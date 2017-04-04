const jwt = require('jsonwebtoken')
const router = require('express').Router()
const passwordHash = require('password-hash')

const debug = require('debug')("snappy:core:authenticate")

function myRoutes(app) {
  app.post('/login', login)
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
  /*
  debug(token)
  res.end(token)*/
}

module.exports = myRoutes
