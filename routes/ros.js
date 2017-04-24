const _ = require(global.initLocation)

const router = require('express').Router()
const cp = require('child_process')
const psTree = require('ps-tree')

const debug = require('debug')("snappy:core:ros")

var child = null
var isRunning = false

var runROS = function() {
  child = cp.spawn("roscore", [], {
    stdio: 'inherit'
  })

  isRunning = true

  child.on('exit', function(code) {
    child = null
    isRunning = false

    if (code) {
      debug('child process exited with code ' + code.toString())
    } else {
      debug('child process exited')
    }
  })

  child.on('close', function(code) {
    child = null
    isRunning = false

    if (code) {
      debug('child process closed with code ' + code.toString())
    } else {
      debug('child process close')
    }
  })
}

var killROSCore = function(callback) {
  debug('killing ROSCORE')
  var pid = child.pid

  var signal = 'SIGKILL';
  callback = callback || function() {};
  var killTree = true;
  if (killTree) {
    psTree(pid, function(err, children) {
      [pid].concat(
        children.map(function(p) {
          return p.PID;
        })
      ).forEach(function(tpid) {
        try {
          process.kill(tpid, signal)
        } catch (ex) {}
      });
      callback();
    });
  } else {
    try {
      process.kill(pid, signal)
    } catch (ex) {}
    callback();
  }
}

router.get('/', function(req, res, next) {
  res.json({
    isRunning: (child && child.pid) ? true : false
  })
})


router.get('/start', function(req, res, next) {
  debug("starting ROS core")
  if (!isRunning) {
    runROS()
    setTimeout(function() {
      res.json({
        isRunning: isRunning
      })
    }, 100)
  } else {
    res.json({
      isRunning: isRunning
    })
  }
})

router.get('/stop', function(req, res, next) {
  if (isRunning) {
    debug("killing ROS core")
    killROSCore()
    setTimeout(function() {
      res.json({
        isRunning: isRunning
      })
    }, 100)
  } else {
    res.json({
      isRunning: isRunning
    })
  }
})

if (_.config.ros_on_start) {
  runROS()
}

module.exports = router
