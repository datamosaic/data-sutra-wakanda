// external project API-access
addHttpRequestHandler(
	'(?:/srvrmon)?/api\.\*',
	'Kabootit/API/srvrmon.js',
	'srvrmonController'
);