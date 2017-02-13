const Git = require('nodegit')
const os = require('os')
const fs = require('fs')
const url = require('url')
const path = require('path')
const uuid = require('uuid')
const sshURL = require('ssh-url')

const sshPrivateKeyPath = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAgV5zSZ4AH+TFJmJ0i7j4e5+uzqQ32iSOW3hz4DfXOmUOguwnTCXv/VIw
DfrSYHjM1ZYh/bFGdzIDJGEqdyqTXXoABAyjzdjJpfjiEnSvu4akZG3KDXRYL4MuOxQkNz9K
A36ftYOwu+SIsS11Nx3J/drLk0xBKAvnxwhb8PsGU/HBCv5ExU6IrH7DFb9dTHLNTVMGKrQc
2u129r5GcHcwnStG6fgr+P2uPUToetgugh1e4ORpCYV6eHPduYs6vlCRka4kiPNX059Y1ZtS
FkwKKHLvk/LF6QbG2OcmEX4ltmNvLBXYEn9LNDE/cad/ZOaOsxzYHtkZSioI4jd4NGLuywID
AQABAoIBAH8/Ncq9XIYCcWDWCqi8Ib0HTdv3bvBkcJnMGr36bvsDF4jzW5vs3OeghZ/ajD9T
0rZrW7e7PQJU8P5BjJF2EUkqjQVuoVgB2iYkbcmVeJzNTLlzvAAL5gml0D1QDGdDGzvguprB
k37cxQ7xFZBG/r1xDjguExCe1TXSJQ0c/BZoBsHL3YqRDZhX5yt4hNBBtuLIqndBxbKA6KTf
oDw2/VntCWp7dlqxmdzkUjKw94BrSf4vY0K76EH8dn2L26MPYPODirzJsvG1U6P0F9fyHhQK
fEdQBnbe0nuWRiq8ZXBvBRRmLWNsqLay2KOXt3dhAB7nKf97eap7QEECJ/2rv3ECgYEA+Mgn
9e2xuZDaoekgIcFb+xQ2IbDHNwSAkW1d5RS+CfgkzinLdgirJbrUFUrGNPM8CwNqkSK7QtYC
fW923elJhpNNmOD3GexgqPvDGaFN+eO9dzDZ24bqPeECI8j7hbKJkm+Kh2tpT/H7kbpY3a59
9GMAuf3xdHXWHj7Fm40yoI0CgYEAhR9Yyu3DI8Fd5wlXiHT9lTKX/amq9DqGPLNF4RGrPr0x
edMpfZfHGwKQJ4jrkDeOLqHMF4OKrAzzfa9lEDarq6V5EkyGGIL3uMgHwA/b0I9FuUFxa+qm
EJh7+eJDGVP3g59DNl86eDMEYY9eui31sLg1j/nid/grXcg/2+AZUrcCgYEAokQbHGMu+rQq
hlTCKoIt9nRWYl8lcRM0sKY/Cf4ffe0mRHoqRRCeYPuc/U5KPZsw3JYb2hJnRc7EzP/47gEN
fgNyJ3cEdRoiadXciUkWzRjoKWfpkTBMdJPgi2q585hh9utd1boPdJ+G0KRU9jKr4Mz6WlXy
OV3qjMuwpCbSkLkCgYA78LplXRthjR6/+bfdLHhF5qsDP5NHNtbcnAgZ6H/H1x5g8VCcSWwQ
YF4SPxd6L1mo65de+w7Em2xDqmcCHuu7dN2H/MbgYJA0NnUu6LUcOna1jJ8KbXRqwo4IHPYD
gIhRTrPP1p8YIjiVyR1pDWq0MK2Fb4mmZSr5pkICuewNDwKBgGsXOSQl6NW9XLgN5ju8kgxa
NLPnwHEFyMhg0bzggd1mJIzwHdn7p6BpbFfRyG8zouY9fTRAmX5qTKRE+JJsVbiYJhFN9SZJ
pgrmkSdoRUSuhn7rWpT9bMvUIqeytAd3kx/hSWP57EutOqg/vkLGIzyF4QFVGrgdCQJesBOS
kGlY
-----END RSA PRIVATE KEY-----`
const sshPublicKeyPath = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCBXnNJngAf5MUmYnSLuPh7n67OpDfaJI5beHPgN9c6ZQ6C7CdMJe/9UjAN+tJgeMzVliH9sUZ3MgMkYSp3KpNdegAEDKPN2Mml+OISdK+7hqRkbcoNdFgvgy47FCQ3P0oDfp+1g7C75IixLXU3Hcn92suTTEEoC+fHCFvw+wZT8cEK/kTFToisfsMVv11Mcs1NUwYqtBza7Xb2vkZwdzCdK0bp+Cv4/a49ROh62C6CHV7g5GkJhXp4c925izq+UJGRriSI81fTn1jVm1IWTAoocu+T8sXpBsbY5yYRfiW2Y28sFdgSf0s0MT9xp39k5o6zHNge2RlKKgjiN3g0Yu7L git@destackci.local`

