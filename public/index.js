
// Definiere die Daten als globale Variablen.
// Nicht sehr schoen, aber simpel.
var stations
var fstaub16
var fstaub17
var fstaub18
var fstaub19
var fullgraph
var CO = []
var NO2 = []
var O3 = []
var PM10 = []
var SO2 = []

// Disable die Visualisierungs-Buttons, weil noch keine Daten geladen sind.
document.getElementById("btn_vis1").disabled = true
document.getElementById("btn_vis2").disabled = true
document.getElementById("btn_vis3").disabled = true

// Socket Objekt wird erstellt.
const socket = io()


// Connect und disconnect events.
socket.on("connect", () => {
  console.log("Connected to the webserver.")
})

socket.on("disconnect", () => {
  console.log("Disconnected from the webserver.")
})


// Hier werden die Daten, die vom Server gesendet werden, aufgefangen.
socket.on("station_data", (obj) => {
  stations = obj
})

socket.on("fstaub16_data", (obj) => {
  fstaub16 = obj
})

socket.on("fstaub17_data", (obj) => {
  fstaub17 = obj
})

socket.on("fstaub18_data", (obj) => {
  fstaub18 = obj
})

socket.on("fstaub19_data", (obj) => {
  fstaub19 = obj
})

socket.on("CO_data", (obj) => {
  CO.push(obj)
  console.log("CO geladen.")
})

socket.on("NO2_data", (obj) => {
  NO2.push(obj)
})

socket.on("O3_data", (obj) => {
  O3.push(obj)
})

socket.on("PM10_data", (obj) => {
  PM10.push(obj)
})

socket.on("SO2_data", (obj) => {
  SO2.push(obj)
})

socket.on("fullgraph_data", (obj) => {
  fullgraph = obj
  console.log("Daten geladen!")
  // Enable die Buttons.
  document.getElementById("btn_vis1").disabled = false
  document.getElementById("btn_vis2").disabled = false
  document.getElementById("btn_vis3").disabled = false
})


// Sendet mehrere requests an den Server um alle Daten seperat zu erhalten.
function request_all_data() {
  
  // Disable den Data Button.
  document.getElementById("btn_getData").disabled = true
  
  socket.emit("get_station_data",  "Beispiel-String")
  socket.emit("get_fstaub16_data",  "Beispiel-String")
  socket.emit("get_fstaub17_data",  "Beispiel-String")
  socket.emit("get_fstaub18_data",  "Beispiel-String")
  socket.emit("get_fstaub19_data",  "Beispiel-String")
  socket.emit("get_CO_data", "Beispiel-String")
  socket.emit("get_NO2_data", "Beispiel-String")
  socket.emit("get_O3_data", "Beispiel-String")
  socket.emit("get_PM10_data", "Beispiel-String")
  socket.emit("get_SO2_data", "Beispiel-String")
  socket.emit("get_fullgraph_data",  "Beispiel-String") 
}


// Hier finden die Visualisierungen statt.
function visualization_1() {
  // Graph
  // Waehle Groesse und Rand des Graphs
  var margin = { top: 50, right: 30, bottom: 30, left: 100 },
    width = 600 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#vis1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
    
  var xScale = d3.scaleLinear()
    .domain([5, 16])
    .range([ 0, width]);
  
  var yScale = d3.scaleLinear()
    .domain([47, 55.2])
    .range([ height, 0]);

  // Fuege x-Achse hinzu.
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));
  
  // Fuege y-Achse hinzu.
    svg.append("g")
      .call(d3.axisLeft(yScale));
  
  // x-Achse Beschriftung
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - 40)
    .attr("y", height + margin.top)
    .text("Longitude")

  // y-Achse Beschriftung
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", - margin.left + 50)
    .attr("x", - margin.top)
    .text("Latitude")
  

  // Calculates average (mean) of all mean values.
  let averages = []
  for (let station in fullgraph.nodes) {
    let average = 0
    let count = 0
    for (let date in fullgraph.nodes[station].mean) {
      if (isNaN(fullgraph.nodes[station].mean[date]) == false && fullgraph.nodes[station].mean[date] != null) {
        count++
        average = average + fullgraph.nodes[station].mean[date]
      }
    }
    id = fullgraph.nodes[station].station_id
    average = average/count
    //console.log({id, average})
    averages.push(average)
    
    if (isNaN(averages[station]) == false) {
      if (averages[station] < 10) {
        color = "green"
      }
      else if (averages[station] < 20) {
        color = "orange"
      }
      else {
        color = "red"
      }
      //console.log('halloo')
      svg.append("circle")
        .attr("cx", xScale(fullgraph.nodes[station].lon))
        .attr("cy", yScale(fullgraph.nodes[station].lat))
        .attr("r", 2)
        .style("fill", color)
    }
  }
}

