//Load the json data and call functions to construct plots
function init() {
    var selector = d3.select("#selDataset");
    d3.json("data/fastfood.json").then((data) => {
        console.log(data)

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
            console.log(item)
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
    createScatter(sortedArr[0])
    
    
});

}

d3.csv("data/Census_data.csv").then((census)=>{
    console.log(census)
    console.log("snails")
})

census = d3.csv("data/Census_data.csv")
console.log(census)

d3.json("data/third.json").then((third)=>{
    console.log(third)
    console.log("snails")
      var mcdonalds = [];
        foodChain.forEach((item)=> {
            i=item.properties;
            if (FoodChain.indexOf(i.Big4) == '-1') {
                FoodChain.push(i.Big4); 
                }
        })
})
// // function createDemographics(id){
// //     d3.json("data/samples.json").then((data) => {
// //         var metadata= data.metadata;
// //         var filteredId = metadata.filter(d => d.id.toString() === id);
// //         showDemographics(filteredId);
    
// //     });
// // }  
// // function showDemographics(metadata){
// //     demographics = d3.select("#sample-metadata")
// //     //clear the panel 
// //     demographics.html('');
// //     //get the key/value pair
// //     Object.entries(metadata[0]).forEach(([key, value]) => {
// //         console.log(key);
// //         demographics.append("h5").text(`${key} : ${value}`)
// //     })
// // }

function createChart(id){
    console.log("Big5", id)
    d3.json("data/fastfood.json").then((data) => {
        var foodChain = data.features;
        var filtered = foodChain.filter(d => d.properties.Big4.toString() === id);
        console.log(filtered);
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
        console.log(states);
        sorted_scores=scores.sort(function(a,b){return b-a;});
        var toptenProvince = states
                            .slice(0, 10)
                            .reverse()
                            .map(st => st);
        console.log(toptenProvince);
        var toptenScores= scores
                           .slice(0, 10)
                           .reverse();
                        //    .sort(function(a,b){return b-a;});
        console.log(toptenScores);
        // //Hover text
         var labels = "locations";
        // Build Bar charts 
        switch(id){
                case "Burger King":
                  color = "rgb(24, 84, 148)";
                  break;
                case "Taco Bell":
                  color= "rgb(104, 42, 141)";
                  break;
                case "McDonalds":
                  color= "rgb(255 199 44)";
                  break;
                case "Subway":
                  color= "rgb(0, 140, 21)";
                  break;
                case "Wendys":
                  color= "rgb(221, 20, 56)";
                  break;
                default:
                  color: 'rgb(106, 83, 184)'
              }
        var trace = {
            x: toptenScores,
            y: toptenProvince,
            text: labels,
            // marker: {color: 'rgb(106, 83, 184)'},
            marker: {color: color},
            type:"bar",
            orientation: "h"
            };
         var layout = {
             title: "<b>Fast food chains by State</b>",
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
            }
         };
        Plotly.newPlot("bar", [trace], layout)
    })
}

function createScatter(id){
    d3.json("data/third.json").then((data) => {
        console.log(data.data.BK)
        var foodChain = data.data;
        console.log(foodChain.Population)
        // var counts = []
        //       switch(id){
        //         case "Burger King":
        //           counts.push(foodChain.BK);
        //           break;
        //         case "Taco Bell":
        //           counts.push(foodChain.TB);
        //           break;
        //         case "McDonalds":
        //           counts.push(foodChain.McDonalds);
        //           break;
        //         case "Subway":
        //           counts.push(foodChain.Subway)
        //           break;
        //         case "Wendys":
        //           counts.push(foodChain.Wendys)
        //           break;
        //       }
        //console.log(counts);
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
        console.log(one)
        console.log(two)
        console.log(province)
        console.log(pairs)
        var options={
        series: [{
          name: "SAMPLE A",
          data: pairs}],
          chart: {
          height: 350,
          type: 'scatter',
          zoom: {
            enabled: true,
            type: 'xy'
          }
        },

        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(1)
            }
          }
        },
        yaxis: {
          tickAmount: 7
        }
        };

        var chart = new ApexCharts(document.querySelector("#splatter"), options);
        chart.render();

    //     var trace1 = {
    //       x: two,
    //       y: one,
    //       mode: 'markers',
    //       type: 'scatter'
    //     };
    //     var data = [trace1]
    //     Plotly.newPlot("splatter", data)
    // })
})
}
//********************************************************************** */   
//         //Build Bubble charts
//         var trace1 = {
//            x: filtered.otu_ids,
//            y: filtered.sample_values,
//            text: filtered.otu_labels,
//            mode: "markers",
//            marker: {
//             size: filtered.sample_values,
//             color:filtered.otu_ids,
//             colorscale: "Earth"
//             },
           
