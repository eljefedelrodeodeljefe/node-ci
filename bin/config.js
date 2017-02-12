const yaml = require('../lib/yaml')
const path = require('path')

module.exports = (argv) => {
  if (argv[0] === 'validate') {
    const config = yaml.read(argv[1])

    if (!config) {
      throw new Error(`invalid yaml ${path.resolve(process.cwd(), argv[1])}`)
    }

  }
}
