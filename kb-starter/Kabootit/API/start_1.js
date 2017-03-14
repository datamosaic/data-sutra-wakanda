/**
 * START API
 * @version 1
 * @modified 
 */
var START = {
	test: new Object()
};
module.exports = START;

/**
 * Test method
 * @public
 * @return {Object}
 */
START.test.hello = function world() {
	return "Hello START world!"
}

/**
 * Something private
 * @private
 */
START.test.anonymous = function() {
	
}

/**
 * Something private, but not explicitly flagged
 */
START.test.anonymousFour = function() {
	
}