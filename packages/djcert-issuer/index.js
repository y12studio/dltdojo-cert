'use strict'

var jsonld = require('jsonld')
var utf8 = require('utf8')
var bitcoreLib = require('bitcore-lib')
var Hash = bitcoreLib.crypto.Hash
const uuidV4 = require('uuid/v4')
var MerkleTools = require('merkle-tools')

// const DATAURL_PNG_RED_50x50 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAARUlEQVR42u3PQQ0AAAjEMM6/aMACT5IuM9B01f6/gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIBcGuAsY8/q7uoYAAAAAElFTkSuQmCC"
// const DATAURL_PNG_BLUE_50x50 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAARElEQVR42u3PQREAAAjDMOZfNGCBL5dWQVK9PyggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIJcGrl5jz5iDI7kAAAAASUVORK5CYII="
// const DATAURL_PNG_GREEN_50x50 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAQ0lEQVR42u3PQREAAAgDoK1/aM3g14MGNJnJAxURERERERERERERERERERERERERERERERERERERERERERERERERuVh8kGPPziaQ7QAAAABJRU5ErkJggg=="

function BlockcertsLib () {}

BlockcertsLib.prototype.sha256 = function (str) {
  return Hash.sha256(Buffer.from(str)).toString('hex')
}

BlockcertsLib.prototype.hash = function (normalized) {
  return this.sha256(utf8.encode(normalized))
}

BlockcertsLib.prototype.getId = function () {
  return 'urn:uuid:' + uuidV4()
}

BlockcertsLib.prototype.validateProof = function (signature) {
  var proof = signature.proof
  var targetHash = signature.targetHash
  var merkleRoot = signature.merkleRoot
  var merkleTools = new MerkleTools()
  return merkleTools.validateProof(proof, targetHash, merkleRoot)
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
        normalized: normalized
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
