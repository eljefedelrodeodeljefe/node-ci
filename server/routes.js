const path = require('path')
const indexPath = path.resolve(__dirname, 'index.html')

exports.register = (server) => {
  server.get('/*', (req, res) => {
    res.sendFile(indexPath)
  })
}
