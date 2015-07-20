//==============================================================================
// default "constants"

var DEFAULT_WORKER_POLLING_PERIOD = 4 * 60 * 60;  // seconds (every 4 hours)

//==============================================================================
// worker vars and init

// initialized once when worker is started the first time

var workerPollingPeriod = DEFAULT_WORKER_POLLING_PERIOD;  // seconds
//var workerAlertPeriod = DEFAULT_WORKER_ALERT_PERIOD;  // min
var workerInterval = null;
var workerIsRunning = false;
var workerTimestampStarted = null;

var serverInfo = SECURITY.getServer();
var allProjects = serverInfo.projects;

//==============================================================================
// helpers

// function workerPollingHelper()
// {
// 	// need permisison to access ds.
// 	// needs to be called here. doesn't work in workerStart()/Stop().
// 	// revoke permission when finished.
// 	var workerPromoteToken = currentSession().promoteWith('Admin');
//
//
//
// 	currentSession().unPromote(workerPromoteToken);
// }  // function

function logMutexUnLock (){
	var logMutex = Mutex ('logAccess');
	logMutex.unlock();
}

function logMutexLock (){
	var logMutex = Mutex ('logAccess');
	var success = false;
	while(sucess = false){
		success = logMutex.tryToLock();
	}
}

// pull in static assets api...we're using not in the way wrapped up for (moving images into directory)
	// we want access to private methods
var SA = require(serverInfo.directory + 'StaticAssets/Kabootit/API/sa_1.js');

/**
 * Run commands
 *
 * @param {String} command Command to run (include all arguments here)
 * @param {Folder} folder Context to run command from
 * @return {Object} Output from command
 */
function callWorker(command, folder) {
	try {
		var worker = SystemWorker.exec(command, null, folder);

		return {
			result: worker.output.toString(),
			error: worker.error.toString()
		}
	}
	catch (e) {

	}
};

/**
 * Write out text file
 *
 * @param {File} file The file to write to
 * @param {String} text The text to write
 * @return {File} The written file
 */
function writeFileTXT(file, text) {
	try {
		var stream = new TextStream(file, "Overwrite");
		stream.rewind();
		stream.write(text);
		stream.flush();
		stream.close();
		
		return file;
	}
	catch (e) {
		
	}
};


//==============================================================================
// actions

function workerStart()
{
	// worker already started
	if( workerIsRunning === true )
		return;
	
	// set status as running and log it
	workerIsRunning = true;
	workerTimestampStarted = new Date();
	console.log("worker started" + " at " + workerTimestampStarted.toISOString() );
	
	// run first time and set up to run every four hours
	if( workerInterval === null )
	{
		// time in ms
		workerInterval = setInterval( backup, workerPollingPeriod * 1000 );
		
		// setInterval waits for the interval to elapse before the first time so do one manually
		setTimeout(backup,0);
	}
}

function workerStop()
{
	if( workerIsRunning === false )
		return;
	if( workerInterval !== null )
	{
		clearInterval( workerInterval );
		workerInterval = null;
	}
	workerIsRunning = false;
	var timestampFinished = new Date();
	var runningTime = ( timestampFinished.getTime() - workerTimestampStarted.getTime() ) / ( 1000 * 60 );  // convert ms to min
	workerTimestampStarted = null;
	console.log("worker stopped" + " at " + timestampFinished + " and ran for " + runningTime.toFixed(2) + " min");	
}

function workerClose()
{
	workerStop();
	close();
}

