'use strict';

const path = require('path')
const when = require('when')
const http = require('http')
const express = require("express")
const fse = require('fs-extra')
const debug = require('debug')("snappy:core:red_connector")

var red_connector = {
  isRunning: false,
  init: function() {
    // Create an Express app
    this.app = express()

    require(path.join(__dirname, '..', 'routes', 'routes'))(this.app)

    // ================================= RED =======================================
    this.red_settings = require(path.join(__dirname, '..', 'data', 'red-settings'))

    this.server = http.createServer(this.app) // Create a server
    this.server.setMaxListeners(0);

    global.snappy_core.RED = require("node-red")
    global.snappy_core.RED.init(this.server, this.red_settings) // Initialise the runtime with a server and settings

    this.app.use(this.red_settings.httpAdminRoot, global.snappy_core.RED.httpAdmin) // Serve the editor UI from /red
    this.app.use(this.red_settings.httpNodeRoot, global.snappy_core.RED.httpNode) // Serve the http nodes UI from /api
  },
  start_red: function() {
    var that = red_connector
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
              that.stop_red()
                .then(function() {
                  debug("Restarting red")
                  setTimeout(function() {
                    return that.start_red()
                  }, 500);
                })
            } else {
              resolve(true)
            }
          })
      })
    })
  },
  stop_red: function() {
    var that = red_connector
    return when.promise(function(resolve, reject) {
      if (that.app) {
        global.snappy_core.RED.stop().then(function() {
          that.server.close(function() {
            delete that.app
            delete that.server
            that.app = null
            that.server = null
            global.snappy_core.RED = null;
            resolve(true)
          })
        })

      }
    })
  },
  clean: function() {
    debug("Cleaning existing config")
    return when.promise(function(resolve, reject) {
      try {
        fse.removeSync(path.join(__dirname, "..", 'userDir', 'status.json'))
        fse.removeSync(path.join(__dirname, "..", 'userDir', 'red', '.config.json'))
        fse.removeSync(path.join(__dirname, "..", 'userDir', 'red', 'lib'))
        debug("Cleaned config")
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = red_connector
