var chook = require('../lib/chook.js');

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