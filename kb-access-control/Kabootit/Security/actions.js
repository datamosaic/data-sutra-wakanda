/**
 * Actions allowed per API; called via xhr
 *
 * @param {HTTPRequest} request
 * @param {HTTPResponse} response
 * @return {JSON}
 */
function actions(request, response) {
	var actionReg = require((FileSystemSync("PROJECT").path.split('/').slice(0,FileSystemSync("PROJECT").path.split('/').length-2).join('/')) + '/Security/Kabootit/Security/registry.js');
	return actionReg.actions.apply(this,arguments);
}
