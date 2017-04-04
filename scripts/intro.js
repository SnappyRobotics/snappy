'use strict';

const fs = require('fs')
const os = require('os')
const path = require('path')
const art = require('ascii-art');
const pictureTube = require('picture-tube')
const debug = require('debug')("snappy:core:intro")

module.exports = function() {
  var image = path.join(__dirname, '..', 'public', 'images', 'logo_white.png')

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

  const myPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "package.json")))


  art.font('Snappy Robotics', 'Doom', 'cyan', function(ascii) {
    fs.createReadStream(image)
      .pipe(tube)
      .on('end', function() {
        console.log(ascii);
        debug("==========================================================================")
        debug("\t\t\t\t" + myPackage.name)
        debug("\t" + myPackage.description)
        debug("\t\t\t       version:" + myPackage.version)
        debug("\t\t\tServer Running on Port : " + global.snappy_core.PORT)

        for (var i = 0; i < addresses.length; i++) {
          debug("\t\t\t   Listening on : " + addresses[i].address + ":" + global.snappy_core.PORT)
        }
        debug("==========================================================================")
      });
  })
}
