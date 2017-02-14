// const steed = require('steed')()
const EventEmitter = require('events')

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
    this.options = Object.assign({
      globalRunnerOptions: null
    }, options)

    this.globalRunner = options.globalRunner || new MacroRunnner(options.globalRunnerOptions)
  }
}

module.exports = DefaultScheduler
module.exports.Scheduler = DefaultScheduler
module.exports.MicroRunner = MicroRunner
module.exports.MacroRunnner = MacroRunnner
