# chook

Headless, framework-agnostic unit test runner for Node.js [![Build Status](https://secure.travis-ci.org/markdalgleish/chook.png)](http://travis-ci.org/markdalgleish/chook)

## Getting Started
Install Chook with: `npm install chook`

Install a test framework adapter. Currently only JsTestDriver has an adapter. Install it with: `npm install https://github.com/markdalgleish/chook-jstestdriver/tarball/master`

```javascript
var chook = require('chook'),
	chook_jstestdriver = require('chook-jstestdriver');

chook.configure(function(){
	chook.use( chook_jstestdriver({configPath: '/path/to/JsTestDriver.conf'}) );
});

chook.run().on('complete', function(results) {
	console.log(results);
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## License
Copyright (c) 2012 Mark Dalgleish  
Licensed under the MIT license.
