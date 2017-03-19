const http = require('http')
const express = require("express")
const path = require('path')
const when = require('when')
const fs = require('fs')
const debug = require('debug')("snappy:core:index")

global.RED = require("node-red")

//--------------------------------SETTINGS--------------------------------

const PORT = 8000

//------------------------------------------------------------------------
global.package = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json")))
debug("==========================================================================")
debug("\t\t\t\t\t" + global.package.name)
debug("\t\t" + global.package.description)
debug("\t\t\t\t       version:" + global.package.version)
debug("\t\t\t\tServer Running on Port : " + PORT)
debug("==========================================================================")




// Create an Express app
var app = express()




require('./routes/routes')(app)

// ================================= RED =======================================
var red_settings = require(path.join(__dirname, 'data', 'red-settings'))

var server = http.createServer(app) // Create a server
server.setMaxListeners(0);

RED.init(server, red_settings) // Initialise the runtime with a server and settings

app.use(red_settings.httpAdminRoot, RED.httpAdmin) // Serve the editor UI from /red
app.use(red_settings.httpNodeRoot, RED.httpNode) // Serve the http nodes UI from /api

server.listen(PORT)

RED.start().then(function() { // Start the runtime
  var conf = require(path.join(__dirname, 'scripts', 'cleanConfig.js'))
  conf.check
    .then(function(o) {
      debug("clean config check returned :", o)
      if (o == "restart") {
        debug("Restarting red")
        RED.init(server, red_settings) // Initialise the runtime with a server and settings

        app.use(red_settings.httpAdminRoot, RED.httpAdmin) // Serve the editor UI from /red
        app.use(red_settings.httpNodeRoot, RED.httpNode) // Serve the http nodes UI from /api
        RED.start()
      }
    })
})
