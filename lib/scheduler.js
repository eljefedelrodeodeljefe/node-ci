// const steed = require('steed')()
const EventEmitter = require('events')
const debug = require('debug')('destackci:core')

const DEFAULT_ORDER = [
  'platform',
  'services',
  'install',
  'build',
  'test',
  'deploy'
]

class MicroRunner extends EventEmitter {
  constructor (options) {
    super()
  }
}

class MacroRunnner extends EventEmitter {
  constructor (options) {
    super()
    this.options = Object.assign({
      order: DEFAULT_ORDER
    }, options)
  }
}

class DefaultScheduler extends EventEmitter {
  constructor (options) {
    super()
    debug('constructor call to DefaultScheduler')

    this.options = Object.assign({
      macroRunnnerOptions: null
    }, options)

    this.macroRunnner = this.options.macroRunnner || new MacroRunnner(this.options.macroRunnnerOptions)
  }
}

module.exports = DefaultScheduler
module.exports.Scheduler = DefaultScheduler
module.exports.MicroRunner = MicroRunner
module.exports.MacroRunnner = MacroRunnner
