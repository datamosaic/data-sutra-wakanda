//==============================================================================

WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonSetTestingPrefs = {};	// @button
	var textFieldAlertPeriod = {};	// @textField
	var buttonRefreshServers = {};	// @button
	var textFieldPollingTimeout = {};	// @textField
	var buttonWorkerClose = {};	// @button
	var buttonRestart = {};	// @button
	var documentEvent = {};	// @document
	var buttonPollingStatus = {};	// @button
	var textFieldPollingPeriod = {};	// @textField
	var imageButtonRefreshGrid = {};	// @buttonImage
	var buttonAutoPollingStop = {};	// @button
	var buttonAutoPollingStart = {};	// @button
	var buttonGetStatsSelectedServer = {};	// @button
// @endregion// @endlock

//==============================================================================

// free functions

function setPollingPrefFields( prefs )
{
	$$('textFieldPollingPeriod').setValue(prefs.period);
	$$('textFieldPollingTimeout').setValue(prefs.timeout);
	//$$('textFieldAlertPeriod').setValue(prefs.alertperiod);
}

function clearPollingPrefFields()
{
	$$('textFieldPollingPeriod').clear();
	$$('textFieldPollingTimeout').clear();
	//$$('textFieldAlertPeriod').clear();
}

function appendToTextField( fieldID, newmsg )
{
	var curmsg = $$(fieldID).getValue();
	var msg = ( curmsg.length > 0 ? ( curmsg + "\n" ) : "" ) + newmsg;
	$$(fieldID).setValue(msg);
}

//==============================================================================

// eventHandlers// @lock

	buttonSetTestingPrefs.click = function buttonSetTestingPrefs_click (event)// @startlock
	{// @endlock
		var prefsObj = {
			period: 1,
			timeout: 5
			//alertperiod: 0.25
		};
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'setprefs', val: prefsObj } ],
			onSuccess: function() {
				SRVRMON.workerPollingExecAsync( {
					// indentation pyramid of doom; better way to do multiple async?
					// have setprefs return newly set prefs
					params: [ { cmd: 'getprefs' } ],
					onSuccess: function(retval) {
						setPollingPrefFields(retval);
						$$('textFieldPolling').setValue("Testing prefs set.");
					}
				} );
			}
		} );
	};// @lock

	textFieldAlertPeriod.change = function textFieldAlertPeriod_change (event)// @startlock
	{// @endlock
		if( ! event.hasOwnProperty('originalEvent') )  return;  // needed whenever using textField.setValue() programatically
		var prefsObj = {
			alertperiod: $$('textFieldAlertPeriod').getValue()
		};
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'setprefs', val: prefsObj } ],
			onSuccess: function() {
				$$('textFieldPolling').setValue("Alert period set.");
			}
		} );
	};// @lock

	buttonRefreshServers.click = function buttonRefreshServers_click (event)// @startlock
	{// @endlock
		ds.Server.allEntities( {
			onSuccess: function(event) {
				sources.server.setEntityCollection(event.entityCollection);
			},
			orderBy: "name asc"
		} );
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		// apparently async module call just doesn't work here.
		// get current polling prefs and set the fields
		var prefs = SRVRMON.workerPollingExec( { cmd: 'getprefs' } );
		setPollingPrefFields(prefs);

		// http://forum.wakanda.org/showthread.php?5948-Grid-checkbox-column-bug
		$$('dataGridServer').column('includeInPoll')
		.setRenderer( function(myCell) {
			if(myCell.dataSource.length !=0 && myCell.rowNumber >= myCell.dataSource.length) {
			//The rule here can be adjusted based your need.
	    		myCell.cellDiv = [];
	    		return myCell;
	    	}
	    } );
	};// @lock

//==============================================================================
// instant

	buttonGetStatsSelectedServer.click = function buttonGetStatsSelectedServer_click (event)// @startlock
	{// @endlock
		var selserverID = sources.server.getCurrentElement().ID.value;
		var selserverName = sources.server.getCurrentElement().name.value;
		$$('textFieldLog').setValue( "Sending request..." );
		SRVRMON.doServerStatsAsync( {
			params: [ selserverID ],
			onSuccess: function(returnval) {
				if( returnval === true )
				{
					appendToTextField( 'textFieldLog', "Stats retrieved for " + selserverName + ".");
					sources.server.serverRefresh({forceRefresh:true});
				}
				else if( returnval === false )
				{
					appendToTextField( 'textFieldLog', "Could not get stats for " + selserverName + ".");
				}
				else
				{
					appendToTextField( 'textFieldLog', "Something weird happened:\n" + returnval);
				}
			}
		} );
	};// @lock

