/**
 * File: io/RemoteObject.js
 * This library is used to unmarshal a soap xml document into javascript objects
 * at present it has only been used with coldfusion mx web serivces - though
 * it should work with all type of services
 *
 * Copyright: 
 * 	2004 Rob Rohan (robrohan@gmail.com) All rights reserved
 *
 * Related:
 * 	util/Collections.js
 * 	xml/XmlDocument.js
 * 	io/Gateway.js
 */
if(typeof COLLECTIONS_VERSION == "undefined" || typeof XMLDOCUMENT_VERSION == "undefined"
	|| typeof GATEWAY_VERSION == "undefined" || typeof DEBUG_VERSION == "undefined")
{	
	alert("Fatal Error: RemoteObject Missing Required Libraries");
	throw new Error("RemoteObject.js Missing Required Libraries");
}

var DATATYPE_MAP 	= "ns2:Map";
var DATATYPE_STRING 	= "soapenc:string";
var DATATYPE_STRING2 = "xsd:string";
var DATATYPE_ARRAY	= "soapenc:Array";
var DATATYPE_BOOLEAN = "soapenc:boolean";
var DATATYPE_NUMBER = "soapenc:double";
var DATATYPE_NUMBER2 = "xsd:double";
var DATATYPE_DATE_TIME = "xsd:dateTime";

/**
 * Variable: REMOTE_OBJECT_VERSION 
 * 	the library version 
 */
var REMOTE_OBJECT_VERSION = "0.2";

/**
 * Variable: __dfh__variable 
 * 	the default handler uses this as a scratch pad var (not thread safe!) 
 */
var __dfh__variable;

/**
 * Function: __gateway__map_from_struct
 * not an API - internal only function - used to make a coldfusion struct (java
 * Map) into a js map (recursive function)
 *
 * Parameters:
 * 	lookupid
 * 	xmldoc
 * 	nstruct
 */
function __gateway__map_from_struct(frag, xmldoc, nstruct)
{
	//var frag = xmldoc.getElementById(lookupid);
	var dChildren = frag.childNodes;
	var dcl = dChildren.length;
	
	for(var q=0; q<dcl; q++)
	{
		if(dChildren.item(q).nodeType == XML_ELEMENT && dChildren.item(q).nodeName == "item")
		{
			var dItem = dChildren.item(q).childNodes;
			var dicl = dChildren.item(q).childNodes.length;
			var key = null;
			var value = null;
			
			//since mozilla and IE define children differenty this is needed :(
			for(z=0; z<dicl; z++)
			{
				if(dItem.item(z).nodeType == XML_ELEMENT && dItem.item(z).nodeName == "key")
				{
					key = dItem.item(z).firstChild.nodeValue;
				}
				if(dItem.item(z).nodeType == XML_ELEMENT && dItem.item(z).nodeName == "value")
				{
					//if(dItem.item(z).getAttribute("href") == null 
					//	|| typeof dItem.item(z).getAttribute("href") == "undefined"
					//	|| dItem.item(z).getAttribute("href") == "")
					var xsiType = dItem.item(z).getAttribute("xsi:type")
					if(xsiType == DATATYPE_STRING || xsiType == DATATYPE_STRING2)
					{
						value = dItem.item(z).firstChild.nodeValue;	
					}
					else if (xsiType == DATATYPE_NUMBER || xsiType == DATATYPE_NUMBER2)
					{
						value = parseFloat(dItem.item(z).firstChild.nodeValue);
					}
					else if (xsiType == DATATYPE_DATE_TIME)
					{
						value = DefaultHandler.xmlDate2JSDate(dItem.item(z).firstChild.nodeValue);
					}
					else if(xsiType == DATATYPE_MAP)
					{
						value = new Map();
						//value = "!ref! " + dItem.item(z).getAttribute("href");
						//var newid = dItem.item(z).getAttribute("href");
						//newid = newid.toString().substring(1,newid.length);
						__gateway__map_from_struct(dItem.item(z), xmldoc, value);
					}
				}
			}
			nstruct.put(key,value);
		}
	}
}

/**
 * handles an axis fault document (when a WS call fails)
 */
