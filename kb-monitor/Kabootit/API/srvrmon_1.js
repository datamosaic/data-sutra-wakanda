/**
 * SRVRMON API
 * @version 1
 * @modified 
 */
var SRVRMON = {
	getStats: new Object(),
	getAndStoreStats: new Object(),
	sendEmail: new Object(),
	doAdmin: new Object(),
	doRemote: new Object()
};
module.exports = SRVRMON;

var EMAIL = require("email");
var TIME = require("Utility/time.js");

// the at-public documentation comment is necessary to make the function callable by API

//==============================================================================

var STR_PING_RESULT = {
	macosx: "1 packets transmitted, 1 packets received",
	ubuntu: "1 packets transmitted, 1 received"
};

var STR_PING_UNKNOWN = {
	macosx: "Unknown host",  // ping: cannot resolve aosentuhasnoetuhsnath.com: Unknown host
	ubuntu: "unknown host"  // ping: unknown host saoetuhasnotehu.com
};

/**
 * get stats of generic address (ping)
 * @public
 * @return {data object}
 */
SRVRMON.getStats.generic = function getStatsGeneric(serverAddr)
{
	var pingResult = SystemWorker.exec( "ping -c 1 " + serverAddr );
	if( pingResult === null )
	{
		console.log( "SRVRMON.getStats.generic: couldn't execute ping." );
		return false;
	}
	var pingOutput = pingResult.output.toString();
	var pingError = pingResult.error.toString();

	if( pingError.indexOf(STR_PING_UNKNOWN.macosx) >= 0
	    || pingError.indexOf(STR_PING_UNKNOWN.ubuntu) >= 0 )
	{
		console.log( "SRVRMON.getStats.generic: unknown address: " + serverAddr );
		return false;
	}
	
	if( pingOutput.indexOf(STR_PING_RESULT.macosx) < 0
	    && pingOutput.indexOf(STR_PING_RESULT.ubuntu) < 0 )
	{
		console.log("SRVRMON.getStats.generic: no ping received. " + pingOutput );
		return false;
	}
	
	var dateResult = SystemWorker.exec( 'date -u "+%F %T"' );  // UTC
	if( dateResult === null )
	{
		console.log( "SRVRMON.getStats.generic: couldn't execute date." );
		return false;
	}
	var stamp = dateResult.output.toString().trim().split(" ");

	var data = {
		stampString: stamp,
		avgOneMin: 0,
		avgFiveMin: 0,
		avgFifteenMin: 0
	};
	return data;
};

//==============================================================================

/**
 * get stats of localhost
 * @public
 * @return {data object}
 */
SRVRMON.getStats.localhost = function getStatsLocalhost()
{
	return KB.callAPI( "DPL.server.getStats" );
};

//==============================================================================

/**
 * get CPU load of game server
 * @public
 * @return {data object}
 */
SRVRMON.getStats.gameServer = function getStatsGameServer( serverRec )
{
	// XHR is defined in solution/required.js
	// 0 is current version of API
	// XHR.get( baseURL, action, params )
	var xhrResult = XHR.get(
		serverRec.address,
		serverRec.request_path
		// request headers, custom timeout
	);
	if( xhrResult.statusLine.indexOf("200") === -1 )
	{
		console.log( "SRVRMON.getStats.gameServer: xhr failed for " 
		  + serverRec.name + " --\n" + JSON.stringify(xhrResult,null,2) );
		return false;
	}
	
	var info = JSON.parse(xhrResult.result);
	
	// slice off " kB" from end, convert to MB
	var memTotal = Math.floor( parseInt( info.memory.total.slice(0,-3), 10 ) / 1024 );
	var memFree = Math.floor( parseInt( info.memory.free.slice(0,-3), 10 ) / 1024 );
	var memUsed = memTotal - memFree;

	var data = {
		stampString: info.timestamp,
		avgOneMin: info.load[0],
		avgFiveMin: info.load[1],
		avgFifteenMin: info.load[2],
		cpu_percent: info.cpu_usage_percent,
		memory_used_mb: memUsed,
		memory_free_mb: memFree
	};
	return data;
};

//==============================================================================

/**
 * send an XHR get request to fire up Kabootit
 * @public
 * @return {data object}
 */
SRVRMON.getStats.xhrGet = function getStatsXHRget( serverRec )
{
	// XHR.get( baseURL, action, params )
	var xhrResult = XHR.get(
		serverRec.address,
		serverRec.request_path
		// request headers, custom timeout
	);
	if( xhrResult.statusLine.indexOf("200") === -1 )
	{
		console.log( "SRVRMON.getStats.xhrGet: xhr failed for " 
		  + serverRec.name + " --\n" + JSON.stringify(xhrResult,null,2) );
		return false;
	}
	
	return {};
};

