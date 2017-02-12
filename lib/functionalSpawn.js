const spawn = require('child_process').spawn
const EventEmitter = require('events')

class FSpawn extends EventEmitter {
  constructor(options) {
    super()
    this.options = options
    this.spawn = null
  }

  run (cb) {
    this.emit('beforeStart')
    // this defines the API:
    // if you need stdio, you need to pipe it yourself.
    // It also promotes IPC
    const opts = {stdio: ['pipe', 'pipe', 'pipe', 'ipc']}

    this.spawn = spawn(this.options.cmd.shift(), this.options.cmd, opts)
    // stack event right after spawn REVIEW
    process.nextTick(() => { this.emit('afterStart') })
    // emulate 'inherit' if wanted
    if (this.options.shouldPipe) {
      this.spawn.stdout.pipe(process.stdout)
      this.spawn.stdin.pipe(process.stdin)
      this.spawn.stderr.pipe(process.stderr)
      // close with prettiness
      this.spawn.once('close', () => { process.stdout.write('\n') })
    }
    // extend through all the events
    this.spawn.on('close', (code) => { this.emit('end', code) })
    this.spawn.on('error', (code) => { this.emit('error', error) })

    this.spawn.on('close', (code) => {
      return process.nextTick(() => { return cb(null) })
    })
  }

  inherit () {
    this.options.shouldPipe = true
  }
}

exports.FSpawn = FSpawn

exports.spawn = function functionalSpawn (command, options, cb) {
  const opts = Object.assign({
    _: options,
    cmd: command || '', // this must become an array
  }, options)

  // here lies API sugar for users not to split commands in array
  if (typeof opts.cmd === 'string') {
    opts.cmd = opts.cmd.split(' ')
  }

  return cb(null, new FSpawn(opts))
}