function __handleFaultDocument(xmldoc)
{
	var fcode = xmldoc.getElementsByTagName("faultcode");
	var fstringnode = xmldoc.getElementsByTagName("faultstring");
	var trace = xmldoc.getElementsByTagNameNS(
		"http://xml.apache.org/axis/",
		"stackTrace"
	);
	
	var dspstring = fcode.item(0).firstChild.nodeValue + "\n\n";
	dspstring += fstringnode.item(0).firstChild.nodeValue + "\n\n";
	dspstring += "See log for more details.";
		
	alert(dspstring);
	
	log.debug(dspstring);
	log.debug(trace.item(0).firstChild.nodeValue);	
}

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Function: RemoteObjectLoader
 * This provides a wrapper for RemoteObjectFactory that accepts a
 * listener/event handler to be registered that will be called when
 * the object is ready.  Much nicer than the setTimeout method.
 * 
 * Note: 
 *  	This may move to another file in the future
 *
 * Parameters:
 * 	url - the web service to load the object from
 *  handler - the callback function to run when the object is loaded
 * 	asyc - (optional) set to true to use async mode  sync mode by default
 */
function RemoteObjectLoader(url, handler, async) 
{
	if(typeof async == "undefined")
		async = false;

	this.remoteObjectFactory = new RemoteObjectFactory();

	this.remoteObjectFactory.setAsync(async);
	this.remoteObjectFactory.createObject(RemoteObjectLoader.HTTPConnectFactory.getInstance(), url);

	var self = this;
	
	checkLoaded = function() 
	{
		var remObj = self.remoteObjectFactory.getObject();
		var fieldCount = 0;
		for(var i in remObj) 
		{
			fieldCount++;
			break;
		}
		
		if(fieldCount > 0) 
		{
			clearInterval(self.loadInterval);
			handler(remObj);
		}
	}
	this.loadInterval = setInterval(checkLoaded, 100);
}
RemoteObjectLoader.HTTPConnectFactory = new HTTPConnectFactory();

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: RemoteFunction
 * mostly used internally. an object to hold remote function
 * information
 */
function RemoteFunction()
{
	this.name = "";
	this.param = new Map();
	this.returnname = "";
	this.returntype = "";
}

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: RemoteObjectFactory
 * Factory to create a remoting object in a non-browser specific way (mostly)
 */
function RemoteObjectFactory()
{
	//the server connection
	//this.remote = new JSRemote(connection);
	this.newobject = new Object();
	this.async = false;
}	

/**
 * Method: RemoteObjectFactory.setAsync
 * set the async mode (defaults to false)
 *
 * Parameters:
 * 	to - boolean of true (async) or false (snyc)
 */	
RemoteObjectFactory.prototype.setAsync = function __setAsync(to)
{
	this.async = to;
};

/**
 * Method: RemoteObjectFactory.getObject
 * after an object is unmarshaled this function can be used to get the
 * object
 *
 * Returns:
 * 	the Webservice as a JS object
 */
RemoteObjectFactory.prototype.getObject = function __getObject()
{
	if(this.newobject == null)
	{
		throw new Error("New remote object is null");
	}
	else
	{
		inst = new Object();
		
		for(i in this.newobject)
		{
			inst[i] = this.newobject[i];
		}
		return inst;
	}
};

/**
 * Method: RemoteObjectFactory.createObject
 * This is a monster method. Basically this is what loads the web service into
 * a JS Object. This returns nothing - what you'll need to do is poll getObject
 * to get the object once its done cooking
 *
 * Parameters:
 * 	connection - an HTTPConnection object to use to query the server
 * 	url - the url to the web service
 */
