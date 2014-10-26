WAF.onAfterInit = function onAfterInit() {
					

// Add the code that needs to be shared between components here


				
				// @region namespaceDeclaration
					
	var btn_signin = {};	// @button
	
				// @endregion
				
				// eventHandlers
				
					
	
		$( "#fld_pass" ).keypress(function( event ) {
		  if ( event.which == 13 ) {
		  		console.log("key pressed");
		  		$('#btn_signin').trigger('click');
		     	event.preventDefault();
		  }
	});
	
	btn_signin.click = function btn_signin_click (event)
	{
		var before = AC.session();
	
		var user = $('#fld_user').val(); //name
		var pass = $('#fld_pass').val(); //team
		var result = AC.login(user,pass);
	
		if (result) {
			var after = AC.session();
		
			if (after.ID != before.ID) {
				console.log("Session is different now!");
				before.__ = 'Before';
				console.log(before);
				after.__ = 'After';
				console.log(after);
				
				formClear();
				
				// some alert that logged in
//				alert("Login succeeded.")
				
				if (before.storage.pageRequested) {
					window.location = '/' + before.storage.pageRequested + '/';
				}
				else {
					window.location = '/inventory/';
				}
			}
		}
		else {
			alert("Login unsuccessful.")
		}
	};

	function formClear() {
		$('#fld_user').val("");
		$("#fld_pass").val("");
	}

	
				
				// @region eventManager
					
	WAF.addListener("btn_signin", "click", btn_signin.click, "WAF");
	
				// @endregion
				};
