var argv = require('yargs').argv
var BlockcertsLib = require('../blockcerts')
var fs = require('fs')
var moment = require('moment')
var Mnemonic = require('bitcore-mnemonic')
var bitcoreLib = require('bitcore-lib')
var Networks = bitcoreLib.Networks

function buildCerts () {
  var bcerts = new BlockcertsLib()
  var tplObj = JSON.parse(fs.readFileSync('bcerts-dltdojo-tpl-2.0.json', 'utf8'))
  bcerts.tplBuilder(tplObj).then(r => {
    fs.writeFileSync('bcerts-dltdojo-2.0.json', JSON.stringify(r, null, 2))
  })
}

//
// https://dltdojo.org/blockcerts/samples/2.0-alpha/issuerTestnet.json
//
function buildSampleIssuer () {
  var bcerts = new BlockcertsLib()
  var code = new Mnemonic('quiz yellow false empty flag day digital nut embrace icon like depend')
  var tplObj = JSON.parse(fs.readFileSync('bcerts-issuer-tpl-2.0.json', 'utf8'))
  bcerts.imageToUri(tplObj)
  var hdPrivateKey = code.toHDPrivateKey()
  for (var index = 0; index < 10; index++) {
    var derivedKey = hdPrivateKey.deriveChild('m/2017/6/' + index + "'")
    // console.log(derivedKey)
    // var address = deriveKey.toAddress(Networks.livenet);
    var address = derivedKey.privateKey.toAddress(Networks.testnet)
    tplObj.publicKeys.push({
      created: moment().format(),
      revoked: moment().add((index + 1) * 3, 'months').format(),
      publicKey: `ecdsa-koblitz-pubkey:${address.toString()}`
    })
  }
  fs.writeFileSync('issuerTestnet-2.0.json', JSON.stringify(tplObj, null, 2))
}

// node configBuilder.js --build
// node configBuilder.js --sampleIssuer
if (argv.build) {
  buildCerts()
} else if (argv.sampleIssuer) {
  buildSampleIssuer()
} else {
  console.log('help?')
}
