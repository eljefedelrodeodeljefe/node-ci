const DestackCI = require('../')

const destack = DestackCI()

// destack.use()
destack.listen(() => {
  destack.run('./nodeci.example.yml')
})
