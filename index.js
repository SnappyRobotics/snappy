'use strict';

const path = require('path')
global.initLocation = path.join(__dirname, 'scripts', 'init')
const _ = require(global.initLocation)

const debug = require('debug')("snappy:core:index")

//global.snappy_core = {}
// debug(_)

require(_.path('scripts', 'intro'))()


//---------------------------Node-RED-----------------------------------------
const red_connector = require(path.join(__dirname, 'scripts', 'red_connector'));


/*
global.snappy_core.stop = red_connector.stop_red
global.snappy_core.start = red_connector.start_red
global.snappy_core.clean = red_connector.clean
*/
if (require.main === module) {
  red_connector.init()

  red_connector.server.on('error', function(e) {
    debug("Cannot start server as Port is being used :", global.snappy_core.PORT)

    console.error(e);

    process.exit(1)
  })

  red_connector.start_red()
} else {
  debug('required as a module');
  module.exports = global.snappy_core
}
