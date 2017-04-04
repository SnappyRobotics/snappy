const path = require('path')

const auto_discovery = require(path.join(__dirname, 'auto_discovery'))

function myRoutes(app) {
  app.use('/info', auto_discovery)

  //All the authenticate routes
  require(path.join(__dirname, 'authenticate'))(app) //Keep this after info for token verification for all the below routes

}
module.exports = myRoutes
