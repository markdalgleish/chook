/*
 * chook
 * https://github.com/markdalgleish/chook
 *
 * Copyright (c) 2013 Mark Dalgleish
 * Licensed under the MIT license.
 */

'use strict';

var core = require('./chook/core');

module.exports = {
	browsers: core.browsers,
	reporters: core.reporters,
	configure: core.configure,
	use: core.use,
	run: core.run
};