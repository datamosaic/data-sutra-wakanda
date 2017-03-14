
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonRefreshServerList = {};	// @button
	var buttonTestServerAlert = {};	// @button
	var buttonBindServerContact = {};	// @button
// @endregion// @endlock

// free functions

function appendToTextField( fieldID, newmsg )
{
	var curmsg = $$(fieldID).getValue();
	var msg = ( curmsg.length > 0 ? ( curmsg + "\n" ) : "" ) + newmsg;
	$$(fieldID).setValue(msg);
}

// eventHandlers// @lock

	buttonRefreshServerList.click = function buttonRefreshServerList_click (event)// @startlock
	{// @endlock
		ds.Server.allEntities( {
			onSuccess: function(event) {
				sources.server.setEntityCollection(event.entityCollection);
			},
			orderBy: "name asc"
		} );
	};// @lock

	buttonTestServerAlert.click = function buttonTestServerAlert_click (event)// @startlock
	{// @endlock
		var selserverID = sources.server.getCurrentElement().ID.value;
		var selserverName = sources.server.getCurrentElement().name.value;
		$$('textFieldMessage').setValue( "Testing email alert for server " + selserverName + "..." );
		SRVRMON.sendEmailTestServerAsync( {
			params: [ selserverID ],
			onSuccess: function(msg) {
				appendToTextField('textFieldMessage',msg);
			}
		} );
	};// @lock

	buttonBindServerContact.click = function buttonBindServerContact_click (event)// @startlock
	{// @endlock
		$$('textFieldMessage').setValue( "binding contact " + sources.alertContact.first_name + " to server " + sources.server.name + "..." );
		
		// sources normally points to the current element
		// it's ok to do this on client
		sources.ServerAlertContact.addNewElement();
		// Server is prefilled to current element (selection) because SAC is a relation attr in Server
		sources.ServerAlertContact.AlertContact.set( sources.alertContact.getCurrentElement() );  // set() because entity
		sources.ServerAlertContact.include_in_alert = true;
		sources.ServerAlertContact.save( { onSuccess: function(event) { 
			appendToTextField( 'textFieldMessage', "server alert contact created." );
			sources.server.serverRefresh( { forceReload: true } );  // for server table and any relations e.g. SAC
		} } );
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("buttonRefreshServerList", "click", buttonRefreshServerList.click, "WAF");
	WAF.addListener("buttonTestServerAlert", "click", buttonTestServerAlert.click, "WAF");
	WAF.addListener("buttonBindServerContact", "click", buttonBindServerContact.click, "WAF");
// @endregion
};// @endlock
