'use strict'
var jsonld = require('jsonld')
var utf8 = require('utf8')
var bitcoreLib = require('bitcore-lib')
var Hash = bitcoreLib.crypto.Hash
const uuidV1 = require('uuid/v1')
var MerkleTools = require('merkle-tools')
const Datauri = require('datauri').sync
var moment = require('moment')
var _ = require('lodash')

function BlockcertsLib () {}

BlockcertsLib.prototype.sha256 = function (str) {
  return Hash.sha256(Buffer.from(str)).toString('hex')
}

BlockcertsLib.prototype.imageToUri = function (parent) {
  if (parent.image.indexOf('data:image') < 0 && parent.image.indexOf('http') < 0) {
    parent.image = Datauri(parent.image)
  }
}

BlockcertsLib.prototype.hash = function (normalized) {
  return this.sha256(utf8.encode(normalized))
}

BlockcertsLib.prototype.getUuid = function () {
  return 'urn:uuid:' + uuidV1()
}

BlockcertsLib.prototype.tplBuilder = function (obj) {
  if (obj.id.indexOf('run:uuid') < 0) {
    obj.id = this.getUuid()
  }

  if (obj.issuedOn.length === 0) {
    obj.issuedOn = moment().format()
  }

  var badge = obj.badge
  if (badge.id.indexOf('run:uuid') < 0) {
    badge.id = this.getUuid()
  }

  this.imageToUri(badge)
  this.imageToUri(badge.issuer)

  var r = []
  var parr = []

  obj.recipientList.forEach(e => {
    var recipientDoc = _.cloneDeep(obj)
    delete recipientDoc.recipientList
    recipientDoc.id = this.getUuid()
    recipientDoc.recipient.recipientProfile.name = e.name
    recipientDoc.recipient.recipientProfile.publicKey = e.publicKey
    recipientDoc.recipient.identity = e.identity
    parr.push(this.computeHash(BlockcertsLib.PrepareNormalize(recipientDoc)))
    r.push(recipientDoc)
  })

  return Promise.all(parr).then(values => {
    var merkleTools = new MerkleTools()
    values.forEach((e, i, a) => {
      r[i].signature.targetHash = e.hash
      merkleTools.addLeaf(e.hash)
    })
    merkleTools.makeTree()
    var merkleRoot = merkleTools.getMerkleRoot().toString('hex')
    r.forEach((e, i, a) => {
      var sig = r[i].signature
      sig.proof = merkleTools.getProof(i)
      sig.merkleRoot = merkleRoot
    })
    merkleTools.resetTree()
    return r
  })
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
  var self = this
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
        normalized: normalized,
        hash: self.hash(normalized)
      })
    })
  })
}

BlockcertsLib.PrepareNormalize = function (certRaw) {
  var cert = _.cloneDeep(certRaw)
  var expandContext = cert['@context']
  if (!expandContext.find(x => x.name === '@vocab')) {
    expandContext.push({
      '@vocab': 'http://fallback.org/'
    })
  }
  delete cert.signature
  return cert
}

module.exports = BlockcertsLib
