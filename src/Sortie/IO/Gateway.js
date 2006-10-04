/**
 * File: IO/Gateway.js
 * This library gives the ability to directly communicate with a server using the 
 * XMLHTTPRequest object in a non-browser specific way.
 *
 * Copyright:
 * 	2004-2006 Rob Rohan (robrohan@gmail.com). All rights reserved
 *
 * Related:
 * 	Util/Collections.js
 * 	Util/Browser.js
 */

if(!Sortie.IO) Sortie.IO = {};

if(!Sortie.IO.Gateway) Sortie.IO.Gateway = {};

Sortie.Core.$({
	require:new Array(
		{ c:"Sortie.Util.Collections", v:"0.2"},
		{ c:"Sortie.Util.Browser", v:"0.3"}
	)
});

/**
 * Class: Pipe
 * This creates a HTTPConnection factory that can produce http connetion object 
 * that are IE and Mozilla capable they can be used to GET and POST to a server
 * It is oftend used in one go like: 
 * (code)
 * var pipe = new Sortie.IO.Pipe().GetInstance();
 * (end code)
 *
 * Namespace: 
 * 	Sortie.IO
 *
 * Returns:
 * 	a factory to create xmlhttprequest objects with
 */ 
Sortie.IO.Pipe = function() {

	/**
	 * Method: Pipe.GetInstance
	 * get an instace of the http connect object this actually just creates 
	 * either an MS or Gecko type object.
	 *
	 * Returns:
	 * 	An XMLHTTPRequest instance that should behave the same on all browsers
	 */ 
	this.GetInstance = function() {
		//the soon to be gateway HTTP connection
		var gw_http_request = null;
		
		//try to create a new http connection object try MS
		if(window.ActiveXObject) {
			try {
				gw_http_request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try {
					gw_http_request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(ex) {
					throw new Error("IE browser, but xmlhttp create failed: " + ex);
				}
			}
		//try gecko type
		} else {
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
				throw new Error("Gecko browser, but xmlhttp create failed: " + ex);
			}
		}
		
		if(gw_http_request == null) {
			throw new Error("HTTPConnect::createInstance(): Unable to create HTTPConnect object");
		}
		
		return gw_http_request;
	};
}


/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: Gateway
 * This object handles sending. This can be used to send and receive data from the 
 * server
 *
 * Namespace:
 * 	Sortie.IO
 *
 * Parameters:
 * 	connection - an XMLHTTPRequest object from the HTTPConnectFactory used to send and receive with
 * 	asyn - boolean for async or sync mode. True means async false means sync
 */
Sortie.IO.Gateway = function(connection, asyn) {
	//the connection object for this remoter
	this.connection = connection;
	this.loading = false;
	this.async = asyn;

	this.username = null;
	this.password = null;
	
	/**
	 * Method: Gateway.DoRequest
	 * Used to do an actual request. Pass in an anon object with the
	 * connection specifics. For example:
	 * (code)
	 *	var httpcon = new HTTPConnectFactory().getInstance();
	 *	var remote = new JSRemote(httpcon, true);
	 *
	 *	remote.doRequest({ 
	 *		method:"POST",
	 *		url:"http://mysite.com/handler.php",
	 *		handler:function(e,conn){ alert(e) },
	 *		body:""
	 *	});
	 * (end code)
	 *
	 * Parameters:
	 * 	params - an object that has some combo of the following properties
	 * (code)
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
	 * (end code)
	 */
	this.DoRequest = function(params) {
		
		//log.info("DoRequest to " + params.url);
		
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
						//log.info("response: ]" + conn.responseText + "[");
						//alert(conn);
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
		
		conn.setRequestHeader("XLibrary", "Sorite 1.5");
			
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
	 * Method: Gateway.DoFormPostRequest
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
	this.DoFormPostRequest = function(url, fields, handler) {
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
	};
}


/////////////////////META DATA //////////////////////////////////////////////
/** 
 * Variable: Sortie.IO.Gateway.VERSION 
 * 	the current version 
 */
Sortie.IO.Gateway["VERSION"] = "0.2";
///////////////////////////////////////////////////////////////////////////
