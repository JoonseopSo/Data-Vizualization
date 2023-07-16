
// Server setup:
const fs = require("fs")
const port = 6789

const express = require("express")
const app = express()
app.use(express.static("public"))
const server = app.listen(port)

console.log(`Webserver is running on port ${port}.`)


// Socket setup:
const socket = require("socket.io")
const io = socket(server)


// Definiert die folgenden Events sobald Client connects. (?)
io.sockets.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected.`)
  
  // Disconnect Nachricht
  let disconnect = () => {
    console.log(`Client ${socket.id} disconnected.`)
  }
  
  
  // Definiere Events, die Daten auslesen und ein "emit" senden, 
  // so dass Client den emit "auffangen" kann. (Im Prinzip immer das gleiche, 5 mal.)
  let get_station_data = (parameters) => {
    fs.readFile("./data_ex1/Stationen.json", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let json_data = JSON.parse(data)
      socket.emit("station_data", json_data)
    })
  }

  let get_fstaub16_data = (parameters) => {
    fs.readFile("./data_ex1/Feinstaub_2016.json", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let json_data = JSON.parse(data)
      socket.emit("fstaub16_data", json_data)
    })
  }

  let get_fstaub17_data = (parameters) => {
    fs.readFile("./data_ex1/Feinstaub_2017.json", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let json_data = JSON.parse(data)
      socket.emit("fstaub17_data", json_data)
    })
  }

  let get_fstaub18_data = (parameters) => {
    fs.readFile("./data_ex1/Feinstaub_2018.json", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let json_data = JSON.parse(data)
      socket.emit("fstaub18_data", json_data)
    })
  }

  let get_fstaub19_data = (parameters) => {
    fs.readFile("./data_ex1/Feinstaub_2019.json", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let json_data = JSON.parse(data)
      socket.emit("fstaub19_data", json_data)
    })
  }

  let get_fullgraph_data = (parameters) => {
    fs.readFile("./data_ex3/full_graph.json", "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let json_data = JSON.parse(data)
      socket.emit("fullgraph_data", json_data)
    })
  }

  let get_CO_data = (parameters) => {
    let CO_data = []
    let years = ['16', '17', '18', '19']
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    for (let year in years) {
      for (let month in months) {
        fs.readFile("./data_ex2/CO_data/CO_20" + years[year] + "_" + months[month] + ".json", "utf8", (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          CO_data = JSON.parse(data)
          socket.emit("CO_data", CO_data)
        })    
      }
    }
  }

  let get_NO2_data = (parameters) => {
    let the_data = []
    let years = ['16', '17', '18', '19']
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    for (let year in years) {
      for (let month in months) {
        fs.readFile("./data_ex2/NO2_data/NO2_20" + years[year] + "_" + months[month] + ".json", "utf8", (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          the_data = JSON.parse(data)
          socket.emit("NO2_data", the_data)
        })    
      }
    }
  }

  let get_O3_data = (parameters) => {
    let the_data = []
    let years = ['16', '17', '18', '19']
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    for (let year in years) {
      for (let month in months) {
        fs.readFile("./data_ex2/O3_data/O3_20" + years[year] + "_" + months[month] + ".json", "utf8", (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          the_data = JSON.parse(data)
          socket.emit("O3_data", the_data)
        })    
      }
    }
  }

  let get_PM10_data = (parameters) => {
    let the_data = []
    let years = ['16', '17', '18', '19']
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    for (let year in years) {
      for (let month in months) {
        fs.readFile("./data_ex2/PM10_data/PM10_20" + years[year] + "_" + months[month] + ".json", "utf8", (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          the_data = JSON.parse(data)
          socket.emit("PM10_data", the_data)
        })    
      }
    }
  }

  let get_SO2_data = (parameters) => {
    let the_data = []
    let years = ['16', '17', '18', '19']
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    for (let year in years) {
      for (let month in months) {
        fs.readFile("./data_ex2/SO2_data/SO2_20" + years[year] + "_" + months[month] + ".json", "utf8", (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          the_data = JSON.parse(data)
          socket.emit("SO2_data", the_data)
        })    
      }
    }
  }
  
  // Definiere Reaktionen auf erwartete "emit"s vom Client.
  socket.on("disconnect", disconnect)
  socket.on("get_station_data", get_station_data)
  socket.on("get_fstaub16_data", get_fstaub16_data)
  socket.on("get_fstaub17_data", get_fstaub17_data)
  socket.on("get_fstaub18_data", get_fstaub18_data)
  socket.on("get_fstaub19_data", get_fstaub19_data)
  socket.on("get_fullgraph_data", get_fullgraph_data)
  socket.on("get_CO_data", get_CO_data)
  socket.on("get_NO2_data", get_NO2_data)
  socket.on("get_O3_data", get_O3_data)
  socket.on("get_PM10_data", get_PM10_data)
  socket.on("get_SO2_data", get_SO2_data)
})
