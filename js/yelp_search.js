//go here for more info: http://www.yelp.com/developers/documentation/v2/search_api

function YelpListing () {
    /*
     * Example creation of a new listing object
     *      var alisting = new YelpListing();
     *      alisting.name = "Changing the name";
    */
    this.name           = "";   //Name of this business
    this.id             = "";   //Yelp ID for this business
    this.img_url        = "";   //URL of photo for this business
    this.yelp_url       = "";   //URL for business page on Yelp
    this.phone          = "";   //Phone number for this business formatted
    this.review_count   = 0;    //Number of reviews for this business
    this.rating         = 5;    //Rating for this business (0-5)
    this.rating_img_url = "";   //url to starts rating for this business
    this.address        = "";   //location.display_address from yelp
    this.city           = "";   //City for this business
    this.zip            = "";   //Postal code for this business
    this.state_code     = "";   //State code for this business Ex: "NY"
    this.snippet        = "";   //Snippet text associated with this business
    //Provides a list of category name, alias pairs that this business is associated with. For example,
    //[["Local Flavor", "localflavor"], ["Active Life", "active"], ["Mass Media", "massmedia"]]
    this.categories     = [];
    this.asString = function() {
        return this.name + ' ' + this.id + ' testing';
    };
}

//our authentication info from yelp, Matt's Keys
var auth = {
  consumerKey: "pcHhvaUcNovVPNbgYGpjAg",
  consumerSecret: "GePUUz4H8LjdAi_yC1mq61nEPDo",
  accessToken: "nB4-uHNGRrIipZCpNka6uMt5MoNFkVxl",
  accessTokenSecret: "FvIpS9FAx_zJAru9XJ_1wU4qGT4",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
};

var debug_location = "New York";
var debug_query = "pizza"

function searchYelp() {
    var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    };
    parameters = [];
    parameters.push(['term', debug_query]);
    parameters.push(['location', debug_location]);
    parameters.push(['callback', 'handleResults']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    var message = {
      'action': 'http://api.yelp.com/v2/search',
      'method': 'GET',
      'parameters': parameters
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var parameterMap = OAuth.getParameterMap(message.parameters);
    //added a semicolon on the next line, not sure why it wasn't there
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
    $.ajax({
      'url': message.action,
      'data': parameterMap,
      'cache': true,
      'dataType': 'jsonp',
      'jsonpCallback': 'handleResults',
      'success': function(data, textStats, XMLHttpRequest) {
        var output = prettyPrint(data);
        alert(output);
      }
    });
}

/*
 * If a sucessful API response is received, display
 * the result cards to the user
 */
function handleResults(data) {
    if(data.message.text == "OK") {
        if (data.businesses.length == 0) {
            alert("Error: No businesses were found near that location");
            return;
        }
        for(var i=0; i<data.businesses.length; i++) {
            alert(data.dusinesses[i]);
            //biz = data.businesses[i];
            //createMarker(biz, new GLatLng(biz.latitude, biz.longitude), i);
        }
    }
    else {
        alert("Error: " + data.message.text);
    }
}
