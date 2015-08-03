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
	this._paramObj = {};
    this._responseHeaders = [];
    this.statusText = "";
    this.status = 0;
    this.responseText = "";
    this.responseType = "text";
    this.curlErr = false;
}
 
/**
 * Declares the Client's operating parameters
 * param object:
 * {
 *   // required
 *   method: 'GET' or 'POST',
 *   url: string,
 *   // optional
 *   postParams: string,  // e.g. stringified JSON
 *   requestHeaders: [ { key: abc, value: xyz } ],
 *   connectTimeout: seconds,
 *   maxTime: seconds
 * }
 */
Client.prototype.open = function open(givenParamObj)
{
    this._paramObj = givenParamObj;
    // throw exceptions or otherwise error if required params not included?
    if( ! ( 'requestHeaders' in this._paramObj ) )
    	this._paramObj.requestHeaders = [];
    if( ! ( 'postParams' in this._paramObj ) )
    	this._paramObj.postParams = "";
    // data-checking?
};
 
/**
 * sends the request defined in the Client
 */
Client.prototype.send = function send() 
{
    // convert request headers to curl syntax
    var strRequestHeaders = "";
    for( var i = 0; i < this._paramObj.requestHeaders.length; ++i )
	{
		var item = this._paramObj.requestHeaders[i];
		strRequestHeaders += ' --header "' + item.key + ': ' + item.value + '"';
	}

    // build the curl command
    var curlCommand = "-i";  // get response headers
	curlCommand += strRequestHeaders;
    if (this._paramObj.method === 'POST') {
		curlCommand += " -X POST -d '" + this._paramObj.postParams + "'";
	}
    if ('connectTimeout' in this._paramObj) {
        curlCommand += " --connect-timeout " + this._paramObj.connectTimeout;
    }
    if ('maxTime' in this._paramObj) {
        curlCommand += " --max-time " + this._paramObj.maxTime;
    }
    curlCommand += " " + this._paramObj.url;
    console.log( "curlCommand: " + curlCommand );
 
    // run the curl command
    var curlResultObj = curl.curl(curlCommand);
 
    // handle curl result
    if (curlResultObj.worker.exitStatus === 0) {
 
        //parse the httpResponse
        var httpResponseText = curlResultObj.console.stdOut.toString("utf8");
 		//console.log(httpResponseText);
 		
        //split the headers and content
        var opt = httpResponseText.indexOf("\r\n\r\n");
        var headerText = httpResponseText.slice(0, opt);
        this.responseText = httpResponseText.slice(opt + 4);
 
        //get the status and response headers
        var headerArr = headerText.split("\r\n");
        this.statusText = headerArr.shift();
        var statusArr = this.statusText.split(" ");
        this.statusText = statusArr[2];
        this.status = parseInt(statusArr[1], 10);
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