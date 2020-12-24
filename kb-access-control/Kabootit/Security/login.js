// an invalid login
var invalid = {
	// the error number (passed as a number)
	error: 401,
	//the text of the error
	errorMessage: "Unauthorized"
};
exports.session = function() {
	return currentSession();
}
/**
 * Is the current session logged in and valid?
 */
exports.valid = function() {
	return (currentSession() && currentSession().storage) ? (currentSession().storage.validLogin || false) : false;
}
/**
 * Attempt to login using default login form
 *
 */
function LoginListener(userName, passwordOrKey, secondIsAKey) {
	//TODO: switch to using sha256 custom or higher
	// login valid
	var auth = authenticate(userName,passwordOrKey);
	if (typeof auth != 'boolean' && auth.error != 401) {
		// determine group belonging to and set up permissions
		if (true) {
			var groups = auth.belongsTo;
			// api
				// rebuild api with current credentials
			// TODO: navigation
			// TODO: SaaS filtering, etc
		}
		// hard code for gamma...only allow players access to web project
		var player = false;
		// grab this project's identifier and punch down
		Folder(FileSystemSync('PROJECT').path).forEachFile(function findProjectFile(file, iterator, parent) {
			// grab project id from project name
			if (file.extension == 'waProject') {
				var getID = /\((.*)\)/;
				var match = getID.exec(file.name);
				// there is an identifier, save what project this is
				if (match[1]) {
					var projID = match[1];
					currentSession().storage.project = projID;
					// hard code for gamma...only allow players access to web project
					var securityDS = solution.getApplicationByName("ה Security (AC)").ds;
					var user = securityDS.User({name:userName});
					if (projID != 'WEB' && user.Group.name == 'Player') {
						player = true;
					}
				}
			}
		});
		// hard code for gamma...only allow players access to web project
		if (player) {
			return invalid;
		}
		// save down prototyping password for easier login
		if (self.name == '☰ Application (APP)') {
			currentSession().storage.protoPass = passwordOrKey;
		}
		// set status as logged in
			//TODO: set this to be some UUID so more hack proof
		currentSession().storage.validLogin = true;
	}
	return auth;
};
exports.login = LoginListener;
/**
 * Log out current user and return to login form
 *
 */
function LogoutListener() {
	// mirror what happens in login, but do the reverse
	// directory logout (only when logged in)
	if (currentUser().name != 'default guest') {
		//custom flags
		delete currentSession().storage.validLogin;
//		delete currentSession().storage.project;
		return logout();
	}
	return false;
}
exports.logout = LogoutListener;
/**
 * Show login form
 *
 */
function showLogin() {
	// this method probably not needed any more as login form is shown when page with route user doesn't have access to is requested
}
exports.loginForm = showLogin;
/**
 * Authenticate credentials
 * @param {String} user
 * @param {String} pass
 * @param {String} [type='default'] Type of authentication to be performed; defaults to kabootit internal
 */
function authenticate(user,pass,type) {
	//default will be to reject login
	var valid = invalid;
	// kabootit internal auth
	if (!type || type == 'default') {
		var theUser = directory.internalStore.User({name: user});
		// use data from the project for login
			// TODO: flip around to cross project communication
		var securityDS = solution.getApplicationByName("ה Security (AC)").ds;
		var record = securityDS.User({name:user});
		// if a user was found
		if (record != null) {
			// see if the stored hash value is correct
			if (record.password === directory.computeHA1(user, pass)) {
				var groups = [];
				var putIntoStorage = {
						myID: record.ID
					};
				valid = {
					ID: record.ID,
					name: record.name,
					fullName: record.name_first + ' ' + record.name_last,
					belongsTo: ['Admin'], //theGroups,
					storage: putIntoStorage
				};
			}
		}
		// user exists in the directory and not in kabootit security project
			// TODO: disallow "kb" user to login when not developer
		if (theUser != null && !putIntoStorage) {
			// allow directory authentication
			return false;
		}
	}
	return valid;
}
exports.authenticate = authenticate;