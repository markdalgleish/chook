// BUILT-IN REPORTERS:
// These can be used in a 'configure' block, e.g. chook.use(chook.reporters.dots());
module.exports = {

	dots: function() {
		return {
			reporter: function(e) {
				e.on('pass', function(msg){
					process.stdout.write('.');
				});

				e.on('fail', function(msg){
					process.stdout.write('f');
				});

				e.on('error', function(msg){
					process.stdout.write('e');
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
							console.log(failure.status.toUpperCase() + ': ' + failure.suiteName + ' - ' + failure.name +
								' (' + failure.error.name + (failure.error.message ? ': ' + failure.error.message : '') + ')');
							if (failure.error.stackArray) {
								failure.error.stackArray.forEach(function(item) {
									if (item.sourceURL.indexOf('phantomjs://') == -1) {
										var traceLine = '  ';
										if (item['function']) {
											traceLine += item['function'] + ': ';
										}
										traceLine += item['sourceURL'].replace('file://', '');
										traceLine += ':' + item.line;
										console.log(traceLine);
									}
								});
							}
							console.log('');

						});
					}
				});
			}
		};
	}

};