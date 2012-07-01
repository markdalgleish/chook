/*
 * chook
 * https://github.com/markdalgleish/chook
 *
 * Copyright (c) 2012 Mark Dalgleish
 * Licensed under the MIT license.
 */

var events = require('events'),
	path = require('path'),
	EventEmitter2 = require('eventemitter2').EventEmitter2,
	globalEventEmitter = new EventEmitter2(),
	configuring = false,
	scripts,
	browsers,
	browser,
	runner;

// Handle EventEmitter2's special 'error' event
globalEventEmitter.on('error', function(){});

exports.browsers = browsers = require('./chook/browsers');
exports.reporters = require('./chook/reporters');

exports.configure = function(func) {
	configuring = true;
	
	// Apply user settings
	func();
	
	// Apply defaults if user settings are incomplete
	if (browser === undefined) {
		browser = browsers.phantom().browser;
	}

	configuring = false;
};

exports.use = function(plugin) {
	if (!configuring) {
		return;
	}

	if (plugin.scripts !== undefined) {
		scripts = plugin.scripts;
	}

	if (plugin.browser !== undefined) {
		browser = plugin.browser;
	}

	if (typeof plugin.runner === 'function') {
		runner = plugin.runner;
	}

	if (typeof plugin.reporter === 'function') {
		plugin.reporter(globalEventEmitter);
	}
};

exports.run = function() {
	var eventEmitter = new EventEmitter2({
		wildcard: true
	});

	// Handle EventEmitter2's special 'error' event
	eventEmitter.on('error', function(){});

	browser.run({
		eventEmitter: eventEmitter,
		htmlPath: path.join(__dirname, 'chook/sandbox/index.html'),
		scripts: scripts,
		runner: runner
	});

	eventEmitter.on('*', function(output) {
		globalEventEmitter.emit(this.event, output);
	});

	return eventEmitter;
};