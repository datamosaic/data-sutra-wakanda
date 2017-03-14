
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var buttonWorkerDataServerStop = {};	// @button
	var buttonWorkerDataServerStart = {};	// @button
	var buttonGetGameServerLoad = {};	// @button
	var buttonGetDataServerLoad = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	buttonWorkerDataServerStop.click = function buttonWorkerDataServerStop_click (event)// @startlock
	{// @endlock
		console.log( "stop data server worker" );
	};// @lock

	buttonWorkerDataServerStart.click = function buttonWorkerDataServerStart_click (event)// @startlock
	{// @endlock
		console.log( "start data server worker" );
	};// @lock

	/**
	 * Promise-based load entity data
	 */
	function loadAllEntities() {
		var deferred = $.Deferred();
		
		ds.ServerLoad.allEntities( {
			onSuccess: function(event)
			{
				deferred.resolve(event.entityCollection);
//				sources.serverLoad.setEntityCollection(event.entityCollection);
			},
			orderBy: "rec_created asc"
		} );
		
		return deferred.promise();
	};
	/**
	 * Promise-based getGameServerLoad
	 */
	function getGameServerLoad() {
		var deferred = $.Deferred();
		
		SRVRMON.getAndStoreGameServerLoadAsync(
		{
			onSuccess: function(result)  // this is my return value from getAndStoreGameServerLoad()
			{
				if( result === true )
				{
					deferred.resolve();
				}
				else
				{
					deferred.reject(result);
				}
			},
			onError: function(error)
			{
				deferred.reject(error);
			}
		} );
		
		return deferred.promise();
	};
	
	
	buttonGetGameServerLoad.click = function buttonGetGameServerLoad_click (event)// @startlock
	{// @endlock
		// getting game server load and refreshing data
		// do these run in order or unknown?
		$.when( getGameServerLoad(), loadAllEntities() )
			// onsuccess of all promises
			.done(function(gameLoad, allLogEntities) {
				// call the entity refresh routine
				if (gameLoad) {
					console.log("game server stats polled");
				}
				
				// update the entities
				sources.serverLoad.setEntityCollection(allLogEntities);
			})
			// onerror or ontimeout of any promise
			.fail(function(error) {
				debug(error);
			})
		;
	};// @lock

	buttonGetDataServerLoad.click = function buttonGetDataServerLoad_click (event)// @startlock
	{// @endlock
		SRVRMON.getAndStoreDataServerLoadAsync(
		{
			onSuccess: function(result)  // this is my return value from getAndStoreCPULoad()
			{
				if( result === true )
				{
					ds.ServerLoad.allEntities( {
						onSuccess: function(event)
						{
							sources.serverLoad.setEntityCollection(event.entityCollection);
						},
						orderBy: "rec_created asc"
					} );
				}
			}
		} );
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("buttonWorkerDataServerStop", "click", buttonWorkerDataServerStop.click, "WAF");
	WAF.addListener("buttonWorkerDataServerStart", "click", buttonWorkerDataServerStart.click, "WAF");
	WAF.addListener("buttonGetGameServerLoad", "click", buttonGetGameServerLoad.click, "WAF");
	WAF.addListener("buttonGetDataServerLoad", "click", buttonGetDataServerLoad.click, "WAF");
// @endregion
};// @endlock
