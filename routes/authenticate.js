const jwt = require('jsonwebtoken')
const router = require('express').Router()
const passwordHash = require('password-hash')

const _ = require(global.initLocation)

const debug = require('debug')("snappy:core:authenticate")

function myRoutes(app) {
  app.post('/login', login)

  app.use(checkAuth) //Keep it here for checking for token just for everything except /login

  app.get('/logout', logout)
}

var login = function(req, res, next) {
  if (req.body.user && req.body.pass) {

    if (req.body.user.trim() != _.config.user) {
      res.status(400).send('Wrong username')
    } else {
      if (!passwordHash.verify(req.body.pass.trim(), _.config.pass)) {
        res.status(400).send('Wrong password')
      } else {
        var token = jwt.sign({
          user: req.body.user.trim(),
          pass: passwordHash.generate(req.body.pass)
        }, _.config.jwt_secret, {
          expiresIn: '1d'
        })

        _.config.token = token
        _.saveConfig()

        res.json({
          success: true,
          token: token
        })
      }
    }
  } else {
    res.status(400).send('username or password not supplied')
  }
}


var logout = function(req, res, next) {
  delete _.config.token
  _.saveConfig()
  res.status(201).send('Successfully logged out!')
}

var checkAuth = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    if (_.config.token) {
      if (_.config.token == token) {

        // verifies secret and checks exp
        jwt.verify(token, _.config.jwt_secret, function(err, decoded) {
          if (err) {
            return res.status(403).json({
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
