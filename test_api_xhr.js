﻿/** * For best results, this file should be called from another module */// how should the xhr be addressed?var URL = require( (FileSystemSync("PROJECT").path.split('/').slice(0,FileSystemSync("PROJECT").path.split('/').length-2).join('/')) + '/AccessControl' + '/API/security_registry.js' ).path("AC");// method to call and arguments to pass invar params = {	//allowed	method: "organization.getAll",	//disallowed//	method: "organization.removeAll",	arguments: [1,'string',{fish: 'bowl'}]}// get permitted actions (via xhr except for this one place)var xhr = require(FileSystemSync("EXTENSIONS_USER").path + "Modules/XHR");xhr.post(URL, "api", params).result;