function addressParser (addressString) {
  const urlObject = url.parse(addressString)
  if (urlObject && urlObject.protocol && urlObject.hostname) {
    return urlObject.href
  }

  const sshObject = sshURL.parse(addressString)
  if (sshObject && sshObject.user) {
    const pathObject = path.parse(sshObject.pathname)
    return `${pathObject.dir}/${pathObject.name}`
  }
  // fallback
  return `/unknown/${uuid.v4()}`
}

function rmdir (dir) {
  var list = fs.readdirSync(dir)
  for (var i = 0; i < list.length; i++) {
    const filename = path.join(dir, list[i])
    const stat = fs.statSync(filename)

    if (filename === '.' || filename === '..') {
      // pass these files
    } else if (stat.isDirectory()) {
      // rmdir recursively
      rmdir(filename)
    } else {
      fs.unlinkSync(filename)
    }
  }
  fs.rmdirSync(dir)
}

/**
 * Clone a repository via ssh, from http/https or ssh address.
 * clone() removes existing directories from os.tmpdir witht the `username/repo` path name.
 *
 * _Note:_ Ideally this should receive an options#commit hast to check out
 * the HEAD commit cleanly and deterministically [TODO]
 * @example
 * clone('git@github.com:eljefedelrodeodeljefe/node-ci-test.git', null, (err, result) => {
 *   if (err) {
 *     return console.log(err)
 *   }
 *
 *   console.log(result)
 *   // returns:  {
 *   //            path: '/var/folders/2p/f6b2p9555fg8g3z7vzvtmlp40000gn/T/eljefedelrodeodeljefe/node-ci-test',
 *   //            repository: Repository {}
 *   //          }
 * })
 *
 * @param {string} addressString
 * @param {Object} options
 * @param {Function} callback
 */
module.exports = (addressString, options, cb) => {
  const cloneToPath = `${os.tmpdir()}${addressParser(addressString)}`
  // delete if exists
  rmdir(cloneToPath)

  const opts = Object.assign({
    checkoutBranch: 'master',
    commit: null,
    force: true,
    fetchOpts: {
      callbacks: {
        certificateCheck: function () {
          return 1
        },
        credentials: function (url, userName) {
          // Personal Access Token
          // return Git.Cred.userpassPlaintextNew('7e03d7d570ebd085404e6a46d45346703e0e7d5f', 'x-oauth-basic')
          // SSH key from agent);
          return Git.Cred.sshKeyMemoryNew(userName, sshPublicKeyPath, sshPrivateKeyPath, '')
        }
      }
    }
  }, options)
  // Clone a given repository into the `./tmp` folder.;
  Git.Clone(addressString, cloneToPath, opts)
    .then((repo) => {
      // TODO(eljefedelrodeodeljefe): continue if we want to check out the HEAD commit
      // if (!options.commit) {
      return cb(null, {
        path: cloneToPath,
        repository: repo
      })
      // }
    })
    .catch((err) => { return cb(err) })
}
