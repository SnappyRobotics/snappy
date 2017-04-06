'use strict';

const path = require('path')
global.initLocation = path.join(__dirname, 'scripts', 'init')
const _ = require(global.initLocation)

const debug = require('debug')("snappy:core:index")

//global.snappy_core = {}
// debug(_)

require(_.path('scripts', 'intro'))()


//---------------------------Node-RED-----------------------------------------
const red_connector = require(path.join(__dirname, 'scripts', 'red_connector'))

if (require.main === module) {
  red_connector.init()

  red_connector.server.on('error', function(e) {
    debug("Cannot start server as Port is being used :", global.snappy_core.PORT)

    console.error(e)

    process.exit(1)
  })

  red_connector.start_red()
} else {
  debug('required as a module')

  module.exports = {
    start: red_connector.start_red,
    stop: red_connector.stop_red,
    clean: function() {
      return Promise.resolve()
        .then(function() {
          return red_connector.clean()
        })
        .then(function() {
          return _.createConfig()
        })
        .then(function() {
          debug("Cleaned")
          return
        })
    }
  }
}
