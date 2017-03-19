const fs = require('fs');
const path = require('path');
const debug = require('debug')('snappy:clearConfig');

const configFile = path.join(__dirname, "..", "userDir", "red", ".config.json")

const dis_all_in_trees = [
  "node-red-node-twitter",
  "node-red-node-email",
  "node-red-node-feedparser",
  "node-red-node-rbe",
  "node-red-node-twitter"
]

const dis_inBuiltNodes = [
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
]

module.exports = {
  clean: function() {
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
            } else {
              branch[key].enabled = true;
              debug("Enabled node :", key);
            }
          }
        }
        fs.writeFileSync(configFile, JSON.stringify(x))
      }
    })
  }
}
