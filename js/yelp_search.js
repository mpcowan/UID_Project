http://api.yelp.com/v2/search?term=food&location=San+Francisco


var auth = {
  //
  // Team Rocket's auth tokens
  //
  consumerKey: "pcHhvaUcNovVPNbgYGpjAg",
  consumerSecret: "GePUUz4H8LjdAi_yC1mq61nEPDo",
  accessToken: "nB4-uHNGRrIipZCpNka6uMt5MoNFkVxl",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "FvIpS9FAx_zJAru9XJ_1wU4qGT4",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
};

/*
 * Construct the URL to call for the API request
 */
function constructYelpURL() {
    var URL = "http://api.yelp.com/" +
        "business_review_search?"+
        "callback=" + "handleResults" +
        "&term=" + document.getElementById("search-query").value +
        "&limit=10" +

    return encodeURI(URL);
}


/*
 * If a sucessful API response is received, place
 * markers on the map.  If not, display an error.
 */
function handleResults(data) {
    // turn off spinner animation
    document.getElementById("spinner").style.visibility = 'hidden';
    if(data.message.text == "OK") {
        if (data.businesses.length == 0) {
            alert("Error: No businesses were found near that location");
            return;
        }
        for(var i=0; i<data.businesses.length; i++) {
            biz = data.businesses[i];
            createMarker(biz, new GLatLng(biz.latitude, biz.longitude), i);
        }
    }
    else {
        alert("Error: " + data.message.text);
    }
}