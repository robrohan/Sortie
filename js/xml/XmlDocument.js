/**
 * File: xml/XmlDocument.js
 * This library provides the ability to create an XML DOM document cross browser.
 * The document can be loaded from a string and written to a string. 
 *
 * Copyright: 
 *	2004 Rob Rohan robrohan@gmail.com All rights reserved
 *
 * See:
 * 	<http://mozref.com/reference/objects/Document>
 * 
 * Example:
 * (start code)
 *  myDoc = new XmlDocumentFactory.getInstance();		//get a new doc
 *  myDoc.loadXML("<test>hi</test>");					//populate from string			
 *  str = myDoc.toString();							//show xml as string
 * 
 *  nodelist = myDoc.getElementsByTagName("tag");		//get a list of elements
 *  nodelist = myDoc.getElementsByTagNameNS("uri","tag");
 *  node = myDoc.documentElement						//the root node
 *  attr = myDoc.createAttribute("name")				//creates and attribute
 *  attr = myDoc.createAttributeNS("uri","name")
 *  element = myDoc.createElement("name")
 *  element = myDoc.createElementNS("uri","name")
 *  node = myDoc.createTextNode(data)
 *  element = myDoc.getElementById(id)
 * (end)
 *
 * Related:
 * 	util/Collections.js
 * 	xml/XmlSax.js (for safari only)
 * 	xml/XmlW3CDom.js (for safari only)
 */
if(typeof COLLECTIONS_VERSION == "undefined" || typeof XMLW3DOM_VERSION == "undefined") {
	alert("Fatal Error: XMLDocument is missing required libraries");
	throw new Error("xmldocument.js missing required libraries");
}

/**
 * Variable: XMLDOCUMENT_VERSION 
 * 	the library version 
 */
var XMLDOCUMENT_VERSION = "0.1";

/**
 * Variable: XML_ELEMENT 
 * 	an xml element 
 */
var XML_ELEMENT             = 1;
/**
 * Variable: XML_ATTRIBUTE 
 */
var XML_ATTRIBUTE           = 2; 
/**
 * Variable: XML_TEXT 
 */
var XML_TEXT                = 3;
/**
 * Variable: XML_CDATA 
 */
var XML_CDATA               = 4;
/**
 * Variable: XML_ENTITY_REFERENCE 
 */
var XML_ENTITY_REFERENCE    = 5;
/**
 * Variable: XML_ENTITY 
 */
var XML_ENTITY              = 6;
/**
 * Variable: XML_PI 
 */
var XML_PI                  = 7;
/**
 * Variable: XML_COMMENT 
 */
var XML_COMMENT             = 8;
/**
 * Variable: XML_DOCUMENT 
 */
var XML_DOCUMENT            = 9;
/**
 * Variable: XML_DOCUMENT_TYPE 
 */
var XML_DOCUMENT_TYPE       = 10;
/**
 * Variable: XML_DOCUMENT_FRAGMENT 
 */
var XML_DOCUMENT_FRAGMENT   = 11;
/**
 * Variable: XML_NOTATION 
 */
var XML_NOTATION            = 12;

var __node_types = new Array();
	__node_types[1]  = "Element";
	__node_types[2]  = "Attribute";
	__node_types[3]  = "Text";
	__node_types[4]  = "CDATA";
	__node_types[5]  = "Entity Reference";
	__node_types[6]  = "Entity";
	__node_types[7]  = "Processing Instruction";
	__node_types[8]  = "Comment";
	__node_types[9]  = "Document";
	__node_types[10] = "Document Type";
	__node_types[11] = "Document Fragment";
	__node_types[12] = "Notation";

/**
 * Function: XML_NodeTypeAsString
 * gets and xml node type as a string
 *
 * Parameters:
 * 	node - the node whos type you'd like to know
 *
 * Return:
 * 	a string that represnets the node
 */
function XML_NodeTypeAsString(node)
{
	try {
		return __node_types[node.nodeType];
	}catch(e){
		throw new Error("XML_NodeTypeAsString:: " + e);
	}
}

