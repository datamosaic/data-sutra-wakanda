WAF.onAfterInit = function onAfterInit() {
	// @region namespaceDeclaration
	
	var btn_signin = {};
	var btn_signout = {};
	
	// @endregion
	
	// eventHandlers
	
	// show sign in or out depending on if logged in
	if (LOGIN.session().user.name == 'default guest') {
		$('#signin').fadeIn();
		$('#fld_user').focus();
	}
	// show sign out
	else {
		// change name to that of logged in
		$('.user').html(LOGIN.session().user.fullName);
		
		$('#signout').fadeIn();
	}
	
	$( "#fld_pass" ).keypress(function(event) {
		if ( event.which == 13 ) {
		 	event.preventDefault();
			
			$('#btn_signin').trigger('click');
		}
	});
	
	btn_signin.click = function btn_signin_click (event) {
		event.preventDefault();
		
		var before = LOGIN.session();
	
		var user = $('#fld_user').val();
		var pass = $('#fld_pass').val();
		var result = LOGIN.login(user,pass);
	
		if (result) {
			var after = LOGIN.session();
		
			if (after.ID != before.ID) {
				formClear();
				if (before.storage.pageRequested) {
					window.location = '/' + before.storage.pageRequested + '/';
				}
				else {
					window.location = '/';
				}
			}
		}
		else {
			alert("Login unsuccessful.")
		}
	};
	
	btn_signout.click = function btn_signout_click (event) {
		event.preventDefault();
		
		LOGIN.logout();
		location.reload();
	};

	function formClear() {
		$('#fld_user').val("");
		$("#fld_pass").val("");
	};
				
	// @region eventManager
	
	WAF.addListener("btn_signin", "click", btn_signin.click, "WAF");
	WAF.addListener("btn_signout", "click", btn_signout.click, "WAF");
	
	// @endregion
};