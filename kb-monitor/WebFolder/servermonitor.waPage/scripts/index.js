//==============================================================================

WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var imageButtonRefreshEvents = {};	// @buttonImage
	var imageButtonRefreshInfo = {};	// @buttonImage
	var textFieldStatSaveCycle = {};	// @textField
	var buttonSSHdisplay = {};	// @button
	var imageButtonAdminSave = {};	// @buttonImage
	var imageButtonServerStop = {};	// @buttonImage
	var imageButtonServerStart = {};	// @buttonImage
	var buttonSSHkeyChange = {};	// @button
	var buttonRefreshServersGlobal = {};	// @button

	var documentEvent = {};	// @document
	var serverEvent = {};	// @dataSource
	var dataGridServer = {};	// @dataGrid
	var buttonRefreshServers = {};	// @button

	// server
	var buttonGetStatsSelectedServer = {};	// @button
	var imageButtonRefreshHistory = {};	// @buttonImage
	
	// contacts
	var imageButtonAlertContactForServer = {};	// @buttonImage
	var imageButtonRemoveContactForServer = {};	// @buttonImage
	var buttonTestServerAlert = {};	// @button
	
	// polling
	var imageButtonAutoPollingStart = {};	// @buttonImage
	var imageButtonAutoPollingStop = {};	// @buttonImage
	var textFieldPollingPeriod = {};	// @textField
	var textFieldPollingTimeout = {};	// @textField
	var imageButtonPollingStatus = {};	// @buttonImage
	var imageButtonWorkerClose = {};	// @buttonImage

// @endregion// @endlock

//==============================================================================
// helper functions

function appendToTextField( fieldID, newmsg )
{
	var curmsg = $$(fieldID).getValue();
	var msg = ( curmsg.length > 0 ? ( curmsg + "\n" ) : "" ) + newmsg;
	$$(fieldID).setValue(msg);
}

function enableWidget( wdgtID, wdgtState )
{
	wdgtState === true ? $$(wdgtID).enable() : $$(wdgtID).disable();
}

function sourcesFieldStringValid( fieldToTest )
{
	return fieldToTest.value !== null && fieldToTest.value.length > 0;
}

//==============================================================================
// helpful procedures

function doAvailContacts()
{
	var selserver = sources.server.getCurrentElement();
	var selserverID = selserver.ID.value;
	SRVRMON.getAvailContactsForServerAsync( {
		params: [ selserverID ],
		onSuccess: function(availContactsForServer) { 
			// three arrays in play:
			// - passed-in argument array (real array type)
			// - local array (real array type)
			// - sources.array (Wak entity coll pointing at array)
			arrAvailContactsForServer = availContactsForServer;  // straight assignment, no looking at fields
			sources.arrAvailContactsForServer.sync();  // update the wrapped up sources "array" with the real array's data
			// sources only knows about the fields manually defined
		}
	} );
}

function doServerWidgetsBasedOnType()
{
	var selserver = sources.server.getCurrentElement();
	switch( selserver.type.value )
	{
		case 'game':
		case 'xhrget':
			$$('textFieldRequestPath').enable();
			break;
		default:
			$$('textFieldRequestPath').disable();
			break;
	}
	switch( selserver.type.value )
	{
		case 'data':
			$$('textFieldAdminScriptStop').disable();
			break;
		default:
			$$('textFieldAdminScriptStop').enable();
			break;
	}
}

function doRefreshServerList()
{
	ds.Server.allEntities( {
		onSuccess: function(event) {
			sources.server.setEntityCollection(event.entityCollection);
		},
		orderBy: "name asc"
	} );
	// sources.server.serverRefresh({forceRefresh:true});  // this doesn't reload the dates on all the entries
}

function enableAdminWidgets()
{
	var selserver = sources.server.getCurrentElement();
	function canEnableAdminButton()
	{
		return sourcesFieldStringValid( selserver.admin_ip )
		  && sourcesFieldStringValid( selserver.admin_username )
		  && sourcesFieldStringValid( selserver.admin_script_path );
	}
	function canEnableStartButton()
	{
		return canEnableAdminButton() && sourcesFieldStringValid( selserver.admin_script_start );
	}
	function canEnableStopButton()
	{
		switch( selserver.type.value )
		{
			case 'data': return true;
			default: return canEnableAdminButton() && sourcesFieldStringValid( selserver.admin_script_stop );
		}
	}
	enableWidget( 'imageButtonServerStart', canEnableStartButton() );
	enableWidget( 'imageButtonServerStop', canEnableStopButton() );
}

