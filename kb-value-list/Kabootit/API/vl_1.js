/**





























 * VL API
 * @version 1
 * @modified
 */
var VL = {
	test: new Object()
};
module.exports = VL;

/**
 * Test method
 * @public
 * @return {Object}
 */
VL.test.hello = function world() {
	return "Hello VL world!"
}

/**
 * Something private
 * @private
 */
VL.test.anonymous = function() {

}

/**
 * Something private, but not explicitly flagged
 */
VL.test.anonymousFour = function() {

}