function ractive(request, response) {
	var path = request.urlPath.split('/');
	if (path.length) {
		path.splice(0,1);
	}
	
	var pageName = path[0] + '/' + path[1]; //'ractive/A2_routing'
	
	// return Router.project(path,request,response);
	
	// require in libraries
	var thisSolution = application.getSettingFile('resources').parent.parent.path;
	var registry = require( thisSolution + 'Security/Kabootit/Security/registry.js' );
	var MIME = require(thisSolution + 'Resources/Modules/mimeTypes.js');
	
	var path = request.urlPath.split('/');
	path.splice(0,2);
	
	// it is possible to pass in a fully qualified wakanda page as the homePage name and therefore not trigger wakPage
	var wakPage = Folder(ds.getModelFolder().path + 'WebFolder/' + pageName + '.waPage');
	
	if (wakPage.exists) {
		try {
			// this is a wakanda page
			if (wakPage.exists) {
				var resource = File(wakPage.path + 'index.html');
			}
			
			// serve page up from /
			if (resource.exists) {
				// look up extension and set MIME type appropriately
				if (MIME.exists('.' + resource.extension)) {
					response.contentType = MIME.get('.' + resource.extension);
				}

				try {
					var html = resource.toString();
				
					// modify packageJson to look in correct location of the home page
					if (wakPage.exists) {
						var index = html.search(/<meta name="WAF.packageJson"(?:\s)?\/>/gi);
						// packageJson not specified
						if (index != -1) {
							// 28 is length of meta name blah blah
							index += 28;
							html = html.substring(0,index) + ' content="/' + pageName + '.waPage/index.package.json"' + html.substring(index, html.length);
						}
					}
					
					return html
				}
				catch (e) {
					try {
						return resource.toBuffer().toBlob();
					}
					catch (e) {
		
					}
				}
			}
		}
		catch (e) {
		
		}
	}
}