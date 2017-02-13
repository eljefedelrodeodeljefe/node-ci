// const steed = require('steed')()
const EventEmitter = require('events')

const DEFAULT_ORDER = {
  /* eslint-disable key-spacing */
  'platform': 0,
  'services': 1,
  'install':  2,
  'build':    3,
  'test':     4,
  'deploy':   5
  /* eslint-enable key-spacing */
}

class MicroRunner extends EventEmitter {
  constructor (options) {
    super()
  }
}

class GlobalRunnner extends EventEmitter {
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

    this.globalRunner = options.globalRunner || new GlobalRunnner(options.globalRunnerOptions)
  }
}

module.exports = DefaultScheduler
module.exports.Scheduler = DefaultScheduler
module.exports.MicroRunner = MicroRunner
module.exports.GlobalRunnner = GlobalRunnner
