// kill switch
var enabled = true;

var DPL = require(ds.getModelFolder().path + "Kabootit/API/dpl_1.js");

//start backup shared worker and run a backup on solution startup
	// this will only happen on production servers
if (enabled && !SECURITY.getServer().developer) {
	DPL.server.backup();
}