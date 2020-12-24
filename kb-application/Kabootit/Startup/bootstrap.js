// special handler that instantiates all other projects on server





addHttpRequestHandler(
	'^',
	Folder(ds.getModelFolder().path).parent.path + 'Resources/Extensions/bootstrap/requestHandler.js',
	'ping'
);