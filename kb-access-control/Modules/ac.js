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
exports.sessions = function sessionsAll() {
	return getUserSessions();
}
exports.user = function user() {
	return LOGIN.session().user;
}
exports.projects = function projects(projectID) {
	if (projectID) {
		var URLs = SECURITY.path(projectID);
	}
	else {
		var URLs = SECURITY.pathAll();
	}
	return URLs;
}
exports.createGroup = function createGroup(groupName) {
	return KB.callAPI('AC.group.create',arguments);
}
exports.createUser = function createUser(values,active) {
	return KB.callAPI('AC.user.create',arguments);
}
exports.renameUser = function renameUser(oldName,newName,password) {
	return KB.callAPI('AC.user.rename',arguments);
}
exports.removeUser = function removeUser(name) {
	return KB.callAPI('AC.user.remove',arguments);
}
exports.activateUser = function activateUser(userName,flagActive) {
	return KB.callAPI('AC.user.activate',[userName,flagActive]);
}
exports.getUserValue = function getUserValue(ID,value) {
	return KB.callAPI('AC.user.getValue',arguments);
}
exports.resetUserPassword = function resetPass(ID,password) {
	return KB.callAPI('AC.user.password.reset',[ID,password]);
}
exports.changeUserPassword = function changePass(ID,oldPass,newPass) {
	return KB.callAPI('AC.user.password.change',[ID,oldPass,newPass]);
}
exports.navigation = function getNavSet(navName) {
	var userID = currentSession().user.ID;
	return KB.callAPI('AC.navigation.getSet',[navName,userID]);
}
exports.navigationURL = function getNavConfigURL() {
	return KB.callAPI('AC.navigation.configure');
}
/**
 * Temporary helper to get users/groups rolling
 * @param {String} [ID] Particular user to modify
 * @param {String} [groupName] Name of group to add to (defaults to player)
 * @returns {Number} How many records modified
 */
// exports.helper =
function helpSetupSomething(ID,groupName) {
	if (!ID) {
		var coll = ds.User.all();
	}
	else {
		var coll = ds.User.createEntityCollection();
		coll.add(ds.User({ID:ID}));
	}
	var player = ds.Group({name:"Player"});
	var admin = ds.Group({name:"Admin"});
	var group = player;
	switch (groupName) {
		case 'Admin':
			group = admin;
			break
		case 'Player':
			group = player;
			break
	}
	for (var i = 0; i < coll.length; i++) {
		var record = coll[i];
		if (groupName || !record.Group) {
			record.Group = group;
			record.save();
		}
	}
	// number of recs touched
	return i;
}
exports.billy = function billy() {
	var coll = ds.User({email:"billygarretsen@gmail.com"});
	return coll;
}