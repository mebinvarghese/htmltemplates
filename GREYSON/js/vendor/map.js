/* Google Maps */
function initGmaps() {

    // EDIT: map latitude and longitude
    var myLatlng = new google.maps.LatLng(34.052235, -118.243683);

    // EDIT: map address
    var contentString = "<strong>Moreno</strong><br>Honey Creek Dr<br>6192 Los Angeles, CA";
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 300
    });

    // EDIT: map marker
    var imagePath = "img/location-icon.png";
    var mapOptions = {
        scrollwheel: false,
        zoom: 12,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
            featureType: "administrative",
            elementType: "all",
            stylers: [{
                saturation: "-100"
            }]
        }, {
            featureType: "landscape",
            elementType: "all",
            stylers: [{
                saturation: -100
            }, {
                lightness: 65
            }, {
                visibility: "on"
            }]
        }, {
            featureType: "road",
            elementType: "all",
            stylers: [{
                saturation: "-100"
            }]
        }, {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{
                visibility: "simplified"
            }]
        }, {
            featureType: "road.arterial",
            elementType: "all",
            stylers: [{
                lightness: "30"
            }]
        }, {
            featureType: "road.local",
            elementType: "all",
            stylers: [{
                lightness: "40"
            }]
        }, {
            featureType: "transit",
            elementType: "all",
            stylers: [{
                saturation: -100
            }, {
                visibility: "simplified"
            }]
        }, {
            featureType: "water",
            elementType: "geometry",
            stylers: [{
                hue: "#ffff00"
            }, {
                lightness: -25
            }, {
                saturation: -97
            }]
        }, {
            featureType: "water",
            elementType: "labels",
            stylers: [{
                lightness: -25
            }, {
                saturation: -100
            }]
        }]
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: imagePath,
        title: "My Location"
    });
    google.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
    });
    google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
}

google.maps.event.addDomListener(window, "load", initGmaps);