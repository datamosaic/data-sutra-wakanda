// external project API-access
addHttpRequestHandler(
	'(?:/start)?/api\.\*',
	'Kabootit/API/start.js',
	'startController'
);