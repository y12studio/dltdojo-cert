var prompt = require('prompt')
// https://github.com/flatiron/prompt
var ethlw = require('eth-lightwallet')
// https://github.com/ConsenSys/eth-lightwallet
// https://github.com/bitpay/bitcore-mnemonic/blob/master/docs/index.md

var keystore = ethlw.keystore
var fs = require('fs')

function createEthKeystore (password, secretSeed) {
  keystore.createVault({
    password: password,
    seedPhrase: secretSeed
  }, (err, ks) => {
    if (err) throw err
        // console.log(err, ks)
    ks.keyFromPassword(password, (err, pwDerivedKey) => {
      if (err) throw err
      ks.generateNewAddress(pwDerivedKey, 5)
      fs.writeFileSync('sample-key.json', ks.serialize())
    })
  })
}

prompt.start()

// var password = prompt('Enter password for encryption', 'password')
prompt.get(['password'], (err, result) => {
  if (err) throw err
  console.log('Enter password for encryption:')
  console.log('  password:   ' + result.password)
  var secretSeed = keystore.generateRandomSeed()
  console.log('  secretSeed: ' + secretSeed)
  createEthKeystore(result.password, secretSeed)
})
