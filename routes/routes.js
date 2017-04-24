const _ = require(global.initLocation)

const auto_discovery = require(_.path('routes', 'auto_discovery'))
const ros = require(_.path('routes', 'ros'))

function myRoutes(app) {
  app.use('/info', auto_discovery)

  //All the authenticate routes
  require(_.path('routes', 'authenticate'))(app) //Keep this after info for token verification for all the below routes

  app.use('/ros', ros)
}
module.exports = myRoutes
