/* global describe it */
var djcertLib = require('../index')
var chai = require('chai')
var assert = chai.assert
var fs = require('fs')
var bitcoreLib = djcertLib.bitcoreLib
var BlockcertsLib = djcertLib.BlockcertLib
var MerkleTools = require('merkle-tools')
const HASH_VALID_2 = '7d5ee19584a27a9bf7d558e0128a27e18f8d11ace3c99cd72423c9db6cbc50d7'

function getPrepareCert (path) {
  var certJson = JSON.parse(fs.readFileSync(path, 'utf8'))
  return BlockcertsLib.PrepareNormalize(certJson)
}

describe('djcert lib test', function () {
  this.timeout(9000)
  it('new bitcore lib PrivateKey()', function () {
    var key = new bitcoreLib.PrivateKey()
    assert.ok(key)
  })

  it('validateProof', function () {
    var certJson = JSON.parse(fs.readFileSync('test/data/sample_cert-valid-2.0.json', 'utf8'))
    var bcerts = new BlockcertsLib()
    assert.isTrue(bcerts.validateProof(certJson.signature))
  })

  it('PrepareNormalize', function () {
    var certJson = JSON.parse(fs.readFileSync('test/data/sample_cert-valid-2.0.json', 'utf8'))
    var result = BlockcertsLib.PrepareNormalize(certJson)
    assert.ok(result)
    assert.isUndefined(result['signature'])
  })

  it('computeHash', function () {
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/sample_cert-valid-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.equal(data.normalized, fs.readFileSync('test/data/normalized-2.0.txt', 'utf8'))
      assert.equal(bcerts.hash(data.normalized), HASH_VALID_2)
    })
  })

  it('computeHash invalid tampered', function () {
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/invalid_tampered-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.notEqual(bcerts.hash(data.normalized), HASH_VALID_2)
    }).catch(m => { assert.fail() })
  })

  it('computeHash invalid unmapped fields', function () {
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
