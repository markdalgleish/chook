var events = require('events'),
	path = require('path'),
	EventEmitter2 = require('eventemitter2').EventEmitter2,
	configuring = false,
	scripts,
	browsers,
	browser,
	runner;

var globalEventEmitter = new EventEmitter2();
// Handle EventEmitter2's special 'error' event
globalEventEmitter.on('error', function(){});
globalEventEmitter.on('complete', function() {
	browser.exit();
});

exports.browsers = browsers = require('./browsers');
exports.reporters = require('./reporters');

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
		htmlPath: path.join(__dirname, 'sandbox/index.html'),
		scripts: scripts,
		runner: runner
	});

	eventEmitter.on('*', function(output) {
		globalEventEmitter.emit(this.event, output);
	});

	return eventEmitter;
};

// Expose vars for testing
exports.getGlobalEventEmitter = function() { return globalEventEmitter; };
exports.getBrowser = function() { return browser; };
exports.getScripts = function() { return scripts; };
exports.getRunner = function() { return runner; };