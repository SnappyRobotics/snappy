'use strict';

const fs = require('fs')
const os = require('os')
const path = require('path')
const debug = require('debug')("snappy:core:intro")

module.exports = function() {
  var interfaces = os.networkInterfaces()
  var addresses = []
  for (var k in interfaces) {
    if (interfaces.hasOwnProperty(k)) {
      for (var k2 in interfaces[k]) {
        if (interfaces[k].hasOwnProperty(k2)) {
          var address = interfaces[k][k2]
          addresses.push({
            address: address.address,
            netmask: address.netmask
          })
        }
      }
    }
  }
  // =========================================================================
  global.snappy_core.package = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "package.json")))

  debug("==========================================================================")
  debug("\t\t\t\t\t" + global.snappy_core.package.name)
  debug("\t\t" + global.snappy_core.package.description)
  debug("\t\t\t\t       version:" + global.snappy_core.package.version)
  debug("\t\t\t\tServer Running on Port : " + global.snappy_core.PORT)

  for (var i = 0; i < addresses.length; i++) {
    debug("\t\t\t\t   Listening on : " + addresses[i].address + ":" + global.snappy_core.PORT)
  }

  debug("==========================================================================")
}
