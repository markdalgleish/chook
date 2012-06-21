/*
 * chook
 * https://github.com/markdalgleish/chook
 *
 * Copyright (c) 2012 Mark Dalgleish
 * Licensed under the MIT license.
 */

var path = require('path'),
	phantom = require('phantom'),
	events = require('events'),
	globalEventEmitter = new events.EventEmitter(),
	scripts,
	runner,
	configReader,

	configuring = false,

	// Hack to pass JSHint, these vars are global within the scope of Phantom's page.evaluate
	document,
	window;

exports.configure = function(func) {
	configuring = true;
	func();
	configuring = false;
};

exports.use = function(plugin) {
	if (!configuring) {
		return;
	}

	if (plugin.scripts !== undefined) {
		scripts = plugin.scripts;
	}

	if (typeof plugin.runner === 'function') {
		runner = plugin.runner;
	}

	if (typeof plugin.reporter === 'function') {
		plugin.reporter(globalEventEmitter);
	}
};

exports.run = function() {
	var eventEmitter = new events.EventEmitter();

	if (typeof scripts === 'string') {
		if (typeof configReader === 'function') {
			scripts = configReader(scripts);
		}
	}
	
	phantom.create(function(ph) {
		ph.createPage(function(page) {
			var evaluate = function(page, func) {
				var args = [].slice.call(arguments, 2),
					fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
					
				page.evaluate(fn);
			};
			
			page.set('onConsoleMessage', function (msg) {
				var matches = msg.match(/^chook.([a-zA-Z0-9_]+):(.+)/),
					eventName,
					output;

				if (matches) {
					eventName = matches[1];
					output = JSON.parse(matches[2]);

					eventEmitter.emit(eventName, output);
					globalEventEmitter.emit(eventName, output);

					if (eventName === 'complete') {
						ph.exit(output.failed === 0 ? 0 : 1);
					}
				}

			});
			
			page.open(path.join(__dirname, 'runner/index.html'), function(status) {
				if (status !== "success") {
					ph.exit(1);
				}
				
				page.evaluate(function(){
					window.chook = {
						
						// Anything stored in results must be valid JSON
						results: {
							duration: undefined,

							total: 0,
							pass: 0,
							fail: 0,
							error: 0,

							suites: []
						},
						
						load_scripts: function load_scripts(scripts) {
							var load_script = function load_script(src) {
								if (!src) {
									window.chook.run();
									return;
								}

								var s = document.createElement('script');
								s.type = 'text/javascript';
								s.src = src;
								s.onload = function() {
									load_script(scripts.shift());
								};

								var script0 = document.getElementsByTagName('script')[0];
								script0.parentNode.insertBefore(s, script0);
							};

							load_script(scripts.shift());
						}
					};

				});
				
				page.evaluate(runner);
				
				evaluate(page, function (scripts) {
					window.chook.load_scripts(scripts);
				}, scripts);
			});
		});
	});	

	return eventEmitter;
};

// BUILT-IN REPORTERS:
// These can be used in a 'configure' block, e.g. chook.use(chook.reporters.dots());
exports.reporters = {

	dots: function() {
		return {
			reporter: function(e) {
				e.on('pass', function(msg){
					process.stdout.write('.');
				});

				e.on('fail', function(msg){
					process.stdout.write('F');
				});

				e.on('error', function(msg){
					process.stdout.write('E');
				});

				e.on('complete', function(){
					console.log(''); // Inserts a new line
				});
			}
		};
	},

	// TODO: Make this smarter by actually reading the full status object, not pushing to an array
	summary: function() {
		return {
			reporter: function(e) {
				var failures = [];

				e.on('fail', function(msg){
					failures.push(msg);
				});

				e.on('error', function(msg){
					failures.push(msg);
				});

				e.on('complete', function(status){
					console.log('');
					console.log('TEST SUMMARY');
					console.log('************');

					console.log('total: ' + status.total);
					console.log('pass: ' + status.pass);
					console.log('fail: ' + status.fail);
					console.log('error: ' + status.error);
					console.log('duration: ' + status.duration);

					if (failures.length > 0) {
						console.log('');
						console.log('TEST FAILURES');
						console.log('*************');

						failures.forEach(function(failure){
							console.log(failure.status.toUpperCase() + ': ' + failure.name +
								' (' + failure.error.name + (failure.error.message ? ': ' + failure.error.message : '') + ')');
						});
					}
				});
			}
		};
	}

};
