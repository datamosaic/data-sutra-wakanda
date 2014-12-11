
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
	var btn_view_2 = {};	// @button
	var btn_view_1 = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		var Router = {};
		
		Router.routes = {
			"tab1" : function() { $("#btn_view_1").trigger('click') },
			"tab2" : function() { $("#btn_view_2").trigger('click') }
		};
		
		window.Router = Router;
		
		// get the url and load everything else beside the main page that was returned by request handler
		
	};// @lock

	btn_view_2.click = function btn_view_2_click (event)// @startlock
	{// @endlock
		// RPC 1: return a promise
		function getTemplate() {
			var deferred = $.Deferred();
			// get RPC results
			RactiveRPC.tab2templateAsync({
				onsuccess: function(results) {
					deferred.resolve(results);
				},
				onerror: function(error) {
					deferred.reject(error);	
				},
				ontimeout: function(error) {
					deferred.reject(error);	
				},
				timeout: 2000,
				params: [1,2]
			});	
			
			return deferred.promise();
		};
		
		// RPC 2: return a promise
		function getData() {
			var deferred = $.Deferred();
			// get RPC results
			RactiveRPC.tab2dataAsync({
				onsuccess: function(results) {
					deferred.resolve(results);
				},
				onerror: function(error) {
					deferred.reject(error);	
				},
				ontimeout: function(error) {
					deferred.reject(error);	
				},
				timeout: 2000,
				params: [1,2]
			});	
			
			return deferred.promise();
		};

		// resolve all promises at the same time
		$.when( getTemplate(), getData() )
			// onsuccess of all promises
			.done(function(template, data) {
		
				var ractive = new Ractive({
				  el: '#container',
				  template: template, // from RPC 1
				  data: data // from RPC 2
				});

				document.getElementById( 'count' ).addEventListener( 'click', function () {
				  ractive.set( 'counter', ractive.get( 'counter' ) + 1 );
				});
				
				// routing
				history.pushState({"2" : "tab2"}, "2", "tab2");
				
			})
			// onerror or ontimeout of any promise
			.fail(function(error) {
				console.log(error);		

			});	
	};// @lock

	btn_view_1.click = function btn_view_1_click (event)// @startlock
	{// @endlock
		// RPC 1: return a promise
		function getTemplate() {
			var deferred = $.Deferred();
			// get RPC results
			RactiveRPC.testTemplateAsync({
				onsuccess: function(results) {
					deferred.resolve(results);
				},
				onerror: function(error) {
					deferred.reject(error);	
				},
				ontimeout: function(error) {
					deferred.reject(error);	
				},
				timeout: 2000,
				params: [1,2]
			});	
			
			return deferred.promise();
		};
		
		// RPC 2: return a promise
		function getData() {
			var deferred = $.Deferred();
			// get RPC results
			RactiveRPC.testDataAsync({
				onsuccess: function(results) {
					deferred.resolve(results);
				},
				onerror: function(error) {
					deferred.reject(error);	
				},
				ontimeout: function(error) {
					deferred.reject(error);	
				},
				timeout: 2000,
				params: [1,2]
			});	
			
			return deferred.promise();
		};

		// resolve all promises at the same time
		$.when( getTemplate(), getData() )
			// onsuccess of all promises
			.done(function(template, data) {
		
				var ractive = new Ractive({
				  el: '#container',
				  template: template, // from RPC 1
				  data: data // from RPC 2
				});

				document.getElementById( 'count' ).addEventListener( 'click', function () {
				  ractive.set( 'counter', ractive.get( 'counter' ) + 1 );
				});
				
				// routing
				history.pushState({"1" : "tab1"}, "1", "tab1");

				
			})
			// onerror or ontimeout of any promise
			.fail(function(error) {
				console.log(error);		

			});	
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("btn_view_2", "click", btn_view_2.click, "WAF");
	WAF.addListener("btn_view_1", "click", btn_view_1.click, "WAF");
// @endregion
};// @endlock