//==============================================================================

// eventHandlers// @lock

	imageButtonRefreshEvents.click = function imageButtonRefreshEvents_click (event)// @startlock
	{// @endlock
		sources.server.serverRefresh({forceRefresh:true});
	};// @lock

	imageButtonRefreshInfo.click = function imageButtonRefreshInfo_click (event)// @startlock
	{// @endlock
		sources.server.serverRefresh({forceRefresh:true});
	};// @lock

	textFieldStatSaveCycle.change = function textFieldStatSaveCycle_change (event)// @startlock
	{// @endlock
		if( ! event.hasOwnProperty('originalEvent') )
			return;  // needed whenever using textField.setValue() programatically
		var prefsObj = {
			statcycle: $$('textFieldStatSaveCycle').getValue()
		};
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'setprefs', val: prefsObj } ],
			onSuccess: function(retval) {
				setPollingPrefFields(retval);
				$$('textFieldPolling').setValue("Stat save cycle set to " + retval.statcycle + ".");
			}
		} );

	};// @lock

	imageButtonAdminSave.click = function imageButtonAdminSave_click (event)// @startlock
	{// @endlock
		sources.server.save( {
			onSuccess: function(event) {
				enableAdminWidgets();
				$$('textFieldLogAdmin').setValue( "admin fields saved." );
			}
		} );	
	};// @lock

	buttonSSHkeyChange.click = function buttonSSHkeyChange_click (event)// @startlock
	{// @endlock
		var result = confirm("Really change the SSH public key? Should rarely be changed.");
		if( result !== true )
		{
			return;
		}
		var newKey = prompt( "New public key:", "insert new public key here" );
		if( newKey === null )
		{
			return;
		}
		SRVRMON.globalSetSSHkeyAsync( { 
			params: [ newKey ],
			onSuccess: function(retval) {
				if( retval === true )
					alert( "Successfully set new ssh key." );
				else
					alert( "Could not set new ssh key." );
			}
		} );
	};// @lock
	
	buttonSSHdisplay.click = function buttonSSHdisplay_click (event)// @startlock
	{// @endlock
		SRVRMON.globalGetSSHkeyAsync( { 
			onSuccess: function(retval) {
				prompt( "Here is the Server Monitor server's public key. This is read-only.", retval );
			}
		} );
	};// @lock

//==============================================================================
// admin

	imageButtonServerStart.click = function imageButtonServerStart_click (event)// @startlock
	{// @endlock
		var result = confirm("Definitely start the selected server?");
		if( result !== true )
		{
			$$('textFieldLogAdmin').setValue('Server start cancelled.');
			return;
		}
		var selserverID = sources.server.getCurrentElement().ID.value;
		SRVRMON.serverStartAsync( {
			params: [ selserverID ],
			onSuccess: function(msg) {
				$$('textFieldLogAdmin').setValue(msg);
			}
		} );
	};// @lock

	imageButtonServerStop.click = function imageButtonServerStop_click (event)// @startlock
	{// @endlock
		var result = confirm("Definitely stop the selected server?");
		if( result !== true )
		{
			$$('textFieldLogAdmin').setValue('Server stop cancelled.');
			return;
		}
		var selserverID = sources.server.getCurrentElement().ID.value;
		SRVRMON.serverStopYesIMeanStopAsync( {
			params: [ selserverID ],
			onSuccess: function(msg) {
				$$('textFieldLogAdmin').setValue(msg);
			}
		} );
	};// @lock

//==============================================================================
// page

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		// apparently async module call just doesn't work here.
		// get current polling prefs and set the fields
		var prefs = SRVRMON.workerPollingExec( { cmd: 'getprefs' } );
		setPollingPrefFields(prefs);

		$$('textFieldRequestOptions').disable();
	};// @lock

//==============================================================================
// server list

	buttonRefreshServers.click = function buttonRefreshServers_click (event)// @startlock
	{// @endlock
		doRefreshServerList();
	};// @lock

	buttonRefreshServersGlobal.click = function buttonRefreshServersGlobal_click (event)// @startlock
	{// @endlock
		doRefreshServerList();
	};// @lock

	serverEvent.onCurrentElementChange = function serverEvent_onCurrentElementChange (event)// @startlock
	{// @endlock
		// onCollectionChange causes an onCurrentElementChange, so avoid double-triggering
		if( event.eventKind !== "onCurrentElementChange" )
			return;
  		doAvailContacts();
  		doServerWidgetsBasedOnType();
		enableAdminWidgets();
	};// @lock

