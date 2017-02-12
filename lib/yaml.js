const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

exports.read = (filepath) => {
  if (!filepath) {
    throw new Error('read function require path or string')
  }
  // Get document, or throw exception on error
  let json = undefined
  try {
    json = yaml.safeLoad(fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf8'))
  } catch (e) {
    console.log(e)
  }
  return json
}
