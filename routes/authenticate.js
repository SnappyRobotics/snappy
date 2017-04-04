const jwt = require('jsonwebtoken')
const router = require('express').Router()
const passwordHash = require('password-hash')

const debug = require('debug')("snappy:core:authenticate")

function myRoutes(app) {
  app.post('/login', login)

  app.use(global.snappy_core.checkLogin)
}


var login = function(req, res, next) {
  if (req.body.user && req.body.pass) {

    if (req.body.user.trim() != global.snappy_core.config.user) {
      res.status(406).end('Wrong username')
    } else {
      if (!passwordHash.verify(req.body.pass.trim(), global.snappy_core.config.pass)) {
        res.status(406).end('Wrong password')
      } else {
        var token = jwt.sign({
          user: req.body.user.trim(),
          pass: passwordHash.generate(req.body.pass)
        }, global.snappy_core.config.jwt_secret, {
          expiresIn: '1d'
        })

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

global.snappy_core.checkLogin = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, global.snappy_core.config.jwt_secret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    })
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    })
  }
}

module.exports = myRoutes
