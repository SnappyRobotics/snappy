const _ = require(global.initLocation)

const router = require('express').Router()

router.get('/', function(req, res, next) {
  res.json({
    name: "Snappy Robotics Software",
    version: _.consts.package.version,
    description: _.consts.package.description,
    snappy: true
  })
})

module.exports = router
