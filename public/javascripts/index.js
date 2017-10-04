var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true
    });

    var myOptions = {
        zoom: 4,
        maxZoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(50, 6),
    }

    map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    directionsDisplay.setMap(map);

    //autocomplete inputbox
    var input = document.getElementById('waypointinput');
    var autocomplete = new google.maps.places.Autocomplete(input);

}

var waypts = [];
var wayptsNames = [];
function calcRoute() {
    
    var request = {
        origin: waypts[0].location,
        destination: waypts[waypts.length - 1].location,
        waypoints: waypts,
        optimizeWaypoints: false,
        travelMode: google.maps.DirectionsTravelMode.WALKING
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
        }
    });
}

function createMarker(latlng) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: map
    });
}

//future: convert all to angular
function createWaypointOverview() {
    $('#waypoints').empty();
    for (var i=0; i<wayptsNames.length; i++) {
        var waypt = document.createElement('div');
        waypt.className = 'waypoint';
        
        var removeWaypt = document.createElement('button');
        removeWaypt.className= 'btn btn-default btn-sm pull-right removeWaypt';

        var removeWayptSpan = document.createElement('span');
        removeWayptSpan.className = 'glyphicon glyphicon-trash';
        
        $('#waypoints').append(waypt);
        waypt.innerHTML = i+1 + ". " + wayptsNames[i];
        console.log(i);
        waypt.addEventListener('click', function (event) {
            console.log($(event.currentTarget));
            //future: open modal to pick couch
        });
        
        waypt.appendChild(removeWaypt);
        removeWaypt.appendChild(removeWayptSpan);

    }
}

function addWaypoint() {

    var address = $('#waypointinput').val();
    $('#waypointinput').val("");
    $('#waypointinput').focus();
    
    if (address) {
        console.log(address);
        wayptsNames.push(address);

        geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                
                console.log('geocoder results:');
                console.log(results[0].geometry.location.lat());
                console.log(results[0].geometry.location.lng());
    
                waypts.push({
                    location: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
                    stopover: true
                });

                createMarker(results[0].geometry.location);
                calcRoute(waypts);
                createWaypointOverview();

                console.log(waypts);
            }
        });
    }

}

initialize();