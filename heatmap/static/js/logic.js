// Creating map object
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 7
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v9",
  accessToken: API_KEY
}).addTo(myMap);

var uscities = "static/data/cities.json";

uscities.forEach(function(state) {
  var polygon = L.polygon(state.geometry.coordinates, {
      weight: 1,
      fillOpacity: 0.7,
      color: 'white',
      dashArray: '3'
  }).addTo(map);
});