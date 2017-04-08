'use strict';

const machineID = require('node-machine-id')
const Promise = require('bluebird')
const path = require('path')
const fs = require('fs')
const debug = require('debug')("snappy:core:init")

var init = (() => {
  var that = this

  that.consts = {
    root: path.join(__dirname, ".."),
    configFile: path.join(__dirname, "..", "userDir", "config.json"),
    PORT: 8000,
    package: JSON.parse(fs.readFileSync(path.join(__dirname, '..', "package.json")))
  }

  that.path = function() {
    var p = this.consts.root
    for (var i = 0; i < arguments.length; i++) {
      p = path.join(p, arguments[i])
    }

    return p
  }

  that.createConfig = function() { //Need to be synchronous
    var ob = {}
    ob.jwt_secret = machineID.machineIdSync()

    const passwordHash = require('password-hash')

    ob.user = 'admin'
    ob.pass = passwordHash.generate('admin')

    that.config = ob
    fs.writeFileSync(that.consts.configFile, JSON.stringify(that.config))

    return that.config
  }

  that.config = ((that.config) ? (that.config) : (() => {
    try {
      return JSON.parse(fs.readFileSync(this.consts.configFile))
    } catch (e) {
      debug("No Config File exists in userDir");
      return that.createConfig()
    }
  })())

  that.saveConfig = function() {
    return new Promise(function(resolve, reject) {
      fs.writeFile(that.consts.configFile, JSON.stringify(that.config), function() {
        resolve('done')
      })
    })
  }

  return that
})()

module.exports = init
