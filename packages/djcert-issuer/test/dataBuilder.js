var BlockcertsLib = require('../blockcerts')
var fs = require('fs')
var bcerts = new BlockcertsLib()
var r = bcerts.tplBuilder(JSON.parse(fs.readFileSync('badge-dltdojo-tpl.json', 'utf8')))
fs.writeFileSync('badge-dltdojo.json', JSON.stringify(r, null, 2))
