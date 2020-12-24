// external project API-access





addHttpRequestHandler(
	'(?:/app)?/api\.\*',
	'Kabootit/API/app.js',
	'appController'
);