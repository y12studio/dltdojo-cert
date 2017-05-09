/* global describe it */
var djcertLib = require('../index')
var chai = require('chai')
var assert = chai.assert
var bitcoreLib = djcertLib.bitcoreLib


describe('djcert lib test', function () {
  this.timeout(9000)
  it('should be ok with bitcore lib PrivateKey()', function () {
    var key = new bitcoreLib.PrivateKey()
    assert.ok(key)
  })

})
