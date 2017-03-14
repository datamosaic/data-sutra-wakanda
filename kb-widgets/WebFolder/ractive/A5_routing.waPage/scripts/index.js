
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var btn_load = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	btn_load.click = function btn_load_click (event)// @startlock
	{// @endlock
		page('xoxo');
	};// @lock
	
	(function(){
		
		Ractive.routesAsync({
			onsuccess : function(results) {
				
				// init router
				page.base('/ractive/A5_routing/');
				page('*', route );
				page();
				
				// store routes
				page.routes = results;
			}
		});
	
	
	})();
	

	function route(ctx) {
		
		// 1. parse url string to endpoints
		
		// 2. display endpoints
		
		// 3. errors: component not found, entire page not found, etc
		
		console.log(ctx);
	};
	
	function show(bit) {
		// rpc to get template and data
			// compile on server (eventually)
		// store compiled on client after initial grab, dump oldest in array
			// up to xxx amount of templates (ie, store only 10)
		
	};
	
	function parse(url) {
		
		
		return []
	};
	

	

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock

		
		
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("btn_load", "click", btn_load.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
