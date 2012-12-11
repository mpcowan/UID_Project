var pinnedCards = [];

function showModal(cardID) {
    $('#modal' + cardID.toString()).modal('show');
}

function helpPrompt() {
    bootbox.dialog("View the user manual?", [{
        "label" : "Yes",
        "class" : "btn-primary",
        "callback": function() {
            window.open("https://www.dropbox.com/s/cm7pt0oesu816vd/UIProject-UserManual.pdf");
        }
    }, {
        "label" : "Cancel",
        "class" : "btn-danger",
        "callback": function() { }
    }]);
}

function unPin(pinNum) {
    $('#pin' + pinNum.toString()).addClass("pin-out");
    bootbox.dialog("Unpin this business?", [{
        "label" : "Yes",
        "class" : "btn-primary",
        "callback": function() {
            var str_pin_idx = $('#card' + pinNum.toString()).attr("pinindex");
            var pin_idx = parseInt(str_pin_idx);
            var toLower = pin_idx+1;
            while(toLower < pinnedCards.length) {
                var newaddress = toLower - 1;
                $("[pinindex=" + toLower.toString() + "]").attr("pinindex", newaddress);
                toLower = toLower + 1;
            }
            pinnedCards.splice(pin_idx, 1);
            savePinnedCards();
            var elem = $('#card' + pinNum.toString());
            $("#modal" + pinNum.toString()).remove();
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

function closeModal(cardID) {
    var pin_idx = getPinIndex(cardID);
    if (pin_idx == undefined) {
        bootbox.dialog("Could not determine pin index of: " + cardID, [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
        bootbox.dialog("Changes can not be saved. Try refreshing the page and trying again.", [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
        return;
    }
    var changed = false;
    //check for changes with the note
    if (pinnedCards[pin_idx].note != $("#note" + cardID).val()) {
        changed = true;
    }
    //check to see if any category names were changed
    var green = $("#greenTitle"+cardID).val();
    var orange = $("#orangeTitle"+cardID).val();
    var purple = $("#purpleTitle"+cardID).val();
    var red = $("#redTitle"+cardID).val();
    var blue = $("#blueTitle"+cardID).val();
    if (custom_cats.length == 5) {
        if (custom_cats[0] != green) {
            if (custom_cats[0] == "Green Label" && green != "") { changed = true; }
            else if (custom_cats[0] != "Green Label" && green != custom_cats[0]) { changed = true; }
        }
        if (custom_cats[1] != orange) {
            if (orange != "" && custom_cats[1] == "Orange Label") { changed = true; }
            else if (custom_cats[1] != "Orange Label" && orange != custom_cats[1]) { changed = true; }
        }
        if (custom_cats[2] != purple) {
            if (purple != "" && custom_cats[2] == "Purple Label") { changed = true; }
            else if (custom_cats[2] != "Purple Label" && purple != custom_cats[2]) { changed = true; }
        }
        if (custom_cats[3] != red) {
            if (red != "" && custom_cats[3] == "Red Label") { changed = true; }
            else if (custom_cats[3] != "Red Label" && red != custom_cats[3]) { changed = true; }
        }
        if (custom_cats[4] != blue) {
            if (blue != "" && custom_cats[4] == "Blue Label") { changed = true; }
            else if (custom_cats[4] != "Blue Label" && blue != custom_cats[4]) { changed = true; }
        }
    }
    //display a success message
    if (changed) {
        //can't use bootbox because of a bug that causes infinite recursion, darn
        var res=confirm("Data has been changed. Close and discard?");
        if (res == true) {
            //dismiss the modal
            $("#note" + cardID).val(pinnedCards[pin_idx].note);
            undoChanges(cardID);
            $("#modal" + cardID).modal('hide');
            return;
        }
        else {
            return;
        }
    }
    else { $("#modal" + cardID).modal('hide'); }
}

function saveModal(cardID) {
    var pin_idx = getPinIndex(cardID);
    if (pin_idx == undefined) {
        bootbox.dialog("Could not determine pin index of: " + cardID, [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
        bootbox.dialog("Changes can not be saved. Try refreshing the page and trying again.", [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
        return;
    }
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
    if (changed) {
        updateModals();
        updateFilters();
    }
    //dismiss the modal
    $('#modal' + cardID).modal('hide');
}

function undoChanges(cardID) {
    var greenName = "green" + cardID;
    var orangeName = "orange" + cardID;
    var purpleName = "purple" + cardID;
    var redName = "red" + cardID;
    var blueName = "blue" + cardID;
    if (custom_cats[0] != "Green Label") { $('input:text[name=' + greenName + ']').val(custom_cats[0]); }
    else { $('input:text[name=' + greenName + ']').val(""); }
    if (custom_cats[1] != "Orange Label") { $('input:text[name=' + orangeName + ']').val(custom_cats[1]); }
    else { $('input:text[name=' + orangeName + ']').val(""); }
    if (custom_cats[2] != "Purple Label") { $('input:text[name=' + purpleName + ']').val(custom_cats[2]); }
    else { $('input:text[name=' + purpleName + ']').val(""); }
    if (custom_cats[3] != "Red Label") { $('input:text[name=' + redName + ']').val(custom_cats[3]); }
    else { $('input:text[name=' + redName + ']').val(""); }
    if (custom_cats[4] != "Blue Label") { $('input:text[name=' + blueName + ']').val(custom_cats[4]); }
    else { $('input:text[name=' + blueName + ']').val(""); }
}

function updateModals() {
    if (pinnedCards.length > 0 && custom_cats.length == 5) {
        $.each(pinnedCards, function(ind, card) {
            var modalID = "modal" + card.id;
            var greenID = "greenTitle" + card.id;
            var orangeID = "orangeTitle" + card.id;
            var purpleID = "purpleTitle" + card.id;
            var redID = "redTitle" + card.id;
            var blueID = "blueTitle" + card.id;
            var greenName = "green" + card.id;
            var orangeName = "orange" + card.id;
            var purpleName = "purple" + card.id;
            var redName = "red" + card.id;
            var blueName = "blue" + card.id;
            //actually update the text in there
            if (custom_cats[0] != "Green Label") { $('input:text[name=' + greenName + ']').val(custom_cats[0]); }
            if (custom_cats[1] != "Orange Label") { $('input:text[name=' + orangeName + ']').val(custom_cats[1]); }
            if (custom_cats[2] != "Purple Label") { $('input:text[name=' + purpleName + ']').val(custom_cats[2]); }
            if (custom_cats[3] != "Red Label") { $('input:text[name=' + redName + ']').val(custom_cats[3]); }
            if (custom_cats[4] != "Blue Label") { $('input:text[name=' + blueName + ']').val(custom_cats[4]); }
        });
    }
}

function updateFilters() {
    if (custom_cats.length == 5) {
        if (custom_cats[0] != "") { $("#greenFilter").text(custom_cats[0]); }
        else { $("#greenFilter").text("Green Label"); }
        if (custom_cats[1] != "") { $("#orangeFilter").text(custom_cats[1]); }
        else { $("#orangeFilter").text("Orange Label"); }
        if (custom_cats[2] != "") { $("#purpleFilter").text(custom_cats[2]); }
        else { $("#purpleFilter").text("Purple Label"); }
        if (custom_cats[3] != "") { $("#redFilter").text(custom_cats[3]); }
        else { $("#redFilter").text("Red Label"); }
        if (custom_cats[4] != "") { $("#blueFilter").text(custom_cats[4]); }
        else { $("#blueFilter").text("Blue Label"); }
    }
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
        $("#card" + cardID).addClass("green");
    }
    else if (catID == 2) {
        pinnedCards[pin_idx].custom_categories.push(2);
        $("#cats" + cardID).append("<div id=\"orange-label" + cardID + "\" class=\"card-label orange-label\"></div>");
        $("#card" + cardID).addClass("orange");
    }
    else if (catID == 3) {
        pinnedCards[pin_idx].custom_categories.push(3);
        $("#cats" + cardID).append("<div id=\"purple-label" + cardID + "\" class=\"card-label purple-label\"></div>");
        $("#card" + cardID).addClass("purple");
    }
    else if (catID == 4) {
        pinnedCards[pin_idx].custom_categories.push(4);
        $("#cats" + cardID).append("<div id=\"red-label" + cardID + "\" class=\"card-label red-label\"></div>");
        $("#card" + cardID).addClass("red");
    }
    else if (catID == 5) {
        pinnedCards[pin_idx].custom_categories.push(5);
        $("#cats" + cardID).append("<div id=\"blue-label" + cardID + "\" class=\"card-label blue-label\"></div>");
        $("#card" + cardID).addClass("blue");
    }
    else {
        return;
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
        $("#card" + cardID).removeClass("green");
    }
    else if (catID == 2) {
        pinnedCards[pin_idx].custom_categories.splice( $.inArray(2, pinnedCards[pin_idx].custom_categories), 1 );
        $("#orange-label" + cardID).remove();
        $("#card" + cardID).removeClass("orange");
    }
    else if (catID == 3) {
        pinnedCards[pin_idx].custom_categories.splice( $.inArray(3, pinnedCards[pin_idx].custom_categories), 1 );
        $("#purple-label" + cardID).remove();
        $("#card" + cardID).removeClass("purple");
    }
    else if (catID == 4) {
        pinnedCards[pin_idx].custom_categories.splice( $.inArray(4, pinnedCards[pin_idx].custom_categories), 1 );
        $("#red-label" + cardID).remove();
        $("#card" + cardID).removeClass("red");
    }
    else if (catID == 5) {
        pinnedCards[pin_idx].custom_categories.splice( $.inArray(5, pinnedCards[pin_idx].custom_categories), 1 );
        $("#blue-label" + cardID).remove();
        $("#card" + cardID).removeClass("blue");
    }
    else {
        return;
    }
    $("#but" + catID.toString() + "icon" + cardID).removeClass("icon-minus");
    $("#but" + catID.toString() + "icon" + cardID).addClass("icon-plus");
    $("#cat-but" + catID.toString() + cardID).removeClass("btn-danger");
    $("#cat-but" + catID.toString() + cardID).addClass("btn-success");
    savePinnedCards();
}

function toggleCategory(cardID, catID) {
    var pin_idx = getPinIndex(cardID);
    if (pin_idx == undefined) {
        bootbox.dialog("Unable to locate card in storage, a page refresh usually solves this issue.", [{
                                "label" : "OK",
                                "class" : "btn-warning",
                            }]);
        return;
    }
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
    map.addComponent(new nokia.maps.map.component.zoom.DoubleClick());
    map.addComponent(new nokia.maps.map.component.panning.Drag());
    map.addComponent(new nokia.maps.map.component.panning.Kinetic());
    //add the card to the isotope class with pin in

    //$(".isotope").append(toAdd_Cards[pinID]);
    //$(".isotope").isotope( 'insert', toAdd_Cards[pinID]);
    //var n = noty({ text: "Bookmark added successfully", type: 'information', layout: 'bottom', theme: 'defaultTheme'});
    //setTimeout(function(){n.close(); }, 3000);
    return (pinnedCards.length-1);
}

function isPinned(yelp_id) {
    if (yelp_id == undefined) {
        return false;
    }
    for (var i = 0; i < pinnedCards.length; i++) {
        if (pinnedCards[i].id == yelp_id) {
            return true;
        }
    }
    return false;
}