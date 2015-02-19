/**
 * Class that helps with login page.
 *	
 * @param {jQuery.Element[]} $user User name data entry
 * @param {jQuery.Element[]} $pass Password data entry
 * @param {jQuery.Element[]} $loginBtn Button to login
 * @param {jQuery.Element[]} $loginDiv Div containing above controls to login
 * @param {jQuery.Element[]} $logoutDiv Div showing who is logged in and allowing to logout
 * @param {jQuery.Element[]} $userDisplay Shows who currently is logged in
 */
function Login($user, $pass, $loginBtn, $loginDiv, $logoutDiv, $userDisplay) {
	// reference to the class so can access it from other contexts
	var that = this;
	
	// check all inputs and prefill with defaults
	if ($user == undefined) { $user = $('#fld_user') };
	if ($pass == undefined) { $pass = $('#fld_pass') };
	if ($loginBtn == undefined) { $loginBtn = $('#btn_signin') };
	if ($loginDiv == undefined) { $loginDiv = $('#signin') };
	if ($logoutDiv == undefined) { $logoutDiv = $('#signout') };
	if ($userDisplay == undefined) { $userDisplay = $('.user') };
	
	// internal variables
	var user;
	
	/**
	 * Expose all jquery elements
	 */
	this.getElements = function getJQueryElements() {
		return {
			userEntry: $user, 
			passEntry: $pass, 
			loginButton: $loginBtn, 
			loginDiv: $loginDiv, 
			logoutDiv: $logoutDiv, 
			userDisplay: $userDisplay
		}
	};
	
	/**
	 * Attempt to login
	 * //TODO: could flip around to async with promises, but seems a bit hairy for what we get in return
	 * @param {jQuery.Event} event
	 */
	this.signin = function signin(event) {
		// don't treat current element as link or button
		event.preventDefault();
		
		// current wakanda session
		var before = LOGIN.session();
	
		var userName = $user.val();
		var password = $pass.val();
		var result = LOGIN.login(userName,password);
	
		if (result) {
			// wakanda session after login
			var after = LOGIN.session();
			
			// we're logged in as somebody new now
			if (after.ID != before.ID) {
				// clear out user and password
				$user.val("");
				$pass.val("");
				
				// running in an iframe
				if (window.parent != window) {
					// login completed successfully, navigate to first nav item
					window.parent.postMessage('softRefresh','*');
				}
				// we had requested a particular page, go there
				else if (before.storage.pageRequested) {
					window.location = '/' + before.storage.pageRequested + '/';
				}
				// go home
				else {
					window.location = '/';
				}
			}
		}
		// TODO: better log out message
		else {
			alert("Login unsuccessful.");
		}
	};
	
	/**
	 * Attempt to logout
	 *
	 * @param {jQuery.Event} event
	 */
	this.signout = function signout(event) {
		// don't treat current element as link or button
		event.preventDefault();
		
		// logout current user
		LOGIN.logoutAsync({
			"onSuccess" : function(result) {
				// reload current page so will show option to login
				location.reload();
			},
			"onError" : function(error) {
				// console.log(error);
			},
			"params" : []
		});
	};
	
	/**
	 * This function will be run when new LOGIN instantiated
	 */
	var __construct = function constructor() {
		// grab user/pass
		function getUser() {
			var deferred = $.Deferred();
			
			LOGIN.userAsync({
				"onSuccess" : function(result) {
					// some test for good data, we probably have valid data
					if (typeof result == 'object') {
						deferred.resolve(result);
					}
					// something not right, m’aidez
					else {
						deferred.reject(result);
					}
				},
				"onError" : function(error) {
					// console.log(error);
					deferred.reject(error);
				},
				"params" : []
			});
			
			return deferred.promise();
		};
		
		// after current user retrieved, do some stuff
		$.when( getUser() )
			// onsuccess of all promises
			.done(function(userInfo) {
				// fill user name and pass
				user = userInfo;
				
				// show login form or status of who logged in
				if (user.name == 'default guest') {
					$loginDiv.fadeIn();
		
					// focus user name
					$user.focus();
				}
				// show sign out
				else {
					// change name to that of logged in
					$userDisplay.html(user.fullName);

					$logoutDiv.fadeIn();
				}
			})
			// onerror or ontimeout of any promise
			.fail(function(error) {
				console.log(error);
			})
		;
		
		// hook up listeners on enter in user/pass
		$pass.keypress(function(event) {
			if ( event.which == 13 ) {
			 	event.preventDefault();
				$loginBtn.trigger('click');
			}
		});
		
		// attempt to get credentials from parent iframe (running in prototyping mode)
		if (window.parent != window) {
			// TODO: need to pass in $user and $pass so that prototype.js can target the correct elements
			window.parent.postMessage('getCredentials','*')
		}
	}();
};