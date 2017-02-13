const restify = require('restify')
const pino = require('pino')()
const debug = require('debug')('destackci:api')
const logger = require('restify-pino-logger')()
const routes = require('./routes')

const server = restify.createServer({
  // certificate: fs.readFileSync('path/to/server/certificate'),
  // key: fs.readFileSync('path/to/server/key'),
  log: pino,
  name: 'destack-ci-api'
})

server.pre(restify.CORS({
  origins: ['*'],
  credentials: false,
  headers: ['authorization']
}))

restify.CORS.ALLOW_HEADERS.push('authorization')
server.on('MethodNotAllowed', function(req, res) {
  if (req.method.toUpperCase() === 'OPTIONS') {
    // Send the CORS headers
    res.header('Access-Control-Allow-Headers', restify.CORS.ALLOW_HEADERS.join(', '))
    res.send(204)
  } else {
    res.send(new restify.MethodNotAllowedError())
  }
})
server.use(logger)
server.use(restify.bodyParser())
server.use(restify.queryParser())
// register routes that are declared in lib/routes and
// have their handlers defined in lib/handlers
routes.register(server)

exports.start = (options, cb) => {
  server.listen(options.apiPort, () => {
    debug('API server started')
    return cb(server)
  })
}
