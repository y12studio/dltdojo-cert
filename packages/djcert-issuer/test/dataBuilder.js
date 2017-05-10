var BlockcertsLib = require('../blockcerts')
var fs = require('fs')
var bcerts = new BlockcertsLib()
bcerts.imageUriBuilder(JSON.parse(fs.readFileSync('dltdojo-issuer.json', 'utf8'))).then(r => {
  fs.writeFileSync('dltdojo-issuer-final.json', JSON.stringify(r, null, 2))
})
