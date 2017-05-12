var BlockcertsLib = require('../blockcerts')
var fs = require('fs')
var bcerts = new BlockcertsLib()
bcerts.tplBuilder(JSON.parse(fs.readFileSync('bcerts-dltdojo-tpl-2.0.json', 'utf8'))).then(r => {
  fs.writeFileSync('bcerts-dltdojo-2.0.json', JSON.stringify(r, null, 2))
})
