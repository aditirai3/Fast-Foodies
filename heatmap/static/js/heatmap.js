// create map object
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 7
});

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v9",
  accessToken: API_KEY
}).addTo(myMap);

// Heatmap layer
// Assign the Data json to a variable
var geodata = "static/data/cities.json";

// Read the data using D3
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

// Marker layer
var food = "static/data/fastfood.json";

// Grab the data with d3
d3.json(food, function(response1) {
  console.log(response1);

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through data
  for (var i = 0; i < response1.features.length; i++) {
    // Set the data location property to a variable
    var location1 = response1.features[i].geometry.coordinates;
    var rname = response1.features[i].properties.Big4;
    switch(rname){
      case "Burger King":
        iconUrl = "static/images/bk.png";
        iconSize = [80, 70]
        break;
      case "Taco Bell":
        iconUrl = "static/images/tb.png";
        iconSize = [40, 40]
        break;
      case "McDonalds":
        iconUrl = "static/images/mcdonalds.png";
        iconSize = [80, 70]
        break;
      case "Subway":
        iconUrl = "static/images/subway.jpg";
        iconSize = [40, 40]
        break;
      case "Wendys":
        iconUrl = "static/images/wendys.png";
        iconSize = [80, 70]
        break;
    }
    var myIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: iconSize
      // iconAnchor: [22, 94],
      // popupAnchor: [-3, -76]
  });

    // Check for location property
    if (location1) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([location1[1], location1[0]], {icon:myIcon})
        .bindPopup("<h3> Name :" + response1.features[i].properties.Big4 + "</h3><hr><h3> City: " + response1.features[i].properties.city + "</h3>"));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

});

