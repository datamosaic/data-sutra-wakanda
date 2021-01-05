exports.login = function login (name,pass) {
	if (LOGIN.valid()) {
		LOGIN.logout();
	}
	return loginByPassword(name,pass);
};

exports.logout = function logout () {
	return LOGIN.logout();
}

exports.session = function session() {
	return LOGIN.session();
}

exports.user = function user() {
	return LOGIN.session().user;
}

exports.getNavigation = function getNavSet(navName) {
	return KB.callAPI('AC.navigation.getSet',[navName,true]);
}