//==============================================================================

/**
 * get stats of data server
 * @public
 * @return {data object}
 */
SRVRMON.getStats.dataServer = function getStatsDataServer( serverAddr )
{
	var xhrResult = XHR.post( serverAddr, "api/-/server/getStats", { token: "1111" } );
	// requestHeaders, timeout
	
	if( xhrResult.statusLine.indexOf("200") === -1 )
	{
		console.log( "SRVRMON.getStats.dataServer: xhr failed. " + JSON.stringify(xhrResult,null,2) );
		return false;
	}
	var data = xhrResult.result;
	return data;
};

//==============================================================================

/**
 * stop data server
 * @public
 * @return
 */
SRVRMON.doAdmin.dataServerStopYesIMeanStop = function dataServerStopYesIMeanStop( serverAddr )
{
	var xhrResult = XHR.post( serverAddr, "api/-/server/kill", { token: "1111" } );
	// since this actually kills the server, there is nothing to get back from the request
};

//==============================================================================

/**
 * get and store stats based on server ID
 * @public
 * @return Boolean or null
 */
SRVRMON.getAndStoreStats.general = function getAndStoreStatsGeneral( serverID, flagSaveStats )
{
	var serverRec = ds.Server({ID:serverID});
	var stats = null;
	switch( serverRec.type )
	{
		case 'local':
			stats = SRVRMON.getStats.localhost();
			break;
		case 'data':
			stats = SRVRMON.getStats.dataServer( serverRec.address );
			break;
		case 'game':
			stats = SRVRMON.getStats.gameServer( serverRec );			
			break;
		case 'xhrget':
			stats = SRVRMON.getStats.xhrGet( serverRec );
			break;
		case 'generic':
			stats = SRVRMON.getStats.generic( serverRec.address );
			break;
		default:
			console.log("SRVRMON.getAndStoreStats.general: unrecognized server type " + serverRec.type + " with address " + serverRec.address );
			return null;
			break;
	}
	
	if( stats === false )
	{
		return false;
	}
	else
	{
		serverRec.last_reached = new Date();
		serverRec.save();
	}
	
	if( flagSaveStats === true )
	{
		var entity = new ds.ServerLoad;
		entity.stampString = stats.stampString;
		entity.avgOneMin = stats.avgOneMin;
		entity.avgFiveMin = stats.avgFiveMin;
		entity.avgFifteenMin = stats.avgFifteenMin;
		if( 'cpu_percent' in stats )  entity.cpu_percent = stats.cpu_percent;
		if( 'memory_used_mb' in stats )  entity.memory_used_mb = stats.memory_used_mb;
		if( 'memory_free_mb' in stats )  entity.memory_free_mb = stats.memory_free_mb;
		entity.Server = serverRec;
		entity.save();
	}
	
	return true;
};

//==============================================================================

/**
 * send email for server alert with per-server contact list
 * @public
 * @return count, expected of emails sent
 */
