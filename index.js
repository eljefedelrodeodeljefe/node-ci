const EventEmitter = require('events')
const Server = require('./server/index')
const APIServer = require('./api/index')

class Destack extends EventEmitter {
  constructor (options) {
    super()
    this.server = null
    this.emit('init', this)
  }

  listen (options, cb) {
    const self = this

    if (!cb && typeof options === 'function') {
      cb = options
      options = undefined
    }

    const opts = Object.assign({
      port: 8080,
      apiPort: 3000
    }, options)

    self.emit('before-server-start', Server, self)

    Server.start(opts, (server) => {
      self.server = server
      self.emit('server-start', self.server, self)

      self.emit('before-api-server-start', APIServer, self)

      APIServer.start(opts, (apiServer) => {
        self.apiServer = apiServer
        self.emit('api-server-start', self.apiServer, self)
      })
    })
  }
}

module.exports = (options) => {
  return new Destack(options)
}

module.exports.Destack = Destack