// steplength: 2, 4, 8 Monate, clusters 3-4
function visualization_project3_task_2() {
  var steplength = parseInt(document.getElementById("step_length").value)
  var clusters = parseInt(document.getElementById("cluster_count").value)
  // Finde Stationen, die überhaupt Daten für alle Dimensionen haben.
  let list = [NO2, O3, PM10, SO2]
  let found_stations = []
  for (let station in CO[0]["data"]) {
    let exists = true
    for (let mol in list) {
      let inmol = false
      for (let c_station in list[mol][0]["data"]) {
        if (station == c_station) {
          inmol = true
        }
      }
      if (inmol == false) {
        exists = false
        break
      }
    }
    if (exists == true) {
      if (station != '228' && station != '231' && station != '238' && station != '1948' && station != '528' && station != '471') {
        found_stations.push(station)
      }
    }
  }
  //console.log(found_stations)

  // Pre-Processing
  // datapoints[Zeitpunkt][Station]{data, centroids}
  let datapoints = []
  list.push(CO)
  //Für jeden der 48/steplength Zeitpunkte:
  for (let time = 0; time < 48/steplength; time++) {
    let moment = []
    for (let station in found_stations) {
      let point = {PM10: 0, O3: 0 , SO2: 0, CO: 0, NO2: 0}
      let mol_count = 0
      for (let mol in list) {
        let count = 0
        let sum = 0
        for (let month = 0; month < steplength; month++) {
          //console.log(list[mol][time*steplength + month]["data"][found_stations[station]])
          for (let date in list[mol][time*steplength + month]["data"][found_stations[station]]) {
            count++
            //console.log(list[mol][time*steplength + month]["data"][found_stations[station]][date][2])
            sum = sum + list[mol][time*steplength + month]["data"][found_stations[station]][date][2]
          }
        }
        let average = sum/count
        //console.log(average)

        if (mol_count == 0) {
          //console.log('NO2')
          point.NO2 = average
        }
        else if (mol_count == 1) {
          //console.log('O3')
          point.O3 = average
        }
        else if (mol_count == 2) {
          point.PM10 = average
        }
        else if (mol_count == 3) {
          point.SO2 = average
        }
        else {
          point.CO = average
        }
        mol_count = mol_count + 1
      }
      moment.push(point)
    }
    datapoints.push(moment)
  }

  // Find max-values and normalize the data.
  let CO_max = 0
  let NO2_max = 0
  let O3_max = 0
  let PM10_max = 0
  let SO2_max = 0 
  for (let month in datapoints) {
    for (let station in datapoints[month]) {
      if (datapoints[month][station].CO > CO_max) {
        CO_max = datapoints[month][station].CO
      }
      if (datapoints[month][station].NO2 > NO2_max) {
        NO2_max = datapoints[month][station].NO2
      }
      if (datapoints[month][station].O3 > O3_max) {
        O3_max = datapoints[month][station].O3
      }
      if (datapoints[month][station].PM10 > PM10_max) {
        PM10_max = datapoints[month][station].PM10
      }
      if (datapoints[month][station].SO2 > SO2_max) {
        SO2_max = datapoints[month][station].SO2
      }
    }
  }
  for (let month in datapoints) {
    for (let station in datapoints[month]) {
      datapoints[month][station].CO = datapoints[month][station].CO/CO_max
      datapoints[month][station].NO2 = datapoints[month][station].NO2/NO2_max
      datapoints[month][station].O3 = datapoints[month][station].O3/O3_max
      datapoints[month][station].PM10 = datapoints[month][station].PM10/PM10_max
      datapoints[month][station].SO2 = datapoints[month][station].SO2/SO2_max
    }
  }
  //console.log(datapoints)

  let distribution = new Array(48/steplength-1)
  for (let index = 0; index < distribution.length; index++) {
    distribution[index] = 0
  }
  let attempts = 100
  for (let tests = 0; tests < attempts; tests++) {
  // Wende k-means an.
  cluster_points = []
  for (let month in datapoints) {
    if (month == 0) {
      cluster_points.push(k.means(datapoints[month], clusters))
    }
    else {
      cluster_points.push(k.means(datapoints[month], cluster_points[0].centroids))
    }  
  }

  /* Teste k-means auf eindeutige Konvergenz der Cluster
  let first_cluster
  for (let tries = 0; tries < 5; tries++) {
    if (tries == 0) {
      first_cluster = (k.means(datapoints[0], clusters)).centroids
    }
    else if ((first_cluster == k.means(datapoints[0], clusters)).centroids) {
      console.log('k-means is deterministic = true')
    } 
    else { console.log('k-means is deterministic = false') }
  }

  for (let index = 0; index < 48/steplength-1; index++) {
    if (cluster_points[index].centroids == cluster_points[index+1].centroids) {
      console.log('Code working as intended.')
    }
  }
  //console.log(cluster_points) */

  // Wende den "AlGorItHmuS" aus der Vorlesung an.
  let change = []
  for (let index = 0; index < cluster_points.length-1; index++) {
    let count = 0
    for (let station in cluster_points[index].datapoints) {
      if (cluster_points[index].datapoints[station].cluster_index != cluster_points[index+1].datapoints[station].cluster_index) {
        count++
      }
    }
    change.push(count)
    distribution[index] = distribution[index] + count
  }
  }
  for (let index = 0; index < distribution.length; index++) {
    distribution[index] = distribution[index]/attempts
  }
  console.log(distribution)

  // Graph
  // Waehle Groesse und Rand des Graphs
  var margin = {top: 50, right: 30, bottom: 30, left: 100},
  width = 600 - margin.left - margin.right,
  height = 470 - margin.top - margin.bottom;

  // Fuege den Graph der Seite hinzu.
  var svg = d3.select("#vis3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  // Erstelle xScale als Funktion xScale(x) -> Pixel auf Graph
  var xScale = d3.scaleLinear()
    .domain([0, 47])
    .range([ 0, width]);
  
  // Fuege x-Achse hinzu.
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

  // x-Achse Beschriftung
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - 40)
      .attr("y", height + margin.top)
      .text("Timesteps in Months from January 2016 to December 2019")

  // Titel
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width + 10)
      .attr("y", - 20)
      .text("Visualization Task 2 (Clustering, Significant Timesteps)")
    
  // Erstelle yScale als Funktion yScale(x) -> Pixel auf Graph
  var yScale = d3.scaleLinear()
    .domain([0, 19])
    .range([ height, 0]);
  
  // Fuege y-Achse hinzu.
    svg.append("g")
      .call(d3.axisLeft(yScale));

  // y-Achse Beschriftung
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", - margin.left + 50)
      .attr("x", - margin.top)
      .text("Number of Stations that changed Cluster (max 19 Stations)")

    for (let index in distribution) {
      //console.log(change[index])
      svg.append("rect")
        .attr("x", xScale(index*steplength))
        .attr("y", yScale(distribution[index]))
        .attr("width", xScale(0.8))
        .attr("height", height-yScale(distribution[index]))
        .attr("fill", "steelblue")
    }
}


