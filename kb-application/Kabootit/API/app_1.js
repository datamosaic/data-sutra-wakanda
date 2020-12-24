/**





























 * APP API
 * @version 1
 * @modified 2014 Aug 19
 */
var APP = {
	test: new Object()
};
module.exports = APP;

/**
 * Retrieve full information about all units as hard-code
 * @public
 * @return {Object}
 */
APP.test.hello = function world() {
	return "Hello APP world!"
}

/**
 * Something private
 * @private
 */
APP.test.anonymous = function() {

}

/**
 * Something private, but not explicitly flagged
 */
APP.test.anonymousFour = function() {

}