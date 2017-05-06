'use strict'

var jsonld = require('jsonld')
var _ = require('lodash')
var utf8 = require('utf8')
var bitcoreLib = require('bitcore-lib')
var Hash = bitcoreLib.crypto.Hash

function BlockcertsLib () {
  this.foo = 'foo'
}

BlockcertsLib.prototype.sha256 = function (str) {
  return Hash.sha256(Buffer.from(str)).toString('hex')
}

// support blockcerts.org schema >= 2.0
// https://github.com/blockchain-certificates/cert-verifier-js

BlockcertsLib.prototype.computeHash = function (cert) {
  return new Promise((resolve, reject) => {
    jsonld.normalize(cert, {
      algorithm: 'URDNA2015',
      format: 'application/nquads',
      expandContext: cert['@context']
    }, (err, normalized) => {
      if (err) {
        reject(err)
      }
      var myRegexp = /<http:\/\/fallback\.org\/(.*)>/
      var matches = myRegexp.exec(normalized)
      if (matches) {
        var unmappedFields = []
        for (var i = 0; i < matches.length; i++) {
          unmappedFields.push(matches[i])
        }
        var reason = 'Found unmapped fields during JSON-LD normalization: ' + unmappedFields.join(',')
        reject(reason)
      }
      resolve({
        // normalized: normalized,
        hash: this.sha256(utf8.encode(normalized))
      })
    })
  })
}

BlockcertsLib.PrepareNormalize = function (cert) {
  var expandContext = cert['@context']
  if (!expandContext.find(x => x.name === '@vocab')) {
    expandContext.push({
      '@vocab': 'http://fallback.org/'
    })
  }
  delete cert.signature
  return cert
}

module.exports = {
  bitcoreLib: bitcoreLib,
  BlockcertLib: BlockcertsLib
}
