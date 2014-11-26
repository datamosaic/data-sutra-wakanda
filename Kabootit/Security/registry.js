﻿/* * This file provides registered actions per credentials and provides how to  * access the projects (what URL they are being served from) */ // variable to denote if in server or developer (manual toggle)var isDeveloper = true;// when running linux, must be serverif (os.isLinux) {	isDeveloper = false;}// is this production or staging?  flag in .waSolution filevar isProduction = true;/*** Aggregate actions, allURLs, paths (on disk), and allRoutes for all included projects*/var allActions = new Object();var allURLs = {	external : {		production: new Object(),		staging: new Object()	},	internal : {		production: new Object(),		staging: new Object()	}}var allIDs = new Object();var allHomes = new Object();var allPaths = new Object();var allRoutes = new Object();var allRoutesWhitelist = new Object();	// get solution's projectsvar configPath = FileSystemSync("SOLUTION").path;var solutionDir = Folder(configPath);for (var j in solutionDir.files) {	if (solutionDir.files[j].extension === "waSolution") {		var solutionFile = File(solutionDir.files[j].path);		break	}}	configPath = configPath.split('/');configPath.pop();configPath.pop();configPath = configPath.join('/') + '/';	var projects = JSON.parse(XmlToJSON(solutionFile.toString(), "json-bag", "solution"));	// get all projects to be operated onfor (var i in projects) {	// only work on project node (weird issue with __CDATA)	if (i.toLowerCase() == 'project') {		// loop over all projects		for (var j = 0; j < projects[i].length; j++) {			// check that this project has a non-null name			if (projects[i][j].hasOwnProperty('path') && projects[i][j].path) {				var regex =  new RegExp(/\((.*)\)/);				var project = projects[i][j].path.split('/');				var id = regex.exec(project[2]) ? regex.exec(project[2])[1].toLowerCase() : '';				var apiSecure = configPath + project[1] + '/Kabootit/Settings/' + id + '.json';				var security = File(apiSecure);				var cmsData = configPath + project[1] + '/Kabootit/Settings/cms.json';				var data = File(cmsData);									if (security.exists && data.exists) {					try {						var api = JSON.parse(security.toString());						var routes = JSON.parse(data.toString());												// go grab actions (TODO: move this to the version level)						var v1API = File(configPath + project[1] + '/Kabootit/API/' + id + '_1.js');						// make sure there is a place to store actions						if (!(api.actions instanceof Array)) {							api.actions = new Array();						}						if (v1API.exists) {							v1API = v1API.toString();							var derivedActions;							var derivedRegex = /@public[\s\S]*?\*\/\s+(.*?)(?:\s+)?=/gi;							while (derivedActions = derivedRegex.exec(v1API)) {								var methodName = derivedActions[1].split('.').slice(1).join('.');								if (api.actions.indexOf(methodName) == -1) {									api.actions.push(methodName);								}							}						}						// assign out						allActions[api.name] = api.actions;						allURLs.external.production[api.name] = api.path.production;						allURLs.external.staging[api.name] = api.path.staging;						allURLs.internal.production[api.name] = api.path.productionInternal;						allURLs.internal.staging[api.name] = api.path.stagingInternal;						allHomes[api.name.toLowerCase()] = routes.home;						allIDs[/\/\/(.*?)\./.exec(api.path.production)[1]] = api.name.toLowerCase();						allIDs[/\/\/(.*?)\./.exec(api.path.staging)[1]] = api.name.toLowerCase();						allPaths[api.name.toLowerCase()] = configPath + project[1];						allRoutes[api.name.toLowerCase()] = routes.routes || new Array();						allRoutesWhitelist[api.name.toLowerCase()] = routes.noLoginRequired || new Array();					}					catch (e) {											}				}			}		}	}	else if (i.toLowerCase() == 'kabootit') {		// loop over array		for (var j = 0; j < projects[i].length; j++) {			// check that this project has a non-null name			if (projects[i][j].hasOwnProperty('production')) {				isProduction = eval(projects[i][j].production);			}		}	}}// is this production or not?// var isProduction = false;var stageProd = isProduction ? 'production' : 'staging';/** * Get project name (module) from request host *  * @param {String}	host The host used to request the page * @return {String} Module identifier */function getProject(host) {	var id;		if (host && host.length) {		// get port number and use that to tell what project is		if (isDeveloper) {			var port = application.httpServer.port;			// host.split(':')[1];						// look through internal urls for requested port			if (isProduction) {				for (var i in allURLs.internal.production) {					if (allURLs.internal.production[i].indexOf(':' + port) != -1) {						id = i;						break					}				}			}			else {				for (var i in allURLs.internal.staging) {					if (allURLs.internal.staging[i].indexOf(':' + port) != -1) {						id = i;						break					}				}			}						}		// get host name and use that to tell what project is		else {			var idLong = host.split('.')[0].toLowerCase();			id = allIDs[idLong];		}	}		return id;}// called in security_check via requirevar module = module || new Object();if (module && module.exports) {	/**	 * Get information about this server	 * @return {Object}	 */	module.exports.getServer = function getServer() {		return {			developer: isDeveloper,			type: stageProd,			os: (os.isLinux ? 'Linux' : (os.isMac ? 'Mac' : (os.isWindows ? 'Windows' : 'Commodore 64')))		};	};			/**	 * Home page for requested project	 *	 * @param {String}	host The host used to request the page	 * @param {String}  module IDentifier for requested module	 * @return {String}	 */	module.exports.homePage = function homePage(host,module) {				// try and figure out what project we're in		var id2 = getProject(host);				// id specified		if (module && allHomes.hasOwnProperty(module.toLowerCase())) {			return allHomes[module.toLowerCase()];		}		// determine id basd on url requested		else if (id2 && allHomes.hasOwnProperty(id2.toLowerCase())) {			return allHomes[id2.toLowerCase()];		}	};		/**	 * Actions allowed per API; called via xhr	 *	 * @param {HTTPRequest} request	 * @param {HTTPResponse} response	 * @return {JSON}	 */	module.exports.actions = function actions(request, response) {		var id = (request && request.hasOwnProperty('body') && request.body.length) ? request.body : '';				// sometimes data is trapped inside the little body		try {			var dejson = JSON.parse(id);			id = dejson;		}		catch (e) {					}				response.contentType = 'application/json';			// this module exists, grab its possible api actions		if (id && allActions.hasOwnProperty(id)) {			return JSON.stringify(allActions[id]);		}		// return nothing		else {			return JSON.stringify(new Array());		}	};		/**	 * How to reference each project (URL)	 * 	 * @param {String}  module IDentifier for requested module	 * @param {Boolean} [internal] Skip any gateway external and directly access by port	 * @return {String} Host (including port, if any)	 */	module.exports.path = function project(module,internal) {		// some check to see if in internal		if (isDeveloper || internal) {			return allURLs.internal[stageProd][module.toUpperCase()];		}		else {			return allURLs.external[stageProd][module.toUpperCase()];		}	};		/**	 * How to reference each project (URL)	 * 	 * @param {Boolean} [internal] Skip any gateway external and directly access by port	 * @return {Object} All URLs for the projects	 */	module.exports.pathAll = function pathAll(internal) {		// some check to see if in internal		if (isDeveloper || internal) {			return allURLs.internal[stageProd];		}		else {			return allURLs.external[stageProd];		}	};		/**	 * How to reference each project (filesystem)	 * 	 * @param {String}  module IDentifier for requested module	 * @return {String} Path to project on filesystem	 */	module.exports.projectPath = function projectPath(id) {		return allPaths[id.toLowerCase()];	};		/**	 * Allowable routes through SPA controller	 * 	 * @param {String}  module IDentifier for requested module	 * @param {String}	host The host used to request the page	 * @return {Array} Allowable routes for project	 */	module.exports.routes = function routes(id,host) {		// if no allRoutes specified for first identifier, probably is single-project solution; return allRoutes for "app"				// id specified		if (id && allRoutes.hasOwnProperty(id.toLowerCase())) {			return {				all : allRoutes[id.toLowerCase()],				noLogin : allRoutesWhitelist[id.toLowerCase()]			}		}				// try and figure out what project we're in		var id2 = getProject(host);				// determine id basd on url requested		if (id2 && allRoutes.hasOwnProperty(id2.toLowerCase())) {			return {				all : allRoutes[id2.toLowerCase()],				noLogin : allRoutesWhitelist[id2.toLowerCase()]			}		}		// fallback for when can't tell what requested		return {			all : allRoutes.app,			noLogin : allRoutesWhitelist.app		}	};}