/**
 * Class: XMLDocumentFactory
 * This can be used to create new xml documents in a somewhat cross browser
 * compatable way. It trys to keep MS and Mozilla functions the same with a touch
 * of w3c thrown in for good measure. This add Namespace support to IE and the 
 * ability to load a document from a string in safari with the supporting libraies
 * The create instance method should give you a DOM object that you should be used to
 */
function XMLDocumentFactory() {;}

/**
 * Method: XMLDocumentFactory.getInstance
 * Gets an instance of an XML document that tries
 * to have the same w3c functions for all browsers
 * currently IE, Mozilla, and Safari
 *
 * Return:
 * 	an XMLDocument object
*/
XMLDocumentFactory.prototype.getInstance = function _xmldoc_getInstance()
{
	try 
    	{
		////////////////////////////////////////////////////////////////////
		//Try to create a microsoft xml document. and try to add the
    		//functions they missed.
		if(window.ActiveXObject) 
		{
			function wrapper(){;}
    			//the document namespace fix for MS
    			//this will hold the prefix to URI
			wrapper.__NSmap = new Map();
    			wrapper.__doc = new ActiveXObject("Microsoft.XMLDOM");
    			wrapper.documentElement = null;
			
			//to get XML from a string
    			wrapper.loadXML = function(str)
			{
				var status = this.__doc.loadXML(str);
    				
    				//try to store the namespaces from the document and put
    				//it in our namespace map so we can use w3c namespace
    				//stuff (or at least try :-d )
    				var rootelement = this.__doc.documentElement;
    				this.__recurseNodeForNamespace(rootelement);
    				
    				//w3c - attribute to the root element
    				this.documentElement = this.__doc.documentElement; 
    				
    				return status;
    			};
						
			//internal usage only
			//look for namespaces in the whole document
			wrapper.__recurseNodeForNamespace = function(node)
    			{
    				if(node != null)
    				{
    					this.__getNamespaces(node);
        				var dChildren = node.childNodes;
        				var dcl = dChildren.length;
        				var i = 0;
        				for(; i<dcl; i++)
            			{	
						if(dChildren.item(i) != null && dChildren.item(i).nodeType == XML_ELEMENT)
						this.__recurseNodeForNamespace(dChildren.item(i));
					}
				}
			};
			
			//
			wrapper.__scratch_element = null;
			wrapper.__recurseNodeForId = function(node,id)
			{    				
				var dChildren = node.childNodes;
				var dcl = dChildren.length;
			    
				var i = 0;
				for(; i<dcl; i++)
				{	
					if(dChildren.item(i) != null)
					{
						if(dChildren.item(i).nodeType == XML_ELEMENT)
						{
							if(dChildren.item(i).getAttribute("id") == id)
							{
								//return dChildren.item(i);
								this.__scratch_element = dChildren.item(i);
								return this.__scratch_element;
							}
							//return 
							this.__recurseNodeForId(dChildren.item(i),id);
						}
					}
				}
				//return null;
				return this.__scratch_element;
			};
			
			//API - w3c
			wrapper.createAttribute = function(name)
			{
				return this.__doc.createAttribute(name);
			};
			
			//API - w3c
			wrapper.createAttributeNS = function(nsURI, name)
			{
				if(this.__NSmap.get(nsURI) == null)
				{
					//this namespace is not in the document
					//it should add it
				}
				return this.__doc.createAttribute(name);
			};
			
    			//API - w3c
    			wrapper.createElement = function(name)
    			{
    				return this.__doc.createElement(name);
    			};
			
    			//API - w3c
    			wrapper.createElementNS = function(nsURI, name)
    			{
    				if(this.__NSmap.get(nsURI) == null)
    				{
    					//this namespace is not in the document
    					//it should add it
    				}
    				return this.__doc.createElement(name);
    			};
			
    			//API - w3c
    			wrapper.createTextNode = function(data)
    			{
    				return this.__doc.createTextNode(data);
    			};
			
    			// API - w3c
    			//to get nodes without a namespace
    			wrapper.getElementById = function(id)
    			{
    				var rootelement = this.__doc.documentElement;
    				return this.__recurseNodeForId(rootelement,id);
    				//return this.__doc.getElementById(id);
    			};
			
    			// API - w3c
    			//to get nodes without a namespace
    			wrapper.getElementsByTagName = function(tagname)
    			{
    				return this.__doc.getElementsByTagName(tagname);
    			};
			
    			//API - non w3c
    			//to output the document as a string
    			//wrapper.xml = this.__doc.xml;
    			wrapper.xml = function()
    			{
    				return this.__doc.xml;
    			};
				
    			//API - w3c
    			//for namespace aware documents
    			wrapper.getElementsByTagNameNS = function(nsURI, tagname)
    			{
    				return this.__doc.getElementsByTagName(this.__fqitem(nsURI,tagname));
    			};
			
    			//internal only. Looks up a uri in the map and fully
    			//qualifies the passed item
    			wrapper.__fqitem = function(nsURI, name)
    			{
    				var fqitem = this.__NSmap.get(nsURI);
    				//alert(this.__NSmap);
    				if(fqitem != null && fqitem != "") 
    					fqitem += ":" + name;
    				else
    					fqitem = name;
    				
    				return fqitem;
    			}
			
				//internal usage only
				wrapper.__getPrefix = function(tagName)
			{
			    var prefix;
			    var prefixIndex = tagName.indexOf(":");
			
			    if (prefixIndex == -1)
			        return null;
			    else 
			        return prefix = tagName.substring(0, prefixIndex);
			};
            
            //internal usage only
            wrapper.__getLocalName = function(tagName)
            {
                var suffix;
                var prefixIndex = tagName.indexOf(":");
            
                if (prefixIndex == -1)
                    return tagName;
                else 
                    return suffix = tagName.substring(prefixIndex+1, tagName.length);
            };
			
				//internal usage only
        		wrapper.__getNamespaces = function(elementNode)
			{
				if(elementNode != null)
				{
			        var attributes = elementNode.attributes;
			 
			        if((attributes != null) && (attributes.length > 0))
			        {
			        	var attlen = attributes.length;
			            for(var x=0; x<attlen; x++)
			            {
			                var attributeNamespacePrefix = this.__getPrefix(attributes.item(x).nodeName);
			                var attributeNamespaceSuffix = this.__getLocalName(attributes.item(x).nodeName);
							
							//is this the default namespace?
			                if((attributeNamespacePrefix == null) 
			                	&& (attributeNamespaceSuffix == "xmlns"))
			                {
			                	//this.__NSmap.put(attributes.item(x).nodeValue,"");
							}
							//this is a namespace, not the default one
			                else if(attributeNamespacePrefix != null
			                	&& (attributeNamespacePrefix == "xmlns"))
			                {
								this.__NSmap.put(attributes.item(x).nodeValue, attributeNamespaceSuffix)
			                }
			            }
			        }
				}
			};
            
			wrapper.toString = function()
			{
				return this.__doc.xml;
			};
			
			return wrapper;
		}
    		////////////////////////////////////////////////////////////////////
    		//Try to create a Gecko XML document and try to add the functions
    		//they missed and add our needed extra stuff too. this resolves to true
    		//in safari, but fails in implementation - so we fail on purpose for
    		//safari
    		else if((!SysBrowser.safari && !window.widget) && document.implementation && document.implementation.createDocument)
		{    			
			var doc = document.implementation.createDocument("", "", null);
    			
			// some versions of Moz do not support the readyState property
			// and the onreadystate event so we patch it!
			if(doc.readyState == null)
			{
				doc.readyState = 1;
				doc.addEventListener(
					"load", 
					function()
					{
						doc.readyState = 4;
						if(typeof doc.onreadystatechange == "function")
							doc.onreadystatechange();
					}, 
					false
				);
			}
    			
			//mozilla xml docs can't be made by strings by default so we'll add
			//this so the functions are the same as MSs
			doc.loadXML = function(s) 
			{
				//parse the string to a new doc
				var doc2 = (new DOMParser()).parseFromString(s, "text/xml");
      
				//remove all initial children
				while(this.hasChildNodes())
					this.removeChild(this.lastChild);
         
				//insert and import nodes
				var clen = doc2.childNodes.length;
				for(var i = 0; i < clen; i++) 
				{
					this.appendChild(this.importNode(doc2.childNodes[i], true));
				}
			};
			
			
             //it also has a problem with doing a to string
             if(!SysBrowser.opera)
             {
	    			doc.__defineGetter__(
	    				"xml", 
	    				function()
	    				{
	    					return (new XMLSerializer()).serializeToString(this);
	    				}
	    			);
	    		}
    			
    			
    			doc.toString = function()
    			{
    				return (new XMLSerializer()).serializeToString(this);
    			};
    			
    			doc.__scratch_element = null;
    			doc.__recurseNodeForId = function(node,id)
    			{    				
				var dChildren = node.childNodes;
				var dcl = dChildren.length;
        	        
				var i = 0;
				for(; i<dcl; i++)
				{	
        				if(dChildren.item(i) != null)
        				{
        					if(dChildren.item(i).nodeType == XML_ELEMENT)
        					{
        						if(dChildren.item(i).getAttribute("id") == id)
            					{
            						this.__scratch_element = dChildren.item(i); 
            						return this.__scratch_element;
            					}
        						
        						//return 
        						this.__recurseNodeForId(dChildren.item(i),id);
        					}
        				}
        			}
        			return this.__scratch_element;
    			};
    			
			// API - w3c
			//to get nodes without a namespace
			doc.getElementById = function(id)
			{
				var rootelement = this.documentElement;
				return this.__recurseNodeForId(rootelement,id);
			};
			
    			return doc;
		}
		//////////////////////////////////////////////////////////////////////////
		//this works in a safari widget, but not in safari proper
		// else if((SysBrowser.safari || window.widget) && document.implementation && document.implementation.createDocument)
		//{
		//	var doc = document.implementation.createDocument("", "", null);
		//	
		//	doc.loadXML = function __sfdoc__loadXML(e)
		//	{
		//		var url = "data:application/xml;charset=utf-8," + encodeURIComponent(e);
		//		
		//		var req = new XMLHttpRequest();
		//		req.open("GET", url, false);
		//		if (req.overrideMimeType) 
		//		{
		//			req.overrideMimeType("application/xml");
		//		}
		//		req.send(null);
		//		
		//		alert(req.responseXML);
		//		
		//	}
		//	
		//	return doc;
		//} 
		
		////////////////////////////////////////////////////////////////////////
		//Fall back on a pure javascript DOM object. This is actually the most
		//w3c compliant, but its slower and uses more memeory, so only use this
		//if we cant get M$s or Geckos (this allows safari to work)
		else
		{	
			function wrapper(){;}
				
    			wrapper.__docImp = new DOMImplementation();
			wrapper.__doc = new DOMDocument(this.__docImp);
			wrapper.documentElement = null;
    			
    			wrapper.loadXML = function(xmldoc)
    			{
    				this.__doc = this.__docImp.loadXML(xmldoc);
    				this.documentElement = this.__doc.documentElement;
    			};
    			
    			wrapper.getElementById = function(id)
    			{
    				return this.__doc.getElementById(id);
    			};
    			
    			wrapper.toString = function()
    			{
    				return this.__doc.toString();
    			};
    			
    			wrapper.getElementsByTagName = function(tag)
    			{
    				return this.__doc.getElementsByTagName(tag);
			};
			
			wrapper.getElementsByTagNameNS = function(uri,tag)
			{
				return this.__doc.getElementsByTagNameNS(uri,tag);
			};
			
			wrapper.createAttribute = function(name)
			{
				return this.__doc.createAttribute(name);
			};
			
			wrapper.createAttributeNS = function(uri,name)
			{
				return this.__doc.createAttributeNS(uri,name);
			};
			
			wrapper.createElement = function(name)
			{
				return this.__doc.createElement(name);
			};
			
			wrapper.createElementNS = function(uri,name)
			{
				return this.__doc.createElementNS(uri,name);
			};
			
			wrapper.createTextNode = function(data)
			{
				return this.__doc.createTextNode(data);
			};
			
			return wrapper;
		}
	
		//we totally failed - nothing worked at all.	
		return null;
		
    	}catch(ex){
    		throw new Error("XML Document creation failed: " + ex);
	}
};