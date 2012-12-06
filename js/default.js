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
            var str_pin_idx = $('#card' + pinNum.toString()).attr("pinindex");
            var pin_idx = parseInt(str_pin_idx);
            pinnedCards.splice(pin_idx, 1);
            savePinnedCards();
            var elem = $('#card' + pinNum.toString());
            $(".isotope").isotope( 'remove', elem);
        }
    }, {
        "label" : "Cancel",
        "class" : "btn-danger",
        "callback": function() {
            rePin(pinNum);
        }
    }]);

}

function getPinIndex(cardID) {
    var str_pin_idx = $('#card' + cardID.toString()).attr("pinindex");
    var pin_idx = parseInt(str_pin_idx);
    return pin_idx;
}

function saveModal(cardID) {
    var pin_idx = getPinIndex(cardID);
    var changed = false;
    //save the note
    if (pinnedCards[pin_idx].note != $("#note" + cardID).val()) {
        pinnedCards[pin_idx].note = $("#note" + cardID).val();
        changed = true;
    }
    //save the custom category names
    var green = $("#greenTitle"+cardID).val();
    var orange = $("#orangeTitle"+cardID).val();
    var purple = $("#purpleTitle"+cardID).val();
    var red = $("#redTitle"+cardID).val();
    var blue = $("#blueTitle"+cardID).val();
    if (custom_cats.length == 5) {
        if (custom_cats[0] != green) {
            if (green == "") {
                custom_cats[0] = "Green Label";
            }
            else {
                custom_cats[0] = green;
            }
            changed = true;
        }
        if (custom_cats[1] != orange) {
            if (orange == "") {
                custom_cats[1] = "Orange Label";
            }
            else {
                custom_cats[1] = orange;
            }
            changed = true;
        }
        if (custom_cats[2] != purple) {
            if (purple == "") {
                custom_cats[2] = "Purple Label";
            }
            else {
                custom_cats[2] = purple;
            }
            changed = true;
        }
        if (custom_cats[3] != red) {
            if (red == "") {
                custom_cats[3] = "Red Label";
            }
            else {
                custom_cats[3] = red;
            }
            changed = true;
        }
        if (custom_cats[4] != blue) {
            if (blue == "") {
                custom_cats[4] = "Blue Label";
            }
            else {
                custom_cats[4] = blue;
            }
            changed = true;
        }
    }
    //store the new information
    savePinnedCards();
    //store the new category information
    saveCategories();
    //display a success message
    /*
    if (changed) {
    bootbox.dialog("Your modifications have been saved.", [{
                                "label" : "OK",
                                "class" : "btn-success",
                            }]);
    }
    else {
        bootbox.dialog("No modifications to save.", [{
                                    "label" : "OK",
                                    "class" : "btn-warning",
                                }]);
    }
    */
}

function savePinnedCards() {
   sessionStorage.cardsArray = JSON.stringify(pinnedCards);
}

function saveCategories() {
    sessionStorage.userCats = JSON.stringify(custom_cats);
}

function rePin(pinNum) {
    $('#pin' + pinNum.toString()).removeClass("pin-out");
}

