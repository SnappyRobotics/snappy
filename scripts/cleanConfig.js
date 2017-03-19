const fs = require('fs');
const path = require('path');
const when = require('when');
const bindCallback = require('when/node').bindCallback;

const debug = require('debug')('snappy:clearConfig');

const configFile = path.join(__dirname, "..", "userDir", "red", ".config.json")



var cleanConfig = {
  dis_all_in_trees: [
    "node-red-node-twitter",
    "node-red-node-email",
    "node-red-node-feedparser",
    "node-red-node-rbe",
    "node-red-node-twitter"
  ],
  dis_inBuiltNodes: [
    "sentiment",
    "exec",
    "unknown",
    "rpi-gpio",
    "mqtt",
    "websocket",
    "watch",
    "tcpin",
    "udp",
    "CSV",
    "HTML",
    "XML",
    "YAML",
    "tail"
  ],
  check: when.promise(function(resolve, reject) {
    var statusFile = path.join(__dirname, "..", "userDir", "status.json")
    fs.open(statusFile, 'r', (err, fd) => {
      var contents = {}
      if (!err) {
        contents = JSON.parse(fs.readFileSync(statusFile));
        if (contents.config_cleanup) {
          resolve("noChange")
          return
        }
      }

      global.RED.stop()
        .then(function() {
          debug("Node-red stopped");
          return cleanConfig.clean()
        }).then(function() {
          contents.config_cleanup = true
          fs.writeFileSync(statusFile, JSON.stringify(contents))

          debug("cleaned config written to file")
          resolve("restart")
          return
        })
    })
  }),
  clean: function(callback) {
    return bindCallback(when.promise(function(resolve, reject) {
      fs.open(configFile, 'r', (err, fd) => {
        if (err) {
          if (err.code === "ENOENT") {
            console.error('myfile does not exist');
            return;
          } else {
            throw err;
          }
        } else {
          var x = JSON.parse(fs.readFileSync(configFile));

          for (var i = 0; i < dis_all_in_trees.length; i++) {
            var branch = x.nodes[dis_all_in_trees[i]].nodes
            for (var key in branch) {
              if (branch.hasOwnProperty(key)) {
                branch[key].enabled = false;
                debug("Disabled Tree :", key)
              }
            }
          }

          var branch = x.nodes["node-red"].nodes
          for (var key in branch) {
            if (branch.hasOwnProperty(key)) {
              if (dis_inBuiltNodes.indexOf(key) > -1) {
                branch[key].enabled = false;
                debug("Disabled node :", key);
              } else if (branch[key].enabled == false) {
                branch[key].enabled = true;
                debug("Enabled node :", key);
              }
            }
          }
          fs.writeFileSync(configFile, JSON.stringify(x))
          resolve(true)
        }
      })
    }), callback);
  }
}

module.exports = cleanConfig
