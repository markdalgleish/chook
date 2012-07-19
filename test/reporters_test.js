var reporters = require('../lib/chook/reporters.js'),
	events = require('events');

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

var oldConsoleLog,
	lastConsoleMessage,
	oldStdout,
	lastStdoutMessage;

exports['reporters'] = {
	setUp: function(done) {
		oldConsoleLog = console.log;
		oldStdOut = process.stdout.write;

		console.log = function(msg) {
			lastConsoleMessage = msg;
		};

		process.stdout.write = function(msg) {
			lastStdoutMessage = msg;
		};

		done();
	},
	'dots reporter handles events': function(test) {
		test.expect(4);

		var e = new events.EventEmitter();
		reporters.dots().reporter(e);

		e.emit('pass');
		test.equal(lastStdoutMessage, '.');

		e.emit('fail');
		test.equal(lastStdoutMessage, 'f');

		e.emit('error');
		test.equal(lastStdoutMessage, 'e');

		e.emit('complete');
		test.equal(lastConsoleMessage, '');

		test.done();
	},
	tearDown: function(done) {
		console.log = oldConsoleLog;
		process.stdout.write = oldStdOut;
		done();
	}
};