//==============================================================================
// individual server

	buttonGetStatsSelectedServer.click = function buttonGetStatsSelectedServer_click (event)// @startlock
	{// @endlock
		var selserverID = sources.server.getCurrentElement().ID.value;
		var selserverName = sources.server.getCurrentElement().name.value;
		$$('textFieldLogServer').setValue( "Sending request..." );
		SRVRMON.doServerStatsAsync( {
			params: [ selserverID ],
			onSuccess: function(returnval) {
				if( returnval === true )
				{
					appendToTextField( 'textFieldLogServer', "Stats retrieved for " + selserverName + ".");
					sources.server.serverRefresh({forceRefresh:true});
				}
				else if( returnval === false )
				{
					appendToTextField( 'textFieldLogServer', "Could not get stats for " + selserverName + ".");
				}
				else
				{
					appendToTextField( 'textFieldLogServer', "Something weird happened:\n" + returnval);
				}
			}
		} );
	};// @lock
	

	imageButtonRefreshHistory.click = function imageButtonRefreshHistory_click (event)// @startlock
	{// @endlock
		sources.server.serverRefresh({forceRefresh:true});
	};// @lock
	

//==============================================================================
// contacts

	imageButtonAlertContactForServer.click = function imageButtonAlertContactForServer_click (event)// @startlock
	{// @endlock
		var selserver = sources.server.getCurrentElement();
		var selcontact = sources.arrAvailContactsForServer.getCurrentElement();  // no .value needed to get atrrib for local array
		SRVRMON.setContactForServerAsync( {
			params: [ selserver.ID.value, selcontact.ID ],
			onSuccess: function(boolSuccess) {
				if( boolSuccess === true )
				{
					sources.server.serverRefresh({forceRefresh:true});
				}
			}
		} );
	};// @lock

	imageButtonRemoveContactForServer.click = function imageButtonRemoveContactForServer_click (event)// @startlock
	{// @endlock
		sources.ServerAlertContact.removeCurrent( { onSuccess: function(event) {
			sources.server.serverRefresh({forceRefresh:true});
		} } );
	};// @lock

	dataGridServer.onRowClick = function dataGridServer_onRowClick (event)// @startlock
	{// @endlock

	};// @lock

	buttonTestServerAlert.click = function buttonTestServerAlert_click (event)// @startlock
	{// @endlock
		var selserverID = sources.server.getCurrentElement().ID.value;
		var selserverName = sources.server.getCurrentElement().name.value;
		$$('richTextInProgress').show();
		SRVRMON.sendEmailTestServerAsync( {
			params: [ selserverID ],
			onSuccess: function(msg) {
				$$('richTextInProgress').hide();
				alert(msg);
			}
		} );
	};// @lock

