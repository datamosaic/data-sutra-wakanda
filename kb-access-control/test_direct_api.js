﻿/**
* TEST: do something with API locally (from same project)
* use commonJS approach
*/
var AC = require(FileSystemSync("PROJECT").path + "API/ac.js");
// good call
var x = AC.organization.getAll();
x;
// restricted call
//var y = AC.organization.removeAll();
//y;
