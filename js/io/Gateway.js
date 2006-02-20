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
 * that are IE, Safari, Mozilla, and Opera capable they can be used to GET and POST 
 * to a server It is oftend used in one go like: 
 * (code)
 * http = new HTTPConnectFactory().getInstance();
 * (end code)
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
}


/**
 * Method: JSRemote.doGetRequest
 * loads the file and uses the call back function func_into(String)
 * to pass in the files contents - can also be used to pass variables
 * in the ?test=123&booga=123 format
 *
 * Parameters:
 * 	url - the url to GET to
 * 	func_handler - the callback function to send the results to
 */
JSRemote.prototype.doGetRequest = function _doGetRequest(url, func_handler)
{
	log.info("doGetRequest to: " + url);
	this.loading = true;
	var conn = this.connection;
	var load = this.loading;
	
	var finaljsr = this;
	
	conn.open("GET", url, this.async);
	if(this.async)
	{
		conn.onreadystatechange = function()
		{
	  		if(conn.readyState == 4)
	  		{
	  			if(conn.status == 200) 
				{
	  				func_handler(conn.responseText);
	  				finaljsr.loading = false;
				}
				else
				{
					alert("There was a problem retrieving the data from the server:\n" + conn.statusText);
				}
	  			load = false;
				//window.status = conn.status;
			}
		}
	}
	//mozilla fix - doesnt like null it seems
 	conn.send("nothing");
 	
 	if(!this.async){
	 	func_handler(conn.responseText);
	  	load = false;
	  	//window.status = conn.status;
	}
};

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
 */
JSRemote.prototype.doPostRequest = function _doPostRequest(url, func_handler, bodyinfo)
{
	log.info("doPostRequest to " + url);
	log.info("using pipe: " + this.connectionid);
	
	this.loading = true;
	var conn = this.connection;
	var load = this.loading;

	var finaljsr = this;
	var finaltimeout = setTimeout("alert")
	
	conn.open("POST", url, this.async);
	
	if(this.async)
	{
		conn.onreadystatechange = function()
		{
			if(conn.readyState == 4)
			{
				log.info("response on pipe: " + finaljsr.connectionid);
				log.info("response: ]" + conn.responseText + "[");
				
				//alert(conn.responseText);
				func_handler(conn.responseText);
				
	  			load = false;
	  			finaljsr.loading = false;
				//window.status = conn.status;
			}
		}
	}
 	
 	if(bodyinfo == "") 
	    bodyinfo = "nothing";
 	
 	conn.setRequestHeader("Content-Length",""+bodyinfo.length);
 	conn.setRequestHeader("XLibrary", "Neuromancer 1.5beta");
 	if(bodyinfo.indexOf("<?") == 0)
 	 	conn.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
 	conn.send(bodyinfo+"");
 	
 	
 	if(!this.async)
 	{
	    func_handler(conn.responseText);
	    load = false;
	    //window.status = conn.status;
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
 */
JSRemote.prototype.doSoapPost = function doSoapPost(url,func,func_handler,xmlinfo)
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
	  					//window.status = conn.status;
	  					//alert(conn.status + " " + conn.statusText);
	  					conn.abort();
	  				}
	  				else
	  				{	
    	  					func_handler(conn.responseText);
						load = false;
						//window.status = conn.status;
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
         	func_handler(conn.responseText);
      		load = false;
      		//window.status = conn.status;
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