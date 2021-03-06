﻿/*
























 * RethinkDB via Recli
 * http://rethinkdb.com/
 * https://github.com/stiang/recli
*/

// system worker
var worker = require("SystemWorker");


// defaults
var OPTIONS = { 	"-h": "localhost",  // host
					"-p": "28015",  // host
					"-d": "test" };		// database


// exports
exports.recli = function(expression, options){

	// input
	options 	= options || OPTIONS;
	var input	= "recli -r"
			 	+ " -h " + options["-h"]
				+ " -p " + options["-p"]
				+ " -d " + options["-d"]
				+ " " + expression;
	// execute
	return worker.execute(input);
};