/**
 * @fileOverview CommonJS module that uses curl as an http client
 * @author Welsh Harris
 * @created 12/18/2014
 */
 
"use strict";
 
var curl = require("curl");
 
/**
 * An http client that uses curl
 * @constructor
 */
function Client() {
    this._method = "";
    this._url = "";
    this._requestHeaderNames = [];
    this._requestHeaderValues = [];
    this._responseHeaders = [];
    this._connectTimeout = null;
    this._maxTime = null;
    this.statusText = "";
    this.status = 0;
    this.responseText = "";
    this.responseType = "text";
    this.curlErr = false;
 
}
 
/**
 * Declares the HTTP method and the URL of the Client
 * @param method - GET is the only option right now (will ad POST, PUT, HEAD, etc. later as needed)
 * @param url
 */
Client.prototype.open = function open(method, url) {
    this._method = method;
    this._url = url;
};
 
 
/**
 * Maximum  time  in  seconds  that you allow the connection to the server to take
 * @param {number} seconds
 */
Client.prototype.setConnectTimeout = function setConnectTimeout(seconds) {
    this._connectTimeout = seconds;
};
 
/**
 * Maximum  time  in  seconds that you allow the whole operation to take
 * @param {number} seconds
 */
Client.prototype.setMaxTime = function setMaxTime(seconds) {
    this._maxTime = seconds;
};
 
/**
 * sends the request defined in the Client
 */
Client.prototype.send = function send() {
    var requestHeaders,
        numLoops, i,
        curlCommand,
        curlResultObj,
        httpResponseText,
        headerText,
        opt,
        headerArr,
        statusArr;
 
    //convert request headers to curl syntax
    requestHeaders = "";
    numLoops = this._requestHeaderNames.length;
    for (i=0; i < numLoops; i++) {
        if (i === 0) {
            requestHeaders = '--header "' + this._requestHeaderNames[i] + ': ' + this._requestHeaderValues[i] + '"';
        } else {
            requestHeaders = requestHeaders + ' ' + '--header "' + this._requestHeaderNames[i] + ': ' + this._requestHeaderValues[i] + '"';
        }
    }
 
    //build the curl command
    curlCommand = "-i"; //get response headers
    if (requestHeaders !== "") {
        curlCommand = curlCommand + " " + requestHeaders;
    }
    if (this._connectTimeout) {
        curlCommand = curlCommand + " " + "--connect-timeout " + this._connectTimeout;
    }
    if (this._maxTime) {
        curlCommand = curlCommand + " " + "--max-time " + this._maxTime;
    }
    curlCommand = curlCommand + " " + this._url;
 
    //run the curl command
    curlResultObj = curl.curl(curlCommand);
 
    //handle curl result
    if (curlResultObj.worker.exitStatus === 0) {
 
        //parse the httpResponse
        httpResponseText = curlResultObj.console.stdOut.toString("utf8");
 
        //split the headers and content
        headerText = httpResponseText.slice(0, opt = httpResponseText.indexOf("\r\n\r\n"));
        this.responseText = httpResponseText.slice(opt + 4);
 
        //get the status and response headers
        headerArr = headerText.split("\r\n");
        this.statusText = headerArr.shift();
        statusArr = this.statusText.split(" ");
        this.statusText = statusArr[1];
        this.status = parseInt(this.statusText, 10);
        this._responseHeaders = getHeaders(headerText);
 
    } else {
        this.curlErr = true;
        this.statusText = "-1";
        this.status = -1;
        throw new Error("Exit Status = " + curlResultObj.worker.exitStatus + ", stdErr = " + curlResultObj.console.stdErr);
    }
};

function getHeaders(headers) {
	//get the headers of the response
	var headersObj = new Object();
	
	// split and format the headers string in an array
	var headersArray = headers.split('\n');
	headersArray.forEach(function(header, index, headersArray) {
		var name, indexSeparator, value;
			
		 // this is not a header but a status, filter it
		if (header.indexOf('HTTP/1.1') === 0) {
			return;
		}

		indexSeparator = header.indexOf(':');
		name = header.substr(0, indexSeparator);
			
		// empty name, filter it
		if (name === "") {
			return;
		}
			
		// clean up the header attribute
		value = header.substr(indexSeparator + 1).trim();
		
		// already exists, (convert to array) push in new entry
		if (headersObj.hasOwnProperty(name)) {
			// make sure this is an array
			if (!(headersObj[name] instanceof Array)) {
				headersObj[name] = [headersObj[name]];
			}
			
			// push in new entry
			headersObj[name].push(value);
		}
		// fills an object with the headers
		else {
			headersObj[name] = value;
		}
		
	});
	
	return headersObj;
}
 
/** public api */
exports.Client = Client;