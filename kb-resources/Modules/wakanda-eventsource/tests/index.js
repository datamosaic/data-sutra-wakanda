﻿var

















	assert,
	sse;

assert = require('assert');
sse = require('wakanda-eventsource');

exports['test start'] =  function test_start() {
	var
		xhr;

	sse.start();
	xhr = new XMLHttpRequest();
	xhr.open('GET', sse.PATTERN, false);
	xhr.send();

};

// AUTORUN
if (require.main === module) {
	require('test').run(exports);
}