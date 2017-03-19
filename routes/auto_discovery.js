var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.json({
    name: "Snappy Robotics Software",
    version: global.package.version,
    description: global.package.description,
    snappy: true
  })
})

module.exports = router
