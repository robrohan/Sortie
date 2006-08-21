/**
 * File: io/Gateway.js
 * This library gives the ability to directly communicate with a server using the 
 * XMLHTTPRequest object in a non-browser specific way.
 *
 * Copyright:
 * 	2004 Rob Rohan (robrohan@gmail.com) - All rights reserved
 *
 * Related:
 * 	util/Collections.js
 */
if(typeof COLLECTIONS_VERSION == "undefined" || typeof BROWSER_SNIFFER_VERSION == "undefined")
{
	alert("Fatal Error: Gateway Missing Required Libraries");
	throw new Error("gateway.js Missing Required Libraries");
}

/**
 * Variable: GATEWAY_VERSION 
 * the library version 
 */
var GATEWAY_VERSION = "0.1";

/**
 * Class: HTTPConnectFactory
 * This creates a HTTPConnection factory that can produce http connetion object 
 * that are IE and Mozilla capable they can be used to GET and POST to a server
 * It is oftend used in one go like: http = new HTTPConnectFactory().getInstance();
 * 
 * Returns:
 * 	a factory to create xmlhttprequest objects with
 */ 
function HTTPConnectFactory(){;}

/**
 * Method: HTTPConnectFactory.getInstance
 * get an instace of the http connect object this actually just creates 
 * either an MS or Gecko type object.
 *
 * Returns:
 * 	An XMLHTTPRequest instance that should behave the same on all browsers
 */ 
HTTPConnectFactory.prototype.getInstance = function getInstance()
{
	//the soon to be gateway HTTP connection
	var gw_http_request = null;
	
	//try to create a new http connection object try MS
	if(window.ActiveXObject){
		try{
			gw_http_request = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e){
			try{
				gw_http_request = new ActiveXObject("Microsoft.XMLHTTP");
			}catch(ex){
				throw new Error("IE browser, but xmlhttp create failed: " + ex);
			}
		}
	//try gecko type
	}else{
		try {
			gw_http_request = new XMLHttpRequest();
			
			if(gw_http_request.readyState == null){
				gw_http_request.readyState = 1;
				gw_http_request.addEventListener(
					"load", 
					function(){
						gw_http_request.readyState = 4;
						if(typeof gw_http_request.onreadystatechange == "function")
							gw_http_request.onreadystatechange();
					},
					false
				);
			}
		}catch(e){
			throw new Error(
				"Gecko browser, but xmlhttp create failed: " + ex
			);
		}
	}
	
	if(gw_http_request == null)
	{
		throw new Error(
			"HTTPConnect::createInstance(): Unable to create HTTPConnect object"
		);
	}
	
	return gw_http_request;
};

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: JSRemote
 * This object handles sending. This can be used to send and receive data from the 
 * server
 *
 * Parameters:
 * 	connection - an XMLHTTPRequest object from the HTTPConnectFactory used to send and receive with
 * 	asyn - boolean for async or sync mode. True means async false means sync
 */
