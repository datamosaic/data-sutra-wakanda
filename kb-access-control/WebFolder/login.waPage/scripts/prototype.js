﻿/**
 * Listen for messages posted from parent window
 */
(function listenForParentMessages(){
	var portholeMethodOn = window.addEventListener ? "addEventListener" : "attachEvent";
	var portholeMethodOff = window.addEventListener ? "removeEventListener" : "detachEvent";
	var portholeEvent = portholeMethodOn == "attachEvent" ? "onmessage" : "message";
	// console.log("child page is listening");
	function messageListener(e) {
		// console.log("message received");
		// console.log(e);
		// go to new page within this project
		if (e.data.page) {
			location.pathname = e.data.page;
		}
		// go to new project
		else if (e.data.url) {
			location.href = e.data.url;
		}
		// login info, try to prefill as much as we can
		else if (e.data.user) {
			// check for logon object to get jquery elements
			if (window.LOGON) {
				var elems = LOGON.getElements();
			}
			// some sample values to try this with
			else {
				var elems = {
					userEntry: $('#fld_user'),
					passEntry: $('#fld_pass'),
					loginButton: $('#btn_signin')//,
					// loginDiv: $('#signin',
					// logoutDiv: $('#signout'),
					// userDisplay: $('.user')
				};
			}
			elems.userEntry.val(e.data.user);
			elems.passEntry.val(e.data.pass);
			// who is currently logged in
			LOGIN.userAsync({
				"onSuccess" : function(userInfo) {
					// not logged in, try to
					if (userInfo.name == 'default guest') {
						// we have a user and a pass, try to log in
						if (e.data.user && e.data.pass) {
							elems.loginButton.click();
						}
						// focus password if we don't have it
						else if (elems.userEntry.val().length) {
							elems.passEntry.focus();
						}
					}
					// unblock login page; somebody wants to see who's logged in
					else {
						window.parent.postMessage('unblock','*');
					}
				},
				"onError" : function(error) {
					// console.log(error);
				},
				"params" : []
			});
		}
	}
	window[portholeMethodOn](portholeEvent,messageListener,false);
})();
/**
 * Send message upstream when document actually finished loading
 */
WAF.onAfterInit = function onAfterInit() {
	// post message to parent that document has finished loading
	if (location.pathname != '/login/') {
		window.parent.postMessage('unblock','*');
	}
};