var core = require('../lib/chook/core.js');

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