RemoteObjectFactory.prototype.createObject = function __createObject(connection, url)
{
	remoter = new JSRemote(connection,this.async);
	//this.remotefunctions = new Map();
	remotefunctions = new Map();
	
	function RemoteObject(){;}
	RemoteObject.prototype.jsremote = remoter;
	RemoteObject.prototype.objecturl = url;
	RemoteObject.prototype.namespace = "neuro://response/";
	RemoteObject.prototype.remotefunctions = remotefunctions; //this.remotefunctions;
	
	RemoteObject.prototype.__createSOAPRequest = function(rfunc, args)
	{
    		//create the request based on the functions
    		//and params - this should not be hard coded at some point
    		//and should probably use *real* xml hehehee
    		var soapxml = "<?xml version='1.0' encoding='utf-8' ?>"
			soapxml += "<soapenv:Envelope";
			soapxml += " xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"";
			soapxml += " xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"";
			soapxml += " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"";
			soapxml += " xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\"";
			soapxml += " xmlns:ns2=\"http://www.w3.org/2001/XMLSchema\"";
			soapxml += " xmlns:impl=\"http://neuromancer.products\"";
			soapxml += " xmlns:asoap=\"http://xml.apache.org/xml-soap\"";
			soapxml += ">";
			soapxml += "<soapenv:Body>";

			soapxml	+= "<ns1:" + rfunc.name + " xmlns:ns1=\"" 
				+ this.namespace + rfunc.name + "\"";
			soapxml	+= " soapenv:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"";
			soapxml	+= ">";
		
		for(x=0; x<rfunc.param.size(); x++)
		{
			var pname = rfunc.param.aname[x];
			var ptype = rfunc.param.avalue[x];
			var pvalue = args[x];
			
			//if it looks like an array...
			if(ptype == "impl:ArrayOf_xsd_anyType")
			{
				soapxml += pvalue.toWSArray(pname,"impl:ArrayOf_xsd_anyType");
			}
			else if(ptype == "impl:ArrayOf_xsd_string")
			{
				soapxml += pvalue.toWSArray(pname,"impl:ArrayOf_xsd_string");
			}
			//probably a struct
			else if(ptype == "apachesoap:Map" || ptype == DATATYPE_MAP)
			{
				soapxml += pvalue.toWSStruct(pname,0,-1);
			}
			//normal variable
			else
			{
				soapxml	+= "<" + pname + " xsi:type=\"" + ptype + "\">" 
					+ pvalue + "</" + pname + "> ";
			}
		}

		soapxml	+= "</ns1:" + rfunc.name + ">";
   		soapxml	+= "</soapenv:Body>";
		soapxml	+= "</soapenv:Envelope>";
		
		log.debug("created soap post: " + soapxml);
				
		return soapxml;
	};
	
	//////////////////   		
	RemoteObject.prototype.__remoteSend = function()
	{
    		// should be the function name 
    		var funcName = arguments[0];
    		// all the rest of the arguments
    		var funcArgs = arguments[1];
    		
		//alert("I ran " + funcName);
    		
    		var arglen = funcArgs.length;
    		
    		//get the remote function object for this function 
    		//(mostly for lookup values)
    		remotefunc = this.remotefunctions.get(funcName);
    		
    		//if we have no record of the function ... thats bad
    		if(remotefunc == null)
    			throw new Error(
    				"Fatal Error: remote function " + funcName + " not listed in object table"
    			);
    		
    		//quick check to see if there are the right number of
    		//parameters (-1 because of the handler)
    		if(remotefunc.param.size() > arglen)
    			throw new Error(
    				"Method " + funcName + " takes " + remotefunc.param.size() + " parameters"
    			);
    		
    		var soappacket = this.__createSOAPRequest(remotefunc,funcArgs);
    		
    		//alert(soappacket);
    		
    		nsptr = this.namespace;
    		fnameptr = remotefunc.name;
    		rtnameptr = remotefunc.returnname;
    		
    		//make sure we have a handler if not make a simple one that just
    		//shows the responses value to stdout
    		var handler = funcArgs[arglen-1];
    		if(handler == null || typeof handler != "function") 
    		{
    			__neuro__myvar__ = new Object();
    			handler = new DefaultHandler("__neuro__myvar__");
    		}
    		
    		if(this.objecturl == null || this.objecturl.length < 1)
    			throw new Error(
    				"Missing object URL, I have no where to send posts. bah!"
    			);
    		
    		//if we are using DH or a subclass
    		if(handler instanceof DefaultHandler)
    		{
    			log.debug("Doing the post with DefaultHandler instance...");
    			this.jsremote.doSoapPost(
    				this.objecturl,
    				funcName,
    				handler.handle,
    				soappacket
    			);
    		}
    		//assume they know what they are doing and just
    		//run the function
    		else
    		{
    			log.debug("Doing the post with a function instance...");
    			this.jsremote.doSoapPost(
    				this.objecturl,
    				funcName,
    				handler,
    				soappacket
    			);
    		}
	};
		
	//////////////////////////////////////////////////////////////////
	
    	//where the wsdl will be
    	tdoc = "";
    	//handler to pass to the loader
    	hnd = function(str)
    	{
    		if(str == null || typeof str == "undefined")
    		{
    			log.error("The WSDL came back null or undefined");
    			return;
    		}
    		
    		tdoc = str;
    	};
    	//get the wsdl
    remoter.doGetRequest(url + "?wsdl",hnd);
    //remoter.doGetRequest(url,hnd);
	
    	//Ok, this is where it gets a bit funky. We can't be sure the wsdl
    	//will be here right away (it is the internet you know) so we have
    	//to set a timer to keep checking to see if the document is ready.
    	//then we have to do all our other stuff to the object that makes it
    	//"match" the remote service
    	rter = remoter;
    	thnd = 0;
    	//rfptr = this.remotefunctions;
    	rfptr = remotefunctions;
    	nobjptr = this.newobject;
	
    	getObjDef = function()
    	{
    		//if the remoter is not loading try to 
    		//do what we need
    		if(tdoc.length > 1)
    		{
			//first stop this loop
    			window.clearInterval(thnd);
    			log.debug("Web service responded - jolly good");
    			
    			var xmlDocFactory = new XMLDocumentFactory();
    			var xmldoc = xmlDocFactory.getInstance();
    			xmldoc.loadXML(tdoc);
    			
    			//get the nodes that tell us about the operations
    			//this object has
    			var opnodes = xmldoc.getElementsByTagNameNS(
    				"http://schemas.xmlsoap.org/wsdl/",
    				"operation"
    			);
    			
    			var partnodes = xmldoc.getElementsByTagNameNS(
    				"http://schemas.xmlsoap.org/wsdl/",
    				"part"
    			);
    			
    			var partlen = partnodes.length;
    			
			//loop over any operation and try to add them to the
			//object remotefunctions table so the object can use
			//them corretly ... well ... at all
			log.debug("Learning web service...");
			log.debug("tdoc: " + tdoc.toString());
			
			var oplen = opnodes.length;
						
    			for(var x=0; x<oplen; x++)
    			{
	    			var fname   = opnodes.item(x).getAttribute("name");
	    			var fparams = opnodes.item(x).getAttribute("parameterOrder");
    				
    				if(!rfptr.contains(fname))
    				{
    					var rf = new RemoteFunction();
        				rf.name = fname;
        				rf.returnname = fname + "Return";
        				
        				//get a list of all the params
					tarray = new Array();
						
					if(fparams != null)
						tarray = fparams.split(" ");
        				
        				//get the type this service uses for params and reutrn type
        				//needed for sending
        				var q=0;
        				for(; q<partlen; q++)
        				{
	        				var pname = partnodes.item(q).getAttribute("name");
	        				var ptype = partnodes.item(q).getAttribute("type");
        					
        					//now we have to look at our params and see what types they
        					//are supposed to be, save it into RemoteFunctoin
        					var u=0;
        					for(;u<tarray.length;u++)
        					{
        						if(tarray[u] == pname)
        						{
        							//got it...
        							rf.param.put(pname,ptype);
        							//neuro_SystemOut(pname + " " + ptype + "\n");
        						}
        					}
        					
        					if(rf.returnname == pname)
        					{
        						//got the return type
        						rf.returntype = ptype;
        						//neuro_SystemOut(rf.returnname + " " + ptype + "\n");
        					}
        				}
        				
        				//fparams.replace(/ /g,",")
        				//neuro_SystemOut(
        				//	"function:\n\t" + rf.returntype + " " + fname 
        				//		+ " (" + rf.param.toString()  + ")\n"
        				//);
        				
        				
        				//we should have all the params for this function so add it
        				//to the object map
        				rfcopy = new Object();
        				for(var i in rf)
            			{
		            		rfcopy[i] = rf[i];
            			}
            			
            			rfptr.put(fname,rfcopy);
        			}
    			}
    			log.debug("Done Learning web service.");
    			
    			var allnames = rfptr.getKeysAsArray();
    			
    			log.debug("Building Local object...");
            	for(var z=0; z<allnames.length; z++)
            	{
            		//var rf = this.remotefunctions[z];
            		//alert(z + " " + allnames[z]);
        	    		eval("RemoteObject.prototype." + allnames[z] 
            			+ " = function(){ this.__remoteSend('"+ allnames[z]
            			+ "',arguments); }"
            		);
            	}
            	
            	var newremote = new RemoteObject();
            	//now we need to copy (not pass a pointer)
            	//for our new object ot get it up to the Factory level
            	//using the this.newobject pointer
            	for(var i in newremote)
            	{
            		nobjptr[i] = newremote[i];
            	}
            	
            	log.debug("Local RemoteObject created and ready.");
    		}
    		else
    		{
	    		log.debug("Waiting for web service to respond...");
    		}
    	};
    	
    	thnd = thread = window.setInterval("getObjDef();", 300);
};
	

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: DefaultHandler
 * The default handler. Used to set variables to what the web service
 * returns. You can write your own, but you have to handle the soap
 * parsing... unless you *want* the raw soap response
 *
 * Parameters:
 * 	v - the variable name that the parse result should be written to *NOTE* this is a string its the variables name *not* the variable itself
 */
