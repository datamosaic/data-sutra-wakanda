﻿var	basePath	= FileSystemSync("WEBFOLDER").path,	startPath	= "ractive/A5_routing.waPage/";var Ractive = {		routes : function routes() {		var routes = File(basePath + startPath + "routes.json").toString();		return JSON.parse(routes);	}};module.exports = Ractive;