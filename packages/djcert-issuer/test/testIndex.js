var index = require('../index')
var assert = require('assert')
var bitcorelib = index.bitcorelib

  describe('bitcore lib test', function () {
    it('new PrivateKey()', function () {
      var key = new bitcorelib.PrivateKey()
      assert.ok(key)
    })
  })
