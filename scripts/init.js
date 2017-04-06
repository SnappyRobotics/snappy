'use strict';

const Promise = require('bluebird')
const path = require('path')
const fs = require('fs')

const debug = require('debug')("snappy:core:init")

var init = (() => {
  this.consts = {
    root: path.join(__dirname, ".."),
    configFile: path.join(__dirname, "..", "userDir", "config.json"),
    PORT: 8000,
    package: JSON.parse(fs.readFileSync(path.join(__dirname, '..', "package.json")))
  }

  this.config = (() => {
    try {
      return JSON.parse(fs.readFileSync(this.consts.configFile))
    } catch (e) {
      debug("No Config File exists in userDir");
      this.createConfig()
    }
  })()

  this.path = function() {
    var p = this.consts.root
    for (var i = 0; i < arguments.length; i++) {
      p = path.join(p, arguments[i])
    }

    return p
  }

  this.createConfig = function() {
    var that = this
    return new Promise(function(resolve, reject) {
      var ob = {}
      ob.jwt_secret = machineID.machineIdSync()

      const passwordHash = require('password-hash')

      ob.user = 'admin'
      ob.pass = passwordHash.generate('admin')

      that.config = ob
      fs.writeFile(that.consts.configFile, JSON.stringify(that.config), function() {
        resolve('done')
      })
    })
  }

  this.saveConfig = function() {
    var that = this
    return new Promise(function(resolve, reject) {
      fs.writeFile(that.consts.configFile, JSON.stringify(that.config), function() {
        resolve('done')
      })
    })
  }

  return this
})()

module.exports = init
