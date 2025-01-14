//Load the json data and call functions to construct plots
function init() {
  var selector = d3.select("#selDataset");
  d3.json("data/fastfood.json").then((data) => {
      var foodChain = data.features;
      const FoodChain = [];
      foodChain.forEach((item)=> {
          i=item.properties;
          if (FoodChain.indexOf(i.Big4) == '-1') {
              FoodChain.push(i.Big4); 
              }
      })
      //sort the array before rendering
      sortedArr=FoodChain.sort();
      sortedArr.forEach((item)=> {
          selector
              .append("option")
              .text(item)
              .property("value", item);
      })
  //Construct initial plots with the first data value
  // createDemographics(data.names[0]);
  // var sortArr = FoodChain.sort();
  // console.log(sortArr);
  createChart(sortedArr[0]); 
  createScatter(sortedArr[0]);
  createMap();    
});

}

census = d3.csv("data/Census_data.csv")

function createChart(id){
  d3.json("data/fastfood.json").then((data) => {
      var foodChain = data.features;
      var filtered = foodChain.filter(d => d.properties.Big4.toString() === id);
      var big5=[], province=[], big4=[], population=[];
      filtered.forEach((item)=> {
          province.push(item.properties.province); 
          population.push(item.properties.Population);
          big4.push(item.properties.Big4) 
      })
      results=arrCount(province);
      states=results[0];
      scores=results[1];

      
      var scoresMap = {};
      //Sort the States with respect to the number of restaurants
      scores.forEach(function(el, i) {
          scoresMap[states[i]] = el;
         });
      
      states.sort(function(a, b) {
           return scoresMap[b] - scoresMap[a];
      });
     
      //Top ten locations 
      sorted_scores=scores.sort(function(a,b){return b-a;});
       //Percent of  restaurant locations 
       var percent = [];
      totals = sorted_scores.reduce((pv, cv) => pv + cv, 0);
      sorted_scores.forEach(function(score) {
          percent.push((score *100/totals).toFixed(2))
      }) 
      var toptenProvince = states
                          .slice(0, 10)
                          .reverse()
                          .map(st => st);
      var toptenScores= scores 
                         .slice(0, 10)
                         .reverse();
      //Hover text
      var toptenPercent = percent
                        .slice(0, 10)
                        .reverse();
     
      // Build Bar charts 
      switch(id){
        case "Burger King":
          color = "rgb(24, 84, 148)";
          title = "Burger King";
          image = "static/images/chart/bk.png"
          break;
        case "Taco Bell":
          color= "rgb(104, 42, 141)";
          title = "Taco Bell";
          image = "static/images/chart/tb.png"
          break;
        case "McDonalds":
          color= "rgb(255 199 44)";
          title = "McDonald's";
          image = "static/images/chart/Mcdonalds.png"
          break;
        case "Subway":
          color= "rgb(0, 140, 21)";
          title = "Subway";
          image = "static/images/chart/subway.png"
          break;
        case "Wendys":
          color= "rgb(221, 20, 56)";
          title = "Wendys";
          image = "static/images/chart/Wendys.png"
          break;
        }
      var trace = {
          x: toptenScores,
          y: toptenProvince,
          text: toptenPercent,
          marker: {color: color},
          type:"bar",
          orientation: "h",
          hovertemplate: '<b>Locations</b>: %{x}<br>' +
                       '<b>Restaurant(%)</b>: %{text}<extra></extra>'
          };
      var layout = {
          title: "<b>"+"Locations By State"+"</b>",
           "titlefont": {
              "size": 20
            },
          height: 400,
          yaxis: {
               tickmode: "linear",
           },
          margin: {
              l: 100,
              r: 100,
              t: 50,
              b: 20
          },
          images: [
            {
              x: 0.1,
              y: 1.02,
              sizex: 0.1,
              sizey: 0.1,
              source: image,
              xanchor: "right",
              xref: "paper",
              yanchor: "bottom",
              yref: "paper"
            }
          ],
       };
      Plotly.newPlot("bar", [trace], layout, {displayModeBar: false})
  })
}

