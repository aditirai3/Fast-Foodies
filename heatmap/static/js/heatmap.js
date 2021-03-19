// create map object

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

var geodata = "static/data/cities.json";

d3.json(geodata, function(response) {

  console.log(response.features.length);

  var heatArray = [];

  for (var i = 0; i < response.features.length; i++) {
    var location = response.features[i].geometry.coordinates;
    var dense = response.features[i].properties.density;
    console.log(location);
    if (location) {
      heatArray.push([location[1], location[0], dense]);
    }
  }

  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

});
// switch case to set colors of heatmap

var food = "static/data/fastfood.json";
console.log("Hello");
// Grab the data with d3
d3.json(food, function(response1) {
  console.log(response1);

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response1.features.length; i++) {
    // Set the data location property to a variable
    var location1 = response1.features[i].geometry.coordinates;

    // Check for location property
    if (location1) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location1[1], location1[0]])
        .bindPopup(response1.features[i].properties.Big4));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});
