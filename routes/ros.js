const _ = require(global.initLocation)

const router = require('express').Router()
const cp = require('child_process')
const psTree = require('ps-tree')

const debug = require('debug')("snappy:core:ros")

var child = null
var isRunning = false

var sendStatus = function(res) {
  res.json({
    isRunning: isRunning,
    onBoot: _.config.ros_on_start
  })
}

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
  sendStatus(res)
})


router.get('/start', function(req, res, next) {
  debug("starting ROS core")
  if (!isRunning) {
    runROS()
    setTimeout(function() {}, 100)
  } else {
    sendStatus(res)
  }
})

router.get('/stop', function(req, res, next) {
  if (isRunning) {
    debug("killing ROS core")
    killROSCore()
    setTimeout(function() {
      sendStatus(res)
    }, 100)
  } else {
    sendStatus(res)
  }
})

router.get('/boot/:mode', function(req, res, next) {
  if (req.params.mode == 'on') {
    _.config.ros_on_start = true
    _.saveConfig()
    sendStatus(res)
  } else if (req.params.mode == 'off') {
    _.config.ros_on_start = false
    _.saveConfig()
    sendStatus(res)
  } else {
    res.sendStatus(403).end('wrong input')
  }
})

if (_.config.ros_on_start && _.consts.hasROS) {
  runROS()
}

module.exports = router
