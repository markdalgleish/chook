'use strict';

var reporters = require('../lib/chook/reporters.js'),
	events = require('events');

var oldConsoleLog,
	lastConsoleMessage,
	oldStdout,
	lastStdoutMessage;

exports['reporters'] = {
	setUp: function(done) {
		oldConsoleLog = console.log;
		oldStdout = process.stdout.write;

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
		process.stdout.write = oldStdout;
		done();
	}
};