﻿/*  * doc: http://doc.wakanda.org/Technical-Notes/Advanced/Writing-Unit-Tests-in-Wakanda.300-959974.en.html * example: https://github.com/miyako/wak-custom-login/blob/master/SAMPLE%2FSAMPLE%2FTests%2FcustomLogin.js * */ var testThis = require("test_this");var testCase = {		name:"testing poc",		test_return:function(){		testThis.helloWorld();		Y.Assert.isTrue(testThis.helloWorld() === "Hello world");	}			}require("unitTest").run(testCase).getReport();