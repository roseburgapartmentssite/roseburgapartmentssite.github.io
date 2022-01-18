var map = null;
var gdir = null;
var iconDefs = {};
var markers = [];
var categories = [];
var cheaterData = '';

/* Map Loading Functions */
function initializeMap() {
    try {
        if (GBrowserIsCompatible()) {
            map = new GMap2($("#map")[0]);
            map.addControl(new GLargeMapControl());
            map.addControl(new GMapTypeControl());
            map.enableDoubleClickZoom();
            map.enableContinuousZoom();
            map.enableScrollWheelZoom();

            map.setCenter(new GLatLng(43.236543, -123.379083), 15);

            gdir = new GDirections(map, $("#directions")[0]);
            GEvent.addListener(gdir, "error", handleErrors);

            window.setTimeout(initMarkers, 0);
        }
    }
    catch (err) {
    }
}
$(document).ready(initializeMap);

function initMarkers() {
    initIcons();
    GDownloadUrl("_scripts/locations.txt", handleData);
}

function initIcons() {
    var ico = new GIcon();
    ico.image = "./_images/house.png";
    ico.iconSize = new GSize(32, 32);
    ico.iconAnchor = new GPoint(16, 16);
    ico.shadow = "./_images/house-shadow.png"
    ico.shadowSize = new GSize(59, 32);
    iconDefs["home"] = ico;

    ico = new GIcon();
    ico.image = "./_images/medical.png";
    ico.iconSize = new GSize(24, 24);
    ico.iconAnchor = new GPoint(16, 16);
    iconDefs["hospital"] = ico;

    ico = new GIcon();
    ico.image = "./_images/school.png";
    ico.iconSize = new GSize(33, 33);
    ico.iconAnchor = new GPoint(16, 16);
    iconDefs["school"] = ico;

    ico = new GIcon();
    ico.image = "./_images/bible.png";
    ico.iconSize = new GSize(24, 24);
    ico.iconAnchor = new GPoint(16, 16);
    iconDefs["church"] = ico;

    ico = new GIcon();
    ico.image = "./_images/stamp.png";
    ico.iconSize = new GSize(32, 32);
    ico.iconAnchor = new GPoint(16, 16);
    iconDefs["postoffice"] = ico;

    ico = new GIcon();
    ico.image = "./_images/bank.png";
    ico.iconSize = new GSize(20, 20);
    ico.iconAnchor = new GPoint(16, 16);
    iconDefs["bank"] = ico;

    ico = new GIcon();
    ico.image = "./_images/shopping.png";
    ico.iconSize = new GSize(25, 25);
    ico.iconAnchor = new GPoint(16, 16);
    iconDefs["shopping"] = ico;
}

function handleData(data) {
    data = data + "\n" + cheaterData;
    var infoW = data.split("\n");
    var i = 0;
    var categories_unfiltered = [];
    for (i = 0; i < infoW.length; i++) {
        if (infoW[i].indexOf("|") != -1) {
            var content = infoW[i].trim().split("|");
            var point = new GLatLng(content[1] * 1, content[2] * 1);
            markers[i] = new GMarker(point, { icon: iconDefs[content[0]], title: content[3] });
            markers[i].myCategory = content[0];
            map.addOverlay(markers[i]);
            doIW(markers[i], formatInfoWindow(content[3], content[4]));

            categories_unfiltered.push(content[0]);
        }
    }
    categories = categories_unfiltered.unique();
    refreshSelectedMarkers();
}

function addMarker(name, category, address, location) {
    // location is assumed to be a GLatLng object
    alert(iconDefs);
    var marker = new GMarker(location, { icon: iconDefs['home'], title: name });
    marker.myCategory = category;
    markers.push(marker);
    map.addOverlay(marker);
    doIW(marker, formatInfoWindow(name, address));

    if (categories.indexOf(category) == -1)
        categories.push(category);

    refreshSelectedMarkers();
}

function formatInfoWindow(name, address, category) {
    var html = '<div class="iw">'
            + '<span class="iwAddressName">' + name + '</span>'
            + '<span class="iwAddressLines">' + address.replace('*', '<br />') + '</span><br />'
            + 'Get Directions: <a href=\'javascript:void(0);\' onclick=\'$("#txtTo")[0].value = "' + address.replace('*', ', ') + '";getDirections_Click();return false;\'>TO: \'' + name + '\'</a><br />'
            + 'Get Directions: <a href=\'javascript:void(0);\' onclick=\'$("#txtFrom")[0].value = "' + address.replace('*', ', ') + '";getDirections_Click();return false;\'>FROM: \'' + name + '\'</a></div>';
    return html;
}

function doIW(pin, html) {
    GEvent.addListener(pin, "click", function() {
        map.openInfoWindowHtml(pin.getLatLng(), html);
    });
}

/* Map Loading Functions  */





/* Map Functions */

function getDirections_Click() {
    if ($("#txtFrom")[0].value != '' && $("#txtTo")[0].value != '')
        if ($("#txtFrom")[0].value != $("#txtTo")[0].value)
            setDirections($("#txtFrom")[0].value, $("#txtTo")[0].value, "en_US");
}

function setDirections(fromAddress, toAddress, locale) {
    gdir.load("from: " + fromAddress + " to: " + toAddress, { "locale": locale, "getSteps": true });
}

function handleErrors() {
    if (gdir.getStatus().code == G_GEO_UNKNOWN_ADDRESS)
        alert("No corresponding geographic location could be found for one of the specified addresses. This may be due to the fact that the address is relatively new, or it may be incorrect.\nError code: " + gdir.getStatus().code);
    else if (gdir.getStatus().code == G_GEO_SERVER_ERROR)
        alert("A geocoding or directions request could not be successfully processed, yet the exact reason for the failure is not known.\n Error code: " + gdir.getStatus().code);
    else if (gdir.getStatus().code == G_GEO_MISSING_QUERY)
        alert("The HTTP q parameter was either missing or had no value. For geocoder requests, this means that an empty address was specified as input. For directions requests, this means that no query was specified in the input.\n Error code: " + gdir.getStatus().code);
    else if (gdir.getStatus().code == G_GEO_BAD_KEY)
        alert("The given key is either invalid or does not match the domain for which it was given. \n Error code: " + gdir.getStatus().code);
    else if (gdir.getStatus().code == G_GEO_BAD_REQUEST)
        alert("A directions request could not be successfully parsed.\n Error code: " + gdir.getStatus().code);
    else alert("An unknown error occurred.");
}
/* Map Functions */


/* Marker Functions */

function show(category) {
    for (var i = 0; i < markers.length; ++i) {
        if (markers[i].myCategory == category)
            markers[i].show();
    }
    $('#chk_' + category).checked = true;
}

function hide(category) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].myCategory == category) {
            markers[i].hide();
        }
    }
    $('#chk_' + category).checked = false;
    map.closeInfoWindow();
}

function boxclick(box, category) {
    if (box.checked) {
        show(category);
    } else {
        hide(category);
    }
}

function refreshSelectedMarkers() {
    var len = categories.length;
    var chkBox = null;
    for (var i = 0; i < len; ++i) {
        if (categories[i] == 'home')
            show(categories[i]);
        else {
            chkBox = $('#chk_' + categories[i])[0];
            if (chkBox != null) {
                if (chkBox.checked == true)
                    show(categories[i]);
                else
                    hide(categories[i]);
            }
        }
    }
}

/* Marker Functions */
