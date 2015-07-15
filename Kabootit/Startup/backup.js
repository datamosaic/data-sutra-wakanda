// kill switch
var enabled = false;

//start backup shared worker and run a backup on solution startup
	// this will only happen on production servers
if (enabled && !SECURITY.getServer().developer) {
	// run 10 seconds later to allow for server to properly start up
	// setTimeout(function() {
		var DPL = require(ds.getModelFolder().path + "Kabootit/API/dpl_1.js");
		// debugger;
		DPL.server.backup();
	// },1000);
}