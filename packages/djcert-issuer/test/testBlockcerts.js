/* global describe it */
var BlockcertsLib = require('../blockcerts')
var chai = require('chai')
var assert = chai.assert
var fs = require('fs')
const HASH_VALID_2 = '7d5ee19584a27a9bf7d558e0128a27e18f8d11ace3c99cd72423c9db6cbc50d7'

function getPrepareCert (path) {
  var certJson = JSON.parse(fs.readFileSync(path, 'utf8'))
  return BlockcertsLib.PrepareNormalize(certJson)
}

describe('djcert lib test', function () {
  this.timeout(9000)

  it('should be valid with a valid json file', function () {
    var certJson = JSON.parse(fs.readFileSync('test/data/sample_cert-valid-2.0.json', 'utf8'))
    var bcerts = new BlockcertsLib()
    assert.isTrue(bcerts.validateProof(certJson.signature))
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

  it('should be equal with targetHash', function () {
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/sample_cert-valid-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.equal(bcerts.hash(data.normalized), HASH_VALID_2)
    })
  })

  it('should be notequal with a invalid tampered', function () {
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/invalid_tampered-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.notEqual(bcerts.hash(data.normalized), HASH_VALID_2)
    }).catch(m => { assert.fail() })
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
