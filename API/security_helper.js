﻿/* * This file is meant to be required and called from the bottom  * of every API.  It removes access to calls for which the current * session doesn't have access * * @example <caption>Paste this code at the bottom of your main API javascript sheet, replacing out arguments appropriately</caption> * require( (FileSystemSync("PROJECT").path.split('/').slice(0,FileSystemSync("PROJECT").path.split('/').length-2).join('/')) + '/AccessControl' + '/API/security_check.js' )("API",API); */exports.init = initAll;exports.controller = controller;/** * Secure access & control for particular revision of API actions * @param {String} module IDentifier for requested module * @param {Object} actions All actions provided by requested API * @return {Object} API revision with access control */function init(module,actions) {	// what is the url for the xhr request	var URL = require( (FileSystemSync("PROJECT").path.split('/').slice(0,FileSystemSync("PROJECT").path.split('/').length-2).join('/')) + '/AccessControl' + '/API/security_registry.js' ).path('AC');		// get permitted actions (via xhr except for this one place)		// allowed actions the same for all versions; future can be different by version	var xhr = require(FileSystemSync("EXTENSIONS_USER").path + "Modules/XHR");	var actionsAllowed = xhr.post(URL, "security", module).result;		/**	 * Recursively touch all properties on API	 * @param {Object} parent Object to iterate over	 * @param {String} path Breadcrumb to where this function is	 */	function iterate(parent,path) {				// non-null, really an object		if (parent && typeof parent == 'object' && typeof parent.hasOwnProperty == 'function') {			// keep track of where we are in the stack			if (path) {				path += '.';			}			else {				path = '';			}						for (var i in parent) {				iterate(parent[i], path + i);			}		}		// at a leaf, check if function not in action list, replace with dummy function that returns error object		// allow API.name (name of this api) and API.external (call to external APIs) to remain		//TODO: possibly change to only replace out functions and leave properties alone		else if (actionsAllowed.indexOf(path) == -1 && eval('typeof actions.' + path) == 'function') {			eval('actions.' + path + ' = accessDenied');		}	}//	debugger	// iterate over all possible actions in module object	iterate(actions);		// return actions currently logged in user can perform	return actions;};/** * Bring in all available revisions of API and check security * @param {String} module IDentifier for requested module * @param {Object} API All actions provided by requested API */function initAll(module,API) {	var apiDirectory = FileSystemSync("PROJECT").path + 'API/';	var i = 1;	while (File(apiDirectory + module + '_v' + i + '.js').exists) {		// get particular version of api methods		API.version.push(require(apiDirectory + module + '_v' + i + '.js'));				// add security restrictions to api methods		init(module,API.version[i - 1]);				// increment to next possible api revision		i++;	}		// take active api and tack on to top level	if (API.activeVersion && API.version[API.activeVersion - 1] != null) {		var __hasProp = {}.hasOwnProperty;		var __extends = function(child, parent) { 			for (var key in parent) { 				if (__hasProp.call(parent, key)) 					child[key] = parent[key]; 			}			function ctor() { 				this.constructor = child; 			} 			ctor.prototype = parent.prototype; 			child.prototype = new ctor(); 			child.__super__ = parent.prototype; 			return child; 		}		__extends(API,API.version[API.activeVersion - 1]);		var z = '';	}}/** * Generic error function */function accessDenied() {	return { 		'error': 401, 		'errorMessage': 'Unauthorized'	};}/** * Called externally (xhr): request handler comes in here * @param {Object} API The requested API * @param {HTTPRequest} request * @param {HTTPResponse} response * @return {JSON} */function controller (API, request, response) {	var 		call,		offset,		version,		method,		params,		fx;	// TODO: sometimes this debugger is needed for cross-project api calls	// debugger;		try {		// pull out version and method from URL		call = request.url.split('/');		// begins with /api as opposed to /<projectID>/api		offset = call[1] == 'api' ? 1 : 0;		version = call[3 - offset];		version = Number(version) == version ? version : API.activeVersion;		method = call.slice(4 - offset).join('.');				// grab any parameterss		params = (request && request.hasOwnProperty('body') && request.body.length) ? JSON.parse(request.body) : new Object();				// try to get the method requested		fx = eval('API.version[' + (version - 1) + '].' + method);	}	catch (e) {			}//	call = request.url.split('/');////	token = call[2]//	version = call[3];//	version = (Number(version) == version) ? version : API.activeVersion;//	//	// based on request params, call a method//	params = (request && request.hasOwnProperty('body') && request.body.length) ? JSON.parse(request.body) : new Object();//	try {//		fx = eval('API.version[' + (version - 1) + '].' + params.method);//	}//	catch (e) {//		//	}		// check gatekeeper security by...		// localhost	if (request.host.indexOf('localhost') == 0 || 		// whitelisted host		API.accessHost.indexOf(request.remoteAddress) != -1 ||		// debug token present		API.accessToken.indexOf(params.token) != -1) {				// this method exists, run it		if (typeof fx == 'function') {			response.contentType = 'application/json';			return JSON.stringify(fx.apply(this,params.arguments));		}	}};