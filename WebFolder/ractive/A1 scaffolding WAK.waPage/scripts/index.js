
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button11 = {};	// @button
	var button10 = {};	// @button
	var button8 = {};	// @button
	var button7 = {};	// @button
	var button6 = {};	// @button
	var button5 = {};	// @button
	var button4 = {};	// @button
	var button3 = {};	// @button
	var button2 = {};	// @button
	var button1 = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	button11.click = function button11_click (event)// @startlock
	{// @endlock
		console.log(new Date());
	};// @lock

	button10.click = function button10_click (event)// @startlock
	{// @endlock
		// TODO: spinner
		$('#container').toggle();
		
		function getTemplate() {
			var deferred = $.Deferred();
			// get RPC results
			RactiveRPC.testTemplateAsync({
				onsuccess: function(results) {
					deferred.resolve(results);
				},
				onerror: function(error) {
					deferred.reject({ code: error.data, msg: error.message });	
				}
			});	
			
			return deferred.promise();
		};
		
		// TODO: flip to async
		function getData() {
		  var deferred = $.Deferred();
		  deferred.resolve(RactiveRPC.testData());
		  return deferred.promise();
		};

		$.when( getTemplate(), getData() )
			.done(function(template, data) {
		
				var ractive = new Ractive({
				  el: '#container',
				  template: template, // from RPC 1
				  data: data // from RPC 2
				});

				document.getElementById( 'count' ).addEventListener( 'click', function () {
				  ractive.set( 'counter', ractive.get( 'counter' ) + 1 );
				});
				
				// TODO: turn off spinner
				$('#container').toggle();
				
			})
			.fail(function(error) {
				console.log(error);		
				
				// TODO: turn off spinner
				$('#container').toggle();	
			});
			
		
				
	};// @lock

	button8.click = function button8_click (event)// @startlock
	{// @endlock
		var x;
		try {
			x = RactiveRPC.testTemplate();
		} catch (e) {
			console.log(e.data);
		};
		console.log(x);
	};// @lock

	button7.click = function button7_click (event)// @startlock
	{// @endlock
		function getTemplate() {
		  var deferred = $.Deferred();
			// get RPC results
			var results;
			try {
				results = RactiveRPC.testTemplate();
			} catch (error) {
				results = error;
			};
			// error checking (go to deferred.done or deferred.fail
			if ( results.name !== "ServerError" ) {
				deferred.resolve(results);	
			}
			else {
				deferred.reject({ code: results.data, msg: results.message });	
			}
			return deferred.promise();
		};
		
		function getData() {
		  var deferred = $.Deferred();
		  deferred.resolve(RactiveRPC.testData());
		  return deferred.promise();
		};

		$.when( getTemplate(), getData() )
			.done(function(template, data) {
		
				var ractive = new Ractive({
				  el: '#container',
				  template: template, // from RPC 1
				  data: data // from RPC 2
				});

				document.getElementById( 'count' ).addEventListener( 'click', function () {
				  ractive.set( 'counter', ractive.get( 'counter' ) + 1 );
				});
				
			})
			.fail(function(error) {
				console.log(error);			
			});
				
	};// @lock

	button6.click = function button6_click (event)// @startlock
	{// @endlock
		function getTemplate() {
		  var deferred = $.Deferred();
		  deferred.resolve(RactiveRPC.testTemplate());
		  return deferred.promise();
		};
		
		function getData() {
		  var deferred = $.Deferred();
		  deferred.resolve(RactiveRPC.testData());
		  return deferred.promise();
		};

		$.when( getTemplate(), getData() )
			.done(function(template, data) {
		
				var ractive = new Ractive({
				  el: '#container',
				  template: template,
				  data: data
				});

				document.getElementById( 'count' ).addEventListener( 'click', function () {
				  ractive.set( 'counter', ractive.get( 'counter' ) + 1 );
				});
				
			});
				
	};// @lock

	button5.click = function button5_click (event)// @startlock
	{// @endlock
		function getTemplate() {
		  var deferred = $.Deferred();
		  deferred.resolve(RactiveRPC.testTemplate());
		  return deferred.promise();
		};

		$.when( getTemplate() )
			.done(function(template) {
		
				var ractive = new Ractive({
				  el: '#container',
				  template: template,
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
				
			})
			
			.fail(function(error) {
				console.log(error);
			});	
				
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		var deferred = $.Deferred();
		deferred.resolve(RactiveRPC.testTemplate());
		deferred.done(function(template) {
		   var ractive = new Ractive({
			  el: '#container',
			  template: template,
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
		});
		
		function ractivate(template) {
			
			
		}

		
		
	};// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		var deferred = $.Deferred();

		deferred.done(function(value) {
		   console.log(value);
		});

		deferred.resolve(RactiveRPC.helloWorld());
		
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		console.log(RactiveRPC.helloWorld());
	};// @lock

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

// @region eventManager// @startlock
	WAF.addListener("button11", "click", button11.click, "WAF");
	WAF.addListener("button10", "click", button10.click, "WAF");
	WAF.addListener("button8", "click", button8.click, "WAF");
	WAF.addListener("button7", "click", button7.click, "WAF");
	WAF.addListener("button6", "click", button6.click, "WAF");
	WAF.addListener("button5", "click", button5.click, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
// @endregion
};// @endlock
