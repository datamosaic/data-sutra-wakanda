﻿var









































	exports,
	assert,
	sse;

exports = exports || {};
assert = require('assert');
sse = require('wakanda-eventsource');
net = require('net');


exports['test start json'] =  function test_start() {
	var
		xhr,
		ok;

	sse.start();
	xhr = new XMLHttpRequest();
	xhr.open('GET', sse.PATTERN, false);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.send();
	assert.strictEqual(xhr.status, 200);
	try {
		ok = JSON.parse(xhr.responseText).ok;
	} catch (e) {
		ok = false
	}
	assert.notStrictEqual(ok, undefined, 'JSON parse failed');
	assert.strictEqual(ok, true);
	sse.stop();
};


exports['test start textstream'] =  function test_start() {
	assert.strictEqual(xhr.status, 200);
	try {
		ok = JSON.parse(xhr.responseText).ok;
	} catch (e) {
		ok = false
	}
	assert.notStrictEqual(ok, undefined, 'JSON parse failed');
	assert.strictEqual(ok, true);
	sse.stop();
};


// AUTORUN
if (require.main === module) {
	require('test').run(exports);
}