﻿/** * Default entry point */function controller(request, response) {	var path = request.urlPath.split('/');	if (path.length) {		path.splice(0,1);	}			// should have been caught by home page	if (path.length == 1 && path[0] == '') {		return Router.homePage(request,response);	}		return Router.project(path,request,response);}/** * RPC entry point */// function rpc(request, response) {// 	return Router.rpc(request,response);// }/** * Theme-specific entry point */function theme(request, response) {	return Router.themes(request,response);}/** * Home page */function home(request, response) {	return Router.homePage(request,response);}/** * Error page */function error(request, response) {	return Router.error(request,response);}// require in librariesvar thisSolution = FileSystemSync("PROJECT").path.split('/').slice(0,FileSystemSync("PROJECT").path.split('/').length-2).join('/');var registry = require( thisSolution + '/Security/Kabootit/Security/registry.js' );var MIME = require(thisSolution + '/Resources/Modules/mimeTypes.js');/** * Router config */var Router = (function() {	return {		/**		 * Project RPC calls		 * @param {HTTPRequest} request		 * @param {HTTPResponse} response		 */		rpc : function(request,response) {			debugger			response.headers.location = '/rpc';			response.statusCode = 307;			debugger		},				/**		 * Project pages		 * @param {Array} params		 * @param {HTTPRequest} request		 * @param {HTTPResponse} response		 */		project : function(params,request,response) {						if (!params) {				params = new Array()			}						// TODO: error checking			var routes = registry.routes(params[0].toLowerCase(),request.host);			// var basePath = projPath + '/WebFolder/';			var basePath = FileSystemSync("PROJECT").path + 'WebFolder/';						// check for symlinked top-level directory			var topLevelSymlink = Folder(basePath + params[0]);			if (topLevelSymlink.exists && topLevelSymlink.parent.path != basePath) {				basePath = topLevelSymlink.parent.path + 'WebFolder/'			}						// get requested file (remove trailing slash)			var fileName = params.join('/');			if (fileName[fileName.length - 1] == '/') {				fileName = fileName.slice(0,fileName.length - 1);			}			var pageName = fileName;						// handle case where index			if (!fileName) {				fileName = 'index';			}						// do we have access to this file			var accessAllowed = false;			var temp = routes.all.some(function check(elem, idx, array) {				// partial match				if (elem.toLowerCase() == fileName.toLowerCase().substr(0,elem.length) || elem == '*') {					accessAllowed = true;					return true;				}				return false;			})						// requested resource			if (accessAllowed) {								// not logged in and login required for this page, show log in page				if (currentSession().user.name == 'default guest' && fileName.substr(0,5) != 'login' && routes.noLogin.filter(function(item){return fileName.indexOf(item) != 0}).length && routes.noLogin.indexOf('*') == -1) {					// store what page trying to access					currentSession().storage.pageRequested = fileName;					return this.login(request,response);				}								// grab file from filesystem and return appropriately				var fullPath = basePath + fileName;				var resource = File(fullPath);								// if requesting main page, try looking inside .waPage folder				if (!resource.exists) {					resource = File(fullPath + '.waPage/index.html');					var wakPage = true;				}				if (!resource.exists) {					resource = File(fullPath + '/index.html');				}										if (resource.exists) {					// this is home page...only serve from /					if (registry.homePage(request.host) == pageName) {						try {							response.headers.location = '/';							response.statusCode = 308;						}						catch (e) {											}					}										// redirect to page ending in slash (so waf-builder files are always available)					if ((resource.extension == 'html' || resource.extension == 'htm') && wakPage && request.urlPath[request.urlPath.length - 1] != '/') {						try {							response.headers.location = request.urlPath + '/';							response.statusCode = 308;						}						catch (e) {											}					}										// look up extension and set MIME type appropriately					if (MIME.exists('.' + resource.extension)) {						response.contentType = MIME.get('.' + resource.extension);					}									try {						return resource.toString();					}					catch (e) {						try {							return resource.toBuffer().toBlob();						}						catch (e) {												}					}				}			}						// default 404 error			return this.error();		},				/**		 * Project Theme resources (not currently in use)		 * @param {HTTPRequest} request		 * @param {HTTPResponse} response		 */		themes : function(request,response) {			var params = request.urlPath.split('/');//			params.splice(0,2);			// get rid of everything up until themes			params.splice(0,params.indexOf('themes') + 1);			if (!params) {				params = new Array()			}						// get theme directory			var modelPath = ds.getModelFolder().path;			var themePath = modelPath.split('/');			themePath.splice(themePath.length - 2,2);			themePath = themePath.join('/');			themePath += '/Themes/WebFolder/themes/';						// get requested file			var fileName = params.join('/');			var resource = File(themePath + fileName);			if (resource.exists) {				// look up extension and set MIME type appropriately				if (MIME.exists('.' + resource.extension)) {					response.contentType = MIME.get('.' + resource.extension);				}								try {					return resource.toString();				}				catch (e) {					try {						return resource.toBuffer().toBlob();					}					catch (e) {											}				}			}						// default 404 error			return this.error();		},				/**		 * Project login page		 * @param {HTTPRequest} request		 * @param {HTTPResponse} response		 */		login : function(request,response) {			var path = request.urlPath.split('/');			path.splice(0,2);						// check for location of "home.waPage" in this project and serve it up by default			var resource = File(ds.getModelFolder().path + 'login.txt');						// hand coded login page			if (resource.exists) {				var path = resource.toString();			}			// hard coded login page (default)			else {				path = 'login';			}						if (File(ds.getModelFolder().path + 'WebFolder/' + path).exists || Folder(ds.getModelFolder().path + 'WebFolder/' + path).exists || Folder(ds.getModelFolder().path + 'WebFolder/' + path + '.waPage').exists) {				try {					response.headers.location = '/' + path + '/';					response.statusCode = 307;					// response.contentType = 'text/html'					// return resource.toString();				}				catch (e) {									}			}						return '404'		},				/**		 * Project Error page		 * @param {HTTPRequest} request		 * @param {HTTPResponse} response		 */		error : function(request,response) {			return '404'		},				/**		 * Project Home page (TODO: need to pull through resources a bit better)		 * @param {HTTPRequest} request		 * @param {HTTPResponse} response		 */		homePage : function(request,response) {			var path = request.urlPath.split('/');			path.splice(0,2);						// TODO: error checking			var homePage = registry.homePage(request.host);						// check for designation of home page in Security json			if (homePage) {				// it is possible to pass in a fully qualified wakanda page as the homePage name and therefore not trigger wakPage				var staticFile = File(ds.getModelFolder().path + 'WebFolder/' + homePage);				var staticFolder = Folder(ds.getModelFolder().path + 'WebFolder/' + homePage);				var wakPage = Folder(ds.getModelFolder().path + 'WebFolder/' + homePage + '.waPage');								if (staticFile.exists || staticFolder.exists || wakPage.exists) {					// not logged in and login required for this page, show log in page					if (currentSession().user.name == 'default guest' && 						homePage.substr(0,5) != 'login' && 						registry.routes(null,request.host).noLogin.indexOf(homePage) == -1) {												// store what page trying to access						currentSession().storage.pageRequested = homePage;						return this.login(request,response);					}										try {						// serve wakanda page up from /						if (wakPage.exists) {							var resource = File(ds.getModelFolder().path + 'WebFolder/' + homePage + '.waPage/index.html');							if (resource.exists) {								// look up extension and set MIME type appropriately								if (MIME.exists('.' + resource.extension)) {									response.contentType = MIME.get('.' + resource.extension);								}												try {									var html = resource.toString();																	// modify packageJson to look in correct location of the home page									var index = html.search(/<meta name="WAF.packageJson"(?:\s)?\/>/gi);									// packageJson not specified									if (index != -1) {										// 28 is length of meta name blah blah										index += 28;										html = html.substring(0,index) + ' content="/' + homePage + '.waPage/index.package.json"' + html.substring(index, html.length);									}																		return html								}								catch (e) {									try {										return resource.toBuffer().toBlob();									}									catch (e) {															}								}							}						}						// non-wakanda pages get served from default location						else {							response.headers.location = '/' + homePage + '/';							response.statusCode = 307;						}					}					catch (e) {										}				}			}						return '127.0.0.1';		}	}})();// requiredvar module = module || new Object()if (module && module.exports) {	module.exports = Router;}