﻿/** * Register all request handlers for given project * @param {HTTPRequest} request * @param {HTTPResponse} response */function initialize (request, response) {	// get all bootstraps	var bootstraps = getItemsWithRole('bootStrap');	// when only one bootstrap, this doesn't return an array so need to cast it	if (!(bootstraps instanceof Array)) {		bootstraps = [bootstraps];	}		// unregister the handler that callled this function (so only available to run once)	removeHttpRequestHandler(			'^',			Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/bootstrap/requestHandler.js',			'initialize'		);		// register all other handlers (api and router from same directory)	var allFiles = Folder(ds.getModelFolder().path + 'Kabootit/Startup').files;	// remove file if matches active bootstrap	allFiles = allFiles.filter(function(item) {		var active = bootstraps.filter(function(booty) {			if (item.path == booty.path) {				return true;			}		});				// if the selected bootstrap is active, no need to run it again		return active.length ? false : true;	});		// grab contents of each file and insert appropriately		//TODO: big warning here...arbitrary code can get executed here!	for (var i = 0; i < allFiles.length; i++) {		eval(allFiles[i].toString());	}		// send to home page (or page just trying to access)	response.headers.location = request.url || '/';	response.statusCode = 307;}/** * Ping all projects in this solution (except for application) * @param {HTTPRequest} request * @param {HTTPResponse} response */function ping (request, response) {	// grab ports for all projects	var projects = SECURITY.pathAll(true);		// unregister the handler that called this function in app project (so only available to run once)	var projectID = self.name.match(/\((.*)\)/)[1];	if (projectID == 'APP') {		removeHttpRequestHandler(			'^/ping',			Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/bootstrap/requestHandler.js',			'ping'		);	}		// ping all projects	var cnt = 0;	for (var i in projects) {		// calling project has already been configured		if (i != projectID) {			var xhrResult = XHR.post(					projects[i], 					"ping"				);							//TODO: when not a successful init, keep track of it				if (xhrResult) {				cnt++			}		}	}		return cnt + " projects successfully inited";}