/**
 *	Wrap XHR calls up
 */

/**
 * Do post request, using CURL libs if available
 * One-off call that will do everything
 * TODO: auto do get/post depending on some preference
 * 
 * @param {String} baseURL The URL for the ajax call
 * @param {String} [action] Optional parameter to tack onto the baseURL
 * @param {Object} [params] Custom parameters to pass to the ajax call
 * @param {{key: String, value}[]} [requestHeaders] Headers to set
 * @param {{seconds: Number, fx: Function}} [timeout] Amount of time to wait with optional function
 * 
 * @return {{statusLine: String, headers: Object, result: Object|String}}
 */
function sendPost(baseURL, action, params, requestHeaders, timeout) {
	// if curl available, use it so we can have additional parameters to monkey with
	try {
		var httpClient = require('httpClient');
	}
	catch (e) {
		httpClient = false;
	}

	if (!params) {
		params = new Object();
	}
	if (!requestHeaders) {  // looping over later, so fix it now
		requestHeaders = new Array();
	}
	if (!timeout) {
		timeout = {
			seconds: 120,
			fx: function() {
				console.log("Timed out after " + timeout.seconds + " seconds")
			}
		};
	}
	else if (typeof timeout == 'number') {
		timeout = {
			seconds: timeout,
			fx: function() {
				console.log("Timed out after " + timeout.seconds + " seconds")
			}
		};
	}
	
	var needSlash = baseURL ? baseURL[baseURL.length - 1] != '/' : false;
	var url = baseURL + (action ? ((needSlash ? '/' : '') + action) : '');
	var headers = new Object();
	var result;
	
	if (httpClient) {
		var client = new httpClient.Client();

		try {
			if( ! requestHeaders.filter( function(item) {
				return item.key.toLowerCase().indexOf('content-type') !== -1;
			} ).length )
			{
				if( typeof params === 'string' )
					requestHeaders.push( { key: 'Content-Type', value: 'text/plain' } );
				else
					requestHeaders.push( { key: 'Content-Type', value: 'application/json' } );
			}
			
			var curlParamObj = {
				method: 'POST',
 				url: url,
				postParams: typeof params === 'string' ? params : JSON.stringify(params),
				requestHeaders: requestHeaders,
				connectTimeout: timeout.seconds,
				maxTime: timeout.seconds
			};
			client.open(curlParamObj);
			
			client.send();
			
			// get the headers of the response
			headers = client._responseHeaders;
			// get the contents of the response
			result = client.responseText;
				
			// JSON response, parse it as objects
			if (headers['Content-Type'] && headers['Content-Type'].indexOf('json') !== -1) {
				result = JSON.parse(result);
			}
		
			// get the status
			statusLine = client.status + ' ' + client.statusText;		
		}
		catch(e) {
			statusLine = "500 XHR get failed for some reason";
		}
	}  // curl
	else {
		var xhr = new XMLHttpRequest();
	
		xhr.onreadystatechange = function() {
			var state = this.readyState;
			// while the status event is not done we continue
			if (state !== 4) { 
				return;
			}
			
			// get the headers of the response
			headers = getHeaders(this);
			// get the contents of the response
			result = this.responseText;
					
			// JSON response, parse it as objects
			if (headers['Content-Type'] && headers['Content-Type'].indexOf('json') !== -1) {
				if (result != "") {
					result = JSON.parse(result);
				}
			}
		};
		
		// open synchronous call
		xhr.open('POST', url, false);
		
		// set custom headers
		if (requestHeaders instanceof Array) {
			for (var i = 0; i < requestHeaders.length; i++) {
				var header = requestHeaders[i];
				xhr.setRequestHeader(header.key,header.value);
			}
		}
		
		// make sure doesn't run forever
		xhr.timeout = timeout.seconds * 1000;
		if (typeof timeout.fx == 'function') {
			xhr.ontimeout = timeout.fx;
		}
		
		// send string across; else stringify
		try {				
			if (typeof params == 'string') {
				xhr.send(params);
			}
			else {
				xhr.send(JSON.stringify(params));
			}
			// get the status
			statusLine = xhr.status + ' ' + xhr.statusText;
		}
		catch(e) {
			statusLine = "500 XHR post failed for some reason";
		}
	}  // XMLHttpRequest
	
	return ({
		statusLine: statusLine,
		headers: headers,
		result: result
	});
}

function getHeaders(that) {
	//get the headers of the response
	var headers = that.getAllResponseHeaders();
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
};

/**
 * Do get request, using CURL libs if available
 * 
 * @param {String} baseURL The URL for the ajax call
 * @param {String} [action] Optional parameter to tack onto the baseURL
 * @param {{key: String, value}[]} [requestHeaders] Headers to set
 * @param {{seconds: Number, fx: Function}} [timeout] Amount of time to wait with optional function
 * 
 * @return {{statusLine: String, headers: Object, result: Object|String}}
 */
function sendGet(baseURL, action, requestHeaders, timeout) {
	// if curl available, use it so we can have additional parameters to monkey with
	try {
		var httpClient = require('httpClient');
	}
	catch (e) {
		httpClient = false;
	}
	
	if (!timeout) {
		timeout = {
			seconds: 120,
			fx: function() {
				console.log("Timed out after " + timeout.seconds + " seconds")
			}
		};
	}
	else if (typeof timeout == 'number') {
		timeout = {
			seconds: timeout,
			fx: function() {
				console.log("Timed out after " + timeout.seconds + " seconds")
			}
		};
	}
	
	var needSlash = baseURL ? baseURL[baseURL.length - 1] != '/' : false;
	var url = baseURL + (action ? ((needSlash ? '/' : '') + action) : '');
	var headers = new Object();
	var result;
	
	if (httpClient) {
		var client = new httpClient.Client();
		
		try {
			var curlParamObj = {
				method: 'GET',
 				url: url,
				requestHeaders: requestHeaders || new Array(),
				connectTimeout: timeout.seconds,
				maxTime: timeout.seconds
			};
			client.open(curlParamObj);
			
			client.send();
			
			// get the headers of the response
			headers = client._responseHeaders;
			// get the contents of the response
			result = client.responseText;
				
			// JSON response, parse it as objects
			if (headers['Content-Type'] && headers['Content-Type'].indexOf('json') !== -1) {
				result = JSON.parse(result);
			}
		
			// get the status
			statusLine = client.status + ' ' + client.statusText;		
		}
		catch(e) {
			statusLine = "500 XHR get failed for some reason";
		}
	}  // curl
	else {
		var xhr = new XMLHttpRequest();
		
		xhr.onreadystatechange = function() {
			var state = this.readyState;
			// while the status event is not done we continue
			if (state !== 4) { 
				return;
			}
		
			// get the headers of the response
			headers = getHeaders(this);
			// get the contents of the response
			result = this.responseText;
				
			// JSON response, parse it as objects
			if (headers['Content-Type'] && headers['Content-Type'].indexOf('json') !== -1) {
				result = JSON.parse(result);
			}
		};
	
		try {
			xhr.open('GET', url);
			xhr.send();
			// TODO put in scaffolding to effectuate a custom timeout
			// currently this uses the standard 2 minute timeout
		
			// get the status
			statusLine = xhr.status + ' ' + xhr.statusText;		
		}
		catch(e) {
			statusLine = "500 XHR get failed for some reason";
		}
	}  // XMLHttpRequest
	
	return ({
		statusLine: statusLine,
		headers: headers,
		result: result
	});
};

// individual components
exports.post = sendPost;
exports.get  = sendGet;