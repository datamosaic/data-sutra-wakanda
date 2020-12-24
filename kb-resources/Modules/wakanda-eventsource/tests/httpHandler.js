﻿//var testSuite = require('wakanda-eventsource/tests/suite');




















var testSuite = require('./suite');

function oneventsourceconnect(httpRequest, httpResponse) {
	var
		connection,
		headers,
		accept,
		lastEventId,
		workerPort;

	connection = httpResponse;
	headers = connection.headers;
	accept = httpRequest.headers.Accept;

	if (accept.indexOf('application/json') > -1) {
		headers.contentType = 'application/json';
		return '{"ok": true, "runTest": true}';
	}

	return '"tests" http request handler found'

}

exports.oneventsourceconnect = oneventsourceconnect;
