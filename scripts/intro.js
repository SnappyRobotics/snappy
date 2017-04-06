'use strict';

const fs = require('fs')
const os = require('os')
const art = require('ascii-art');
const pictureTube = require('picture-tube')

const debug = require('debug')("snappy:core:intro")

const _ = require(global.initLocation)

module.exports = function() {
  var image = _.path('public', 'images', 'logo_white.png')

  var tube = pictureTube()
  tube.pipe(process.stdout)

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

  art.font('Snappy Robotics', 'Doom', 'cyan', function(ascii) {
    fs.createReadStream(image)
      .pipe(tube)
      .on('end', function() {
        console.log(ascii);
        debug("==========================================================================")
        debug("\t\t\t\t" + _.consts.package.name)
        debug("\t" + _.consts.package.description)
        debug("\t\t\t       version:" + _.consts.package.version)
        debug("\t\t\tServer Running on Port : " + _.consts.PORT)

        for (var i = 0; i < addresses.length; i++) {
          debug("\t\t\t   Listening on : " + addresses[i].address + ":" + _.consts.PORT)
        }

        debug("==========================================================================")
      });
  })
}
