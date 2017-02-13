const swaggerJSDoc = require('swagger-jsdoc')

const BASE = 'api/ci'
const VERSION = require('../package.json').version
const SHORT_VERSION = `v${VERSION.split('.')[0]}` // 0.1.0 -> v0

const options = {
  swaggerDefinition: {
    info: {
      title: 'Destack-CI-API', // Title (required)
      version: VERSION // Version (required)
    }
  },
  apis: [__filename] // Path to the API docs
}
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options)

exports.register = (server) => {
  server.get(`${BASE}/${SHORT_VERSION}/api-docs.json`, function (req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  server.get('/', (req, res, next) => {
    return res.send(400, 'API route not found')
  })
}
