const path = require('path')
const when = require('when')
const http = require('http')
const RED = require("node-red")
const express = require("express")
const debug = require('debug')("snappy:core:red_connector")

var red_connector = {
  init: function() {
    // Create an Express app
    this.app = express()

    require(path.join(__dirname, '..', 'routes', 'routes'))(this.app)

    // ================================= RED =======================================
    var red_settings = require(path.join(__dirname, '..', 'data', 'red-settings'))

    this.server = http.createServer(this.app) // Create a server
    this.server.setMaxListeners(0);

    RED.init(this.server, red_settings) // Initialise the runtime with a server and settings

    this.app.use(red_settings.httpAdminRoot, RED.httpAdmin) // Serve the editor UI from /red
    this.app.use(red_settings.httpNodeRoot, RED.httpNode) // Serve the http nodes UI from /api
  },
  start_red: function() {
    var that = this
    return when.promise(function(resolve, reject) {
      if (!that.app) {
        that.init()
      }

      that.server.listen(global.snappy_core.PORT)

      RED.start().then(function() { // Start the runtime
        var conf = require(path.join(__dirname, '..', 'scripts', 'cleanConfig.js'))
        conf.check
          .then(function(o) {
            debug("clean config check returned :", o)
            if (o == "restart") {
              debug("Restarting red")
              RED.init(server, red_settings) // Initialise the runtime with a server and settings

              that.app.use(red_settings.httpAdminRoot, RED.httpAdmin) // Serve the editor UI from /red
              that.app.use(red_settings.httpNodeRoot, RED.httpNode) // Serve the http nodes UI from /api
              RED.start().then(function() {
                resolve(true)
              })
            } else {
              resolve(true)
            }
          })
      })
    })
  }
}

module.exports = red_connector
