﻿/** * AC API * @version 1 * @modified 2014 April 14 */var AC = new Object();AC.organization = {};/** * Get all organizations * @public * @returns {Array} */AC.organization.getAll = function get() {	return ds.Organization.all();};AC.organization.removeAll = function remove() {	return ds.Organization.remove();};module.exports = AC;