
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var imageButtonRefreshGrid = {};	// @buttonImage
	var buttonDeleteSelected = {};	// @button
// @endregion// @endlock

	// this is wrapped in onAfterInit() so it's ok to have it free in this scope
	function refreshLoadHistoryGrid()
	{
		sources.Server1.serverRefresh({forceRefresh:true});
		sources.serverLoad.serverRefresh({forceRefresh:true});
		ds.ServerLoad.allEntities( {
			onSuccess: function(event) {
				sources.serverLoad.setEntityCollection(event.entityCollection);
			},
			orderBy: "rec_created desc"
		} );
	}

// eventHandlers// @lock

	imageButtonRefreshGrid.click = function imageButtonRefreshGrid_click (event)// @startlock
	{// @endlock
		refreshLoadHistoryGrid();
	};// @lock

	buttonDeleteSelected.click = function buttonDeleteSelected_click (event)// @startlock
	{// @endlock
		var gridToDeleteIn = 'dataGridStatsHistory';
		// this is meant to be client code so don't concern with moving it somewhere else
		var statIDs = WAF.sources.serverLoad.getIDs();
		var selectedEntityIndexArray = $$(gridToDeleteIn).getSelectedRows();
		var selectedStatIDs = [];
		$.each( selectedEntityIndexArray, function() {
			selectedStatIDs.push(statIDs[this].ID);
		} );
		
		WAF.sources.serverLoad.deleteSelected( {
			onSuccess: function(event) {
				WAF.sources.serverLoad.setEntityCollection(event.result);
				WAF.sources.serverLoad.orderBy("rec_created desc");
				var errorRows = [];
				var statIDs = WAF.sources.serverLoad.getIDs();
				for( var i = 0, len = statIDs.length; i < len; ++i ) {
					$.each( event.userData.selectedStatIDs, function() {
						if( this == statIDs[i].ID )  errorRows.push(i);
					} );
				}
				if( errorRows.length > 0 ) {
					$$('textFieldDeleteResult')
					.setValue("The highlighted stats could not be removed: " + errorRows.toString() );
					$$(gridToDeleteIn).setSelectedRows(errorRows);
				}
				else {
					$$('textFieldDeleteResult')
					.setValue("Your selection has been removed on the server.");
					//if( event.result.length > 0 )
					//	$$(gridToDeleteIn).setSelectedRows();
				}
				refreshLoadHistoryGrid();
			},
			userData: { selectedStatIDs: selectedStatIDs }
		}, $$(gridToDeleteIn).getSelectedRows() );
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("imageButtonRefreshGrid", "click", imageButtonRefreshGrid.click, "WAF");
	WAF.addListener("buttonDeleteSelected", "click", buttonDeleteSelected.click, "WAF");
// @endregion
};// @endlock