//==============================================================================
// polling

	//==============================================================================
	// actions

	buttonAutoPollingStart.click = function buttonAutoPollingStart_click (event)// @startlock
	{// @endlock
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'getprefs' } ],
			onSuccess: function(retval) {
				setPollingPrefFields(retval);
			}
		} );
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'start' } ],
			onSuccess: function() {
				$$('textFieldPolling').setValue("Polling started.");
			}
		} );
	};// @lock

	buttonAutoPollingStop.click = function buttonAutoPollingStop_click (event)// @startlock
	{// @endlock
		SRVRMON.workerPollingExecAsync( { 
			params: [ { cmd: 'stop' } ],
			onSuccess: function() {
				$$('textFieldPolling').setValue("Polling stopped.");
			}
		} );
	};// @lock

	buttonWorkerClose.click = function buttonWorkerClose_click (event)// @startlock
	{// @endlock
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'close' } ],
			onSuccess: function() {
				$$('textFieldPolling').setValue("Worker closed.");
				clearPollingPrefFields();
			}
		} );
	};// @lock

	//==============================================================================
	// set

	textFieldPollingPeriod.change = function textFieldPollingPeriod_change (event)// @startlock
	{// @endlock
		if( ! event.hasOwnProperty('originalEvent') )  return;  // needed whenever using textField.setValue() programatically
		var prefsObj = {
			period: $$('textFieldPollingPeriod').getValue()
		};
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'setprefs', val: prefsObj } ],
			onSuccess: function() {
				$$('textFieldPolling').setValue("Polling period set.");
			}
		} );
	};// @lock

	textFieldPollingTimeout.change = function textFieldPollingTimeout_change (event)// @startlock
	{// @endlock
		if( ! event.hasOwnProperty('originalEvent') )  return;  // needed whenever using textField.setValue() programatically
		var prefsObj = {
			timeout: $$('textFieldPollingTimeout').getValue()
		};
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'setprefs', val: prefsObj } ],
			onSuccess: function() {
				$$('textFieldPolling').setValue("Polling timeout set.");
			}
		} );

	};// @lock

	//==============================================================================
	// get

	buttonPollingStatus.click = function buttonPollingStatus_click (event)// @startlock
	{// @endlock
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'getprefs' } ],
			onSuccess: function(retval) {
				setPollingPrefFields(retval);
				var msg = ""
					+ "Polling is" + ( retval.running ? "" : " not" ) + " running." + "\n"
					+ "";
				$$('textFieldPolling').setValue(msg);
			}
		} );
	};// @lock

//==============================================================================
// tools

	buttonRestart.click = function buttonRestart_click (event)// @startlock
	{// @endlock
		var selserverID = sources.server.getCurrentElement().ID.value;
		SRVRMON.restartServerAsync( {
			params: [ selserverID ],
			onSuccess: function(msg) {
				$$('textFieldTools').setValue(msg);
			}
		} );
	};// @lock


//==============================================================================
// other

//==============================================================================
// history

	imageButtonRefreshGrid.click = function imageButtonRefreshGrid_click (event)// @startlock
	{// @endlock
		sources.server.serverRefresh({forceRefresh:true});
	};// @lock
	
//==============================================================================

// @region eventManager// @startlock
	WAF.addListener("buttonSetTestingPrefs", "click", buttonSetTestingPrefs.click, "WAF");
	WAF.addListener("textFieldAlertPeriod", "change", textFieldAlertPeriod.change, "WAF");
	WAF.addListener("buttonRefreshServers", "click", buttonRefreshServers.click, "WAF");
	WAF.addListener("textFieldPollingTimeout", "change", textFieldPollingTimeout.change, "WAF");
	WAF.addListener("buttonWorkerClose", "click", buttonWorkerClose.click, "WAF");
	WAF.addListener("buttonRestart", "click", buttonRestart.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("buttonPollingStatus", "click", buttonPollingStatus.click, "WAF");
	WAF.addListener("textFieldPollingPeriod", "change", textFieldPollingPeriod.change, "WAF");
	WAF.addListener("imageButtonRefreshGrid", "click", imageButtonRefreshGrid.click, "WAF");
	WAF.addListener("buttonAutoPollingStop", "click", buttonAutoPollingStop.click, "WAF");
	WAF.addListener("buttonAutoPollingStart", "click", buttonAutoPollingStart.click, "WAF");
	WAF.addListener("buttonGetStatsSelectedServer", "click", buttonGetStatsSelectedServer.click, "WAF");
// @endregion
};// @endlock
