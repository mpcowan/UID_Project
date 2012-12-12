

    function retrieve_zip(callback)
    {
    try { if(!google) { google = 0; } } catch(err) { google = 0; } // Stupid Exceptions
    if(navigator.geolocation) // FireFox/HTML5 GeoLocation
    {
    navigator.geolocation.getCurrentPosition(function(position)
    {
    zip_from_latlng(position.coords.latitude,position.coords.longitude,callback);
    });
    }
    else if(google && google.gears) // Google Gears GeoLocation
    {
    var geloc = google.gears.factory.create('beta.geolocation');
    geloc.getPermission();
    geloc.getCurrentPosition(function(position)
    {
    zip_from_latlng(position.latitude,position.longitude,callback);
    },function(err){});
    }
    }
    function zip_from_latlng(latitude,longitude,callback)
    {
    // Setup the Script using Geonames.org's WebService
    var script = document.createElement("script");
    script.src = "http://ws.geonames.org/findNearbyPostalCodesJSON?lat=" + latitude + "&lng=" + longitude + "&callback=" + callback;
    // Run the Script
    document.getElementsByTagName("head")[0].appendChild(script);
    }
    function example_callback(json)
    {
    // Now we have the data! If you want to just assume it's the 'closest' zipcode, we have that below:
    zip = json.postalCodes[0].postalCode;
    country = json.postalCodes[0].countryCode;
    state = json.postalCodes[0].adminName1;
    county = json.postalCodes[0].adminName2;
    place = json.postalCodes[0].placeName;
    
         var n = noty({ text: "Location added successfully", type: 'information', layout: 'bottom', theme: 'defaultTheme'});
      setTimeout(function(){n.close(); }, 3000);

        $("input#locale").val(zip);

    }
    