function createScatter(id){
  d3.json("data/third.json").then((data) => {
      var foodChain = data.data;
      var color = []
      var fcolor = []
      switch(id){
        case "Burger King":
          fcolor.push('white');
          color.push('#185494');
          break;
        case "Taco Bell":
          fcolor.push('white');
          color.push('#682a8d');
          break;
        case "McDonalds":
          fcolor.push('black');
          color.push('#ffc72c');
          break;
        case "Subway":
          fcolor.push('white');
          color.push('#008c15');
          break;
        case "Wendys":
          fcolor.push('white');
          color.push('#dd1438');
          break;
      } 

      var province=[], pairs = [], one = [], two = [];
      foodChain.forEach((item)=> {
          province.push(item.Name); 
          var population = item.Population;
          var poverty = item.Poverty
          two.push(item.Poverty)
          switch(id){
              case "Burger King":
                var count= item.BK;
                break;
              case "Taco Bell":
                var count= item.TB;
                break; 
              case "McDonalds":
                var count= item.McDonalds;
                break;
              case "Subway":
                var count= item.Subway
                break;
              case "Wendys":
                var count= item.Wendys
                break;
            } 
          var ratio = (count/population*1000000)
          one.push(ratio)
          pairs.push([ratio, poverty, poverty])

      })
      var options={
        series: [{
          name: "Poverty Rate",
          data: pairs
          }],
        chart: {
          height: 400,
          type: 'bubble',
          // zoom: {
          //   enabled: true,
          //   type: 'xy'
          // },
          toolbar: {
            show: false

          }         
          },
        dataLabels: {
          enabled: false
        },
        tooltip:{
          enabled: true,
          custom: function({series, seriesIndex, dataPointIndex, w}) {
          	var arrays = w.config.series[0].data
          	var pov = series[seriesIndex][dataPointIndex]
          	var ava = arrays[dataPointIndex][0]
    		return '<div class="arrow_box" style="background-color:'+ color + ';color:' + fcolor +
          ';font-family: Arial, sans-serif; font-size: 13px;fill-opacity: 1; font-weight:bold">' +
      		'<span style="padding:5px"> Poverty Rate (%): ' +'<span style="font-weight:normal">'+ parseFloat(pov).toFixed(2) + '</span></span><br>' +
      		'<span style="padding:5px"> RAMP: ' +'<span style="font-weight:normal">'+ parseFloat(ava).toFixed(2) + '</span></span><br>' +
      		'</div>'
			},
        },
        colors: color,
        title: {
          text: "Restaurants by Poverty Rate",
          align: "center",
          style: {
            fontSize:  '20px',
            fontFamily:  '"Open Sans", verdana, arial, sans-serif'
            
          }
        },
        xaxis: {
          tickAmount: 10,
          title: {
              text: "Restaurant Availability per Million People"},
          labels: {
            formatter: function(val) {
              return parseFloat(val)
            }
          },
          min: 0,
          max: 10,
          tooltip: false
        },
        yaxis: {
          tickAmount: 7,
          title: {
              text: "Poverty Rate (%)"},
          labels: {
              formatter: function(val) {
              return parseInt(val)
                }
              },
          min: 8,
          max: 24
        },
        };
      console.log(options)
      chart = new ApexCharts(document.querySelector("#splatter"), options);
      chart.render();

})
}
function optionChanged(id) {
  console.log("In OptionChanged "+ id);
  createChart(id);
  d3.selectAll("#splatter").html("");
  createScatter(id);

 };

init();
//Count the restaurants by states
function arrCount(states) {
  var a = [],
    b = [],
    prev;

  states.sort();
  for (var i = 0; i < states.length; i++) {
    if (states[i] !== prev) {
      a.push(states[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = states[i];
  }

  return [a, b];
}


// Heatmap code
// // create map object
function createMap(){
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

d3.json(geodata).then((response) =>{
var heatArray = [];

for (var i = 0; i < response.features.length; i++) {
  var location = response.features[i].geometry.coordinates;
  var dense = response.features[i].properties.density;
  //console.log(location);
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
d3.json(food).then((response1) =>{
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
      iconUrl = "static/images/subway.png";
      iconSize = [40, 50]
      break
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
      .bindPopup("<h3> Name: " + response1.features[i].properties.Big4 + "</h3><hr><h3> City: " + response1.features[i].properties.city + "</h3>"));
  }

}

// Add our marker cluster layer to the map
myMap.addLayer(markers);

})

var legend = L.control({position: 'bottomleft'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
      places = ['McDonalds', "Burger King", "Wendys", "Subway", "Taco Bell"],
      labels = ["static/images/chart/mcdonalds.png", "static/images/chart/bk.png", "static/images/chart/wendys.png", "static/images/chart/subway.png", "static/images/chart/tb.png"];
  var table = L.DomUtil.create('table', 'hello')
  for (var i = 0; i < places.length; i++) {
    if (i>=0) {
      table.innerHTML +=
          "<tr><td><strong>" + places[i] + "</strong></td>" +(" <td><img src="+ labels[i] +" height='40' width='40'>") +"</td></tr>";
    }
  }
  return table;
};
legend.addTo(myMap);
};