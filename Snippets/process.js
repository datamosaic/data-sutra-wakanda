﻿process.pid/** * Run commands * * @param {String} command Command to run (include all arguments here) * @param {Folder} folder Context to run command from * @return {Object} Output from command */function callWorker(command, folder) {	try {		var worker = SystemWorker.exec(command, null, folder);		return {			result: worker.output.toString(),			error: worker.error.toString()		}	}	catch (e) {	}};var cmd = 'kill -9 ' + process.pid;callWorker(cmd,'/');