// Creating map object

var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 7
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v9",
  accessToken: API_KEY
}).addTo(myMap);

console.log("Hello")

// Store API query variables
var food = "static/data/fastfood.json";

// Grab the data with d3
d3.json(food, function(response) {

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response.length; i++) {
    console.log(response.length)
    // Set the data location property to a variable
    var location = response.features[i].geometry.coordinates;

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location[1], location[0]])
        .bindPopup(response.features[i].properties.Big4));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});
