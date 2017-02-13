const path = require('path')
const url = require('url')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const history = require('connect-history-api-fallback')

// const cache = require('./lib/cache')
const routes = require('./routes')

// const GitHubStrategy = require('passport-github').Strategy
const pino = require('pino')()
const expressPino = require('express-pino-logger')({
  logger: pino
})

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000

// cache.init()

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(history())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressPino)
app.use(helmet.frameguard())
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", "'unsafe-inline'"],
//     styleSrc: ["'self'", "'unsafe-inline'"],
//     fontSrc: ["'self'", 's3.eu-central-1.amazonaws.com'],
//     imgSrc: ['s3.eu-central-1.amazonaws.com', 'data:'],
//     sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
//     reportUri: '/report-violation',
//     objectSrc: ["'none'"],
//     upgradeInsecureRequests: true
//   },
//
//   // This module will detect common mistakes in your directives and throw errors
//   // if it finds any. To disable this, enable "loose mode".
//   loose: false,
//
//   // Set to true if you only want browsers to report errors, not block them.
//   // You may also set this to a function(req, res) in order to decide dynamically
//   // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
//   reportOnly: false,
//
//   // Set to true if you want to blindly set all headers: Content-Security-Policy,
//   // X-WebKit-CSP, and X-Content-Security-Policy.
//   setAllHeaders: false,
//
//   // Set to true if you want to disable CSP on Android where it can be buggy.
//   disableAndroid: false,
//
//   // Set to false if you want to completely disable any user-agent sniffing.
//   // This may make the headers less compatible but it will be much faster.
//   // This defaults to `true`.
//   browserSniff: true
// }))
app.use(helmet.dnsPrefetchControl())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.noSniff())
app.use(helmet.xssFilter())

routes.register(app)

io.on('connection', (socket) => {
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  const heartbeat = setInterval(() => {
    console.log('heartbeat')
    socket.volatile.emit('heartbeat', {})
  }, 5000)
  socket.on('disconnect', function () {
    console.log('user disconnected');
    clearInterval(heartbeat)
    io.emit('user disconnected')
  })
})

exports.start = (options, cb) => {
  server.listen(options.port)
  return cb(server)
}
