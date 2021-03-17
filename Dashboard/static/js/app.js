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
        //sort the drop down menu list before rendering
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
    
    
});

}
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
   };

 init();
//Count the restaurants by states; Returns 2 lists 
//a => sorted array of states; 
//b => number of times each states repeats.
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
