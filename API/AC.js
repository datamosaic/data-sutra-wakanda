﻿// NAMESPACE examplevar AC = {};AC.organization = {};AC.organization.getAll = function get() {	return ds.Organization.all();};/* * test stuff todo */AC.test = {};AC.test.mongoDB = function get() {	// TODO: connect and get mongo data};AC.test.redis = function get() {	// TODO: connect and get redis};AC.test.odbc = function get() {	// TODO: connect and get odbc};AC.test.mysql = function get() {	// TODO: connect and get mysql};AC.test.mssql = function get() {	// TODO: connect and get mssql};AC.test.nuodb = function get() {	// TODO: connect and get mssql};AC.test.fileJSON = function get() {	// TODO: connect and get fileJSON};AC.test.mailchimp = function get() {	// TODO: connect and get some mailchimp data};/* * client request starts here */function controller (request, response) {	debugger;	var 		method,		results;	// TODO: go to access and control module to authenticate client request	// if AC authenticated	var authenticated = true;	if (authenticated) {		currentSession().promoteWith('Code');				// TODO: based on request params, call a method generically (no CASE!)		// if multilevel deep, call correctly//		var results = AC[method](request);		results = AC.organization.getAll();		}	else {		// TODO: if not authenticated		// TODO: use error module with error object		return "some error"	}	return results;	};