function addCategory(cardID, catID) {
    var pin_idx = getPinIndex(cardID);
    if (catID == 1) {
        pinnedCards[pin_idx].custom_categories.push(1);
        $("#cats" + cardID).append("<div id=\"green-label" + cardID + "\" class=\"card-label green-label\"></div>");
    }
    else if (catID == 2) {
        pinnedCards[pin_idx].custom_categories.push(2);
        $("#cats" + cardID).append("<div id=\"orange-label" + cardID + "\" class=\"card-label orange-label\"></div>");
    }
    else if (catID == 3) {
        pinnedCards[pin_idx].custom_categories.push(3);
        $("#cats" + cardID).append("<div id=\"purple-label" + cardID + "\" class=\"card-label purple-label\"></div>");
    }
    else if (catID == 4) {
        pinnedCards[pin_idx].custom_categories.push(4);
        $("#cats" + cardID).append("<div id=\"red-label" + cardID + "\" class=\"card-label red-label\"></div>");
    }
    else if (catID == 5) {
        pinnedCards[pin_idx].custom_categories.push(5);
        $("#cats" + cardID).append("<div id=\"blue-label" + cardID + "\" class=\"card-label blue-label\"></div>");
    }
    else {
        alert("catID not found -> " + catID.toString());
    }
    $("#but" + catID.toString() + "icon" + cardID).addClass("icon-minus");
    $("#but" + catID.toString() + "icon" + cardID).removeClass("icon-plus");
    $("#cat-but" + catID.toString() + cardID).addClass("btn-danger");
    $("#cat-but" + catID.toString() + cardID).removeClass("btn-success");
    savePinnedCards();
}

function removeCategory(cardID, catID) {
    var pin_idx = getPinIndex(cardID);
    if (catID == 1) {
        pinnedCards[pin_idx].custom_categories.splice( $.inArray(1, pinnedCards[pin_idx].custom_categories), 1 );
        $("#green-label" + cardID).remove();
    }
    else if (catID == 2) {
        pinnedCards[pin_idx].custom_categories.splice( $.inArray(2, pinnedCards[pin_idx].custom_categories), 1 );
        $("#orange-label" + cardID).remove();
    }
    else if (catID == 3) {
        pinnedCards[pin_idx].custom_categories.splice( $.inArray(3, pinnedCards[pin_idx].custom_categories), 1 );
        $("#purple-label" + cardID).remove();
    }
    else if (catID == 4) {
        pinnedCards[pin_idx].custom_categories.splice( $.inArray(4, pinnedCards[pin_idx].custom_categories), 1 );
        $("#red-label" + cardID).remove();
    }
    else if (catID == 5) {
        pinnedCards[pin_idx].custom_categories.splice( $.inArray(5, pinnedCards[pin_idx].custom_categories), 1 );
        $("#blue-label" + cardID).remove();
    }
    else {
        alert("catId not found -> " + catID.toString());
    }
    $("#but" + catID.toString() + "icon" + cardID).removeClass("icon-minus");
    $("#but" + catID.toString() + "icon" + cardID).addClass("icon-plus");
    $("#cat-but" + catID.toString() + cardID).removeClass("btn-danger");
    $("#cat-but" + catID.toString() + cardID).addClass("btn-success");
    savePinnedCards();
}

function toggleCategory(cardID, catID) {
    var pin_idx = getPinIndex(cardID);
    if ($.inArray(parseInt(catID), pinnedCards[pin_idx].custom_categories) != -1) {
        removeCategory(cardID, catID);
    }
    else {
        addCategory(cardID, catID);
    }
}

function pin(pinID, mapUnique, lat, lon) {
    pinnedCards.push(search_results[pinID]);
    savePinnedCards();
    //remove it from the results list
    //$('#master' + pinID.toString()).remove();
    //add the modal bit to the body
    $('body').append(toAdd_Modals[pinID]);
    var actID = mapUnique.substring(3);
    //init the custom labels
    if (custom_cats.length == 5) {
        if (custom_cats[0] != "Green Label") {
            $('input:text[name=green' + actID + ']').val(custom_cats[0]);
        }
        if (custom_cats[1] != "Orange Label") {
            $('input:text[name=orange' + actID + ']').val(custom_cats[1]);
        }
        if (custom_cats[2] != "Purple Label") {
            $('input:text[name=purple' + actID + ']').val(custom_cats[2]);
        }
        if (custom_cats[3] != "Red Label") {
            $('input:text[name=red' + actID + ']').val(custom_cats[3]);
        }
        if (custom_cats[4] != "Blue Label") {
            $('input:text[name=blue' + actID + ']').val(custom_cats[4]);
        }
    }
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