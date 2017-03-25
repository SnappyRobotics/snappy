const path = require('path')
const fs = require('fs')
const debug = require('debug')("snappy:core:index")

global.snappy_core = {}

//--------------------------------SETTINGS--------------------------------

global.snappy_core.PORT = 8000

//------------------------------------------------------------------------

global.snappy_core.package = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json")))

debug("==========================================================================")
debug("\t\t\t\t\t" + global.snappy_core.package.name)
debug("\t\t" + global.snappy_core.package.description)
debug("\t\t\t\t       version:" + global.snappy_core.package.version)
debug("\t\t\t\tServer Running on Port : " + global.snappy_core.PORT)
debug("==========================================================================")

const red_connector = require(path.join(__dirname, 'scripts', 'red_connector'));

red_connector.start_red()