function visualization_2() {

  let graph = fullgraph;

  for (let station_id in graph["nodes"]) {
    graph["nodes"][station_id]["id"] = graph["nodes"][station_id]["station_id"]
    delete graph["nodes"][station_id]["station_id"]
  }

  for (let station_id in graph["links"]) {
    graph["links"][station_id]["source"] = graph["links"][station_id]["station_id_1"]
    delete graph["links"][station_id]["station_id_1"]
  }

  for (let station_id in graph["links"]) {
    graph["links"][station_id]["target"] = graph["links"][station_id]["station_id_2"]
    delete graph["links"][station_id]["station_id_2"]
  }

  var user_distance = window.prompt("Which value in meters should the cut-off point for close proximity have?");
  var timestep = window.prompt("Which month in which year should be displayed?");
  var maxValue = -Infinity;
  var minValue = Infinity;
  var sum_of_squared_error = []; // Array, dass alle existierenden sum_of_squared_error Werte beinhaltet
  var dates = ["2016-01", "2016-02", "2016-03", "2016-04", "2016-05", "2016-06", "2016-07", "2016-08", "2016-09", "2016-10", "2016-11", "2016-12",
    "2017-01", "2017-02", "2017-03", "2017-04", "2017-05", "2017-06", "2017-07", "2017-08", "2017-09", "2017-10", "2017-11", "2017-12",
    "2018-01", "2018-02", "2018-03", "2018-04", "2018-05", "2018-06", "2018-07", "2018-08", "2018-09", "2018-10", "2018-11", "2018-12",
    "2019-01", "2019-02", "2019-03", "2019-04", "2019-05", "2019-06", "2019-07", "2019-08", "2019-09", "2019-10", "2019-11", "2019-12"]


  var zaehler = 0; // Anzahl der Objekte, die sum_of_squared_error als Key besitzen

  console.log(dates.length);

  for (let i = 0; i < graph["links"].length; i++) {
    if (graph["links"][i].hasOwnProperty('sum_of_squared_error') == true) {
      zaehler++
    }
  }

  console.log("Anzahl Kanten-Objekte mit sum_of_squared_error als Variable: " + zaehler);

  // For Schleife, die für undefined Werte das Average in JSON schreibt
  /*
    for (let i = 0; i < zaehler; i++) {
      if (graph["links"][i]["sum_of_squared_error"][timestep] == undefined) {
        graph["links"][i]["sum_of_squared_error"][timestep] = 0;
        for (let j = 0; j < dates.length; j++) {
          if (graph["links"][i]["sum_of_squared_error"][dates[j]] == undefined) {
            graph["links"][i]["sum_of_squared_error"][timestep] += 0;
          }
          else {
            graph["links"][i]["sum_of_squared_error"][timestep] += graph["links"][i]["sum_of_squared_error"][dates[j]];
          }
        }
        graph["links"][i]["sum_of_squared_error"][timestep] = graph["links"][i]["sum_of_squared_error"][timestep] / dates.length;
      }
    }*/

  for (let i = 0; i < zaehler; i++) {
    sum_of_squared_error[i] = graph["links"][i]["sum_of_squared_error"][timestep]
  }

  console.log("Anzahl aller Kanten-Objekte: " + graph["links"].length);
  console.log(graph["links"]);

  // For-Schleife, um Maximum und Minimum Wert zu extrahieren
  for (let number of sum_of_squared_error) {
    if (number > maxValue) {
      maxValue = number
    }
    if (number < minValue) {
      minValue = number
    }
  }
  console.log("MAX: " + maxValue);
  console.log("MIN: " + minValue);

  //Normalisierung der Daten auf 0 bis 1
  for (let i = 0; i < zaehler; i++) {
    sum_of_squared_error[i] = (sum_of_squared_error[i] - minValue) / (maxValue - minValue);
  }

  console.log(sum_of_squared_error);

  //Die Werte auf 2 Nachkommastellen runden
  for (let i = 0; i < zaehler; i++) {
    sum_of_squared_error[i] = sum_of_squared_error[i].toFixed(2);
  }

  console.log(sum_of_squared_error);

  graph["links"] = graph["links"].filter(element => element.hasOwnProperty('sum_of_squared_error') == true);

  graph["links"] = graph["links"].filter(element => element.distance <= user_distance);

  console.log(graph["links"]);


  var canvas = d3.select("#vis2"),
    width = canvas.attr("width"),
    height = canvas.attr("height"),
    ctx = canvas.node().getContext("2d"),
    r = 4,
    color = d3.scaleOrdinal(d3.schemeCategory20),
    simulation = d3.forceSimulation()
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide(r + 1))
      .force("charge", d3.forceManyBody()
        .strength(-15))
      .force("link", d3.forceLink()
        .id(function (d) { return d.id; }));


  simulation.nodes(graph.nodes);
  simulation.force("link")
    .links(graph.links);
  simulation.on("tick", update);

  canvas
    .call(d3.drag()
      .container(canvas.node())
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  function update() {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.0;
    graph.links.forEach(drawLink);


    ctx.globalAlpha = 1.0;
    graph.nodes.forEach(drawNode);
  }

  function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
  }



  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
    console.log(d3.event.subject);
  }

  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }



  function drawNode(d) {
    ctx.beginPath();
    ctx.fillStyle = color(d.bundesland);
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawLink(d) {
    ctx.globalAlpha = ((d.sum_of_squared_error[timestep] - minValue) / (maxValue - minValue)).toFixed(2);
    ctx.moveTo(d.source.x, d.source.y);
    ctx.lineTo(d.target.x, d.target.y);
    ctx.stroke();
  }


}

