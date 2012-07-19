var chook = require('../lib/chook.js');

exports['chook'] = {
	setUp: function(done) {
		done();
	},
	'has public functions': function(test) {
		test.expect(3);
		test.equal(typeof chook.configure, 'function', 'should have a "configure" function.');
		test.equal(typeof chook.use, 'function', 'should have a "use" function.');
		test.equal(typeof chook.run, 'function', 'should have a "run" function.');
		test.done();
	},
	'has reporters': function(test) {
		test.expect(1);
		test.equal(typeof chook.reporters, 'object', 'should have reporters property');
		test.done();
	},
	'has browsers': function(test) {
		test.expect(1);
		test.equal(typeof chook.browsers, 'object', 'should have browsers property');
		test.done();
	}
};