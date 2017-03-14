// two ways to include a js file
//include( FileSystemSync("SOLUTION").path + "path/to/extrafile.js" );
//include( FileSystemSync("PROJECT").path + "Modules/extrafile.js" );
//var EMAIL = require("email");

//==============================================================================
// Global table

exports.globalGetSSHkey = function globalGetSSHkey()
{
	var globaldata = ds.MyGlobalSettings.all();
	if( globaldata.length == 0 )
		return null;
	return globaldata[0].ssh_key;
};

exports.globalSetSSHkey = function globalSetSSHkey( givenSSHkey )
{
	var globaldata = ds.MyGlobalSettings.all();
	var globalrec = globaldata.length == 1 ? globaldata[0] : new ds.MyGlobalSettings;
	globalrec.ssh_key = givenSSHkey;
	return globalrec.save();
	//return true;
};

//==============================================================================
// contacts

exports.getAvailContactsForServer = function getAvailContactsForServer(serverID)
{
	var serverAlertContacts = ds.ServerAlertContact.query( "Server.ID == :1", serverID );
	//console.log( JSON.stringify(serverAlertContacts,null,"  ") );
	
	var serverAlertContactIDs = serverAlertContacts.toArray( "AlertContact.ID" );
	//console.log( JSON.stringify(serverAlertContactIDs,null,"  ") );
	
	var serverAlertContactIDArr = serverAlertContactIDs.map(
		function(curval,index,array) { return curval.AlertContact.ID; } );
	//console.log( serverAlertContactIDArr );
	
	// need condition cuz if no active contacts for given server then query will return nothing
	var allContactsNotInSAC = serverAlertContactIDArr.length > 0 ? 
		ds.AlertContact.query( "not ID in :1", serverAlertContactIDArr )
		: ds.AlertContact.all();
	// this is an entity collection
	
	// order by in query string didn't work because all() is called sometimes and didn't have the sort
	// so just use orderBy, which returns EntColl so need to reassign
	allContactsNotInSAC = allContactsNotInSAC.orderBy( "last_name asc, first_name asc, email asc" );

	//console.log( allContactsNotInSAC );
	return allContactsNotInSAC;
	// this becomes a dumb entity collection once it goes from here back to client
};

exports.setContactForServer = function setContactForServer( serverID, contactID )
{
	var serverRec = ds.Server({ID:serverID});
	var contactRec = ds.AlertContact({ID:contactID});
	
	var sac = new ds.ServerAlertContact;
	sac.AlertContact = contactRec;
	sac.Server = serverRec;
	sac.include_in_alert = true;
	sac.save();
	
	return true;
};

//==============================================================================
// admin

exports.serverStart = function serverStart(serverID)
{
	return KB.callAPI( "SRVRMON.doRemote.serverStart", [ serverID ] );
};

exports.serverStopYesIMeanStop = function serverStopYesIMeanStop(serverID)
{
	return KB.callAPI( "SRVRMON.doRemote.serverStopYesIMeanStop", [ serverID ] );
};

//==============================================================================
// alerts

exports.sendEmailTestServer = function sendEmailTest(serverID)
{
	var emailResult = KB.callAPI( "SRVRMON.sendEmail.serverAlert", [ serverID, 'test' ] );
	
	var msg = "";
	if( emailResult.expected > 0 )
	{
		msg = "Test alert email sent to " + emailResult.count
		  + " contact" + ( emailResult.count > 1 ? "s" : "" )
		  + " of " + emailResult.expected + " expected.";
	}
	else if( emailResult.expected === 0 )
	{
		msg = "Please set some contacts for inclusion in alert.";
	}
	else
	{
		msg = "Something weird happened: [count] " + emailResult.count + " [expected] " + emailResult.expected;
	}
	return msg;
};

//==============================================================================
// get server stats

exports.doServerStats = function doServerStats( serverID )
{
	return KB.callAPI( "SRVRMON.getAndStoreStats.general", [ serverID, true ] );  // true => save stats
};

//==============================================================================
// polling worker

exports.workerPollingExec = function workerPollingExec( paramobj )
{
	// paramobj {
	//   cmd: 'start', 'stop', etc
	//   val: (optional, relevant to command)
	// }

	var worker = new SharedWorker( "Workers/workerPolling.js", "workerPolling" );  // file, name of worker
	var port = worker.port;
	
	//--------------------------------------
	// message receiving from worker
	
	var workerReturnValue = null;
	port.onmessage = function(event)
	{
		var message = event.data;
		switch(message.response)
		{
			case 'status':
			case 'prefs':
				workerReturnValue = message.payload;  // returned in command handler after wait 
				break;
			default:
				console.log("workerPollingCommand: response from worker not recognized: " + message.response);
				break;
		}
		close();  // needed so original module function exits its wait() and returns
	};
	
	//--------------------------------------
	// command handling from requestor
	// command posting to worker
	
	var cmd = paramobj.cmd;
	//console.log("command posting to worker: " + cmd);
	switch(cmd)
	{
		//--------------------------------
		// actions
		case 'start':
		case 'stop':
		case 'close':
			port.postMessage( { command: cmd } );
			// return confirmation of these commands?
			return;
			break;
		//--------------------------------
		// set
		case 'setprefs':
			port.postMessage( { command: cmd, payload: paramobj.val } );
			wait();
			return workerReturnValue;
			break;
		//--------------------------------
		// get
		case 'getstatus':
		case 'getprefs':
			port.postMessage( { command: cmd } );
			wait();  // wait for worker callback to onmessage above. needs callback to call close() to exit this wait().
			return workerReturnValue;
			break;
		//--------------------------------
		// unknown
		default:
			console.log("workerPollingCommand: command to worker not recognized: " + cmd);
			return;
			break;
	}
};

exports.workerPollingGetStatus = function workerPollingGetStatus()
{
	// cannot send complex objects from module RPC to client
	var statusobj = exports.workerPollingExec( { cmd: 'getstatus' } );
	var msg = ""
		+ "Polling is" + ( statusobj.running ? "" : " not" ) + " running." + "\n"
		+ "Worker opened: " + TIME.dateTimeUTCToString(statusobj.opened) + ".\n"
	;
	if( statusobj.running === true )
	{
		msg += "Polling started: " + TIME.dateTimeUTCToString(statusobj.started) + ".\n";
		msg += "Polling has been running for " + TIME.timeElapsedToString( statusobj.started, new Date() ) + ".\n";
	}
	return msg;
};
