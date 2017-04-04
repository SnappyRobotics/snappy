const jwt = require('jsonwebtoken')
const router = require('express').Router()
const passwordHash = require('password-hash')

const debug = require('debug')("snappy:core:authenticate")

function myRoutes(app) {
  app.post('/login', login)

  app.use(global.snappy_core.checkLogin) //Keep it here for checking for token just for everything except /login

  app.get('/logout', logout)
}

var login = function(req, res, next) {
  if (req.body.user && req.body.pass) {

    if (req.body.user.trim() != global.snappy_core.config.user) {
      res.status(406).end('Wrong username')
    } else {
      if (!passwordHash.verify(req.body.pass.trim(), global.snappy_core.config.pass)) {
        debug(req.body.pass.trim())
        debug(passwordHash.generate(req.body.pass.trim()))
        res.status(406).end('Wrong password')
      } else {
        var token = jwt.sign({
          user: req.body.user.trim(),
          pass: passwordHash.generate(req.body.pass)
        }, global.snappy_core.config.jwt_secret, {
          expiresIn: '1d'
        })

        global.snappy_core.config.token = token
        global.snappy_core.saveConfig()

        res.json({
          success: true,
          token: token
        })
      }
    }
  } else {
    res.status(406).end('username or password not supplied')
  }
}


var logout = function(req, res, next) {
  delete global.snappy_core.config.token
  global.snappy_core.saveConfig()
  res.status(201).end('Successfully logged out!')
}

global.snappy_core.checkLogin = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    if (global.snappy_core.config.token) {
      if (global.snappy_core.config.token == token) {

        // verifies secret and checks exp
        jwt.verify(token, global.snappy_core.config.jwt_secret, function(err, decoded) {
          if (err) {
            return res.json({
              success: false,
              message: 'Failed to authenticate token.',
              err: err
            });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
          }
        })
      } else {
        return res.status(403).send({
          success: false,
          message: 'Logged in from other computer. Access denied. Only one login at a time.'
        })
      }
    } else {
      return res.status(403).send({
        success: false,
        message: 'Logged out. Access denied'
      })
    }
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided. Access denied.'
    })
  }
}

module.exports = myRoutes
