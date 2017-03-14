// home page
addHttpRequestHandler(
	'^(?:/srvrmon)?/$',
	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/router/router.js',
	'home'
);

// theme non-script resources
addHttpRequestHandler(
	'^/themes',
	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/router/router.js',
	'theme'
);

// theme script resources (mars)
addHttpRequestHandler(
	'(.*/themes/mars)',
	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/router/router.js',
	'theme'
);

// single entry point for all non-core wakanda resources
addHttpRequestHandler(
	'^/(?!themes|themes-custom|waLib|rpc|rest|waUpload|src/resources|images|api|srvrmon/api|srvrmon/rpc)',
	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/router/router.js', 
	'controller'
);