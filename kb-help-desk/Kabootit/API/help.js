/**































































































































































































































 * Boilerplate code (virtually the same for all APIs)
 * START
 */

/**
 * Called externally (xhr): request handler enters here
 * NOTE: must be uniquely named
 * @param {HTTPRequest} request
 * @param {HTTPResponse} response
 * @return {JSON}
 */
function helpController (request, response) {
	var
		call,
		offset,
		version,
		method,
		params,
		fx;

	try {
		// pull out version and method from URL
		call = request.url.split('/');
		// begins with /api as opposed to /<projectID>/api
		offset = call[1] == 'api' ? 1 : 0;
		version = call[3 - offset];
		version = Number(version) == version ? version : HELP.activeVersion;
		method = call.slice(4 - offset).join('.');

		// grab any parameters
		params = (request && request.hasOwnProperty('body') && request.body.length) ? JSON.parse(request.body) : new Object();

		// try to get the method requested
		fx = eval('HELP.version[' + (version - 1) + '].' + method);
	}
	catch (e) {

	}

	// check gatekeeper security by...
		// localhost
	if (request.host.indexOf('localhost') == 0 ||
		// whitelisted host
		HELP.accessHost.indexOf(request.remoteAddress) != -1 ||
		// debug token present
		HELP.accessToken.indexOf(params.token) != -1) {

		// this method exists, run it
		if (typeof fx == 'function') {
			response.contentType = 'application/json';

			// promote with full rights
			var token = currentSession().promoteWith('Admin');

			// run function as superuser
			var results = fx.apply(this,params.arguments);

			// json-ify results while still have full access
			var resultCereal = JSON.stringify(results);

			// demote
			currentSession().unPromote(token);

			return resultCereal;

		}
	}

	// something not right, error out
	response.contentType = 'application/json';
	return JSON.stringify(accessDenied());
};

/**
 * API object
 */
var HELP = {
	name : 'HELP',
	// all possible incarnations of this API
	version : new Array(),
	// default to version 1 if nothing specified
	activeVersion : 1,
	// external access allowed from following tokens
	accessToken : new Array(),
	// access allowed without token from following hosts
	accessHost : new Array()
}

/**
 * Called from this project (require), export
 */
var module = module || new Object();
if (module && module.exports) {
	module.exports = HELP;
}

// what is the url for the xhr request (will be different for dev/deployed) (A + C trick so not accidentally replaced)
var URL = (SECURITY || require( (FileSystemSync("PROJECT").path.split('/').slice(0,FileSystemSync("PROJECT").path.split('/').length-2).join('/')) + '/Security/Kabootit/Security/registry.js' )
	).path('A' + 'C',true);

// get permitted actions (via xhr except for this one place)
	// allowed actions the same for all versions; future can be different by version
var actionsAllowed = XHR.post(URL, "security", "HELP").result;

/**
 * Check if logged in user can perform this call
 * @param {String} path The scoped method we're trying to run
 * @return {Boolean} Can this method be run or not
 */
function accessCheck(path,fx) {
	// no access, fail
	if (actionsAllowed.indexOf(path) == -1) {
		return accessDenied;
	}
	// run
	else {
		return fx;
	}
}

/**
 * Generic error function
 */
function accessDenied() {
	return {
		'error': 401,
		'errorMessage': 'Unauthorized'
	};
}

/**
 * Bring in all available revisions of API and check security
 * @param {String} module IDentifier for requested module
 * @param {Object} API All actions provided by requested API
 */
function init(module,API) {
	var apiDirectory = FileSystemSync("PROJECT").path + 'Kabootit/API/';
	var i = 1;

	// lower case file names
	if (module) {
		module = module.toLowerCase();
	}

	while (File(apiDirectory + module + '_' + i + '.js').exists) {
		/**
		 * Iterate down through api and replace all functions with check to see if can run
		 * @param node Node of object; only functions are changed
		 * @param {String} path The location in the api
		 */
		function iterate(node,path) {
			if (typeof node == 'object') {
				if (path) {
					path = path + '.';
				}
				else {
					path = '';
				}

				for (var i in node) {
					// replace function with security-checked version
					if (typeof node[i] == 'function') {
						node[i] = accessCheck(path + i,node[i]);
					}
					// non-null object
					else if (node[i] && typeof node[i] == 'object') {
						iterate(node[i],path + i);
					}
				}
			}
		}

		// get api version
		var ver = require(apiDirectory + module + '_' + i + '.js');

		// add security checks
		iterate(ver);

		// push this revision of the api in
		API.version.push(ver);

		// increment to next possible api revision
		i++;
	}

	// take active api and tack on to top level
	if (API.activeVersion && API.version[API.activeVersion - 1] != null) {
		var __hasProp = {}.hasOwnProperty;
		var __extends = function(child, parent) {
			for (var key in parent) {
				if (__hasProp.call(parent, key))
					child[key] = parent[key];
			}
			function ctor() {
				this.constructor = child;
			}
			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		}
		__extends(API,API.version[API.activeVersion - 1]);
	}
}

/**
 * Boilerplate code (virtually the same for all APIs)
 * END
 */


///// TO CREATE NEW API
//
// 1) Find/replace in this file 'HELP' with whatever the API you are creating
// 2) Change below values
//
///// INSTRUCTIONS


/**
 * Whitelisted developer tokens
 */
HELP.accessToken.push('1111');

/**
 * Whitelisted hosts
 */
// HELP.accessHost.push('8.8.4.4');

/**
 * Set active version of API
 */
//HELP.activeVersion = 2;

/**
 * Pull in numbered versions (HELP_v1.js, HELP_v2.js, ..., HELP_vn.js)
 */
init('HELP',HELP);