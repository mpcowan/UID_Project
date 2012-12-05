//go here for more info: http://www.yelp.com/developers/documentation/v2/search_api

var search_results = [];
var toAdd_Cards = [];
var toAdd_Modals = [];

function YelpListing () {
    /*
     * Example creation of a new listing object
     *      var alisting = new YelpListing();
     *      alisting.name = "Changing the name";
    */
    this.name              = "";   //Name of this business
    this.id                = "";   //Yelp ID for this business
    this.img_url           = "imgs/restaurant_placeholder.png";
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
    this.toSearchResult = function(num) {
      var cardString = "<div id=\"master" + num.toString() + "\" class=\"card well\" rating=\"" + this.rating + "\" popularity=\"" + this.review_count + "\" name=\"" + this.name + "\">\n";
      cardString += "<div draggable=\"\" class=\"popover top pin-align\" id=\"card" + this.id + "\">\n";
      cardString += "<div id=\"pin" + this.id + "\" class=\"show-hand pin-in pin-out\"";
      cardString += " onClick=\"pin(" + num.toString() + ",'map" + this.id + "'," + this.latitude + "," + this.longitude + ")\"";
      cardString += "><img src=\"imgs/pin_blue.png\" alt=\"Pin overlay\" /></div>\n";
      cardString += "<h3 class=\"popover-title\" name>" + this.name + "</h3>\n";
      cardString += "<div class=\"popover-content\" >\n";
      cardString += "<table>\n<tr>\n<td>\n<img src=\"" + this.img_url + "\" alt=\"Business Picture\" />\n";
      cardString += "</td>\n<td style=\"padding-left: 5px;\">\n<p>" + this.address1 + "</p>\n<p>" + this.address2 + "</p>\n";
      cardString += "<p>Phone: " + this.phone + "</p>\n</td>\n</tr>\n<tr>\n<td style=\"padding-top: 7px;\">\n";
      cardString += "<img src=\"" + this.rating_img_url + "\" alt=\"Rating Image\" />\n</td>\n<td>\n<p>Reviews: " + this.review_count + "</p>\n";
      cardString += "</td>\n</tr>\n</table>\n</div>\n</div>\n</div>\n";
      return cardString;
    };
    this.toCard = function() {
      var cardString = "<div class=\"card isotope-item\" rating=\"";
      cardString += this.rating + "\" popularity=\"" + this.review_count + "\" name=\"" + this.name + "\" style=\"position: absolute; left: 0px; top: 0px; transform: translate(0px, 0px);\">\n";
      cardString += "<div class=\"popover top pin-align show-hand\" id=\"card" + this.id + "\">\n";
      cardString += "<div class=\"pin-in\" id=\"pin" + this.id + "\" onClick=\"unPin('" + this.id + "')\"><img src=\"imgs/pin_blue.png\" alt=\"Pin overlay\"/></div>\n";
      cardString += "<h3 class=\"popover-title\" onClick=\"showModal('" + this.id + "')\" name>" + this.name + "</h3>\n";
      cardString += "<div class=\"popover-content\" onClick=\"showModal('" + this.id + "')\">\n";
      cardString += "<table>\n<tr>\n<td>\n<img src=\"" + this.img_url + "\" alt=\"Business Picture\" />\n";
      cardString += "</td>\n<td style=\"padding-left: 5px;\">\n<p>" + this.address1 + "</p>\n<p>" + this.address2 + "</p>\n";
      cardString += "<p>Phone: " + this.phone + "</p>\n</td>\n</tr>\n<tr>\n<td style=\"padding-top: 7px;\">\n";
      cardString += "<img src=\"" + this.rating_img_url + "\" alt=\"Rating Image\" />\n</td>\n<td>\n<p>Reviews: " + this.review_count + "</p>\n";
      cardString += "</td>\n</tr>\n</table>\n</div>\n</div>\n</div>\n";
      return cardString;
    };
    this.toModal = function() {
      var modalString = "<div id=\"modal" + this.id + "\" class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n";
      modalString += "<div class=\"modal-header\">\n<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n<h3 id=\"myModalLabel\">" + this.name + "</h3>\n</div>\n";
      modalString += "<div class=\"modal-body\">\n<div class=\"clearfix\">\n<div class=\"modal-main-col\">\n<div class=\"modal-card-content\">\n<table>\n<tr>\n<td>\n";
      modalString += "<img src=\"" + this.img_url + "\" alt=\"Business Picture\" />\n</td>\n";
      modalString += "<td style=\"padding-left: 5px;\">\n<p>" + this.address1 + "</p>\n<p>" + this.address2 + "</p>\n<p>Phone: " + this.phone + "</p>\n</td>\n</tr>\n";
      modalString += "<tr>\n<td style=\"padding-top: 7px;\">\n<img src=\"" + this.rating_img_url + "\" alt=\"Rating image\" />\n</td>\n<td>\n<p>Reviews: " + this.review_count + "</p>\n</td>\n</tr>\n";
      modalString += "</table>\n</div>\n<p class=\"modal-title\" style=\"padding-top: 15px; padding-bottom: 7px;\">Notes: </p class=\"modal-title\">\n<textarea class=\"new-comment-input\" placeholder=\"Write a comment or note...\"></textarea>\n</div>\n";
      modalString += "<div class=\"modal-sidebar\">\n<p class=\"modal-title\">Social</p class=\"modal-title\">\n";
      modalString += "<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-text=\"Good Eats: \" data-size=\"large\" data-count=\"none\" data-dnt=\"true\" data-url=\"" + this.yelp_url + "\">Tweet</a>\n";
      modalString += "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=\"https://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>\n";
      modalString += "<p class=\"modal-title\" style=\"margin-top: 7px;\">Custom Categories</p class=\"modal-title\">\n<div class=\"editable-labels\">\n<div class=\"editable-label\">\n<table>\n<tr>\n";
      modalString += "<td>\n<div class=\"green-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"greenTitle\" type=\"text\" placeholder=\"No name\" name=\"green\">\n</td>\n<td>\n<a href=\"#\" class=\"btn btn-success btn-small\"><i class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n";
      modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"orange-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"orangeTitle\" type=\"text\" placeholder=\"No name\" name=\"orange\">\n</td>\n<td>\n<a href=\"#\" class=\"btn btn-danger btn-small\"><i class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n";
      modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"purple-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"purpleTitle\" type=\"text\" placeholder=\"No name\" name=\"purple\">\n</td>\n<td>\n<a href=\"#\" class=\"btn btn-success btn-small\"><i class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n";
      modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"red-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"redTitle\" type=\"text\" placeholder=\"No name\" name=\"red\">\n</td>\n<td>\n<a href=\"#\" class=\"btn btn-danger btn-small\"><i class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n";
      modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"blue-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"blueTitle\" type=\"text\" placeholder=\"No name\" name=\"blue\">\n</td>\n<td>\n<a href=\"#\" class=\"btn btn-success btn-small\"><i class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n</div>\n<p class=\"modal-title\">Yelp Categories</p class=\"modal-title\">\n";
      modalString += "</div>\n<div style=\"clear: both;\"></div>\n</div>\n<div align=\"center\" id=\"map" + this.id + "\" style=\"z-index: -1; width: 630px; height: 400px;\"></div>\n</div>\n";
      modalString += "<div class=\"modal-footer\">\n<button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button>\n<button class=\"btn btn-primary\">Save changes</button>\n</div>\n</div>\n";
      return modalString;
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

/*
var filer;
var DATA_FILE = "listings.txt"; // Caches Yelp Listings.

function onError(e) {
  console.log('File Error: ' + e.name);
}

function filerInit() {
   filer = new Filer();
   filer.init({persistent: true, size: 2*1024 * 1024}, function(fs) {
      }, onError);
   filer.init();
}
*/
/*
 * Saves the given array of Yelp listings (@listings_array) to disk.
 */
 /*
function saveListings(listings_array) {
    //false says don't throw error if file already exists.
    filer.create(DATA_FILE, false, function(fileEntry) {
    }, onError);

    var my_data = JSON.stringify(listings_array);
    filer.write(DATA_FILE, {data: my_data, type: 'text/plain'},
      function(fileEntry, fileWriter) {
        console.log('wrote to data file');
      },
      onError
    );
}
*/
/*
 * Loads the Yelp listing array that was saved to disk.
 */
 /*
function getListings() {

  filer.open(DATA_FILE, function(file) {
      // Use FileReader to read file.
      var reader = new FileReader();
      reader.onload= function(e) {
          // console.log('Read Text = ' + this.result);
          return this.result;
      }
      reader.readAsText(file);
    }, onError);
}

function testWrite() {


    var alisting = new YelpListing();
    alisting.name = "Changing the name";

  var alisting2 = new YelpListing();
    alisting2.name = "New NAMEE HAHA";
*/
/*
var data_arr = [alisting, alisting2];
    //false says don't throw error if file already exists.
    filer.create('myFile.txt', false, function(fileEntry) {
    // fileEntry.name == 'myFile.txt'
    }, onError);


    //var blob = new Blob(['body { color: red; }'], {type: 'text/css'});
    var my_data = JSON.stringify(data_arr);
    filer.write('myfile.txt', {data: my_data, type: 'text/plain'},
      function(fileEntry, fileWriter) {
        console.log('tested writing to dest');
      },
      onError
    );

}

function testRead() {

  console.log('testing reading...');
  filer.open('myfile.txt', function(file) {
      // Use FileReader to read file.
      var reader = new FileReader();
      reader.onload= function(e) {
          console.log('Read Text = ' + this.result);
      }
      reader.readAsText(file);
    }, onError);


}
*/
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

  search_results = [];
  var search_cards = [];

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
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);


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
                    result.img_url = data["businesses"][itemnum][key];
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
                    try { result.latitude = data["businesses"][itemnum][key]["coordinate"]["latitude"]; }
                    catch(err) { }
                    try { result.longitude = data["businesses"][itemnum][key]["coordinate"]["longitude"]; }
                    catch(err) { }
                    try { result.state_code = data["businesses"][itemnum][key]["state_code"]; }
                    catch(err) { }
                    try { result.zip = data["businesses"][itemnum][key]["postal_code"]; }
                    catch(err) { }
                    try { result.city = data["businesses"][itemnum][key]["city"]; }
                    catch(err) { }
                    try {
                      if (data["businesses"][itemnum][key]["display_address"].length == 4) {
                        try { result.address1 = data["businesses"][itemnum][key]["display_address"][0]; }
                        catch(err) { }
                        try { result.address2 = data["businesses"][itemnum][key]["display_address"][3]; }
                        catch(err) { }
                      }
                      else if (data["businesses"][itemnum][key]["display_address"].length == 2) {
                        try { result.address1 = data["businesses"][itemnum][key]["display_address"][0]; }
                        catch(err) { }
                        try { result.address2 = data["businesses"][itemnum][key]["display_address"][1]; }
                        catch(err) { }
                      }
                    }
                    catch(err) { }
                  }
                }
              }

              search_results.push(result);
              search_cards.push(result.toSearchResult(itemnum));
              toAdd_Cards.push(result.toCard());
              toAdd_Modals.push(result.toModal());
            }
          }
        } else {
          alert("No results");
        }
      //console.log(data);
      //var output = prettyPrint(data);
      //$("body").append(output);

      $("#results_panel").empty();
      $("#results_panel").append("<br /><br /><h3 style=\"margin-left: 20px;\">Results From Yelp:</h3><br />");
      for (var tmp in search_cards) 
        $("#results_panel").append(search_cards[tmp]);

      var draggableArguments={ helper:'clone', appendTo: '#content', containment: 'DOM', snap: true, zIndex: 1500, addClasses: true, start:function(event, ui) { globalElement = $(this); }, stop:function(event, ui) { globalElement = null; } };
      $("[draggable]").draggable(draggableArguments);
      $(".content").css("overflow-y", "scroll");
      
    }
  });

}

$(document).ready(function(){

  //filerInit();

  $("button#search").click(function(){
    var query = $("input#query").val();
    var zipcode = $("input#locale").val();
    $("#results_panel").html("<br/><br/><h4 style='text-align:center;'>Loading results from Yelp...&nbsp; <img src='imgs/load.gif'></h4>");
    getResults(query, zipcode);
    if (! $("#extruderRight[isopened]").length) { $(".flap").click(); }
  });
});
