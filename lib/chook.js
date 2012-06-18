/*
 * chook
 * https://github.com/markdalgleish/chook
 *
 * Copyright (c) 2012 Mark Dalgleish
 * Licensed under the MIT license.
 */

var path = require('path'),
	events = require('events'),
	phantom = require('phantom'),
	runner,
	configReader,

	// Hack to pass JSHint, these vars are global within the scope of Phantom's page.evaluate
	document,
	window;

exports.use = function(plugin) {
	if (typeof plugin.runner === 'function') {
		runner = plugin.runner;
	}
	if (typeof plugin.configReader === 'function') {
		configReader = plugin.configReader;
	}
};

exports.run = function(scripts) {
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
					NULL_ERROR = null, // TODO: Add error support for events
					eventName,
					output;

				if (matches) {
					eventName = matches[1];
					output = JSON.parse(matches[2]);

					eventEmitter.emit(eventName, NULL_ERROR, output);

					if (eventName === 'complete') {
						ph.exit(output.failed === 0 ? 0 : 1);
					}
				}

			});
			
			page.open(path.join(__dirname, 'runner/index.html'), function(status) {
				if (status !== "success") {
					console.log("can't load the address!");
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
