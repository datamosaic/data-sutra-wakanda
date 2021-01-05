// first request that comes will instantiate all project request handlers before serving up request
addHttpRequestHandler(
	'^',
	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/bootstrap/requestHandler.js',
	'initialize'
);