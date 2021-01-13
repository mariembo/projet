let map;
let markersArray = [];

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: { lat: 47.22, lng: 2.49 },
        mapTypeId: 'terrain',
        draggableCursor : 'default'
    });
    var elevator = new google.maps.ElevationService;
    var infowindow = new google.maps.InfoWindow({ map: map });

    map.addListener('click', function(event) {
        console.log(event);
        addMarker(event.latLng);
      });
    map.addListener('click', function (event) {
        displayLocationElevation(event.latLng, elevator, infowindow);
        addMarker(event.latLng)
    });
}

var g = 9.81;
var c = 299792458;
var Mt = 5.972*Math.pow(10,24);
var Rs = (2*g*Mt)/Math.pow(c,2);

let elevationObserver = {
    value1: undefined,
    value2: undefined,
    setValue: (newVal) => {
        if (!this.value1) {
            this.value1 = newVal;
        }
        else if (!this.value2) {
            this.value2 = newVal;
            var rA = value1 + 6371000;
            var rB = value2 + 6371000;

            //var phiA = ((-1)*g*Mt)/rA;
            //var phiB = ((-1)*g*Mt)/rB;

            // ((Math.sqrt(1-Rs/rA))/(Math.sqrt(1-Rs/rB)));

            var deltaF = ((Math.sqrt(1-Rs/rA))/(Math.sqrt(1-Rs/rB)))-1;

            //fA = fA.toPrecision(6);
            //fB = fB.toPrecision(6);
            var hA = value1.toPrecision(4);
            var hB = value2.toPrecision(4);
            deltaF = deltaF.toPrecision(4);

            var h1 = document.getElementById('h1');
            h1.textContent = hA + ' m';

            var h2 = document.getElementById('h2');
            h2.textContent = hB + ' m';

            //var f1 = document.getElementById('f1');
            //f1.textContent = fA + ' Hz';

            //var f2 = document.getElementById('f2');
            //f2.textContent = fB + ' Hz';

            var decaF = document.getElementById('decaF');
            decaF.textContent = deltaF;
            
            Mt.textContent = Mt;
            var lol = Math.pow(10,24);
            
            lol.textContent = lol;
            console.log(Mt);
            console.log(lol);
            console.log(deltaF);
        }
        else {
            this.value1 = newVal;
            this.value2 = undefined;
        }

    }
}

function displayLocationElevation(location, elevator, infowindow) {
    elevator.getElevationForLocations({
        'locations': [location]
    }, function (results, status) {
        infowindow.setPosition(location);
        if (status === 'OK') {
            if (results[0]) {
                infowindow.setContent('La hauteur en ce point <br>est ' +
                    results[0].elevation + ' m');
                elevationObserver.setValue(results[0].elevation);
            } else {
                infowindow.setContent('Aucun résultat');
            }
        } else {
            infowindow.setContent('Impossible de trouver la hauteur à cause de: ' + status);
        }
    });
}

function addMarker(latLng) {
    let marker = new google.maps.Marker({
        map: map,
        position: latLng,
        draggable: true
    });
    markersArray.push(marker);
}