//==============================================================================
// polling

	function setPollingPrefFields( prefs )
	{
		if( prefs.hasOwnProperty('period') )
			$$('textFieldPollingPeriod').setValue(prefs.period);
		if( prefs.hasOwnProperty('timeout') )
			$$('textFieldPollingTimeout').setValue(prefs.timeout);
		//if( prefs.hasOwnProperty('alertperiod') )
		//	$$('textFieldAlertPeriod').setValue(prefs.alertperiod);
		if( prefs.hasOwnProperty('statcycle') )
			$$('textFieldStatSaveCycle').setValue(prefs.statcycle);
	}
	
	function clearPollingPrefFields()
	{
		$$('textFieldPollingPeriod').clear();
		$$('textFieldPollingTimeout').clear();
		//$$('textFieldAlertPeriod').clear();
		$$('textFieldStatSaveCycle').clear();
	}

	//==================================
	// actions

	imageButtonAutoPollingStart.click = function imageButtonAutoPollingStart_click (event)// @startlock
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

	imageButtonAutoPollingStop.click = function imageButtonAutoPollingStop_click (event)// @startlock
	{// @endlock
		SRVRMON.workerPollingExecAsync( { 
			params: [ { cmd: 'stop' } ],
			onSuccess: function() {
				$$('textFieldPolling').setValue("Polling stopped.");
			}
		} );
	};// @lock

	imageButtonWorkerClose.click = function imageButtonWorkerClose_click (event)// @startlock
	{// @endlock
		var result = confirm("Definitely close the worker? Polling will stop and polling parameters will be reset to default values.");
		if( result !== true )
		{
			$$('textFieldPolling').setValue('Worker status not changed.');
			return;
		}
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'close' } ],
			onSuccess: function() {
				$$('textFieldPolling').setValue("Worker closed.");
				clearPollingPrefFields();
			}
		} );
	};// @lock

	//==================================
	// get/set

	imageButtonPollingStatus.click = function imageButtonPollingStatus_click (event)// @startlock
	{// @endlock
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'getprefs' } ],
			onSuccess: function(retval) {
				setPollingPrefFields(retval);
			}
		} );
		SRVRMON.workerPollingGetStatusAsync( {
			params: [  ],
			onSuccess: function(retval) {
				$$('textFieldPolling').setValue(retval);
			}
		} );
	};// @lock

	textFieldPollingPeriod.change = function textFieldPollingPeriod_change (event)// @startlock
	{// @endlock
		if( ! event.hasOwnProperty('originalEvent') )
			return;  // needed whenever using textField.setValue() programatically
		var prefsObj = {
			period: $$('textFieldPollingPeriod').getValue()
		};
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'setprefs', val: prefsObj } ],
			onSuccess: function(retval) {
				setPollingPrefFields(retval);
				$$('textFieldPolling').setValue("Polling period set to " + retval.period + ".");
			}
		} );
	};// @lock

	textFieldPollingTimeout.change = function textFieldPollingTimeout_change (event)// @startlock
	{// @endlock
		if( ! event.hasOwnProperty('originalEvent') )
			return;  // needed whenever using textField.setValue() programatically
		var prefsObj = {
			timeout: $$('textFieldPollingTimeout').getValue()
		};
		SRVRMON.workerPollingExecAsync( {
			params: [ { cmd: 'setprefs', val: prefsObj } ],
			onSuccess: function(retval) {
				setPollingPrefFields(retval);
				$$('textFieldPolling').setValue("Polling timeout set to " + retval.timeout + ".");
			}
		} );
	};// @lock

//==============================================================================

// @region eventManager// @startlock
	WAF.addListener("imageButtonRefreshEvents", "click", imageButtonRefreshEvents.click, "WAF");
	WAF.addListener("imageButtonRefreshInfo", "click", imageButtonRefreshInfo.click, "WAF");
	WAF.addListener("textFieldStatSaveCycle", "change", textFieldStatSaveCycle.change, "WAF");
	WAF.addListener("buttonSSHdisplay", "click", buttonSSHdisplay.click, "WAF");
	WAF.addListener("imageButtonAdminSave", "click", imageButtonAdminSave.click, "WAF");
	WAF.addListener("imageButtonServerStop", "click", imageButtonServerStop.click, "WAF");
	WAF.addListener("imageButtonServerStart", "click", imageButtonServerStart.click, "WAF");
	WAF.addListener("buttonSSHkeyChange", "click", buttonSSHkeyChange.click, "WAF");
	WAF.addListener("buttonRefreshServersGlobal", "click", buttonRefreshServersGlobal.click, "WAF");

	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("server", "onCurrentElementChange", serverEvent.onCurrentElementChange, "WAF");
	WAF.addListener("dataGridServer", "onRowClick", dataGridServer.onRowClick, "WAF");
	WAF.addListener("buttonRefreshServers", "click", buttonRefreshServers.click, "WAF");

	// server
	WAF.addListener("buttonGetStatsSelectedServer", "click", buttonGetStatsSelectedServer.click, "WAF");
	WAF.addListener("imageButtonRefreshHistory", "click", imageButtonRefreshHistory.click, "WAF");

	// contacts
	WAF.addListener("imageButtonAlertContactForServer", "click", imageButtonAlertContactForServer.click, "WAF");
	WAF.addListener("imageButtonRemoveContactForServer", "click", imageButtonRemoveContactForServer.click, "WAF");
	WAF.addListener("buttonTestServerAlert", "click", buttonTestServerAlert.click, "WAF");

	// polling
	WAF.addListener("imageButtonAutoPollingStart", "click", imageButtonAutoPollingStart.click, "WAF");
	WAF.addListener("imageButtonAutoPollingStop", "click", imageButtonAutoPollingStop.click, "WAF");
	WAF.addListener("textFieldPollingPeriod", "change", textFieldPollingPeriod.change, "WAF");
	WAF.addListener("textFieldPollingTimeout", "change", textFieldPollingTimeout.change, "WAF");
	WAF.addListener("imageButtonPollingStatus", "click", imageButtonPollingStatus.click, "WAF");
	WAF.addListener("imageButtonWorkerClose", "click", imageButtonWorkerClose.click, "WAF");

// @endregion
};// @endlock
