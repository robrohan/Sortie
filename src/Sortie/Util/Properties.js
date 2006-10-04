/**
 * File: Util/Properties.js
 *
 * Copyright: 
 * 	2006 Rob Rohan (robrohan@gmail.com) All rights reserved
 *
 * Related:
 *	Util/Collections.js
 */
if(!Sortie.Util) Sortie.Util = {};

/*if(typeof COLLECTIONS_VERSION == "undefined" || typeof OUTPUT_VERSION == "undefined")
{
	alert("Fatal Error: Properties is missing required libraries");
	throw new Error("Properties.js missing required libraries");
} */
Sortie.Core.$({
	require:new Array(
		{ c:"Sortie.Util.Collections", v:"0.2"}
	)
});

/**
 * Class: Sortie.Util.Properties
 * 
 */
Sortie.Util.Properties = function() {
	this.map = new Sortie.Util.Map();
	
	/**
	 * Method: Properties.Parse
	 * Used to load a properies file from a string
	 *
	 * Parameters:
	 * 	
	 * 	style - null=plain text, 2=escaped, 3=base64ed
	 * 	
	 * Return:
	 */
	this.Parse = function(str) {
		var alllines = str.split("\n");
		
		for(var z=0; z<alllines.length; z++) {
			//remove commentlines
			currentline = alllines[z].toString().replace(/#.*$/g,"");
			if(currentline == "")
				continue;
			
			var parts = this.SplitNameValue(currentline)
			this.map.Put(parts[0],parts[1]);
		}
	};
	
		
	/**
	 * Method: Properties.SplitNameValue
	 *
	 * Returns:
	 * 	an array of two items, name and value
	 */
	this.SplitNameValue = function(nvpair) {
		var nv = new Array();
		nv = nvpair.split("=");
		
		if(nv.length == 2) {
			return nv;
		} else if(nv.length == 1) {
			nv[1] = "";
			return nv;
		} else if(nv.length > 2) {
			var value="";
			for(z=1; z<nv.length; z++) {
				value += nv[z] + "=";
			}
			return new Array(nv[0], value.substring(0,value.length-1));
		} else {
			//??
		}
	}
	
	/**
	 * Method: Properties.PropertyNames
	 * Returns an enumeration of all the keys in this property list, including 
	 * distinct keys in the default property list if a key of the same name has not 
	 * already been found from the main properties list.
	 *
	 * Returns:
	 * 	 an array of key names
	 */
	this.PropertyNames = function()
	{
		return this.map.GetKeysAsArray();
	};
	
		
	/**
	 * Method: Properties.GetProperty
	 * Gets the value from the properites by key. If key is not found it will
	 * return what (if anything) is passed in defaultValue. If key is not found
	 * and no defaultvalue given, it'll  return null
	 *
	 * Parameters:
	 * 	key - the string key to search for
	 * 	defaultValue - (optional) the value to return if the key is not found
	 *
	 * Returns:
	 *  the property as a string, the default value, or null	
	 */
	this.GetProperty = function(key, defaultValue) {
		var value = this.map.Get(key);
		
		if(value == null) {
			if(defaultValue != null && typeof defaultValue != "undefined") {
				value = defaultValue;
			}
		}
		
		return value;
	};
	
	/**
	 * Method: Properties.SetProperty
	 * Sets (or adds) a property from this properties object
	 *
	 * Parameters:
	 * 	key - the key
	 * 	value - the value
	 */
	this.SetProperty = function(key, value) {
		this.map.Put(key,value);
	};
	
	/**
	 * Method: Properties.Store
	 * 
	 * Parameters:
	 * 	style - null=plain text, 2=escaped, 3=base64ed
	 * 	header - the header to put at the top of the file (string) can be null
	 * Return:
	 */
	this.Store = function(style, header) {
		var mapkeys = this.map.GetKeysAsArray();
		var propfile = (header == null) ? "" : header;
		var value = "";
		
		for(var z=0; z<mapkeys.length; z++) {
			propfile += mapkeys[z];
			value = this.map.Get(mapkeys[z]);
			
			propfile += "=";
			
			if(style == 2) {
				propfile += escape(value);
			} else {
				propfile += value;
			}
			
			if(z != (mapkeys.length-1) )
				propfile += "\n";
		}
		return propfile;
	};
}

/////////////////////META DATA //////////////////////////////////////////////
/** 
 * Variable: Sortie.Util.Properties.VERSION 
 * 	the current version 
 */
Sortie.Util.Properties["VERSION"] = "0.2";
///////////////////////////////////////////////////////////////////////////
