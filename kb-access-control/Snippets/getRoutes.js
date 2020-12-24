// the ID of project you're interested in
var id = 'html';
var securityInfo = {
	// retrieve home page
	homePage : SECURITY.homePage(null,id),
	// allowed actions
//	actions: SECURITY.actions(),
	// get url
	path: SECURITY.path(id,true),
	// get location on disk
	projectPath: SECURITY.projectPath(id),
	// get allowed routes
	routes: SECURITY.routes(id),
	// get all urls
	pathAll: SECURITY.pathAll(),
	// info about server
	server: SECURITY.getServer()
}
securityInfo;