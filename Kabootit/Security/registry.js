﻿/* * This file provides registered actions per credentials and provides how to  * access the projects (what URL they are being served from) */  // variable to denote if in server or developer var isDeveloper = true; /** * Aggregate actions, allURLs, paths (on disk), and allRoutes for all included projects */var allActions = new Object();var allURLs = {	server : new Object(),	developer : new Object()}var allHomes = new Object();var allPaths = new Object();var allRoutes = new Object();var allRoutesWhitelist = new Object();	// get solution's projectsvar configPath = FileSystemSync("SOLUTION").path;var solutionDir = Folder(configPath);for (var j in solutionDir.files) {	if (solutionDir.files[j].extension === "waSolution") {		var solutionFile = File(solutionDir.files[j].path);		break	}}	configPath = configPath.split('/');configPath.pop();configPath.pop();configPath = configPath.join('/') + '/';	var projects = JSON.parse(XmlToJSON(solutionFile.toString(), "json-bag", "solution"));	// get all projects to be operated onfor (var i in projects) {	// only work on project node (weird issue with __CDATA)	if (i.toLowerCase() == 'project') {		// loop over all projects		for (var j = 0; j < projects[i].length; j++) {			// check that this project has a non-null name			if (projects[i][j].hasOwnProperty('path') && projects[i][j].path) {				var regex =  new RegExp(/\((.*)\)/);				var project = projects[i][j].path.split('/');				var id = regex.exec(project[2]) ? regex.exec(project[2])[1].toLowerCase() : '';				var apiSecure = configPath + project[1] + '/Kabootit/Security/' + id + '.json';				var security = File(apiSecure);									if (security.exists) {					try {						var api = JSON.parse(security.toString());												// go grab actions (TODO: move this to the version level)						var v1API = File(configPath + project[1] + '/Kabootit/API/' + id + '_1.js')						// make sure there is a place to store actions						if (!(api.actions instanceof Array)) {							api.actions = new Array();						}						if (v1API.exists) {							v1API = v1API.toString();							var derivedActions							var derivedRegex = /@public[\s\S]*?\*\/\s+(.*?)(?:\s+)?=/gi;							while (derivedActions = derivedRegex.exec(v1API)) {								var methodName = derivedActions[1].split('.').slice(1).join('.');								if (api.actions.indexOf(methodName) == -1) {									api.actions.push(methodName);								}							}						}						// assign out						allActions[api.name] = api.actions;						allURLs.server[api.name] = api.path.server;						allURLs.developer[api.name] = api.path.developer;						allHomes[api.name.toLowerCase()] = api.home;						allPaths[api.name.toLowerCase()] = configPath + project[1];						allRoutes[api.name.toLowerCase()] = api.routes || new Array();						allRoutesWhitelist[api.name.toLowerCase()] = api.noLoginRequired || new Array();					}					catch (e) {											}				}			}		}	}}/** * Get project name (module) from request host *  * @param {String}	host The host used to request the page * @return {String} Module identifier */function getProject(host) {	var id		// get port number and use that to tell what project is	if (isDeveloper) {		var port = host.split(':')[1];					// look through developer urls for requested port		for (var i in allURLs.developer) {			if (allURLs.developer[i].indexOf(port) != -1) {				id = i;			}		}	}	// get host name and use that to tell what project is	else {		id = host.split('.')[0].toLowerCase()	}		return id}// called in security_check via requirevar module = module || new Object();if (module && module.exports) {	/**	 * Home page for requested project	 *	 * @param {String}	host The host used to request the page	 * @param {String}  module IDentifier for requested module	 * @return {String}	 */	module.exports.homePage = function homePage(host,module) {		// try and figure out what project we're in		var id2 = getProject(host);				// id specified		if (module && allHomes.hasOwnProperty(module.toLowerCase())) {			return allHomes[module.toLowerCase()];		}		// determine id basd on url requested		else if (id2 && allHomes.hasOwnProperty(id2.toLowerCase())) {			return allHomes[id2.toLowerCase()]		}	}		/**	 * Actions allowed per API; called via xhr	 *	 * @param {HTTPRequest} request	 * @param {HTTPResponse} response	 * @return {JSON}	 */	module.exports.actions = function actions(request, response) {		var id = (request && request.hasOwnProperty('body') && request.body.length) ? request.body : '';				// sometimes data is trapped inside the little body		try {			var dejson = JSON.parse(id);			id = dejson;		}		catch (e) {					}				response.contentType = 'application/json';			// this module exists, grab its possible api actions		if (id && allActions.hasOwnProperty(id)) {			return JSON.stringify(allActions[id]);		}		// return nothing		else {			return JSON.stringify(new Array());		}	}		/**	 * How to reference each project (URL)	 * 	 * @param {String}  module IDentifier for requested module	 * @return {String} Host (including port, if any)	 */	module.exports.path = function project(module) {		// some check to see if in developer		if (isDeveloper) {			return allURLs.developer[module];		}		else {			return allURLs.server[module];		}	}		/**	 * How to reference each project (filesystem)	 * 	 * @param {String}  module IDentifier for requested module	 * @return {String} Path to project on filesystem	 */	module.exports.projectPath = function projectPath(id) {		return allPaths[id.toLowerCase()];	}		/**	 * Allowable routes through SPA controller	 * 	 * @param {String}  module IDentifier for requested module	 * @param {String}	host The host used to request the page	 * @return {Array} Allowable routes for project	 */	module.exports.routes = function routes(id,host) {		// if no allRoutes specified for first identifier, probably is single-project solution; return allRoutes for "app"				// try and figure out what project we're in		var id2 = getProject(host);				// id specified		if (id && allRoutes.hasOwnProperty(id.toLowerCase())) {			return {				all : allRoutes[id.toLowerCase()],				noLogin : allRoutesWhitelist[id.toLowerCase()]			}		}		// determine id basd on url requested		else if (id2 && allRoutes.hasOwnProperty(id2.toLowerCase())) {			return {				all : allRoutes[id2.toLowerCase()],				noLogin : allRoutesWhitelist[id2.toLowerCase()]			}		}		// fallback for when can't tell what requested		return {			all : allRoutes.app,			noLogin : allRoutesWhitelist.app		}	}}