// run backup in this ds
function backup() {
	// build up zip command
	var theDate = new Date();
	var backupFileName = theDate.toISOString().slice(0, 10) + '_' + theDate.toISOString().slice(11, 13) + '_' + theDate.toISOString().slice(14, 16);
	var zip = 'zip -r /tmp/' + backupFileName + '.zip /tmp/' + backupFileName;
	
	// create temporary placeholder directory
	var backupDir = callWorker('mkdir /tmp/' + backupFileName, Folder('/tmp/'));
	
	for (var i = 0; i < allProjects.length; i++) {
		// grab ds for given project
		var projectDS = solution.getApplicationByName(allProjects[i].name).ds;
		
		var manifest = projectDS.backup();
		if (manifest === null){
			console.log(allProjects[i].id + " Backup Error");
		}
		else {
			console.log(allProjects[i].id + " Backup OK");
			
			var wakBackup = Folder(File(manifest.path).parent.path + 'DataFolder');
			var kbTemp = Folder('/tmp/' + backupFileName + '/' + allProjects[i].id);
			
			// copy / rename newly created backup
			SA.file.copyTree(
				wakBackup,
				kbTemp
			);
			// bring across manifest.json as well...why not working as well?
			// manifest.copyTo(kbTemp,true);
		
			// add to zip command
			// zip += kbTemp + '/ ';
		
			// prune old backup copies
			var lastBackups = File(manifest.parent.parent.path + 'lastBackups.json');
			var oldBackups = JSON.parse(lastBackups.toString());
			while (oldBackups.length >= 42) {
				// remove directory through CLI, because wakanda doesn't have a directory delete
				callWorker('rm -R ' + File(oldBackups[0]).parent.path, '/');
				// don't keep track of this backup anymore
				oldBackups = oldBackups.slice(1);
			}
			// write out backups still stored
			writeFileTXT(lastBackups,JSON.stringify(oldBackups));
		}
	}
	
	// create temporary zip file
	var zippedFile = callWorker(zip,Folder('/tmp/'));
	console.log("Backup completed succcessfully on " + allProjects.length + " projects.");
	
	// upload this file to dropbox
	// var droppedBox = dropbox('/tmp/' + backupFileName + '.zip');
	
	return {
		zip: zippedFile.result,
		dropbox: 'nothing'//droppedBox.result
	}
}

// copy backup to dropbox
function dropbox(backupFilePath) {
	console.log("Dropbox doing its thing...");
	
	// variables specific to particular installation
	//TODO: in addition to setting these correctly (and installing the CLI tools) you must also authorize the server with the particular dropbox account
	var DROPBOX_FOLDER = "/home/ubuntu/Dropbox\ \(Stratotainment\,\ LLC\)/s\ Server\ Backups/";
	var DROPBOX_BIN = "/home/ubuntu/.dropbox/dropbox.py";
	
	// command to grab status
	var drop = DROPBOX_BIN + ' filestatus ' + DROPBOX_FOLDER;
	
	// move temp backup zip file into dropbox for synchronization
	var backupFile = File(backupFilePath);
	backupFile.moveTo(DROPBOX_FOLDER + backupFile.name,true);
	
	// check dropbox status
		// TODO: do this after delay
	var dropFile = callWorker(drop, Folder('/'));
	
	console.log("Dropbox: " + dropFile.result);
	
	return {
		result: dropFile.result
	};
}

//==============================================================================
// message receiving from server-side module

// onconnect is whenever someone connects to this SharedWorker to talk to it
onconnect = function(msg)
{
	var port = msg.ports[0];  // bidirectional
	port.onmessage = function(event)
	{
		var message = event.data;
		switch(message.command)
		{
			//--------------------------------
			// actions
			case 'start':
				workerStart();
				break;
			case 'stop':
				workerStop();
				break;
			case 'close':
				workerClose();
				break;
			case 'backup':  // run a one-off backup 
				var success = backup();
				port.postMessage( { response: "backup", payload: success } );
				break;
			//--------------------------------
			// set
			// case 'setprefs':
			// 	workerSetPrefs(message.payload);
			// 	console.log("worker setprefs");
			// 	break;
			//--------------------------------
			// get
			// case 'isrunning':
			// 	port.postMessage( { response: "running", payload: workerIsRunning } );
			// 	break;
			//--------------------------------
			// unknown
			default:
				console.log( "workerPolling: unrecognized command " + message.command );
				break;
		}
	}
}