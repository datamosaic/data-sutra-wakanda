﻿exports.moveFile = function moveFile(from, to) {	var results = SOLUTION.callAPI('SA.file.move',arguments);		return results};exports.copyFile = function copyFile(from, to) {	var results = SOLUTION.callAPI('SA.file.copy',arguments);		return results};exports.removeFile = function removeFile(file) {	var results = SOLUTION.callAPI('SA.file.remove',arguments);		return results};