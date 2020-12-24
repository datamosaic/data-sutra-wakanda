// home page
addHttpRequestHandler(
	'^(?:/app)?/$',
	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/router/router.js',
	'home'
);
// theme non-script resources
addHttpRequestHandler(
	'^/themes',
	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/router/router.js',
	'theme'
);
// single entry point for all non-core wakanda resources
addHttpRequestHandler(
	'^/(?!themes|waLib|rpc|rest|src/resources|images|api|app/api|app/rpc)',
	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/router/router.js',
	'controller'
);