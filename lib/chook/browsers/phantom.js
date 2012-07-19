var phantom = require('phantom'),
	phantomInstance,

	// Hack to pass JSHint:
	// These vars are global within the scope of Phantom's page.evaluate
	document,
	window;

var run = function(config) {
	phantom.create(function(ph) {
		phantomInstance = ph;

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

					config.eventEmitter.emit(eventName, output);
				} else {
					config.eventEmitter.emit('log', msg);
				}

			});
			
			page.open(config.htmlPath, function(status) {
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
				
				page.evaluate(config.runner);
				
				evaluate(page, function (scripts) {
					window.chook.load_scripts(scripts);
				}, config.scripts);
			});
		});
	});
};

var exit = function() {
	phantomInstance.exit();
};

module.exports = function() {
	return {
		browser: {
			run: run,
			exit: exit
		}
	};
};