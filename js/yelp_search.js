//go here for more info: http://www.yelp.com/developers/documentation/v2/search_api

var custom_cats = [];

var search_results = [];
var toAdd_Cards = [];
var toAdd_Modals = [];
var persisting_cards = [];

function YelpListing () {
    /*
     * Example creation of a new listing object
     *      var alisting = new YelpListing();
     *      alisting.name = "Changing the name";
    */
    this.name              = "";   //Name of this business
    this.id                = "";   //Yelp ID for this business
    this.img_url           = "http://s3-media2.ak.yelpcdn.com/bphoto/7DIHu8a0AHhw-BffrDIxPA/ms.jpg";
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
    this.note              = "";
    this.toSearchResult = function(num) {
      var cardString = "<div draggable=\"\" id=\"card" + this.id + "\" class=\"card";
      if ($.inArray(1, this.custom_categories) != -1) { cardString += " green"; }
      if ($.inArray(2, this.custom_categories) != -1) { cardString += " orange"; }
      if ($.inArray(3, this.custom_categories) != -1) { cardString += " purple"; }
      if ($.inArray(4, this.custom_categories) != -1) { cardString += " red"; }
      if ($.inArray(5, this.custom_categories) != -1) { cardString += " blue"; }
      cardString += "\" lat=" + this.latitude.toString() + " lon=" + this.longitude.toString() + " yelpid='" + this.id + "' mapid='map" + this.id + "'" + " searchInd=" + num.toString();
      cardString += " rating=\"" + this.rating + "\" popularity=\"" + this.review_count + "\" name=\"" + this.name + "\">\n";
      cardString += "<div  class=\"popover top pin-align\">\n";
      cardString += "<div id=\"pin" + this.id + "\" class=\"show-hand pin-in pin-out pin-hidden\"";
      cardString += " onClick=\"unPin('" + this.id + "')\"";
      cardString += "><img src=\"imgs/pin_blue.png\" alt=\"Pin overlay\" title=\"Unpin this business\"/></div>\n";
      cardString += "<div id=\"cats" + this.id + "\" class=\"card-categories\">\n"
      if (this.custom_categories.length > 0) {
        for (var ind = 0; ind < this.custom_categories.length; ind++) {
          if (this.custom_categories[ind] == 1) {
            cardString += "<div id=\"green-label" + this.id + "\" class=\"card-label green-label\"></div>";
          }
          else if (this.custom_categories[ind] == 2) {
            cardString += "<div id=\"orange-label" + this.id + "\" class=\"card-label orange-label\"></div>";
          }
          else if (this.custom_categories[ind] == 3) {
            cardString += "<div id=\"purple-label" + this.id + "\" class=\"card-label purple-label\"></div>";
          }
          else if (this.custom_categories[ind] == 4) {
            cardString += "<div id=\"red-label" + this.id + "\" class=\"card-label red-label\"></div>";
          }
          else {
            cardString += "<div id=\"blue-label" + this.id + "\" class=\"card-label blue-label\"></div>";
          }
        }
      }
      cardString += "</div>\n";
      cardString += "<h3 class=\"popover-title\" onClick=\"showModal('" + this.id + "')\" name>" + this.name + "</h3>\n";
      cardString += "<div class=\"popover-content\" onClick=\"showModal('" + this.id + "')\" >\n";
      cardString += "<table>\n<tr>\n<td>\n<img src=\"" + this.img_url + "\" alt=\"Business Picture\" />\n";
      cardString += "</td>\n<td style=\"padding-left: 5px;\">\n<p>" + this.address1 + "</p>\n<p>" + this.address2 + "</p>\n";
      cardString += "<p>Phone: " + this.phone + "</p>\n</td>\n</tr>\n<tr>\n<td style=\"padding-top: 7px;\">\n";
      cardString += "<img src=\"" + this.rating_img_url + "\" alt=\"Rating Image\" />\n</td>\n<td>\n<p>Reviews: " + this.review_count + "</p>\n";
      cardString += "</td>\n</tr>\n</table>\n</div>\n</div>\n</div>\n";
      return cardString;
    };
    this.toCard = function() {
      var cardString = "<div draggable=\"\" id=\"card" + this.id + "\" class=\"card";
      if ($.inArray(1, this.custom_categories) != -1) { cardString += " green"; }
      if ($.inArray(2, this.custom_categories) != -1) { cardString += " orange"; }
      if ($.inArray(3, this.custom_categories) != -1) { cardString += " purple"; }
      if ($.inArray(4, this.custom_categories) != -1) { cardString += " red"; }
      if ($.inArray(5, this.custom_categories) != -1) { cardString += " blue"; }
      cardString += "\" lat=" + this.latitude.toString() + " lon=" + this.longitude.toString() + " yelpid='" + this.id + "' mapid='map" + this.id + "'";
      cardString += " rating=\"" + this.rating + "\" popularity=\"" + this.review_count + "\" name=\"" + this.name + "\">\n";
      cardString += "<div  class=\"popover top pin-align\" id=\"card" + this.id + "\">\n";
      cardString += "<div id=\"pin" + this.id + "\" class=\"show-hand pin-in pin-out pin-hidden\"";
      cardString += " onClick=\"unPin('" + this.id + "')\"";
      cardString += "><img src=\"imgs/pin_blue.png\" alt=\"Pin overlay\" title=\"Unpin this business\"/></div>\n";
      cardString += "<div id=\"cats" + this.id + "\" class=\"card-categories\">\n"
      if (this.custom_categories.length > 0) {
        for (var ind = 0; ind < this.custom_categories.length; ind++) {
          if (this.custom_categories[ind] == 1) {
            cardString += "<div id=\"green-label" + this.id + "\" class=\"card-label green-label\"></div>";
          }
          else if (this.custom_categories[ind] == 2) {
            cardString += "<div id=\"orange-label" + this.id + "\" class=\"card-label orange-label\"></div>";
          }
          else if (this.custom_categories[ind] == 3) {
            cardString += "<div id=\"purple-label" + this.id + "\" class=\"card-label purple-label\"></div>";
          }
          else if (this.custom_categories[ind] == 4) {
            cardString += "<div id=\"red-label" + this.id + "\" class=\"card-label red-label\"></div>";
          }
          else {
            cardString += "<div id=\"blue-label" + this.id + "\" class=\"card-label blue-label\"></div>";
          }
        }
      }
      cardString += "</div>\n";
      cardString += "<h3 class=\"popover-title\" onClick=\"showModal('" + this.id + "')\" name>" + this.name + "</h3>\n";
      cardString += "<div class=\"popover-content\" onClick=\"showModal('" + this.id + "')\" >\n";
      cardString += "<table>\n<tr>\n<td>\n<img src=\"" + this.img_url + "\" alt=\"Business Picture\" />\n";
      cardString += "</td>\n<td style=\"padding-left: 5px;\">\n<p>" + this.address1 + "</p>\n<p>" + this.address2 + "</p>\n";
      cardString += "<p>Phone: " + this.phone + "</p>\n</td>\n</tr>\n<tr>\n<td style=\"padding-top: 7px;\">\n";
      cardString += "<img src=\"" + this.rating_img_url + "\" alt=\"Rating Image\" />\n</td>\n<td>\n<p>Reviews: " + this.review_count + "</p>\n";
      cardString += "</td>\n</tr>\n</table>\n</div>\n</div>\n</div>\n";
      return cardString;
    };
    this.toModal = function() {
      var modalString = "<div id=\"modal" + this.id + "\" class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n";
      modalString += "<div class=\"modal-header\">\n<button type=\"button\" class=\"close\" onClick=\"closeModal('" + this.id + "')\" aria-hidden=\"true\">×</button>\n<h3 id=\"myModalLabel\">" + this.name + "</h3>\n</div>\n";
      modalString += "<div class=\"modal-body\">\n<div class=\"clearfix\">\n<div class=\"modal-main-col\">\n<div class=\"modal-card-content\">\n<table>\n<tr>\n<td>\n";
      modalString += "<img src=\"" + this.img_url + "\" alt=\"Business Picture\" />\n</td>\n";
      modalString += "<td style=\"padding-left: 5px;\">\n<p>" + this.address1 + "</p>\n<p>" + this.address2 + "</p>\n<p>Phone: " + this.phone + "</p>\n</td>\n</tr>\n";
      modalString += "<tr>\n<td style=\"padding-top: 7px;\">\n<img src=\"" + this.rating_img_url + "\" alt=\"Rating image\" />\n</td>\n<td>\n<p>Reviews: " + this.review_count + "</p>\n</td>\n</tr>\n";
      modalString += "</table>\n</div>\n<p class=\"modal-title\" style=\"padding-top: 15px; padding-bottom: 7px;\">Note: </p>\n";
      if (this.note == "") { modalString += "<textarea id=\"note" + this.id + "\" class=\"new-comment-input\" placeholder=\"Write a comment or note...\"></textarea>\n</div>\n"; }
      else { modalString += "<textarea id=\"note" + this.id + "\" class=\"new-comment-input\" placeholder=\"Write a comment or note...\">" + this.note + "</textarea>\n</div>\n"; }
      modalString += "<div class=\"modal-sidebar\">\n<p class=\"modal-title\">Social</p class=\"modal-title\">\n";
      modalString += "<a href=\"https://twitter.com/intent/tweet?original_referer=&text=Good%20Eats%3A%20&tw_p=tweetbutton&url=" + this.yelp_url + "\" target=\"_blank\" class=\"btn btn-info\">Share on Twitter</a>";
      modalString += "<p class=\"modal-title\" style=\"margin-top: 7px;\">Custom Categories</p class=\"modal-title\">\n<div class=\"editable-labels\">\n";
      modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"green-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"greenTitle" + this.id + "\" type=\"text\" placeholder=\"No name\" name=\"green" + this.id + "\">\n</td>\n<td>\n";
      if ($.inArray(1, this.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but1" + this.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + this.id + "',1)\"><i id=\"but1icon" + this.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
      else { modalString += "<a href=\"#\" id=\"cat-but1" + this.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + this.id + "',1)\"><i id=\"but1icon" + this.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
      modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"orange-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"orangeTitle" + this.id + "\" type=\"text\" placeholder=\"No name\" name=\"orange" + this.id + "\">\n</td>\n<td>\n";
      if ($.inArray(2, this.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but2" + this.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + this.id + "',2)\"><i id=\"but2icon" + this.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
      else { modalString += "<a href=\"#\" id=\"cat-but2" + this.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + this.id + "',2)\"><i id=\"but2icon" + this.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
      modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"purple-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"purpleTitle" + this.id + "\" type=\"text\" placeholder=\"No name\" name=\"purple" + this.id + "\">\n</td>\n<td>\n";
      if ($.inArray(3, this.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but3" + this.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + this.id + "',3)\"><i id=\"but3icon" + this.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
      else { modalString += "<a href=\"#\" id=\"cat-but3" + this.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + this.id + "',3)\"><i id=\"but3icon" + this.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
      modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"red-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"redTitle" + this.id + "\" type=\"text\" placeholder=\"No name\" name=\"red" + this.id + "\">\n</td>\n<td>\n";
      if ($.inArray(4, this.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but4" + this.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + this.id + "',4)\"><i id=\"but4icon" + this.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
      else { modalString += "<a href=\"#\" id=\"cat-but4" + this.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + this.id + "',4)\"><i id=\"but4icon" + this.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
      modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"blue-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"blueTitle" + this.id + "\" type=\"text\" placeholder=\"No name\" name=\"blue" + this.id + "\">\n</td>\n<td>\n";
      if ($.inArray(5, this.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but5" + this.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + this.id + "',5)\"><i id=\"but5icon" + this.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n</div>\n"; }
      else { modalString += "<a href=\"#\" id=\"cat-but5" + this.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + this.id + "',5)\"><i id=\"but5icon" + this.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n</div>\n"; }
      modalString += "</div>\n<div style=\"clear: both;\"></div>\n</div>\n<div align=\"center\" id=\"map" + this.id + "\" style=\"z-index: -1; width: 640px; height: 400px;\"></div>\n</div>\n";
      modalString += "<div class=\"modal-footer\">\n<button class=\"btn\" onClick=\"closeModal('" + this.id + "')\" aria-hidden=\"true\">Close</button>\n<button class=\"btn btn-primary\" onClick=\"saveModal('" + this.id + "')\">Save changes</button>\n</div>\n</div>\n";
      return modalString;
    };
}

function toSearchResult(yelp_listing, num) {
      var cardString = "<div draggable=\"\" id=\"card" + yelp_listing.id + "\" class=\"card";
      if ($.inArray(1, yelp_listing.custom_categories) != -1) { cardString += " green"; }
      if ($.inArray(2, yelp_listing.custom_categories) != -1) { cardString += " orange"; }
      if ($.inArray(3, yelp_listing.custom_categories) != -1) { cardString += " purple"; }
      if ($.inArray(4, yelp_listing.custom_categories) != -1) { cardString += " red"; }
      if ($.inArray(5, yelp_listing.custom_categories) != -1) { cardString += " blue"; }
      cardString += "\" lat=" + yelp_listing.latitude.toString() + " lon=" + yelp_listing.longitude.toString() + " yelpid='" + yelp_listing.id + "' mapid='map" + yelp_listing.id + "'" + " searchInd=" + num.toString();
      cardString += " rating=\"" + yelp_listing.rating + "\" popularity=\"" + yelp_listing.review_count + "\" name=\"" + yelp_listing.name + "\">\n";
      cardString += "<div  class=\"popover top pin-align\" id=\"card" + yelp_listing.id + "\">\n";
      cardString += "<div id=\"pin" + yelp_listing.id + "\" class=\"show-hand pin-in pin-out pin-hidden\"";
      cardString += " onClick=\"unPin('" + yelp_listing.id + "')\"";
      cardString += "><img src=\"imgs/pin_blue.png\" alt=\"Pin overlay\" title=\"Unpin this business\"/></div>\n";
      cardString += "<div id=\"cats" + yelp_listing.id + "\" class=\"card-categories\">\n"
      if (yelp_listing.custom_categories.length > 0) {
        for (var ind = 0; ind < yelp_listing.custom_categories.length; ind++) {
          if (yelp_listing.custom_categories[ind] == 1) {
            cardString += "<div id=\"green-label" + yelp_listing.id + "\" class=\"card-label green-label\"></div>";
          }
          else if (yelp_listing.custom_categories[ind] == 2) {
            cardString += "<div id=\"orange-label" + yelp_listing.id + "\" class=\"card-label orange-label\"></div>";
          }
          else if (yelp_listing.custom_categories[ind] == 3) {
            cardString += "<div id=\"purple-label" + yelp_listing.id + "\" class=\"card-label purple-label\"></div>";
          }
          else if (yelp_listing.custom_categories[ind] == 4) {
            cardString += "<div id=\"red-label" + yelp_listing.id + "\" class=\"card-label red-label\"></div>";
          }
          else {
            cardString += "<div id=\"blue-label" + yelp_listing.id + "\" class=\"card-label blue-label\"></div>";
          }
        }
      }
      cardString += "</div>\n";
      cardString += "<h3 class=\"popover-title\" onClick=\"showModal('" + yelp_listing.id + "')\" name>" + yelp_listing.name + "</h3>\n";
      cardString += "<div class=\"popover-content\" onClick=\"showModal('" + yelp_listing.id + "')\" >\n";
      cardString += "<table>\n<tr>\n<td>\n<img src=\"" + yelp_listing.img_url + "\" alt=\"Business Picture\" />\n";
      cardString += "</td>\n<td style=\"padding-left: 5px;\">\n<p>" + yelp_listing.address1 + "</p>\n<p>" + yelp_listing.address2 + "</p>\n";
      cardString += "<p>Phone: " + yelp_listing.phone + "</p>\n</td>\n</tr>\n<tr>\n<td style=\"padding-top: 7px;\">\n";
      cardString += "<img src=\"" + yelp_listing.rating_img_url + "\" alt=\"Rating Image\" />\n</td>\n<td>\n<p>Reviews: " + yelp_listing.review_count + "</p>\n";
      cardString += "</td>\n</tr>\n</table>\n</div>\n</div>\n</div>\n";
      return cardString;
}

function toCard(yelp_listing) {
      var cardString = "<div draggable=\"\" id=\"card" + yelp_listing.id + "\" class=\"card";
      if ($.inArray(1, yelp_listing.custom_categories) != -1) { cardString += " green"; }
      if ($.inArray(2, yelp_listing.custom_categories) != -1) { cardString += " orange"; }
      if ($.inArray(3, yelp_listing.custom_categories) != -1) { cardString += " purple"; }
      if ($.inArray(4, yelp_listing.custom_categories) != -1) { cardString += " red"; }
      if ($.inArray(5, yelp_listing.custom_categories) != -1) { cardString += " blue"; }
      cardString += "\" lat=" + yelp_listing.latitude.toString() + " lon=" + yelp_listing.longitude.toString() + " yelpid='" + yelp_listing.id + "' mapid='map" + yelp_listing.id + "'";
      cardString += " rating=\"" + yelp_listing.rating + "\" popularity=\"" + yelp_listing.review_count + "\" name=\"" + yelp_listing.name + "\">\n";
      cardString += "<div  class=\"popover top pin-align\" >\n"; //used to include id=\"card" + yelp_listing.id + "\"
      cardString += "<div id=\"pin" + yelp_listing.id + "\" class=\"show-hand pin-in\"";
      cardString += " onClick=\"unPin('" + yelp_listing.id + "')\"";
      cardString += "><img src=\"imgs/pin_blue.png\" alt=\"Pin overlay\" title=\"Unpin this business\"/></div>\n";
      cardString += "<div id=\"cats" + yelp_listing.id + "\" class=\"card-categories\">\n"
      if (yelp_listing.custom_categories.length > 0) {
        for (var ind = 0; ind < yelp_listing.custom_categories.length; ind++) {
          if (yelp_listing.custom_categories[ind] == 1) {
            cardString += "<div id=\"green-label" + yelp_listing.id + "\" class=\"card-label green-label\"></div>";
          }
          else if (yelp_listing.custom_categories[ind] == 2) {
            cardString += "<div id=\"orange-label" + yelp_listing.id + "\" class=\"card-label orange-label\"></div>";
          }
          else if (yelp_listing.custom_categories[ind] == 3) {
            cardString += "<div id=\"purple-label" + yelp_listing.id + "\" class=\"card-label purple-label\"></div>";
          }
          else if (yelp_listing.custom_categories[ind] == 4) {
            cardString += "<div id=\"red-label" + yelp_listing.id + "\" class=\"card-label red-label\"></div>";
          }
          else {
            cardString += "<div id=\"blue-label" + yelp_listing.id + "\" class=\"card-label blue-label\"></div>";
          }
        }
      }
      cardString += "</div>\n";
      cardString += "<h3 class=\"popover-title\" onClick=\"showModal('" + yelp_listing.id + "')\" name>" + yelp_listing.name + "</h3>\n";
      cardString += "<div class=\"popover-content\" onClick=\"showModal('" + yelp_listing.id + "')\" >\n";
      cardString += "<table>\n<tr>\n<td>\n<img src=\"" + yelp_listing.img_url + "\" alt=\"Business Picture\" />\n";
      cardString += "</td>\n<td style=\"padding-left: 5px;\">\n<p>" + yelp_listing.address1 + "</p>\n<p>" + yelp_listing.address2 + "</p>\n";
      cardString += "<p>Phone: " + yelp_listing.phone + "</p>\n</td>\n</tr>\n<tr>\n<td style=\"padding-top: 7px;\">\n";
      cardString += "<img src=\"" + yelp_listing.rating_img_url + "\" alt=\"Rating Image\" />\n</td>\n<td>\n<p>Reviews: " + yelp_listing.review_count + "</p>\n";
      cardString += "</td>\n</tr>\n</table>\n</div>\n</div>\n</div>\n";
      return cardString;
    }

function toModal(yelp_listing) {
  var modalString = "<div id=\"modal" + yelp_listing.id + "\" class=\"modal hide fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n";
  modalString += "<div class=\"modal-header\">\n<button type=\"button\" class=\"close\" onclick=\"closeModal('" + yelp_listing.id + "')\" aria-hidden=\"true\">×</button>\n<h3 id=\"myModalLabel\">" + yelp_listing.name + "</h3>\n</div>\n";
  modalString += "<div class=\"modal-body\">\n<div class=\"clearfix\">\n<div class=\"modal-main-col\">\n<div class=\"modal-card-content\">\n<table>\n<tr>\n<td>\n";
  modalString += "<img src=\"" + yelp_listing.img_url + "\" alt=\"Business Picture\" />\n</td>\n";
  modalString += "<td style=\"padding-left: 5px;\">\n<p>" + yelp_listing.address1 + "</p>\n<p>" + yelp_listing.address2 + "</p>\n<p>Phone: " + yelp_listing.phone + "</p>\n</td>\n</tr>\n";
  modalString += "<tr>\n<td style=\"padding-top: 7px;\">\n<img src=\"" + yelp_listing.rating_img_url + "\" alt=\"Rating image\" />\n</td>\n<td>\n<p>Reviews: " + yelp_listing.review_count + "</p>\n</td>\n</tr>\n";
  modalString += "</table>\n</div>\n<p class=\"modal-title\" style=\"padding-top: 15px; padding-bottom: 7px;\">Note: </p>\n";
  if (yelp_listing.note == "") { modalString += "<textarea id=\"note" + yelp_listing.id + "\" class=\"new-comment-input\" placeholder=\"Write a comment or note...\"></textarea>\n</div>\n"; }
  else { modalString += "<textarea id=\"note" + yelp_listing.id + "\" class=\"new-comment-input\" placeholder=\"Write a comment or note...\">" + yelp_listing.note + "</textarea>\n</div>\n"; }
  modalString += "<div class=\"modal-sidebar\">\n<p class=\"modal-title\">Social</p class=\"modal-title\">\n";
  modalString += "<a href=\"https://twitter.com/intent/tweet?original_referer=&text=Good%20Eats%3A%20&tw_p=tweetbutton&url=" + yelp_listing.yelp_url + "\" target=\"_blank\" class=\"btn btn-info\">Share on Twitter</a>";
  modalString += "<p class=\"modal-title\" style=\"margin-top: 7px;\">Custom Categories</p class=\"modal-title\">\n<div class=\"editable-labels\">\n";
  modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"green-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"greenTitle" + yelp_listing.id + "\" type=\"text\" placeholder=\"No name\" name=\"green" + yelp_listing.id + "\">\n</td>\n<td>\n";
  if ($.inArray(1, yelp_listing.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but1" + yelp_listing.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',1)\"><i id=\"but1icon" + yelp_listing.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
  else { modalString += "<a href=\"#\" id=\"cat-but1" + yelp_listing.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',1)\"><i id=\"but1icon" + yelp_listing.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
  modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"orange-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"orangeTitle" + yelp_listing.id + "\" type=\"text\" placeholder=\"No name\" name=\"orange" + yelp_listing.id + "\">\n</td>\n<td>\n";
  if ($.inArray(2, yelp_listing.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but2" + yelp_listing.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',2)\"><i id=\"but2icon" + yelp_listing.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
  else { modalString += "<a href=\"#\" id=\"cat-but2" + yelp_listing.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',2)\"><i id=\"but2icon" + yelp_listing.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
  modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"purple-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"purpleTitle" + yelp_listing.id + "\" type=\"text\" placeholder=\"No name\" name=\"purple" + yelp_listing.id + "\">\n</td>\n<td>\n";
  if ($.inArray(3, yelp_listing.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but3" + yelp_listing.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',3)\"><i id=\"but3icon" + yelp_listing.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
  else { modalString += "<a href=\"#\" id=\"cat-but3" + yelp_listing.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',3)\"><i id=\"but3icon" + yelp_listing.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
  modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"red-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"redTitle" + yelp_listing.id + "\" type=\"text\" placeholder=\"No name\" name=\"red" + yelp_listing.id + "\">\n</td>\n<td>\n";
  if ($.inArray(4, yelp_listing.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but4" + yelp_listing.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',4)\"><i id=\"but4icon" + yelp_listing.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
  else { modalString += "<a href=\"#\" id=\"cat-but4" + yelp_listing.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',4)\"><i id=\"but4icon" + yelp_listing.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n"; }
  modalString += "<div class=\"editable-label\">\n<table>\n<tr>\n<td>\n<div class=\"blue-label custom-label-cube\"></div>\n</td>\n<td>\n<input class=\"label-title\" id=\"blueTitle" + yelp_listing.id + "\" type=\"text\" placeholder=\"No name\" name=\"blue" + yelp_listing.id + "\">\n</td>\n<td>\n";
  if ($.inArray(5, yelp_listing.custom_categories) == -1) { modalString += "<a href=\"#\" id=\"cat-but5" + yelp_listing.id + "\" class=\"btn btn-success btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',5)\"><i id=\"but5icon" + yelp_listing.id + "\" class=\"icon-white icon-plus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n</div>\n"; }
  else { modalString += "<a href=\"#\" id=\"cat-but5" + yelp_listing.id + "\" class=\"btn btn-danger btn-small\" onClick=\"toggleCategory('" + yelp_listing.id + "',5)\"><i id=\"but5icon" + yelp_listing.id + "\" class=\"icon-white icon-minus\"></i></a>\n</td>\n</tr>\n</table>\n</div>\n</div>\n"; }
  modalString += "</div>\n<div style=\"clear: both;\"></div>\n</div>\n<div align=\"center\" id=\"map" + yelp_listing.id + "\" style=\"z-index: -1; width: 640px; height: 400px;\"></div>\n</div>\n";
  modalString += "<div class=\"modal-footer\">\n<button class=\"btn\" onClick=\"closeModal('" + yelp_listing.id + "')\" aria-hidden=\"true\">Close</button>\n<button class=\"btn btn-primary\" onClick=\"saveModal('" + yelp_listing.id + "')\">Save changes</button>\n</div>\n</div>\n";
  return modalString;
}

//our authentication info from yelp, Matt's Keys
var auth_backup = {
  consumerKey: "oa8kg9SqZxyLkHbwd6W9rg",
  consumerSecret: "Tr7k1th2pJRCL8QOh686DkVlSqk",
  accessToken: "7ZC4hwGaez9yL9Bm4tZyNHBDlgzQIfnU",
  accessTokenSecret: "EiUowROXZHlu4_zRvS0SjcrVG70",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
};

//secondary api keys, courtesy of Matt
var auth = {
  consumerKey: "ZQwbb6QQQjtFZ2NvhK9Q6A",
  consumerSecret: "W8SNS0IyuIbHSTq5bS7KXG7teKc",
  accessToken: "lGb7sPwLntAFArfsMSXA7Ame6vmR3nOx",
  accessTokenSecret: "2C4vVKYOU3iDo6acPouJUJeaqUo",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
}

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
            bootbox.dialog("Error: No businesses were found near that location.", [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
            return;
        }
        for(var i=0; i<data.businesses.length; i++) {
            alert(data.businesses[i]);
            //biz = data.businesses[i];
            //createMarker(biz, new GLatLng(biz.latitude, biz.longitude), i);
        }
    }
    else {
        bootbox.dialog("Error: " + data.message.text, [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
    }
}


function getResults(query, zipcode) {

  search_results = [];
  toAdd_Cards = [];
  toAdd_Modals = [];
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
                      else if (data["businesses"][itemnum][key]["display_address"].length == 3) {
                        try { result.address1 = data["businesses"][itemnum][key]["display_address"][0]; }
                        catch(err) { }
                        try { result.address2 = data["businesses"][itemnum][key]["display_address"][2]; }
                        catch(err) { }
                      }
                      else if (data["businesses"][itemnum][key]["display_address"].length == 1) {
                        try { result.address1 = data["businesses"][itemnum][key]["display_address"][0]; }
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
          var n = noty({ text: "No results found", type: 'error', layout: 'bottom', theme: 'defaultTheme'});
          setTimeout(function(){n.close(); }, 3000);
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
  return false;
}

function storeCards(cards_array) {
  if(typeof(Storage)!=="undefined")
    sessionStorage.cardsArray=cards_array;
  else
    return "Sorry, your browser does not support web storage...";
}

function loadCards(pinnedCards) {

    if(pinnedCards != null) {
      var counter = 0;
      $.each(pinnedCards, function(idx, item)
      {
        if (item != null) {
          var elem = toCard(item);
          $(".isotope").append(elem);
          $("#card" + item.id).attr("pinindex", counter);
          $("body").append(toModal(item));
          //init the custom labels
          if (custom_cats.length == 5) {
              if (custom_cats[0] != "Green Label") {
                  $('input:text[name=green' + item.id + ']').val(custom_cats[0]);
              }
              if (custom_cats[1] != "Orange Label") {
                  $('input:text[name=orange' + item.id + ']').val(custom_cats[1]);
              }
              if (custom_cats[2] != "Purple Label") {
                  $('input:text[name=purple' + item.id + ']').val(custom_cats[2]);
              }
              if (custom_cats[3] != "Red Label") {
                  $('input:text[name=red' + item.id + ']').val(custom_cats[3]);
              }
              if (custom_cats[4] != "Blue Label") {
                  $('input:text[name=blue' + item.id + ']').val(custom_cats[4]);
              }
          }
          //init the map for the modal
          var lat = item.latitude;
          var lon = item.longitude;
          nokia.Settings.set("appId", "tS3F6tL4Vw-6Mz4o7F7s");
          nokia.Settings.set("authenticationToken", "wW7onlgkAti0wUGXo8Y5Tw");
          var map = new nokia.maps.map.Display(document.getElementById("map" + item.id),
              {
                  'components': [
                      // ZoomBar provides a UI to zoom the map in & out
                      new nokia.maps.map.component.ZoomBar(),
                      // We add the behavior component to allow panning / zooming of the map
                      //new nokia.maps.map.component.Behavior(),
                      // Creates UI to easily switch between street map satellite and terrain mapview modes
                      new nokia.maps.map.component.TypeSelector(),
                      // Creates a toggle button to show/hide public transport lines on the map
                      new nokia.maps.map.component.PublicTransport(),
                      /* Shows a scale bar in the bottom right corner of the map depicting
                       * ratio of a distance on the map to the corresponding distance in the real world
                       * in either kilometers or miles
                       */
                      new nokia.maps.map.component.ScaleBar()
                      /* Positioning will show a set "map to my GPS position" UI button
                       * Note: this component will only be visible if W3C geolocation API
                       * is supported by the browser and if you agree to share your location.
                       * If you location can not be found the positioning button will reset
                       * itself to its initial state
                       */
                      //new nokia.maps.positioning.component.Positioning(),
                      // Add ContextMenu component so we get context menu on right mouse click / long press tap
                      //new nokia.maps.map.component.ContextMenu()
                      ],
                      'zoomLevel': 16,
                      'center': [lat, lon]
              });
          var marker = new nokia.maps.map.StandardMarker([lat, lon]);
          map.objects.add(marker);
          map.addComponent(new nokia.maps.map.component.zoom.DoubleClick());
          map.addComponent(new nokia.maps.map.component.panning.Drag());
          map.addComponent(new nokia.maps.map.component.panning.Kinetic());
          counter = counter + 1;
        }
      });
    }

}

function loadCategories() {
  var temp = eval(JSON.parse(sessionStorage.userCats));
  if (temp != null) {
    custom_cats = temp;
  }
  else {
    custom_cats = [];
    custom_cats.push("Green Label");
    custom_cats.push("Orange Label");
    custom_cats.push("Purple Label");
    custom_cats.push("Red Label");
    custom_cats.push("Blue Label");
  }
  updateFilters();
}

function yelpSearchForm() {
    var query = $("input#query").val();
    var zipcode = $("input#locale").val();
    if (zipcode == "") {
      bootbox.dialog("Please enter a city or zipcode first.", [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
      //e.preventDefault();
      return false;
    }
    if (query == "") {
      bootbox.dialog("Please enter a search query first.", [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
      //e.preventDefault();
      return false;
    }
    $("#results_panel").html("<br/><br/><h4 style='text-align:center;'>Loading results from Yelp...&nbsp; <img src='imgs/load.gif'></h4>");
    getResults(query, zipcode);
    if (! $("#extruderRight[isopened]").length) { $(".flap").click(); }
    //e.preventDefault();
    return false;
}

$(document).ready(function(){
  custom_cats = [];
  pinnedCards = [];

  if(sessionStorage.userCats) {
    loadCategories();
  }
  else {
    custom_cats = [];
    custom_cats.push("Green Label");
    custom_cats.push("Orange Label");
    custom_cats.push("Purple Label");
    custom_cats.push("Red Label");
    custom_cats.push("Blue Label");
  }

  if( sessionStorage.cardsArray ) {
    pinnedCards = eval(JSON.parse(sessionStorage.cardsArray));
    if (pinnedCards == null) {
      pinnedCards = [];
    }
  }
  else
    pinnedCards = [];

  //filerInit();
  // $(".isotope").html(loadCards());
  loadCards(pinnedCards);

  /*
  $("button#search").click(function(e) {
    e.preventDefault();
    var query = $("input#query").val();
    var zipcode = $("input#locale").val();
    if (zipcode == "") {
      bootbox.dialog("Please enter a city or zipcode first.", [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
      return false;
    }
    if (query == "") {
      bootbox.dialog("Please enter a search query first.", [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
      return false;
    }
    $("#results_panel").html("<br/><br/><h4 style='text-align:center;'>Loading results from Yelp...&nbsp; <img src='imgs/load.gif'></h4>");
    getResults(query, zipcode);
    if (! $("#extruderRight[isopened]").length) { $(".flap").click(); }
    return false;
  });
  */

    $(".flap").click(function() {
      $(".content").css("overflow-y", "scroll");
    });

  });