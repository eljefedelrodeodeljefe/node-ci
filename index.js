const EventEmitter = require('events')
const path = require('path')
const debug = require('debug')('destackci:core')
const Server = require('./server/index')
const APIServer = require('./api/index')

const Scheduler = require('./lib/scheduler')
const yaml = require('./lib/yaml')

function isString (str) {
  return typeof str === 'string' || str instanceof String
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

class Destack extends EventEmitter {
  constructor (options) {
    super()
    this.server = null
    this.scheduler = null
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
        debug('destackci initialized')
        return cb()
      })
    })
  }

  run (options) {
    let opts = {
      configPath: null,
      mainModule: process.mainModule.filename,
      cwd: process.cwd(),
      macroQueue: null
    }

    if (isString(options)) {
      opts.configPath = options
    } else if (isObject(options)) {
      opts = Object.assign(opts, options)
    }

    opts.macroQueue = this._readConfig(opts)

    debug('calling _run() with %O', opts)

    this._run(opts)
  }

  _run (opts) {
    this.scheduler = new Scheduler()
  }

  _readConfig (opts) {
    if (path.isAbsolute(opts.configPath)) {
      return yaml.read(opts.configPath)
    } else {
      const base = path.dirname(opts.mainModule)
      return yaml.read(path.resolve(base, opts.configPath))
    }
  }
}

module.exports = (options) => {
  return new Destack(options)
}

module.exports.Destack = Destack
