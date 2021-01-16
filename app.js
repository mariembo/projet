
//Initialisation des variables globales
var map; // Map
var marker; //Marqueur sur la map
var G = 6.67430*Math.pow(10,-11); //Constante gravitationnelle
var c = 299792458; //Celerité
var Mt = 5.972*Math.pow(10,24); //Masse de la Terre
var Rs = (2*G*Mt)/Math.pow(c,2); //Rayon de Schwarzschild
var value1 = undefined; //Hauteur du lieu 1
var value2 = undefined; //Hauteur du lieu 2

//Initialisation de la map
function initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: { lat: 47.22, lng: 2.49 },
        mapTypeId: 'terrain',
        draggableCursor : 'default'
    });

    var elevator = new google.maps.ElevationService;

      //Ajout d'un marqueur lors d'un click sur la map
    map.addListener('click', function(event) {
        addMarker(event.latLng);
      });

      //Ajout d'un marqueur lors d'un second click sur la map et definition des hauteurs des lieus
    map.addListener('click', function (event) {
        defLocationElevation(event.latLng, elevator);
        addMarker(event.latLng)
    });
}

//Definition des hauteurs des lieus
function defLocationElevation(location, elevator) {
    elevator.getElevationForLocations({
        'locations': [location]
    }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
              if (!this.value1) {
                  this.value1 = results[0].elevation;
              }
              else if (!this.value2) {
                  this.value2 = results[0].elevation;
                  getShift();
              }
              else {
                  this.value1 = results[0].elevation;
                  this.value2 = undefined;
              }

            } else {
              console.log("Error occured");
            }
        } else {
        }
    });
}

//Calcul du décalage
function getShift(){
  //Hauteur des lieus par rapport au centre de la Terre
  var rA = this.value1 + 6371000;
  var rB = this.value2 + 6371000;

  var deltaF = (Math.sqrt(1-Rs/rA)/Math.sqrt(1-Rs/rB))-1; //Formule du décalage

  //Definition des variables en récuperant uniquement 4 chiffres
  var hA = this.value1.toPrecision(4);
  var hB = this.value2.toPrecision(4);

  deltaF = deltaF.toPrecision(4);

  //Association des variables calculées/récupérées en javascript avec les éléments correspondant dans le html
  var h1 = document.getElementById('h1');
  h1.textContent = hA + ' m';

  var h2 = document.getElementById('h2');
  h2.textContent = hB + ' m';

  var decaF = document.getElementById('decaF');
  decaF.textContent = deltaF;
}

//Ajout d'un marqueur à la map
function addMarker(latLon) {
  if (this.marker){
    this.marker.setMap(null);
  }
    this.marker = new google.maps.Marker({
        map: map,
        position: latLon,
        draggable: false
    });
    this.marker.setMap(map);
}
