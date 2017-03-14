/**
 * CODE API
 * @version 1
 * @modified 2014 April 14
 */
var CODE = {
	test : new Object(),
	utils: new Object(),
	builder : new Object()
};

function callWorker(command, folder) {
	try {
		var worker = SystemWorker.exec(command, null, folder);
		
		return {
			result: worker.output.toString(),
			error: worker.error.toString()
		}
	}
	catch (e) {
		
	}
}

/**
 * Get all organizations
 * @public
 * @returns {Array}
 */
CODE.test.One = function get() {
	return "hiya";
};

/**
 * Check if relation "pass through" is valid — entity or entity collection at the other side
 * @public
 * @param {Entity|EntityCollection} The Wakanda object starting point
 * @param {String} String of dot/"." delimited relations
 * @returns {Boolean}
 */
CODE.utils.hasRecords = function hasRecords(reference, relations) {
	
	// relations param a valid string
	if ( relations && typeof relations !== "string" ) {
		return false
	}
		
	// reference param valid entity or entity collection
	if ( !(reference && (typeof reference.getStamp == "function" || typeof reference.count == "function" )) ) {
		return false
	}
	
	var items = relations.split(".");
	// last pass
	if ( items.length == 1 ) {
		// valid relation pass through
		try {
			if ( eval("reference." + items[0]) ) {
				return true;
			}
			else {
				return false;
			}
		} catch (e) {
			return false;
		}	
	}
	else {  // recurse
		try {
			if ( eval("reference." + items[0]) ) {
				var newRelations = items.splice(1);
				newRelations = newRelations.join(".");
				return hasRecords(eval("reference." + items[0]), newRelations);
			}
			else {
				return false;
			}
		} catch (e) {
			return false;
		}	
	}	
	
};

/**
 * Build one ractive page
 * @param {File} payload Everything needed to run a builder
 * @public
 * @returns {Array}
 */
CODE.builder.ractive1 = function buildOne(payload) {
//	return payload;
	// get the builder
	if (payload && payload.exists) {
		return
		// unzip payload
		callWorker('zip -ll -r ' + payload.name + ' templates views',payload.path);
		
		var
			projectName = payload.project,
			srcDir = payload.source,
			destDir = payload.dest;
		

		// the path to get to the resources project
		var codePath = ds.getModelFolder().path;

		// which project is this running in?
		var projPath = Folder(codePath).parent.path + projectName + '/';

		// require in bootstrap builder
		var bootstrap = require(codePath + "Extensions/builders/bootstrap/bootstrap_ractive.js");

		// run the bootstrap builder
		var results = bootstrap.run(projPath + 'WebFolder/' + srcDir + '/', projPath + 'WebFolder/' + destDir + '/');

		results
	}
	
	return results;
};


module.exports = CODE;
