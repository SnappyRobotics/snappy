const path = require('path')
const when = require('when')
const http = require('http')
global.snappy_core.RED = require("node-red")
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

    global.snappy_core.RED.init(this.server, red_settings) // Initialise the runtime with a server and settings

    this.app.use(red_settings.httpAdminRoot, global.snappy_core.RED.httpAdmin) // Serve the editor UI from /red
    this.app.use(red_settings.httpNodeRoot, global.snappy_core.RED.httpNode) // Serve the http nodes UI from /api
  },
  start_red: function() {
    var that = this
    return when.promise(function(resolve, reject) {
      if (!that.app) {
        that.init()
      }

      that.server.listen(global.snappy_core.PORT)

      global.snappy_core.RED.start().then(function() { // Start the runtime
        var conf = require(path.join(__dirname, '..', 'scripts', 'cleanConfig.js'))
        conf.check
          .then(function(o) {
            debug("clean config check returned :", o)
            if (o == "restart") {
              debug("Restarting red")
              global.snappy_core.RED.init(server, red_settings) // Initialise the runtime with a server and settings

              that.app.use(red_settings.httpAdminRoot, global.snappy_core.RED.httpAdmin) // Serve the editor UI from /red
              that.app.use(red_settings.httpNodeRoot, global.snappy_core.RED.httpNode) // Serve the http nodes UI from /api
              global.snappy_core.RED.start().then(function() {
                resolve(true)
              })
            } else {
              resolve(true)
            }
          })
      })
    })
  },
  stop_red: function() {
    var that = this
    return when.promise(function(resolve, reject) {
      if (that.app) {
        global.snappy_core.RED.stop().then(function() {
          that.server.stop().then(function() {
            resolve(true)
          })
        })

      }
    })
  }
}

module.exports = red_connector
