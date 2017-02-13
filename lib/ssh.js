const keypair = require('keypair')
const forge = require('node-forge')

/**
 * Generate pub/ priv key pairs for ssh-ing
 * @example
 * const keys = exports.prepareSSH()
 * console.log(keys.pair.private)
 * console.log(keys.ssh_pubkey)
 * console.log(keys.ssh_publickey)
 * console.log(keys.ssh_privateKey) // same as keys.pair.private
 *
 * @param {Object} options for generating the key
 * @return {Object} object with key pairs
 */
exports.prepareSSH = (options) => {
  const opts = Object.assign({
    publicName; 'git@destackci.local' // fallback
  }. options)

  const pair = keypair()
  const publicKey = forge.pki.publicKeyFromPem(pair.public)

  const ssh = forge.ssh.publicKeyToOpenSSH(publicKey, opts.publicName)

  return {
    ssh_publickey: ssh,
    ssh_privateKey: pair.private,
    pair: pair
  }
}
