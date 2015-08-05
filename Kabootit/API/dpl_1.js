﻿/** * DPL API * @version 1 * @modified 2015 June 22 */var DPL = {	server : {		getStats: null,		backup: null	}};// uptime macosx// 13:58  up  1:06, 3 users, load averages: 1.28 1.13 1.03// uptime ubuntu// 12:58:12 up 15 days,  1:33,  2 users,  load average: 0.01, 0.02, 0.05var STR_UPTIME_LOAD = {	macosx: "load averages:",	ubuntu: "load average:"};/** * Get stats of this server * @public * @returns {Object} */DPL.server.getStats = function getServerStats(){	// run uptime command	var uptimeResult = SystemWorker.exec( "uptime" );	if( uptimeResult === null )	{		console.log( "DPL.server.getStats: couldn't execute uptime" );		return false;	}	var uptimeOutput = uptimeResult.output.toString();		// look for load string	var loadTrio = null;	if( uptimeOutput.indexOf(STR_UPTIME_LOAD.macosx) >= 0 )	{		loadTrio = uptimeOutput.split(STR_UPTIME_LOAD.macosx)[1].trim().split(' ');	}	else if( uptimeOutput.indexOf(STR_UPTIME_LOAD.ubuntu) >= 0 )	{		loadTrio = uptimeOutput.split(STR_UPTIME_LOAD.ubuntu)[1].trim().split(', ');	}	else	{		console.log("DPL.server.getStats: couldn't parse uptime results");		return false;	}		// run date command	// same on macosx and ubuntu	var dateResult = SystemWorker.exec( 'date -u "+%F %T"' );  // UTC	if( dateResult === null )	{		console.log( "DPL.server.getStats: couldn't execute date" );		return false;	}	var stamp = dateResult.output.toString().trim().split(" ");	// package results of load and date into object	var data = {		stampString: stamp,		avgOneMin: parseFloat(loadTrio[0]),		avgFiveMin: parseFloat(loadTrio[1]),		avgFifteenMin: parseFloat(loadTrio[2])	};	data.plaintext = data.stampString + " " + data.avgOneMin + " " + data.avgFiveMin + " " + data.avgFifteenMin;	return data;};/** * Backup DataFolder for all projects * @public * @returns {Object} */DPL.server.backup = function startBackupWorker() {	// grab worker	var worker = new SharedWorker( "Workers/backup.js", "kbBackup" );  // file, name of worker	var workerReturnValue = null;		var port = worker.port;		port.onmessage = function(event)	{		console.log("Returned from worker");		var message = event.data;		switch(message.response)		{			case 'running':  // boolean true=running				workerReturnValue = message.payload;  // returned in command handler after wait 				break;			case 'backup':				// on successful backup, schedule another one for 4 hours from now				workerReturnValue = 'backup done';				break; 			default:				console.log("workerPollingCommand: response from worker not recognized: " + message.response);				break;		}		close();  // needed so original module function exits its wait() and returns	};		port.postMessage( { command: 'start' } );	// when called in bootstrap (as this is) it prevents next bootstraps from running	// wait();  // wait for worker callback to onmessage above. needs callback to call close() to exit this wait().		return workerReturnValue;}/** * Get stats of this server * @public * @returns {Object} */DPL.server.kill = function killServer() {	/**	 * Run commands	 *	 * @param {String} command Command to run (include all arguments here)	 * @param {Folder} folder Context to run command from	 * @return {Object} Output from command	 */	function callWorker(command, folder) {		try {			var worker = SystemWorker.exec(command, null, folder);			return {				result: worker.output.toString(),				error: worker.error.toString()			}		}		catch (e) {		}	};		// shutdown	console.log("Shutdown initiated");		var target = Date.now() + 10;  // basically wait 10 ms	while ( Date.now() < target ) {		// spin it so we can see preceding log	}		callWorker('kill -9 ' + process.pid,'/');}module.exports = DPL;