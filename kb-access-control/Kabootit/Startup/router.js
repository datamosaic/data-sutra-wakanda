// home page

addHttpRequestHandler(

	'^(?:/kb-ac)?/$',

	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/router/router.js',

	'home'

);



// single entry point for all non-core wakanda resources

addHttpRequestHandler(

	'^/(?!themes|waLib|rpc|rest|waUpload|src/resources|images|api|kb-ac/api|security|kb-ac/security)',

	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/router/router.js',

	'controller'

);