exports.login = function login (name,pass) {	if (LOGIN.valid()) {		LOGIN.logout();	}	return loginByPassword(name,pass);};exports.logout = function logout () {	return LOGIN.logout();}exports.session = function session() {	return LOGIN.session();}exports.user = function user() {	return LOGIN.session().user;}exports.projects = function projects(projectID) {	if (projectID) {		var URLs = SECURITY.path(projectID);	}	else {		var URLs = SECURITY.pathAll();	}		return URLs;}exports.createUser = function createUser(values,active) {	return KB.callAPI('AC.user.create',arguments);}exports.renameUser = function renameUser(oldName,newName,password) {	return KB.callAPI('AC.user.rename',arguments);}exports.removeUser = function removeUser(name) {	return KB.callAPI('AC.user.remove',arguments);}exports.activateUser = function activateUser(userName,flagActive) {	return KB.callAPI('AC.user.activate',[userName,flagActive]);}exports.getUserName = function getUserName(ID) {	return KB.callAPI('AC.user.getName',[ID]);}exports.resetUserPassword = function getUserName(ID,password) {	return KB.callAPI('AC.user.resetPass',[ID,password]);}exports.navigation = function getNavSet(navName) {	return KB.callAPI('AC.navigation.getSet',[navName]);}