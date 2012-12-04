http://api.yelp.com/v2/search?term=food&location=San+Francisco




/*
 * Construct the URL to call for the API request
 */
function constructYelpURL() {
    var mapBounds = map.getBounds();
    var URL = "http://api.yelp.com/" +
        "business_review_search?"+
        "callback=" + "handleResults" +
        "&term=" + document.getElementById("term").value +
        "&limit=10" +
        "&tl_lat=" + mapBounds.getSouthWest().lat() +
        "&tl_long=" + mapBounds.getSouthWest().lng() +
        "&br_lat=" + mapBounds.getNorthEast().lat() +
        "&br_long=" + mapBounds.getNorthEast().lng() +
        "&ywsid=" + YWSID;
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