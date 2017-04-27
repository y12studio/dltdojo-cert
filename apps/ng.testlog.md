### References
* dltdojo/apps/ng2bitcoin at master · y12studio/dltdojo  https://github.com/y12studio/dltdojo/tree/master/apps/ng2bitcoin
* angular/angular-cli: CLI tool for Angular https://github.com/angular/angular-cli
* angular - PhantomJS does not work with Karma in Angular2 project - Stack Overflow  http://stackoverflow.com/questions/42660902/phantomjs-does-not-work-with-karma-in-angular2-project

### ngred

2017-04-27T15:41:52+0800

```
$ ng version
@angular/cli: 1.0.1
node: 6.9.5
os: linux x64
$ ng new ngred
$ cd ngred
$ npm i lodash bitcore-lib intl -S
$ npm i @types/lodash karma-phantomjs-launcher -D
$ egrep 'shim|intl' src/polyfills.ts
import "core-js/client/shim"; // Evergreen requirements section
import 'intl';  // Run `npm install --save intl`.
$ egrep '[Pp]hantom' karma.conf.js
    require('karma-phantomjs-launcher'),
    browsers: ['PhantomJS'],
$ egrep 'es5' src/tsconfig.spec.json
    "target": "es5",
$ ng test
27 04 2017 16:14:24.511:WARN [karma]: No captured browser, open http://localhost:9876/
27 04 2017 16:14:24.521:INFO [karma]: Karma v1.4.1 server started at http://0.0.0.0:9876/
27 04 2017 16:14:24.522:INFO [launcher]: Launching browser PhantomJS with unlimited concurrency
27 04 2017 16:14:24.571:INFO [launcher]: Starting browser PhantomJS
27 04 2017 16:14:24.975:INFO [PhantomJS 2.1.1 (Linux 0.0.0)]: Connected on socket yMgeVUJ7dcSIVnzWAAAA with id 7919854
PhantomJS 2.1.1 (Linux 0.0.0): Executed 3 of 3 SUCCESS (0.091 secs / 0.144 secs)

// Invalid Host header issue
// --host 0.0.0.0 Not working · Issue #882 · webpack/webpack-dev-server  https://github.com/webpack/webpack-dev-server/issues/882
// ng serve --host 192.168.2.73
$ egrep 'serve' package.json
    "start": "ng serve --host 0.0.0.0",
$ npm start
> ngred@0.0.0 start /home/lin/git/dltdojo-cert/apps/ngred
> ng serve --host 0.0.0.0

** NG Live Development Server is running on http://0.0.0.0:4200 **
Hash: 8de9dada9f79cb05cf61                                                      Time: 8580ms
chunk    {0} polyfills.bundle.js, polyfills.bundle.js.map (polyfills) 567 kB {4} [initial] [rendered]
chunk    {1} styles.bundle.js, styles.bundle.js.map (styles) 65.2 kB {4} [initial] [rendered]
chunk    {2} main.bundle.js, main.bundle.js.map (main) 3.63 kB {3} [initial] [rendered]
chunk    {3} vendor.bundle.js, vendor.bundle.js.map (vendor) 2.45 MB [initial] [rendered]
chunk    {4} inline.bundle.js, inline.bundle.js.map (inline) 0 bytes [entry] [rendered]
webpack: Compiled successfully.
```

generate the bitcore component
```
$ npm run dltdojo:bundle
$ egrep 'dltdojo' .angular-cli.json
      "scripts": ["dltdojocert.lib.js"],
$ ng g c bitcore
```

build the project.
```
$ ng build
$ tree --du -h -I 'node_modules'
.
├── [ 11M]  dist
│   ├── [5.3K]  favicon.ico
│   ├── [ 672]  index.html
│   ├── [5.6K]  inline.bundle.js
│   ├── [5.7K]  inline.bundle.js.map
│   ├── [8.9K]  main.bundle.js
│   ├── [6.3K]  main.bundle.js.map
│   ├── [564K]  polyfills.bundle.js
│   ├── [681K]  polyfills.bundle.js.map
│   ├── [1.5M]  scripts.bundle.js
│   ├── [1.8M]  scripts.bundle.js.map
│   ├── [ 65K]  styles.bundle.js
│   ├── [ 80K]  styles.bundle.js.map
│   ├── [2.6M]  vendor.bundle.js
│   └── [3.2M]  vendor.bundle.js.map
├── [  61]  DltdojoCertLib.js
├── [4.7K]  e2e
│   ├── [ 297]  app.e2e-spec.ts
│   ├── [ 210]  app.po.ts
│   └── [ 193]  tsconfig.e2e.json
├── [1.2K]  karma.conf.js
├── [1.5K]  package.json
├── [ 756]  protractor.conf.js
├── [1.0K]  README.md
├── [1.5M]  src
│   ├── [ 11K]  app
│   │   ├── [   0]  app.component.css
│   │   ├── [ 128]  app.component.html
│   │   ├── [1000]  app.component.spec.ts
│   │   ├── [ 214]  app.component.ts
│   │   ├── [ 523]  app.module.ts
│   │   └── [5.3K]  bitcore
│   │       ├── [   0]  bitcore.component.css
│   │       ├── [ 120]  bitcore.component.html
│   │       ├── [ 635]  bitcore.component.spec.ts
│   │       └── [ 622]  bitcore.component.ts
│   ├── [4.0K]  assets
│   ├── [1.5M]  dltdojocert.lib.js
│   ├── [4.4K]  environments
│   │   ├── [  51]  environment.prod.ts
│   │   └── [ 387]  environment.ts
│   ├── [5.3K]  favicon.ico
│   ├── [ 292]  index.html
│   ├── [ 336]  main.ts
│   ├── [2.4K]  polyfills.ts
│   ├── [  80]  styles.css
│   ├── [1.1K]  test.ts
│   ├── [ 209]  tsconfig.app.json
│   ├── [ 302]  tsconfig.spec.json
│   └── [ 104]  typings.d.ts
├── [ 385]  tsconfig.json
└── [2.6K]  tslint.json

  12M used in 7 directories, 45 files
$ npm run dltdojo:build
$ tree --du -h dist
dist
├── [2.1M]  app.html
├── [5.3K]  favicon.ico
├── [ 784]  index.html
├── [1.5K]  inline.b0177f0729a4fff681b6.bundle.js
├── [ 11K]  main.d8638a8d6ba1c573c0d0.bundle.js
├── [174K]  polyfills.d1aea3e040f57187da8e.bundle.js
├── [1.5M]  scripts.9d7c8ccbb02a2b899410.bundle.js
├── [   0]  styles.d41d8cd98f00b204e980.bundle.css
└── [384K]  vendor.7bc3647375af77442ce6.bundle.js

 4.2M used in 0 directories, 9 files

```