function DefaultHandler(arg)
{
	//bb
	__throwaway = "";
	__dfh__variable = "__throwaway";
	__dfh__handler = null;

	var v = "__throwaway";
    var handler = null;

	if(typeof arg == "function") 
	{
		handler = arg;
	} 
	else if(typeof arg == "string") 
	{
		v = arg;
	}
	//bb
	
	//if this is a pointer it works great (array).
	//but if its a string it doesnt work at all.
	//it saves the values into __dfh__variable but they
	//never get set back to the original variable.
	__dfh__variable = v;
	//bb
	__dfh__handler = handler;
}

/**
 * Method: DefaultHandler.handle
 * try to break apart the soap message and get it to the
 * proper place. Note: this is a break off fuction so the
 * "this" is useless :-/
 *
 * Parameters:
 * 	str - the SOAP XML
 */
DefaultHandler.prototype.handle = function __handle(str)
{ 
	log.debug("DefaultHandler::handle running...");
	if(str == null)
		return;
		
	var	xmlDocFactory = new XMLDocumentFactory();
	var xmldoc = xmlDocFactory.getInstance();
	xmldoc.loadXML(str);
	
	var resvalnodes = null;
	//this is going to hold the return types datatype
	var returntype = null;
	
	//alert(nsptr + " " + fnameptr + " " + rtnameptr);
	
	//first things first, see if there was a fault...
	var fault = xmldoc.getElementsByTagNameNS(
		"http://schemas.xmlsoap.org/soap/envelope/",
		"Fault"
	);

	if(fault != null && typeof fault != "undefined" && fault.item(0) != null)
	{
		//TODO: handle faults...
		//handleFault(xmldoc)
		__handleFaultDocument(xmldoc)
		return;
	}
		
	//neuro_SystemOut(xmldoc.xml);
	if(typeof nsptr != "undefined" && typeof fnameptr != "undefined")
	{
		resvalnodes = xmldoc.getElementsByTagName(rtnameptr);
		
	}
	
	//this could be a simple value or an array...
	log.debug("Going to see if the value is a simple type, array, or map");
	//log.debug(resvalnodes + " " + resvalnodes.item(0).childNodes.length + " " + complextypeid);
	
	//get the return type
	returntype = resvalnodes.item(0).getAttribute("xsi:type");
		
	//if(resvalnodes != null && resvalnodes.item(0).childNodes.length > 0 
	//	&& (complextypeid == null || typeof complextypeid == "undefined" || complextypeid == "")
	//)
	//if(resvalnodes != null && resvalnodes.length > 0 && complextypeid == null)
	//{    		
		//this is probably a Fat array	
		//if(resvalnodes[0].childNodes.length > 1)
		log.debug("testing fat array or string...");
		//if(resvalnodes.item(0).childNodes.length > 1)
		if(returntype == DATATYPE_ARRAY)
		{
			log.debug("running fat array");
	
			var cnl = resvalnodes.item(0).childNodes.length;
			
			var __alist = new List();
			__dfh__variable = new List();
			
			for(var z=0;z<cnl;z++)
			{
				if(resvalnodes.item(0).childNodes.item(z).nodeType == XML_ELEMENT)
				{
					__alist.add(
						resvalnodes.item(0).childNodes.item(z).firstChild.nodeValue
					);
				}
			}
	
			for(__i_ in __alist)
			{
				//eval(__dfh__variable + "[__i_] = __alist[__i_]" );
				__dfh__variable[__i_] = __alist[__i_];
			}	
	
		}
		//this is probably a simple value
		else if(returntype == DATATYPE_STRING || returntype == DATATYPE_BOOLEAN || returntype == DATATYPE_STRING2)
		{
			log.debug("running thin array or string");
			//if the thin array libs are around (they should be)
			if(typeof ThinArray != "undefined")
			{
				var isThinA = false;
				eval("isThinA = " + __dfh__variable + " instanceof ThinArray");
				if(isThinA)
				{
					eval(__dfh__variable + ".fromPacket(resvalnodes.item(0).firstChild.nodeValue)");
				}
				//probably a normal string
				else
				{
					eval(__dfh__variable + " = resvalnodes.item(0).firstChild.nodeValue");
				}
			}
			else
			{
				eval(__dfh__variable + " = resvalnodes.item(0).firstChild.nodeValue");
			}
		}
		else if (returntype == DATATYPE_NUMBER || returntype == DATATYPE_NUMBER2)
		{
			eval(__dfh__variable + " = parseFloat(resvalnodes.item(0).firstChild.nodeValue)");
		}
		else if (returntype == DATATYPE_DATE_TIME)
		{
			eval(__dfh__variable + " = DefaultHandler.xmlDate2JSDate(resvalnodes.item(0).firstChild.nodeValue)");
		}
	//}
	//this is a structure (a coldfusion struct)
	//else if(complextypeid != null && complextypeid.length > 1)
	else if(returntype == DATATYPE_MAP)
	{
		log.debug("running struct...");
			
		//so now we lookup the reference id of the first node and begin building
		//our map. This is going to be very recursive, but since I am in a break off
		//function this could get hairy
		var newstruct = new Map();
		
		__dfh__variable = new Map();
		
		//recurse over the xml doc and ids and build maps in maps to represent
		//the cf struct as a js object
		log.debug("going into recurse...");
		__gateway__map_from_struct(resvalnodes.item(0), xmldoc, newstruct);
		log.debug("done recurse");
		
		//copy the newly made map to the handler
		for(var __z_ in newstruct)
		{
			__dfh__variable[__z_] = newstruct[__z_]; 
		}
		log.debug("done copy");
		
		//null out our temp object
		newstruct = null;
	}
	else
	{
		log.error("Got unknown datatype back from WS: " + returntype);
		__dfh__variable = null;
	}
	
	//bb
	if(__dfh__handler && __dfh__variable)
		__dfh__handler(eval(__dfh__variable));
	//bb
	
	if(this.afterLoad != null && typeof this.afterLoad != "undefined")
		this.afterLoad(__dfh__variable);
	
	
	//if this is from the handler that was not specified
	//show the value to stdout
	if(__dfh__variable == "__neuro__myvar__")
	{
		// TODO: this throws not defined errors.  Probably should be if(typeof neuro_SystemOut == "function") instead
		// Hopefully, however, no one will ever get here, because they'll always be using a callback.
		if(neuro_SystemOut != null)
		{
			neuro_SystemOut("\n");
			eval("neuro_SystemOut(" + __dfh__variable + ".toString())");
			neuro_SystemOut("\n");
			if(neuro_Runner != null)
				neuro_Runner("");
		}
	}
};

DefaultHandler.xmlDate2JSDate = function __xmlDate2JSDate(xmlDate) {
	var val = xmlDate.split("T");
	// split it into date and time portions
	var date = val[0];
	var time = val[1];
	date = date.split("-");
	time = time.split(":");
	// rip out the date portions
	var year = date[0];
	var month = date[1] - 1; // JS uses 0-11, not 1-12
	var day = date[2];
	// rip out the time portions
	var hours = time[0];
	var minutes = time[1];
	var seconds = parseFloat(time[2]);
	// convert fractional seconds to milliseconds
	var millis = Math.round((seconds - Math.floor(seconds) ) * 1000);
	seconds = Math.floor(seconds);
	// assemble the completed date
	var completeDate = new Date(year, month, day, hours, minutes, seconds, millis);
	// adjust the time from UTC (Zulu) to local time
	// TODO: change the to check for the appropriate adjustment, rather than blindly assuming UTC
	return new Date(completeDate.getTime() - (completeDate.getTimezoneOffset() * 60 * 1000));
};