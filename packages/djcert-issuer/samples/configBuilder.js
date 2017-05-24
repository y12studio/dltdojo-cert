var argv = require('yargs').argv
var BlockcertsLib = require('../blockcerts')
var fs = require('fs')
var _ = require('lodash')
var moment = require('moment')
var Mnemonic = require('bitcore-mnemonic')
// var bitcoreLib = require('bitcore-lib')
// var Networks = bitcoreLib.Networks

function buildCerts () {
  var bcerts = new BlockcertsLib()
  var tplObj = JSON.parse(fs.readFileSync('bcerts-dltdojo-tpl-2.0.json', 'utf8'))
  bcerts.tplBuilder(tplObj).then(r => {
    fs.writeFileSync('bcerts-dltdojo-2.0-all.json', JSON.stringify(r, null, 2))
  })
}

//
// https://dltdojo.org/blockcerts/samples/2.0-alpha/issuerTestnet.json
//
function buildSampleIssuer (hdPrivateKey) {
  var bcerts = new BlockcertsLib()
  var tplObj = JSON.parse(fs.readFileSync('bcerts-issuer-tpl-2.0.json', 'utf8'))
  bcerts.imageToUri(tplObj)
  var savedPrivateKeys = []
  for (var index = 0; index < 10; index++) {
    var derivedKey = hdPrivateKey.deriveChild('m/2017/6/' + index + "'")
    var privateKey = derivedKey.privateKey
    var address = privateKey.toAddress().toString()
    var key = {
      created: moment().format(),
      revoked: moment().add((index + 1) * 3, 'months').format(),
      publicKey: `ecdsa-koblitz-pubkey:${address}`
    }
    tplObj.publicKeys.push(key)
    var pkey = _.clone(key)
    pkey.privateKey = privateKey.toWIF()
    savedPrivateKeys.push(pkey)
  }
  fs.writeFileSync('issuerTestnet-2.0.json', JSON.stringify(tplObj, null, 2))
  fs.writeFileSync('issuerTestnet-key-2.0.json', JSON.stringify(savedPrivateKeys, null, 2))
}

// node configBuilder.js --build
// node configBuilder.js --sampleIssuer
if (argv.build) {
  buildCerts()
} else if (argv.sampleIssuer) {
  var code = new Mnemonic('quiz yellow false empty flag day digital nut embrace icon like depend')
  var password = 'HelloDltdojo'
  var isTestNet = true
  var hdPrivateKey = isTestNet ? code.toHDPrivateKey(password, 'testnet') : code.toHDPrivateKey(password, 'livenet')
  buildSampleIssuer(hdPrivateKey)
} else if (argv.sampleAnchorV1) {
  var wif = 'cNerHRTSNtckBApvPadznETjDcpfXjCJ8m9jNC3vrxkmXrWGTRfo'
  var certArr = JSON.parse(fs.readFileSync('bcerts-dltdojo-2.0-all.json', 'utf8'))
  var merkleRoot = certArr[0].signature.merkleRoot
  new BlockcertsLib().anchor(wif, merkleRoot).then(txid => {
    console.log(txid)
  })
  // https://www.blocktrail.com/tBTC/address/n4PUYLvHZmz7oGWsVnWLzEYc5ivHdDcusb
} else if (argv.sampleCerts) {
  var txid = 'df605517e9010dd320b9013a5324762c064fa610287b738c6bcbe56d679ca9ae'
  certArr = JSON.parse(fs.readFileSync('bcerts-dltdojo-2.0-all.json', 'utf8'))
  certArr.forEach((e, i, a) => {
    e.signature.anchors[0].sourceId = txid
    fs.writeFileSync(`${e.id.replace('urn:uuid:', '')}.json`, JSON.stringify(e, null, 2))
  })
  fs.writeFileSync('bcerts-dltdojo-2.0-all-txid.json', JSON.stringify(certArr, null, 2))
}
