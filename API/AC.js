﻿/** * Public API variable */var AC = {};/** * Called internally: use as a module */var module = module || new Object();if (module && module.exports) {	module.exports = AC;}/** * Called externally (xhr): request handler comes in here */function controller (request, response) {	var 		params,		fx;	debugger;		// based on request params, call a method	params = (request && request.hasOwnProperty('body') && request.body.length) ? JSON.parse(request.body) : new Object();	fx = eval('AC.' + params.method);	if (typeof fx == 'function') {		response.contentType = 'application/json';		return JSON.stringify(fx.apply(this,params.arguments));	}};/** * API: public methods */AC.organization = {};AC.organization.getAll = function get() {	return ds.Organization.all();};AC.organization.removeAll = function remove() {	return ds.Organization.remove();};/** * Private functions, variables and CONSTANTS */function anonymous(xx) {	}// check security of this API (this is generic code that can be placed into any module)var securityCheck = require( (FileSystemSync("PROJECT").path.split('/').slice(0,FileSystemSync("PROJECT").path.split('/').length-2).join('/')) + '/AccessControl' + '/API/security_check.js' )("AC",AC);