var prompt = require('prompt');
// https://github.com/flatiron/prompt
var ethlw = require("eth-lightwallet")
// https://github.com/ConsenSys/eth-lightwallet
var keystore = ethlw.keystore
var fs = require('fs')

function createKeystore(password) {
    var secretSeed = keystore.generateRandomSeed()
    console.log(secretSeed)
    keystore.createVault({
        password: password,
        seedPhrase: secretSeed
    }, (err, ks) => {
        // console.log(err, ks)
        if (ks) {
            console.log(ks.serialize())
            fs.writeFileSync('sample.key.json',ks.serialize())
        }
    })
}

prompt.start();

// var password = prompt('Enter password for encryption', 'password')
prompt.get(['password'], (err, result) => {
    console.log('Enter password for encryption:');
    console.log('  password: ' + result.password);
    createKeystore(result.password)
});