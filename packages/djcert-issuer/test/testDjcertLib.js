/* global describe it */
var djcertLib = require('../index')
var chai = require('chai')
var assert = chai.assert
var fs = require('fs')
var bitcoreLib = djcertLib.bitcoreLib
var BlockcertsLib = djcertLib.BlockcertLib

function getPrepareCert (path) {
  var certJson = JSON.parse(fs.readFileSync(path, 'utf8'))
  return BlockcertsLib.PrepareNormalize(certJson)
}

describe('djcert lib test', function () {
  it('new bitcore lib PrivateKey()', function () {
    var key = new bitcoreLib.PrivateKey()
    assert.ok(key)
  })

  it('PrepareNormalize', function () {
    var certJson = JSON.parse(fs.readFileSync('test/data/sample_cert-valid-2.0.json', 'utf8'))
    var result = BlockcertsLib.PrepareNormalize(certJson)
    assert.ok(result)
    assert.isUndefined(result['signature'])
  })

  it('computeHash', function () {
    this.timeout(5000)
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/sample_cert-valid-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.equal(data.hash, '7d5ee19584a27a9bf7d558e0128a27e18f8d11ace3c99cd72423c9db6cbc50d7')
    })
  })

  it('computeHash invalid tampered', function () {
    this.timeout(5000)
    var bcerts = new BlockcertsLib()
    var prepareNormalizeResult = getPrepareCert('test/data/invalid_tampered-2.0.json')
    return bcerts.computeHash(prepareNormalizeResult).then(data => {
      assert.notEqual(data.hash, '7d5ee19584a27a9bf7d558e0128a27e18f8d11ace3c99cd72423c9db6cbc50d7')
    }).catch(err => { assert.fail() })
  })

  it('computeHash invalid unmapped fields', function () {
    this.timeout(5000)
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