function JSRemote(connection, asyn)
{
	//the connection object for this remoter
	this.connection = connection;
	this.loading = false;
	this.async = asyn;

	this.username = null;
	this.password = null;
		
	/**
	 * Method: JSRemote.doRequest
	 *
	 * Parameters:
	 * 	params - an object that has the following properties
	 * 		method = GET,POST,DELETE,PUT,etc
	 *		url = where to call to
	 *		handler = the call back function
	 * 		error_handler = error handler
	 *		body = the body data (for posts)
	 * 		fields = for form posts, the fields
	 *		extra_headers = any extra headers to pass along
	 * 		function = the SOAP function (if a soap request)
	 *		username = the http username
	 * 		password = the http password
	 * 		encoding = default is utf-8
	 */
	this.doRequest = function(params) {
		
		log.info("doRequest to " + params.url);
		
		this.loading = true;
		var conn = this.connection;
		var load = this.loading;
	
		var finaljsr = this;
		var finaltimeout = setTimeout("alert")
		
		if(params.username != null && params.username != null)
			conn.open(params.method, params.url, this.async, params.username, params.password);
		else
			conn.open(params.method, params.url, this.async);
		
		if(this.async){
			conn.onreadystatechange = function(){
				if(conn.readyState == 4){
					if(conn.status == 200){
						log.info("response: ]" + conn.responseText + "[");
						
						params.handler(conn);
					}else{
						try{
							params.error_handler(conn);
						}catch(e){
							throw Error(e);
						}
					}
					
					finaljsr.loading = false;
					load = false;
				}
			}
		}
		
		if(!params.body) 
			params.body = "nothing";
		else{
			conn.setRequestHeader("Content-Length",""+params.body.length);
			if(params.body.indexOf("<?") == 0)
				conn.setRequestHeader("Content-Type", "text/xml; charset=" + ((params.encoding) ? params.encoding : "utf-8") );
		}
		
		conn.setRequestHeader("XLibrary", "Neuromancer 1.5");
			
		if(typeof params.extra_headers == "object") {
			for (var i in params.extra_headers) {
				conn.setRequestHeader(i, params.extraHeaders[i]);
			}
		}
		
		conn.send(params.body+"");
		
		if(!this.async){
			params.handler(conn);
			load = false;
		}
	};
	
	/**
	 * Method: JSRemote.doGetRequest
	 * loads the file and uses the call back function func_into(String)
	 * to pass in the files contents - can also be used to pass variables
	 * in the ?test=123&amp;booga=123 format
	 *
	 * Parameters:
	 * 	url - the url to GET to
	 * 	func_handler - the callback function to send the results to
	 *
	 * Deprecated:
	 * 	Use <JSRemote.doRequest> instead
	 */
	this.doGetRequest = function(url, func_handler)
	{
		log.info("doGetRequest to: " + url);
		this.loading = true;
		var conn = this.connection;
		var load = this.loading;
		
		var finaljsr = this;
		
		if(this.username != null && this.password != null)
			conn.open("GET", url, this.async, this.username, this.password);
		else
			conn.open("GET", url, this.async);
		
		if(this.async)
		{
			conn.onreadystatechange = function()
			{
				if(conn.readyState == 4)
				{
					if(conn.status == 200) 
					{
						func_handler(conn.responseText, conn);
						finaljsr.loading = false;
					}
					else
					{
						throw new Error("There was a problem retrieving the data from the server:\n" + conn.statusText);
					}
					load = false;
				}
			}
		}
		//mozilla fix - doesnt like null it seems
		conn.send("nothing");
		
		if(!this.async){
			func_handler(conn.responseText, conn);
			load = false;
		}
	};
	
	/**
	 * Method: JSRemote.doFormPostRequest
	 * This method implements a multi-field form submission via a POST,
	 * using the 'fields' object as a set of name:value pairs to pass as
	 * the form fields.  It simply delegates to doPostRequest for the
	 * actual processing; the only functionality is serializing the fields.
	 *
	 * Note that this method's parameter ordering does NOT correspond to
	 * doPostRequest's.
	 * 
	 * Parameters:
	 *  url - the url to POST to
	 *  fields - the form fields to POST
	 *  handler - the callback function to send results to
	 */
	this.doFormPostRequest = function(url, fields, handler) {
		var body = "";
		var headers = new Object();
		var boundary = "neuro" + Math.random();
		
		for (var i in fields) {
			body += "--" + boundary + "\nContent-Disposition: form-data;name=\"" + i + "\"\n";
			body += "\n";
			body += fields[i] + "\n";
			body += "\n";
		}
		body += "--" + boundary + "--";
		
		headers["Content-Type"] = "multipart/form-data; boundary=" + boundary;
		this.doPostRequest(url, handler, body, headers);
	}
	
	/**
	 * Method: JSRemote.doPostRequest
	 * Does a simple post request, passing the bodyinfo as the body of the 
	 * request - meaning the only way to get the bodyinfo out is to do 
	 * #GetHttpRequestData().content# in coldfusion for example
	 *
	 * Parameters:
	 * 	url - the url to POST to
	 * 	func_handler - the callback function to send the results to
	 * 	bodyinfo - what to send in the body of the POST 
	 *
	 * Deprecated:
	 * 	Use <JSRemote.doRequest> instead
	 */
	this.doPostRequest = function(url, func_handler, bodyinfo, extraHeaders)
	{
		log.info("doPostRequest to " + url);
		log.info("using pipe: " + this.connectionid);
		
		this.loading = true;
		var conn = this.connection;
		var load = this.loading;
	
		var finaljsr = this;
		var finaltimeout = setTimeout("alert")
		
		if(this.username != null && this.password != null)
			conn.open("POST", url, this.async, this.username, this.password);
		else
			conn.open("POST", url, this.async);
		
		if(this.async)
		{
			conn.onreadystatechange = function()
			{
				if(conn.readyState == 4)
				{
					log.info("response on pipe: " + finaljsr.connectionid);
					log.info("response: ]" + conn.responseText + "[");
					
					func_handler(conn.responseText, conn);
					
					load = false;
					finaljsr.loading = false;
				}
			}
		}
		
		if(bodyinfo == "") 
			bodyinfo = "nothing";
		
		conn.setRequestHeader("Content-Length",""+bodyinfo.length);
		conn.setRequestHeader("XLibrary", "Neuromancer 1.5");
		if(bodyinfo.indexOf("<?") == 0)
			conn.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		if (typeof extraHeaders == "object") {
			for (var i in extraHeaders) {
				conn.setRequestHeader(i, extraHeaders[i]);
			}
		}
		conn.send(bodyinfo+"");
		
		if(!this.async)
		{
			func_handler(conn.responseText, conn);
			load = false;
		}
	};
	
	/**
	 * Method: JSRemote.doSoapPost
	 * This does a soap compliant request to a server
	 *
	 * Parameters:
	 * 	url - the url to POST to
	 * 	func - the SOAP function to invoke
	 * 	func_handler - the callback function to send the results to
	 * 	xmlinfo - what to send in the body of the POST (often soap data)
	 *
	 * Deprecated:
	 * 	Use <JSRemote.doRequest> instead
	 */
	this.doSoapPost = function(url,func,func_handler,xmlinfo)
	{
		log.info("doSoapPost to: " + url + " function: " + func);
		this.loading = true;
		var conn = this.connection;
		var load = this.loading;
		
		if(conn == null)
			throw new Error("Connection problem in SoapPost");
		
		try
		{
			conn.open("POST", url, this.async);
			if(this.async)
			{
				conn.onreadystatechange = function()
				{
					if(conn.readyState == 4)
					{
						if(conn.status != "200")
						{
							conn.abort();
						}
						else
						{	
							func_handler(conn.responseText, conn);
							load = false;
						}
					}
				}
			}
			
			// (2) LOADED (3) INTERACTIVE
			if(conn.readyState != 2 && conn.readyState != 3)
			{
				if(func != null && func != "")
					conn.setRequestHeader("SOAPAction", func);
				
				conn.setRequestHeader("Content-Type", "application/soap+xml; charset=utf-8");
				conn.setRequestHeader("Content-Length",""+xmlinfo.toString().length);
				conn.send(xmlinfo.toString());
			}
			
			if(!this.async)
			{
				func_handler(conn.responseText, conn);
				load = false;
			}
		}
		catch(e)
		{
			//alert("gateway::" + e);
			//this can error some times (on gecko stuff mostly)
			//so just try to clear the buffer
			conn.send(null);
		}
	};
}