var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.json({
    name: "Snappy Robotics Software",
    version: global.snappy_core.package.version,
    description: global.snappy_core.package.description,
    snappy: true
  })
})

module.exports = router