SRVRMON.sendEmail.serverAlert = function sendEmailServerAlert( serverID, serverCondition )
{
	var myserver = ds.Server({ID:serverID});

	// create new ServerAlertEvent record
	var myevent = new ds.ServerAlertEvent;
	myevent.Server = myserver;
	myevent.event_type = serverCondition;
	myevent.save();
	
	// msg {
	//   to: address,
	//   subject: string,
	//   body: string
	// }
	var msg = {
		subject: "generic subject (please specify)",
		body: "generic body (please specify)"
	};
	
	var msgLastReached = "Last reached: " + ( myserver.last_reached === null ? "never" : myserver.last_reached_fmt );
	var msgDowntime = "Downtime: " + ( myserver.went_down === null ? "none" :
	  TIME.timeElapsedToString( myserver.went_down, myserver.last_reached ) );
	var msgWentDown = "Went down: " + ( myserver.went_down === null ? "never" :
	  ( myserver.went_down_fmt + "\n" + msgDowntime ) );
	var msgLastAlerted = "Last alerted: " + ( myserver.last_alerted === null ? "never" : myserver.last_alerted_fmt );

	console.log( msgLastReached );
	console.log( msgDowntime );
	console.log( msgWentDown );
	console.log( msgLastAlerted );
	
	switch( serverCondition )
	{
		case 'down':
			msg.subject = "==> Server Down: " + myserver.name + " <==";
			msg.body = msgLastReached;
			break;
		case 'downrestartfailed':
			msg.subject = "==> Server Down (restart failed): " + myserver.name + " <==";
			msg.body = msgLastReached;
			msg.body += "\nRestart failed.";
			break;
		case 'up':
			msg.subject = "==> Server Up: " + myserver.name + " <==";
			msg.body = msgWentDown;
			break;
		case 'uprestartsuccessful':
			msg.subject = "==> Server Up (restart successful): " + myserver.name + " <==";
			msg.body = msgWentDown;
			msg.body += "\nRestart successful.";
			break;
		case 'uprestartfailed':
			msg.subject = "==> Server Up (restart failed): " + myserver.name + " <==";
			msg.body = msgWentDown;
			msg.body += "\nTried to auto-restart. Seemed that server did not respond and gave up. But later it came back up.";
			break;
		case 'stilldown':
			msg.subject = "==> Server Still Down: " + myserver.name + " <==";
			msg.body = msgWentDown;
			msg.body += "\n" + msgLastAlerted;
			break;
		case 'test':
			msg.subject = "==> Server Alert Test: " + myserver.name + " <==";
			msg.body = msgLastReached;
			msg.body += "\n" + msgWentDown;
			msg.body += "\n" + msgLastAlerted;
			break;
		default:
			msg.subject = "==> Server Alert: " + myserver.name + " <==";
			var msgError = "SRVRMON.sendEmail.serverAlert: unrecognized server condition: " + serverCondition;
			console.log( msgError );
			msg.body = msgError;
			break;
	}

	var contacts = ds.ServerAlertContact.query( "Server.ID == :1 and include_in_alert == true", serverID ).AlertContact;
	return SRVRMON.sendEmail.general( msg, contacts );
};

//==============================================================================

/**
 * send email for general message with greeting to an AlertContact collection 
 * @public
 * @return count, expected of emails sent
 */
SRVRMON.sendEmail.general = function sendEmailGeneral( msg, contacts )
{
	// msg {
	//   to: address,
	//   subject: string,
	//   body: string
	// }

	var emailCount = 0;
	var emailExpected = 0;
	for( var i = 0; i < contacts.length; ++i )
	{
		++emailExpected;	
		msg.to = contacts[i].email;
		if( EMAIL.send(msg) === true )		
			++emailCount;
		msg.to = "";
	}
	
	return { count: emailCount, expected: emailExpected };
};

//==============================================================================
// remote commands

function serverSSHcommand( serverID, scriptFieldName )
{
	var serverRec = ds.Server({ID:serverID});

	var myslash = serverRec.admin_script_path.charAt( serverRec.admin_script_path.length - 1 ) === '/' ? "" : "/";
	var scriptFQP = serverRec.admin_script_path + myslash + serverRec[scriptFieldName];  // fully qualified path
	var cmdscript = "nohup " + scriptFQP + " > /dev/null 2> /dev/null < /dev/null &";
	
	var sshPort = ( serverRec.admin_port === null || serverRec.admin_port.length === 0 ) ? "" : ( " -p " + serverRec.admin_port );
	var cmdssh = "ssh" + sshPort + ( " " + serverRec.admin_username + "@" + serverRec.admin_ip );
	  
	var cmdcomplete = cmdssh + ' "' + cmdscript + '"';
	console.log( "serverSSHcommand: " + cmdcomplete );
	
	var result = SystemWorker.exec( cmdcomplete );
	return result !== null;
}

/**
 * 
 * @public
 * @return 
 */
SRVRMON.doRemote.serverStart = function serverStart(serverID)
{
	var serverRec = ds.Server({ID:serverID});
	var serverText = serverRec.name + " at " + serverRec.address;
	var result = serverSSHcommand( serverID, 'admin_script_start' );
	return ( result === true ? "Start request sent for " : "Could not execute start request for " ) + serverRec.name + " at " + serverRec.address + ".";	
};

/**
 * 
 * @public
 * @return 
 */
SRVRMON.doRemote.serverStopYesIMeanStop = function serverStopYesIMeanStop(serverID)
{
	var serverRec = ds.Server({ID:serverID});
	var result = null;
	switch( serverRec.type )
	{
		case 'data':
			KB.callAPI( "SRVRMON.doAdmin.dataServerStopYesIMeanStop", [ serverRec.address ] );
			result = true;  // nothing to return from API call
			break;
		default:
			result = serverSSHcommand( serverID, 'admin_script_stop' );
			break;
	}
	return ( result === true ? "Stop request sent for " : "Could not execute stop request for " ) + serverRec.name + " at " + serverRec.address + ".";
};
