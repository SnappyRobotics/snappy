'use strict';

const machineID = require('node-machine-id')
const userhome = require('userhome')
const Promise = require('bluebird')
const path = require('path')
const fs = require('fs')

const debug = require('debug')("snappy:core:init")

var init = function() {
  var that = init

  that.consts = {
    root: path.join(__dirname, ".."),
    configFile: userhome(".snappy-core", "config.json"),
    PORT: 8895,
    package: JSON.parse(fs.readFileSync(path.join(__dirname, '..', "package.json"))),
    isWin: /^win/.test(process.platform),
    isLinux: process.platform === "linux",
    isMac: process.platform === "darwin"
  }

  //----------------Check for ROS
  var checkForROS = function() {
    const execSync = require('child_process').execSync;
    return execSync('rosversion -d').toString();
  }

  that.consts.hasROS = checkForROS()

  that.path = function() {
    var p = that.consts.root
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

    ob.authentication = false

    ob.ros_on_start = true

    that.config = ob

    try {
      fs.mkdirSync(userhome(".snappy-core"))
    } catch (e) {

    }

    fs.writeFileSync(that.consts.configFile, JSON.stringify(that.config))

    return that.config
  }

  that.config = ((that.config) ? (that.config) : (() => {
    try {
      return JSON.parse(fs.readFileSync(that.consts.configFile))
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
}

module.exports = init()