//         };
//         var bubble_layout = {
//             title: "<br><b>Bubble Chart OTU id vs Sample values</b>",
//             xaxis: {title: "OTU IDs"},
//             height : 600,
//             width: 1000
//         }
//         Plotly.newPlot(bubble, [trace1], bubble_layout)
//         // Build guage chart
//         var metadata = data.metadata.filter(d => d.id.toString() === id)[0];
//         var wfreq = metadata.wfreq;
//         if (wfreq == null) {
//             wfreq = 0;
//         }
//         var data = [
//             {
//                 domain: { x: [0, 1], y: [0, 1]  },            
//                 value: parseFloat(wfreq),
//                 title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week<br><br>',
// 		  	    height: 600,
// 		  	    width: 600,
//                 type: "indicator",
//                 mode: "gauge+number",
//                 gauge: { axis: { range: [0, 9] },
//                 bar: { color: 'rgba(8,29,88,0)' },
//                    steps: [
//                     { range: [0, 1], color: 'rgb(255,255,217)' },
//                     { range: [1, 2], color: 'rgb(237,248,217)' },
//                     { range: [2, 3], color: 'rgb(199,233,180)' },
//                     { range: [3, 4], color: 'rgb(127,205,187)' },
//                     { range: [4, 5], color: 'rgb(65,182,196)' },
//                     { range: [5, 6], color: 'rgb(29,145,192)' },
//                     { range: [6, 7], color: 'rgb(34,94,168)' },
//                     { range: [7, 8], color: 'rgb(37,52,148)' },
//                     { range: [8, 9], color: 'rgb(8,29,88)' }
//                   ]}
//             }
//         ];
        
//         var layout = { width: 600, height: 500, margin: { t: 10, b: 0 },
//                         };
//         Plotly.newPlot('gauge', data, layout);
// });
// }

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
// var myMap = L.map("map", {
//   center: [37.0902, -95.7129],
//   zoom: 7
// });

// // Add a tile layer
// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/light-v9",
//   accessToken: API_KEY
// }).addTo(myMap);

// Heatmap layer
// Assign the Data json to a variable
// var geodata = "static/data/cities.json";

// // Read the data using D3
// d3.json(geodata, function(response) {

//   console.log(response.features.length);

//   var heatArray = [];

//   for (var i = 0; i < response.features.length; i++) {
//     var location = response.features[i].geometry.coordinates;
//     var dense = response.features[i].properties.density;
//     console.log(location);
//     if (location) {
//       heatArray.push([location[1], location[0], dense]);
//     }
//   }

//   var heat = L.heatLayer(heatArray, {
//     radius: 20,
//     blur: 35
//   }).addTo(myMap);

// });
// // switch case to set colors of heatmap

// // Marker layer
// var food = "static/data/fastfood.json";

// // Grab the data with d3
// d3.json(food, function(response1) {
//   console.log(response1);

//   // Create a new marker cluster group
//   var markers = L.markerClusterGroup();

//   // Loop through data
//   for (var i = 0; i < response1.features.length; i++) {
//     // Set the data location property to a variable
//     var location1 = response1.features[i].geometry.coordinates;
//     var rname = response1.features[i].properties.Big4;
//     switch(rname){
//       case "Burger King":
//         iconUrl = "static/images/bk.png";
//         iconSize = [80, 70]
//         break;
//       case "Taco Bell":
//         iconUrl = "static/images/tb.png";
//         iconSize = [40, 40]
//         break;
//       case "McDonalds":
//         iconUrl = "static/images/mcdonalds.png";
//         iconSize = [80, 70]
//         break;
//       case "Subway":
//         iconUrl = "static/images/subway.jpg";
//         iconSize = [40, 40]
//         break;
//       case "Wendys":
//         iconUrl = "static/images/wendys.png";
//         iconSize = [80, 70]
//         break;
//     }
//     var myIcon = L.icon({
//       iconUrl: iconUrl,
//       iconSize: iconSize
//       // iconAnchor: [22, 94],
//       // popupAnchor: [-3, -76]
//   });

//     // Check for location property
//     if (location1) {

//       // Add a new marker to the cluster group and bind a pop-up
//       markers.addLayer(L.marker([location1[1], location1[0]], {icon:myIcon})
//         .bindPopup("<h3> Name :" + response1.features[i].properties.Big4 + "</h3><hr><h3> City: " + response1.features[i].properties.city + "</h3>"));
//     }

//   }

//   // Add our marker cluster layer to the map
//   myMap.addLayer(markers);

// });

