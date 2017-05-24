/* global describe it */
var BlockcertsLib = require('../blockcerts')
var chai = require('chai')
var assert = chai.assert
var fs = require('fs')
var bitcoreLib = require('bitcore-lib')
var Hash = bitcoreLib.crypto.Hash
// https://github.com/blockchain-certificates/cert-verifier-js
// var CertVerifierJs = require('cert-verifier-js')
// var CertificateVerifier = CertVerifierJs.CertificateVerifier
// var Certificate = CertVerifierJs.Certificate

const HASH_VALID_2 = '7d5ee19584a27a9bf7d558e0128a27e18f8d11ace3c99cd72423c9db6cbc50d7'

function getPrepareCert (path) {
  var certJson = JSON.parse(fs.readFileSync(path, 'utf8'))
  return BlockcertsLib.PrepareNormalize(certJson)
}

// https://github.com/blockchain-certificates/cert-verifier-js/blob/master/lib/verifier.js#L451
function toUTF8Data (string) {
  var utf8 = []
  for (var i = 0; i < string.length; i++) {
    var charcode = string.charCodeAt(i)
    if (charcode < 0x80) utf8.push(charcode)
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6),
        0x80 | (charcode & 0x3f))
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f))
    }
    // surrogate pair
    else {
      i++
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
        (string.charCodeAt(i) & 0x3ff))
      utf8.push(0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f))
    }
  }
  return utf8
}

describe('djcert lib test', function () {
  this.timeout(9000)

  it('should be valid with a valid proof', function () {
    var certJson = JSON.parse(fs.readFileSync('test/data/sample_cert-valid-2.0.json', 'utf8'))
    var bcerts = new BlockcertsLib()
    assert.isTrue(bcerts.validateProof(certJson.signature))
  })

  it('shoulb be true with UTF8Data', function () {
    var target = '測DLTDOJO試'
    var bufferFromUTF8Data = Buffer.from(toUTF8Data(target))
    assert.equal(Buffer.from(target, 'utf8').toString('hex'), bufferFromUTF8Data.toString('hex'))
    var bcerts = new BlockcertsLib()
    var t2 = Hash.sha256(bufferFromUTF8Data).toString('hex')
    assert.equal(bcerts.sha256(target), t2)
  })

  it('should be true wtih getUuid', function () {
    var bcerts = new BlockcertsLib()
    var id = bcerts.getUuid()
    assert.isString(id)
    assert.isTrue(id.indexOf('urn:uuid') === 0)
  })

  it('should be Undefined with signature removed', function () {
    var certJson = JSON.parse(fs.readFileSync('test/data/sample_cert-valid-2.0.json', 'utf8'))
    var result = BlockcertsLib.PrepareNormalize(certJson)
    assert.ok(result)
    assert.isUndefined(result['signature'])
  })

  it('should be equal with normalized.txt', function () {
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/sample_cert-valid-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.equal(data.normalized, fs.readFileSync('test/data/normalized-2.0.txt', 'utf8'))
    })
  })

  it('should be equal with targetHash in cert-vaild-2.0.json', function () {
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/sample_cert-valid-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.equal(data.hash, HASH_VALID_2)
      assert.equal(bcerts.sha256(data.normalized), HASH_VALID_2)
    })
  })

  it('should be equal with targetHash in signature', function () {
    var file = 'test/data/36c45f60-402b-11e7-9cb0-73294609d9a7.json'
    var bcerts = new BlockcertsLib()
    var certJson = JSON.parse(fs.readFileSync(file, 'utf8'))
    var targetHash = certJson.signature.targetHash
    var prepareNormalizeResult = BlockcertsLib.PrepareNormalize(certJson)
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.equal(data.hash, targetHash)
    })
  })

  it('should be notequal with a invalid tampered', function () {
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/invalid_tampered-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.notEqual(bcerts.sha256(data.normalized), HASH_VALID_2)
    }).catch(m => {
      assert.fail()
    })
  })

  it('should be invalid with invalid unmapped fields', function () {
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/sample_cert-valid-2.0.json')
    // var prepareNormalizeResult = getPrepareCert('test/data/invalid_unmapped_fields-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.fail()
    }).catch(err => {
      assert.ok(err)
    })
  })
})
