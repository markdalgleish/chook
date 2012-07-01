var Zombie = require('zombie'),

	// Hack to pass JSHint:
	// These vars are global within the scope of Zombie's browser.evaluate
	document,
	window,
	alert;

var run = function(config) {
	Zombie.visit('file://' + config.htmlPath, function(err, browser) {
		var evaluate = function(func) {
			var args = [].slice.call(arguments, 1),
				fn = "(" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");";

			browser.evaluate(fn);
		};

		browser.onalert(function (msg) {
			var matches = msg.match(/^chook.([a-zA-Z0-9_]+):(.+)/),
				eventName,
				output;

			if (matches) {
				eventName = matches[1];
				output = JSON.parse(matches[2]);

				config.eventEmitter.emit(eventName, output);
			}

		});

		evaluate(function(){
			//Zombie doesn't detect console messages so we'll turn them into alerts
			(function(){
				console.log = function(msg) {
					alert(msg);
				};
			}());

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
		
		evaluate(config.runner);
		
		evaluate(function (scripts) {
			window.chook.load_scripts(scripts);
		}, config.scripts);
	});
};

module.exports = function() {
	return {
		browser: {
			run: run
		}
	};
};