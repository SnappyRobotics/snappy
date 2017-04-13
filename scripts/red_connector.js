'use strict';

const http = require('http')
const fse = require('fs-extra')
const express = require("express")
const Promise = require('bluebird')
const bodyParser = require('body-parser')
const debug = require('debug')("snappy:core:red_connector")

const _ = require(global.initLocation)

var red_connector = {
  isRunning: false,
  init: function() {
    debug("initializing RED")
    this.app = express()

    // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({
      extended: false
    }))

    // parse application/json
    this.app.use(bodyParser.json())

    require(_.path('routes', 'routes'))(this.app)

    // =============================== RED =====================================
    this.red_settings = require(_.path('data', 'red-settings'))

    this.server = http.createServer(this.app) // Create a server
    this.server.setMaxListeners(0);

    this.RED = require("node-red")
    this.RED.init(this.server, this.red_settings) // Initialise the runtime with a server and settings

    this.app.use(this.red_settings.httpAdminRoot, this.RED.httpAdmin) // Serve the editor UI from /red
    this.app.use(this.red_settings.httpNodeRoot, this.RED.httpNode) // Serve the http nodes UI from /api

    debug("initialized RED")
  },
  start_red: function() {
    var that = red_connector

    debug("starting RED")

    return new Promise(function(resolve, reject) {
      if (!that.app) {
        that.init()
      }

      that.server.listen(_.consts.PORT)

      that.RED.start().then(function() { // Start the runtime
        var conf = require(_.path('scripts', 'cleanREDConfig.js'))
        conf.check
          .then(function(o) {
            debug("clean config check returned :", o)
            if (o == "restart") {
              return that.stop_red()
                .then(function() {
                  debug("Restarting red")
                  setTimeout(function() {
                    return that.start_red()
                  }, 500);
                })
            } else {
              debug("started RED")
              that.isRunning = true
              resolve(true)
            }
          })
      })
    })
  },
  stop_red: function() {
    var that = red_connector

    debug("stopping RED")

    return new Promise(function(resolve, reject) {
      if (that.app) {
        that.RED.stop().then(function() {
          that.server.close(function() {
            delete that.app
            delete that.server
            that.app = null
            that.server = null
            that.RED = null;

            debug("stopped RED")
            that.isRunning = false

            resolve(true)
          })
        })
      }
    })
  },
  clean: function() {
    debug("Cleaning existing RED Config")
    return new Promise(function(resolve, reject) {
      try {
        fse.moveSync(_.path('userDir', 'red', '.gitignore'), _.path('userDir', 'red.gitignore'))

        fse.removeSync(_.path('userDir', 'red'))

        fse.ensureDir(_.path('userDir', 'red'), err => {
          fse.moveSync(_.path('userDir', 'red.gitignore'), _.path('userDir', 'red', '.gitignore'))

          debug("Cleaned RED config")
          resolve(true)
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = red_connector
