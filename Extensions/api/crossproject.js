/**
 * Brokers the call to external (other projects) APIs
 * @param {String} method The way you would normally call a method if it were required in....example: "AC.organization.getAll"
 * @param {Array} [args] Array of arguments to be passed to this method
 * @param {Number} [version] Which version of API to call
 * @return Whatever the call returns
 */
function external(method, args, version) {
	var callingProject = self.name.match(/\((.*)\)/)[1];
	
	// no version specified, use default version
	if (Number(version) != version) {
		version = '-';
	}
	
	if (method) {
		var apiName = method.split('.')[0];
		method = method.substr(apiName.length + 1).split('.').join('/');
		
		// convert Arguments to Array
		if (args && typeof args == 'object' && args.length && !(args instanceof Array)) {
			var argArray = new Array();
			for (var i = 0; i < args.length; i++) {
				argArray[i] = args[i];
			}
			args = argArray;
		}
		
		// get server/port for external project
		var URL = require( (FileSystemSync("PROJECT").path.split('/').slice(0,FileSystemSync("PROJECT").path.split('/').length-2).join('/')) + '/Security/Kabootit/Security/registry.js' ).path(apiName,true);
		
		// get permitted actions (via xhr except for this one place)
//		var xhr = require(FileSystemSync("PROJECT").path + "Modules/XHR");
		var results = XHR.post(
				URL, 
				"api/" + version + "/" + method,
				{
					arguments: args || null
				}
			).result;
		
		return results;
	}
}
exports.callAPI = external;