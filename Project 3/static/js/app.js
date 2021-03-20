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

d3.json("data/third.json").then((third)=>{
      var mcdonalds = [];
        foodChain.forEach((item)=> {
            i=item.properties;
            if (FoodChain.indexOf(i.Big4) == '-1') {
                FoodChain.push(i.Big4); 
                }
        })
})

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
        var toptenProvince = states
                            .slice(0, 10)
                            .reverse()
                            .map(st => st);
        var toptenScores= scores
                           .slice(0, 10)
                           .reverse();
                        //    .sort(function(a,b){return b-a;});
        // //Hover text
         var labels = "locations";
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
            text: labels,
            marker: {color: color},
            type:"bar",
            orientation: "h"
            };
        var layout = {
            title: "<b>"+"Locations By State"+"</b>",
            height: 500,
            width: 600,
             "titlefont": {
                "size": 20
              },
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
        Plotly.newPlot("bar", [trace], layout)
    })
}

function createScatter(id){
    d3.json("data/third.json").then((data) => {
        var foodChain = data.data;
        var color = []
        switch(id){
          case "Burger King":
            //var color = '#185494';
            color.push('#185494');
            break;
          case "Taco Bell":
            //var color = "#682a8d";
            color.push('#682a8d');
            break;
          case "McDonalds":
            //var color = "#ffc72c";
            color.push('#ffc72c');
            break;
          case "Subway":
            //var color = "#008c15";
            color.push('#008c15');
            break;
          case "Wendys":
            //var color = "#dd1438";
            color.push('#dd1438');
            break;
        } 
        console.log(color)
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
            pairs.push([ratio, poverty])

        })
        
        var options={
          series: [{
            name: "SAMPLE A",
            data: pairs
            }],
          chart: {
            height: 350,
            type: 'scatter',
            zoom: {
              enabled: true,
              type: 'xy'
            }         
            },
          // markers: {
          //   discrete: [{
          //     seriesIndex: 0,
          //     dataPointIndex: 4,
          //     size: 100
          //     }]
          // },
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
                text: "Restaurant Availability"},
            labels: {
              formatter: function(val) {
                return parseFloat(val).toFixed(1)
              }
            },
            min: 0,
            max: 10

          },
          yaxis: {
            tickAmount: 7,
            title: {
                text: "Poverty Rate"},
            min: 8,
            max: 24
          }
          };

        var chart = new ApexCharts(document.querySelector("#splatter"), options);
        // chart.zoomX(new (0.1), new (5));
        chart.render();



})
}

function optionChanged(id) {
    console.log("In OptionChanged "+ id);
    // createDemographics(id);
    createChart(id);
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
  
 
//   var result = arrCount(arr);
//   console.log('[' + result[0] + ']','[' + result[1] + ']')

// Heatmap code
// // create map object
function createMap(){
console.log("try again")
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
console.log("try 2")
// Heatmap layer
// Assign the Data json to a variable
var geodata = "static/data/cities.json";
// Read the data using D3

d3.json(geodata).then((response) =>{
  console.log(response)

  console.log(response.features.length);

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
  console.log("test 1")
});
// switch case to set colors of heatmap

// Marker layer
var food = "static/data/fastfood.json";
console.log(food)
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
        .bindPopup("<h3> Name: " + response1.features[i].properties.Big4 + "</h3><hr><h3> City: " + response1.features[i].properties.city + "</h3>"));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

})
};


