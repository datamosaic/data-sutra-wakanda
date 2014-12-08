
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button1 = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		RactiveRPC.helloWorldAsync({
			onsuccess: function(data) {
				console.log(data);
			},
			onerror: function(error) {
				
			},
			params : []
		});
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		
		// TODO: move to a rpc
		var ractive = new Ractive({
		  el: '#container',
		  template: '#template',
		  data: {
		  	greeting: 'Hello',
		  	name: 'world',
		  	color: 'purple',
		  	size: 4,
		  	font: 'Georgia',
		  	counter: 0
		  }
		});

		document.getElementById( 'count' ).addEventListener( 'click', function () {
		  ractive.set( 'counter', ractive.get( 'counter' ) + 1 );
		});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
