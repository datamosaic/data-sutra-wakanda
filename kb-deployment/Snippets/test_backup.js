﻿//var worker = new SharedWorker( "Workers/backup.js", "kbBackup" )//worker.port.postMessage({command:'backup'});var DPL = require(ds.getModelFolder().path + "Kabootit/API/dpl_1.js");DPL.server.backup();