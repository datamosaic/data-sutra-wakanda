﻿/* * This file provides registered actions per credentials and provides how to  * access the projects (what URL they are being served from) *//** * Actions allowed per API; called via xhr * * @param {HTTPRequest} request * @param {HTTPResponse} response */function actions(request, response) {	var module = (request && request.hasOwnProperty('body') && request.body.length) ? JSON.parse(request.body) : '';		// stubbed data for actions allowed per api	var stub = {			'api_xxx': ['action1','action2','action3'],			'AC': [				'organization.get',				'organization.getAll',				'organization.new',				'organization.delete',				'organization.duplicate'			],			'FACTORY': [				'test.testAction'			]		};		// this module exists, grab it's possible api actions	if (module && stub.hasOwnProperty(module)) {		response.contentType = 'application/json';		return JSON.stringify(stub[module]);	}	// return nothing	else {		return JSON.stringify(new Array());	}}// called in security_check via requirevar module = module || new Object();if (module && module.exports) {	/**	 * How to reference each project	 * 	 * @param {String}  module IDentifier for requested module	 * @return {String} Host (including port, if any)	 */	module.exports.path = function project(module) {		var server = {			'APP': '',			'BARRACKS': '',			'BOOTCAMP': '',			'FACTORY': '',			'ZERO': '',			'HAL': '',			'HQ': '',			'RECRUIT': '',			'AC': '',			'VL': ''		}		var developer = {			'APP': 'http://localhost:9221/',			'BARRACKS': 'http://localhost:9222/',			'BOOTCAMP': 'http://localhost:9223/',			'FACTORY': 'http://localhost:9224/',			'ZERO': 'http://localhost:9225/',			'HAL': 'http://localhost:9226/',			'HQ': 'http://localhost:9227/',			'RECRUIT': 'http://localhost:9228/',			'AC': 'http://localhost:9201/',			'VL': 'http://localhost:9202/'		}				// some check to see if in developer		if (true) {			return developer[module]		}		else {			return server[module]		}	}}