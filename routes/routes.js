const path = require('path')

const auto_discovery = require(path.join(__dirname, 'auto_discovery'))

function myRoutes(app) {
  app.use('/info', auto_discovery)
}
module.exports = myRoutes
