// helper for all projects to get url and port for projects
addHttpRequestHandler(
	'(?:/kb-ac)?/security\.\*',
	'Kabootit/Security/actions.js',
	'actions'
);

// external project API-access
addHttpRequestHandler(
	'(?:/kb-ac)?/api\.\*',
	'Kabootit/API/ac.js',
	'acController'
);