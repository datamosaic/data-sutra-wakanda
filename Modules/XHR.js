/**
 *	Wrap XHR calls up
 */


/**
 * One-off call that will do everything
 * TODO: auto do get/post depending on some preference
 * 
 * @param {String} baseURL The URL for the ajax call
 * @param {String} [action] Optional parameter to tack onto the baseURL
 * @param {Object} [params] Custom parameters to pass to the ajax call
 * @param {{key: String, value}[]} [requestHeaders] Headers to set
 * 
 * @return {{statusLine: String, headers: Object, result: Object|String}}
 */
function sendXHR(baseURL, action, params, requestHeaders) {
	if (!params) {
		params = new Object();
	}
	var xhr = new XMLHttpRequest();
	var needSlash = baseURL[baseURL.length - 1] != '/';
	var url = baseURL + (action ? ((needSlash ? '/' : '') + action) : '');
	var headers = new Object();
	var result
	
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
	
	// send string across; else stringify
	if (typeof params == 'string') {
		xhr.send(params);
	}
	else {
		xhr.send(JSON.stringify(params));
	}
	
	// get the status
	statusLine = xhr.status + ' ' + xhr.statusText;
	
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
		// fills an object with the headers
		headersObj[name] = value;
	});
	
	return headersObj;
}

function sendPost() {
	return sendXHR.apply(this,arguments);
}

function sendGet(baseURL, action) {
	var xhr = new XMLHttpRequest();
	var needSlash = baseURL ? baseURL[baseURL.length - 1] != '/' : false;
	var url = baseURL + (action ? ((needSlash ? '/' : '') + action) : '');
	var headers = new Object();
	var result
	
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
	
	xhr.open('GET', url);
	xhr.send();
	
	// get the status
	statusLine = xhr.status + ' ' + xhr.statusText;
	
	return ({
		statusLine: statusLine,
		headers: headers,
		result: result
	});
}

// one-off call
exports.send = sendXHR;

// individual components
exports.post = sendPost;
exports.get  = sendGet;