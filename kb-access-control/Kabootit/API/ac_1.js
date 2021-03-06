﻿/**
 * AC API
 * @version 1
 * @modified 2014 April 14
 */
var AC = {
	organization : {
		getAll: null,
		removeAll: null
	},
	group : {
		create: null,
		rename: null,
		remove: null
	},
	user : {
		create: null,
		rename: null,
		remove: null,
		resetPass: null,
		password: {
			reset: null,
			change: null
		},
		activate: null,
		getName: null
	},
	navigation : {
		getSet: null,
		configure: null,
		update: null
	}
};
/**
 * Get all organizations
 * @public
 * @returns {Array}
 */
AC.organization.getAll = function get() {
	return ds.Organization.all();
};
/**
 * Delete all organizations
 * @returns {Boolean}
 */
AC.organization.removeAll = function remove() {
	return ds.Organization.remove();
};
/**
 * Create new group
 * @param {String} group Name of new group
 * @public
 * @returns {Entity}
 */
AC.group.create = function createGroup(group) {
	// check to see if this group already exists
	var record = ds.Group.query("name = :1",group).first();
	if (record) {
		return record;
//		 return {
// 			'error': 409,
// 			'errorMessage': 'Group already exists'
// 		};
	}
	record = ds.Group.createEntity();
	record.name = group;
	record.save();
	return record;
};
/**
 * Create new user with given credentials
 *
 * @param {{name: [String], password: [String], name_first: [String], name_last: [String], flag_active: [Boolean]}}} values At least name and password are required
 * @param {Boolean} [active=false] Is the user active or not
 * @param {String|UUID} [group] Group to assign this user to
 * @public
 * @returns {Entity}
 */
AC.user.create = function createUser(values,active,group) {
	// enough information to try and create a login
	if (typeof values == 'object' && values.hasOwnProperty('name') && values.hasOwnProperty('password')) {
		// check to see if this user already exists
		var record = ds.User.query("name = :1",values.name).first();
		if (record) {
			return {
				'error': 409,
				'errorMessage': 'User already exists'
			};
		}
		// create user record
		record = ds.User.createEntity();
		record.name = values.name;
		record.password = directory.computeHA1(values.name, values.password);
		record.name_first = values.name_first;
		record.name_last = values.name_last;
		// parameter in value object takes precedence
		record.flag_active = values.flag_active || active;
		record.save();
		// assign to group
		if (typeof group == 'string') {
			// try by name
			var group = ds.Group.query("name = :1",group).first();
			// try by uuid
			if (!group) {
				group = ds.Group.query("ID = :1",group).first();
			}
			// we have a group
			if (group) {
				record.Group = group;
				record.save();
			}
		}
		return record;
	}
};
/**
 * Rename user
 *
 * @param {String} oldName Name of user to rename
 * @param {String} newName New name to give this user
 * @param {String} password Current password
 * @public
 * @returns {Boolean}
 */
AC.user.rename = function renameUser(oldName,newName,oldPassword) {
	if (oldName && newName) {
		var password = directory.computeHA1(oldName, oldPassword);
		var record = ds.User.query("name = :1 and password = :2", oldName, password).first();
		if (record) {
			record.name = newName;
			record.password = directory.computeHA1(newName, oldPassword);
			record.save();
			return true;
		}
	}
	return {
		'error': 404,
		'errorMessage': 'User not found'
	};
};
/**
 * Delete user
 *
 * @param {String} name Name of user to delete
 * @public
 * @returns {Boolean}
 */
AC.user.remove = function deleteUser(name) {
	if (name) {
		var record = ds.User.query("name = :1", name).first();
		if (record) {
			record.remove();
			return true;
		}
		return {
			'error': 404,
			'errorMessage': 'User not found'
		};
	}
};
/**
 * Reset user password
 *
 * @param {String} ID UUID of user
 * @param {String} pass New password for this user
 * @public
 * @returns {Boolean}
 */
AC.user.password.reset = function resetPass(ID,pass) {
	if (ID && pass) {
		var record = ds.User.query("ID = :1", ID).first();
		if (record) {
			record.password = directory.computeHA1(record.name, pass);
			record.save();
			return true;
		}
		return {
			'error': 404,
			'errorMessage': 'User not found'
		};
	}
};
/**
 * Rename user
 *
 * @param {String} ID UUID of user
 * @param {String} oldPassword Current password
 * @param {String} newPassword New password to give this user
 * @public
 * @returns {Boolean}
 */
AC.user.password.change = function changePass(ID,oldPassword,newPassword) {
	if (oldPassword && newPassword) {
		if (ID) {
			var record = ds.User.query("ID = :1", ID).first();
			var oldHash = directory.computeHA1(record.name, oldPassword);
			if (record.password == oldHash) {
				record.password = directory.computeHA1(record.name, newPassword);
				record.save();
				return true;
			}
		}
		return {
			'error': 404,
			'errorMessage': 'User not found'
		};
	}
};
/**
 * Toggle user active flag
 *
 * @param {String} name Name of user
 * @param {Boolean} status Toggle user status
 * @public
 * @returns {Boolean}
 */
