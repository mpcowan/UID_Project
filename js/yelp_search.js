//go here for more info: http://www.yelp.com/developers/documentation/v2/search_api

function YelpListing () {
    /*
     * Example creation of a new listing object
     *      var alisting = new YelpListing();
     *      alisting.name = "Changing the name";
    */
    this.name              = "";   //Name of this business
    this.id                = "";   //Yelp ID for this business
    this.img_url           = "";   //URL of photo for this business
    this.yelp_url          = "";   //URL for business page on Yelp
    this.phone             = "";   //Phone number for this business formatted
    this.review_count      = 0;    //Number of reviews for this business
    this.rating            = 5;    //Rating for this business (0-5)
    this.rating_img_url    = "";   //url to starts rating for this business
    this.address1          = "";   //first line of address
    this.address2          = "";   //second line of address
    this.city              = "";   //City for this business
    this.zip               = "";   //Postal code for this business
    this.state_code        = "";   //State code for this business Ex: "NY"
    this.snippet           = "";   //Snippet text associated with this business
    this.latitude          = 0.0   //latitude of business for mapping
    this.longitude         = 0.0   //longitude of business for mapping
    //Provides a list of category name, alias pairs that this business is associated with. For example,
    //[["Local Flavor", "localflavor"], ["Active Life", "active"], ["Mass Media", "massmedia"]]
    this.yelp_categories   = [];
    this.custom_categories = [];
    this.notes             = [];
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

function searchYelp(query, location) {
    var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    };
    parameters = [];
    parameters.push(['term', query]);
    parameters.push(['location', location]);
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
      }
    });
}

/*
 * If a sucessful API response is received, display
 * the result cards to the user
 */
function handleResults(data) {
    console.log(data);
    if(data !== undefined) {
        if (data.businesses.length == 0) {
            alert("Error: No businesses were found near that location");
            return;
        }
        for(var i=0; i<data.businesses.length; i++) {
            alert(data.businesses[i]);
            //biz = data.businesses[i];
            //createMarker(biz, new GLatLng(biz.latitude, biz.longitude), i);
        }
    }
    else {
        alert("Error: " + data.message.text);
    }
}


function getResults(query, zipcode) {


  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };

  parameters = [];
  parameters.push(['term', query]);
  parameters.push(['location', zipcode]);
  parameters.push(['callback', 'cb']);
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
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)


  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
      if (data["total"] > 0) {
          for (var itemnum in data["businesses"]) {
            if (data["businesses"].hasOwnProperty(itemnum)) {
              var result = new YelpListing();
              for (var key in data["businesses"][itemnum]) {
                if (data["businesses"][itemnum].hasOwnProperty(key)) {
                  if (key == "rating") {
                    result.rating = data["businesses"][itemnum][key];
                  }
                  else if (key == "rating_img_url") {
                    result.rating_img_url = data["businesses"][itemnum][key];
                  }
                  else if (key == "name") {
                    result.name = data["businesses"][itemnum][key];
                  }
                  else if (key == "review_count") {
                    result.review_count = data["businesses"][itemnum][key];
                  }
                  else if (key == "snippet_text") {
                    result.snippet = data["businesses"][itemnum][key];
                  }
                  else if (key == "image_url") {
                    result.image_url = data["businesses"][itemnum][key];
                  }
                  else if (key == "url") {
                    result.yelp_url = data["businesses"][itemnum][key];
                  }
                  else if (key == "display_phone") {
                    result.phone = data["businesses"][itemnum][key];
                  }
                  else if (key == "id") {
                    result.id = data["businesses"][itemnum][key];
                  }
                  else if (key == "location") {
                    result.latitude   = data["businesses"][itemnum][key]["coordinate"]["latitude"];
                    result.longitude  = data["businesses"][itemnum][key]["coordinate"]["longitude"];
                    result.state_code = data["businesses"][itemnum][key]["coordinate"]["state_code"];
                    result.zip        = data["businesses"][itemnum][key]["coordinate"]["postal_code"];
                    result.city       = data["businesses"][itemnum][key]["coordinate"]["city"];
                    if (data["businesses"][itemnum][key]["coordinate"]["display_address"].length == 4) {
                      result.address1 = data["businesses"][itemnum][key]["coordinate"]["display_address"][0];
                      result.address2 = data["businesses"][itemnum][key]["coordinate"]["display_address"][3];
                    }
                  }
                }
              }
            }
          }
        } else {
          alert("No results");
        }
      console.log(data);
      var output = prettyPrint(data);
      $("body").append(output);
    }
  });

}


$(document).ready(function(){

  $("button#search").click(function(){
    var query = $("input#query").val();
    var zipcode = $("input#locale").val();
    getResults(query, zipcode);
    $(".flap").click();
  });

});


