var core = require('../lib/chook/core.js');

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

exports['configure'] = {
	setUp: function(done) {
		done();
	},
	'plugins can set scripts': function(test) {
		test.expect(1);

		var scripts = ['foo'];
		core.configure(function(){
			core.use({scripts: scripts});
		});

		test.equal(core.getScripts(), scripts);
		test.done();
	},
	'plugins can set browser': function(test) {
		test.expect(1);

		var browser = {
			run: function(){},
			exit: function(){}
		};
		core.configure(function(){
			core.use({browser: browser});
		});

		test.equal(core.getBrowser(), browser);
		test.done();
	},
	'plugins can set runner': function(test) {
		test.expect(1);

		var runner = function(){};
		core.configure(function(){
			core.use({runner: runner});
		});

		test.equal(core.getRunner(), runner);
		test.done();
	},
	'plugins can set reporter': function(test) {
		test.expect(1);

		var globalEventEmitter;

		var reporter = function(e){
			globalEventEmitter = e;
		};
		core.configure(function(){
			core.use({reporter: reporter});
		});

		test.equal(core.getGlobalEventEmitter(), globalEventEmitter);
		test.done();
	},
	'plugins cannot be set outside of a configure block': function(test) {
		test.expect(1);

		var scripts = ['foo'];
		core.use({scripts: scripts});

		test.notEqual(core.getScripts(), scripts);
		test.done();
	}
};