AC.user.activate = function activateUser(name,status) {
	if (typeof name == 'string' && typeof status == 'boolean') {
		var record = ds.User.query("name = :1", name).first();
		if (record) {
			record.flag_active = status;
			record.save();
			return true;
		}
		return {
			'error': 404,
			'errorMessage': 'User not found'
		};
	}
	return {
		'error': 400,
		'errorMessage': 'Incorrect parameters passed'
	};
};
/**
 * Get particular value of user (name is default)
 *
 * @param {String} ID UUID of user
 * @param {String} [value="name"] What value to return
 * @public
 * @returns {String}
 */
AC.user.getValue = function getUserName(ID,value) {
	// default to get the name
	if (!value) {
		value = 'name';
	}
	if (ID) {
		var record = ds.User.query("ID = :1", ID).first();
		if (record) {
			// coming from one hop or more away, need to eval
			if (value.indexOf('.')) {
				try {
					return eval('record.' + value);
				}
				catch (e) {
					return '';
				}
			}
			// no eval required
			else {
				return record[value];
			}
		}
		return {
			'error': 404,
			'errorMessage': 'User not found'
		};
	}
	return {
		'error': 400,
		'errorMessage': 'Incorrect parameters passed'
	};
};
/**
 * Get navigation set(s)
 *
 * @param {String} [name] Name of navigation set to retrieve. If not specified, will return all navigation sets
 * @param {Boolean} [userID] User ID, figure out group and which navsets based off this
 * @public
 * @returns {Object}
 */
AC.navigation.getSet = function getNavSet(name,userID) {
	// only give active navigation sets
	var query = 'flag_active = true';
	// if name specified, only return that
	if (name) {
		query += " and name = :1";
	}
	// make sure we're not passing in null or something that will hang things up
	else {
		name = "Bob";
	}
	// user specified, filter down to only available navigation sets
	if (userID && userID != "00000000000000000000000000000000") {
		query += ' and GroupNavigationSet.Group.User.ID = :2';
	}
	else {
		userID = 'Bob';
	}
	function formatURL(realURL,id) {
		var url = '';
		if (typeof id == 'string') {
			id = id.toLowerCase();
		}
		if (realURL) {
			try {
				var navInfo = realURL.split('/')[2].split(':');
			}
			catch(e) {
			}
			url = navInfo[0];
			// when running developer
			if (url == 'localhost') {
				// solution name
				var solutionName = JSON.parse(File(FileSystemSync('SOLUTION').path + 'Kabootit/Meta/meta.json').toString()).KabootitProduction;
				url = 'http://' + id + '.' + solutionName + '.127.0.0.1.xip.io:' + navInfo[1] + '/';
			}
			// running on a deployed server
			else {
				url = realURL;
			}
		}
		return url;
	}
	var navSets = ds.NavigationSet.query(query, name, userID).orderBy("order_by asc");
	var navigation = new Array();
	if (navSets && navSets.length) {
		for (var i = 0; i < navSets.length; i++) {
			var navSet = navSets[i];
			var id = navSet.identifier || '';
			id = id.toLowerCase();
			// when no identifier present, blank url
			if (!id || id == '') {
				var url = '';
			}
			// pull url from projects
			else {
				if (id == 'web') {
					id = 'www';
				}
				var realURL = SECURITY.path(id);
				var url = formatURL(realURL,id);
			}
			var navItems = new Array();
			var navItemCollection = navSet.NavigationItemCollection.orderBy("order_by asc");
			for (var j = 0; j < navItemCollection.length; j++) {
				var navItem = navItemCollection[j];
				// if this item is turned on, grab it
				if (navItem.flag_active) {
					navItems.push({
							name: navItem.name,
							id: navItem.identifier,
							url: navItem.url,
							url_domain: formatURL(navItem.url_domain,navItem.identifier),
							uuid: navItem.ID
						});
				}
			}
			// only add navigation set if it has items
			if (navItems.length) {
				navigation.push({
						name: navSet.name,
						id: navSet.identifier,
						url: url,
						items: navItems,
						uuid: navSet.ID
					});
			}
		}
		return navigation;
	}
	return {
		'error': 404,
		'errorMessage': 'No navigation sets configured'
	};
};
/**
 * Configure navigation sets
 *
 * @public
 * @returns {String} URL of navigation engine
 */
AC.navigation.configure = function getNavURL() {
	var realURL = SECURITY.path('ac');
	var navInfo = realURL.split('/')[2].split(':');
	var url = navInfo[0];
	// when running developer
	if (url == 'localhost') {
		// solution name
		var solutionName = JSON.parse(File(FileSystemSync('SOLUTION').path + 'Kabootit/Meta/meta.json').toString()).KabootitProduction;
		url = 'http://' + 'ac' + '.' + solutionName + '.127.0.0.1.xip.io:' + navInfo[1] + '/';
	}
	// running on a deployed server
	else {
		url = realURL;
	}
	return url;
};
/**
 * One-off update after project ID moved down to navigation item level
 *
 * @public
 * @returns {String} URL of navigation engine
 */
AC.navigation.update = function getNavURL() {
	var navSets = ds.NavigationSet.all();
	for (var i = 0; i < navSets.length; i++) {
		var navSet = navSets[i];
		for (var j = 0; j < navSet.NavigationItemCollection.length; j++) {
			var navItem = navSet.NavigationItemCollection[j];
			if (!navItem.identifier) {
				navItem.identifier = navSet.identifier;
				navItem.save();
			}
		}
	}
	return "Upgraded existing navigation";
};
module.exports = AC;