var pinnedCards = [];

function showModal(cardID) {
    $('#modal' + cardID.toString()).modal('show');
}

function unPin(pinNum) {
    $('#pin' + pinNum.toString()).addClass("pin-out");
    bootbox.dialog("Unpin this business?", [{
        "label" : "Yes",
        "class" : "btn-primary",
        "callback": function() {
            $('#card' + pinNum.toString()).remove();
        }
    }, {
        "label" : "Cancel",
        "class" : "btn-danger",
        "callback": function() {
            rePin(pinNum);
        }
    }]);
}

function rePin(pinNum) {
    $('#pin' + pinNum.toString()).removeClass("pin-out");
}

function pin(pinID, mapUnique, lat, lon) {
    pinnedCards.push(search_results[pinID]);
    //remove it from the results list
    //$('#master' + pinID.toString()).remove();
    //add the modal bit to the body
    $('body').append(toAdd_Modals[pinID]);
    //init the map for the modal
    nokia.Settings.set("appId", "tS3F6tL4Vw-6Mz4o7F7s");
    nokia.Settings.set("authenticationToken", "wW7onlgkAti0wUGXo8Y5Tw");
    var map = new nokia.maps.map.Display(document.getElementById(mapUnique.toString()),
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
    //add the card to the isotope class with pin in

    //$(".isotope").append(toAdd_Cards[pinID]);
    //$(".isotope").isotope( 'insert', toAdd_Cards[pinID]);
    //var n = noty({ text: "Bookmark added successfully", type: 'information', layout: 'bottom', theme: 'defaultTheme'});
    //setTimeout(function(){n.close(); }, 3000);
    return (pinnedCards.length-1);
}

function isPinned(yelp_id) {
    for (var i = 0; i < pinnedCards.length; i++) {
        if (pinnedCards[i].id == yelp_id) {
            return true;
        }
    }
    return false;
}