function visualization_cologne_scatter() {
// Visualisiere die Entwicklung der Feinstaubwerte im Koelner Verkehr (Turiner Straße
// zwischen 11 und 12 Uhr) in 2016-2019.
// 31.06.2019 - 21.08.2019 fehlen, 6 Messdaten fehlen sonst (59 Tage insgesamt).
  let vis1_stationen = []
  let vis1_fstaub16 = []
  let vis1_fstaub17 = []
  let vis1_fstaub18 = []
  let vis1_fstaub19 = []

  // Suche alle relevanten Stationen.
  for (let station_id in stations["data"]) {
    if (stations["data"][station_id][2] == "Köln Turiner Straße") {
      vis1_stationen.push(station_id)
    }
  }
  
  // Ziehe relevante Daten aus den Feinstaub JSONs.
  for (let index in vis1_stationen) {
    for (let day in fstaub16["data"][vis1_stationen[index]]) {
      if (fstaub16["data"][vis1_stationen[index]][day][2] == null) {
        console.log("Missing value detected.")
      }
      else {
        vis1_fstaub16.push(fstaub16["data"][vis1_stationen[index]][day][2])
      }
    }
  }

  for (let index in vis1_stationen) {
    for (let day in fstaub17["data"][vis1_stationen[index]]) {
      if (fstaub17["data"][vis1_stationen[index]][day][2] == null) {
        console.log("Missing value detected.")
      }
      else {
        vis1_fstaub17.push(fstaub17["data"][vis1_stationen[index]][day][2])
      }
    }
  }

  for (let index in vis1_stationen) {
    for (let day in fstaub18["data"][vis1_stationen[index]]) {
      if (fstaub18["data"][vis1_stationen[index]][day][2] == null) {
        console.log("Missing value detected.")
      }
      else {
        vis1_fstaub18.push(fstaub18["data"][vis1_stationen[index]][day][2])
      }
    }
  }

  for (let index in vis1_stationen) {
    for (let day in fstaub19["data"][vis1_stationen[index]]) {
      if (fstaub19["data"][vis1_stationen[index]][day][2] == null) {
        console.log("Missing value detected.")
      }
      else {
        vis1_fstaub19.push(fstaub19["data"][vis1_stationen[index]][day][2])
      }
    }
  }
  
  // Function, die Durschnitt eines Arrays aus Integers berechnet.
  function average(int_array) {
    let average = 0
    for (let i = 0; i < int_array.length; i++) {
      average = average + int_array[i]
    }
    return (average/int_array.length)
  }

  // Berechnung der Jahresgrenzen in Tagen (Zaehlung von 0).
  let vis1_days16 = vis1_fstaub16.length
  let vis1_days17 = vis1_days16 + vis1_fstaub17.length
  let vis1_days18 = vis1_days17 + vis1_fstaub18.length 
  let vis1_days19 = vis1_days18 + vis1_fstaub19.length
  
  // Vereinige Daten fuer den Graph.
  let all_data = [...vis1_fstaub16,...vis1_fstaub17,...vis1_fstaub18,...vis1_fstaub19]
  // Definiere x-Werte (Tage) manuell.
  let xVal = []
  for (let i = 0; i < all_data.length; i++) {
    xVal.push(i)
  }

  // Graph
  // Waehle Groesse und Rand des Graphs
  var margin = {top: 50, right: 30, bottom: 30, left: 100},
  width = 600 - margin.left - margin.right,
  height = 470 - margin.top - margin.bottom;

  // Fuege den Graph der Seite hinzu.
  var svg = d3.select("#vis1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  // Erstelle xScale als Funktion xScale(x) -> Pixel auf Graph
  var xScale = d3.scaleLinear()
    .domain([0, (all_data.length)])
    .range([ 0, width ]);
  
  // Fuege x-Achse hinzu.
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

  // x-Achse Beschriftung
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - 40)
      .attr("y", height + margin.top)
      .text("Days (Start: 01.01.2016, End: 31.12.2019 | 59 days are missing)")

  // Titel
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width + 10)
      .attr("y", - 20)
      .text("Particulate Matter in Turiner Street, Cologne. Daily averages from 11am to 12pm.")
    
  // Erstelle yScale als Funktion yScale(x) -> Pixel auf Graph
  var yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
  
  // Fuege y-Achse hinzu.
    svg.append("g")
      .call(d3.axisLeft(yScale));

  // y-Achse Beschriftung
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", - margin.left + 50)
      .attr("x", - margin.top)
      .text("data in micrograms per cubic meter")

  // Jahres-Trennlinien
    svg.append("line")
      .attr("x1", xScale(vis1_days16))
      .attr("x2", xScale(vis1_days16))
      .attr("y1", yScale(0))
      .attr("y2", yScale)
      .attr("stroke-width", 1)
      .attr("stroke", "lightgrey")

    svg.append("line")
      .attr("x1", xScale(vis1_days17))
      .attr("x2", xScale(vis1_days17))
      .attr("y1", yScale(0))
      .attr("y2", yScale)
      .attr("stroke-width", 1)
      .attr("stroke", "lightgrey")

    svg.append("line")
      .attr("x1", xScale(vis1_days18))
      .attr("x2", xScale(vis1_days18))
      .attr("y1", yScale(0))
      .attr("y2", yScale)
      .attr("stroke-width", 1)
      .attr("stroke", "lightgrey")

    svg.append("line")
      .attr("x1", xScale(vis1_days19))
      .attr("x2", xScale(vis1_days19))
      .attr("y1", yScale(0))
      .attr("y2", yScale)
      .attr("stroke-width", 1)
      .attr("stroke", "lightgrey")

  // Jahres-Zahlen
    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale(vis1_days16) + 4)
      .attr("y", yScale(97))
      .style("font-size", "12px")
      .style("fill", "grey")
      .text("2017")

    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale(vis1_days17) + 4)
      .attr("y", yScale(97))
      .style("font-size", "12px")
      .style("fill", "grey")
      .text("2018")

    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale(vis1_days18) + 4)
      .attr("y", yScale(97))
      .style("font-size", "12px")
      .style("fill", "grey")
      .text("2019")
  
  // Plotte die Punkte.
  for (let i = 0; i < all_data.length; i++) {
    if (all_data[i] >= 50) {
      svg.append('g')
      .append("circle")
        .attr("cx", xScale(xVal[i]))
        .attr("cy", yScale(all_data[i]))
        .attr("r", 2.5)
        .style("fill", "lightblue")
        .style("stroke", "red")
        .style("stroke-width", 1)
    }
    else if (all_data[i] == 0) {
      svg.append('g')
      .append("circle")
        .attr("cx", xScale(xVal[i]))
        .attr("cy", yScale(all_data[i]))
        .attr("r", 2.5)
        .style("fill", "lightblue")
        .style("stroke", "blue")
        .style("stroke-width", 1)
    }
    else {
      svg.append('g')
      .append("circle")
        .attr("cx", xScale(xVal[i]))
        .attr("cy", yScale(all_data[i]))
        .attr("r", 2)
        .style("fill", "lightblue")
    }
  }

  // Durschnittswert - Linien
    svg.append("line")
      .attr("x1", xScale(0))
      .attr("x2", xScale(vis1_days16))
      .attr("y1", yScale(average(vis1_fstaub16)))
      .attr("y2", yScale(average(vis1_fstaub16)))
      .attr("stroke-width", 2)
      .attr("stroke", "steelblue")

    svg.append("line")
      .attr("x1", xScale(vis1_days16))
      .attr("x2", xScale(vis1_days17))
      .attr("y1", yScale(average(vis1_fstaub17)))
      .attr("y2", yScale(average(vis1_fstaub17)))
      .attr("stroke-width", 2)
      .attr("stroke", "steelblue")

    svg.append("line")
      .attr("x1", xScale(vis1_days17))
      .attr("x2", xScale(vis1_days18))
      .attr("y1", yScale(average(vis1_fstaub18)))
      .attr("y2", yScale(average(vis1_fstaub18)))
      .attr("stroke-width", 2)
      .attr("stroke", "steelblue")
  
    svg.append("line")
      .attr("x1", xScale(vis1_days18))
      .attr("x2", xScale(vis1_days19))
      .attr("y1", yScale(average(vis1_fstaub19)))
      .attr("y2", yScale(average(vis1_fstaub19)))
      .attr("stroke-width", 2)
      .attr("stroke", "steelblue")

  // Legende
    svg.append("circle")
      .attr("cx", xScale(1400) + 10)
      .attr("cy", yScale(97) - 3)
      .attr("r", 2.5)
      .style("fill", "lightblue")
      .style("stroke", "red")
      .style("stroke-width", 1)

    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale(1400) + 20)
      .attr("y", yScale(97))
      .style("font-size", "12px")
      .style("fill", "grey")
      .text(">= 50 micrograms per cubic meter")

    svg.append("circle")
      .attr("cx", xScale(1400) + 10)
      .attr("cy", yScale(92) - 3)
      .attr("r", 2.5)
      .style("fill", "lightblue")

    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale(1400) + 20)
      .attr("y", yScale(92))
      .style("font-size", "12px")
      .style("fill", "grey")
      .text("'normal' value")

    svg.append("circle")
      .attr("cx", xScale(1400) + 10)
      .attr("cy", yScale(87) - 3)
      .attr("r", 2.5)
      .style("fill", "lightblue")
      .style("stroke", "blue")
      .style("stroke-width", 1)

    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale(1400) + 20)
      .attr("y", yScale(87))
      .style("font-size", "12px")
      .style("fill", "grey")
      .text("0 micrograms per cubic meter")

    svg.append("line")
      .attr("x1", xScale(1400) + 7)
      .attr("x2", xScale(1400) + 13)
      .attr("y1", yScale(82) - 3)
      .attr("y2", yScale(82) - 3)
      .attr("stroke-width", 2)
      .attr("stroke", "steelblue")

    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", xScale(1400) + 20)
      .attr("y", yScale(82))
      .style("font-size", "12px")
      .style("fill", "grey")
      .text("average of a year")
}


// Zweite Visualisierung:
// Kategorisiere Stationen mit Durchschnittsmesswert (PM10 / squared "error") auf gegebenem Zeitintervall statt mit k-means.
// So hat man ein anschauliches Ergebnis.
function visualization_project3_task_2_bonus() {

}

