/**
 * File: util/Output.js
 * Output text functions used by the console and the log
 *
 * Copyright: 
 * 	2004 Rob Rohan (robrohan@gmail.com) All rights reserved
 *
 * Related:
 *	util/Log.js
 */

if(typeof DEBUG_VERSION == "undefined")
{
	alert("Fatal Error: System is missing required libraries");
	throw new Error("system.js missing required libraries");
}

/**
 * Variables: SYSTEM_VERSION 
 * 	library version 
 */
var OUTPUT_VERSION = "0.1";

/**
 * Variables: NEWLINE
 * 	the default new line character to add to strings made by the system
 * (default [br])
 */
var NEWLINE = "\n";

/** 
 * the console area (if defined) 
 */
var conarea = null;

/**
 * Function: neuro_SystemOut
 * This function writes a log line to standard out (often an alert box if the console 
 * is off)
 *
 * Parameters:
 * 	str - the string to log
 */
function neuro_SystemOut(str)
{
	//this shouldn't check every time should it?
	if(conarea == null)
	{
		conarea = document.getElementById("neurostdout");
	}

	if(conarea != null)
	{
		str = neuro_xmlFormat(str);
		str = str.replace(/ /g,"&nbsp;");
		str = str.replace(/\n/g,"<br>");
		conarea.innerHTML += str;
	} 
	else
	{
		log.debug(str);
		//alert(str);
	}
}

/**
 * Function: neuro_SystemErr
 * This function writes a log line to standard err (often an alert box)
 *
 * Parameters:
 * 	str - the string to log
 */
function neuro_SystemErr(str)
{
	neuro_SystemOut(str);
}

/**
 * Function: neuro_decToHex
 * Converts a decimal number to a hex value
 *
 * Parameters:
 * 	dec - decimal number 
 *
 * Return:
 * 	hex string
 */
function neuro_decToHex(dec)
{
	var hex = "";
	var a = "" + dec; a = a.length;
	var map = "0123456789ABCDEF";
	
	for(var i = 0; i < a; i++)
	{
		point = map.charAt(dec-Math.floor(dec/16)*16);
		dec = (dec - map.indexOf(point)) / 16;
		hex = point + hex;
	}
	
	if (hex.charAt(0) == "0") hex = hex.substring(1, hex.length);
	
	return hex;
};

/**
 * Function: neuro_xmlFormat
 * Escapes the basic bad xml characters from a string
 *
 * Parameters:
 *	str - possible dirty string 
 * 
 * Returns:
 * 	xml friendly string
 */
function neuro_xmlFormat(str)
{
	str = str.replace(/&/g,"&amp;");
	str = str.replace(/</g,"&lt;");
	str = str.replace(/>/g,"&gt;");
	return str;
};

/**
 * Function: neuro_parseBoolean
 * looks at a string and guesses if its a true or false value
 *
 * Parameters:
 * 	str - boolean string 
 *
 * Returns:
 * 	boolean true or false value
 */
function neuro_parseBoolean(str)
{
	if(str == null || typeof str == "undefined")
		return false;
		
	if(str.toString() == "TRUE" || str.toString() == "true")
		return true;
	return false;
};


/**
 * Function: neuro_Reflect
 * shows information about an object - lists functions and variables - to stdout
 *
 * Parameters:
 * 	obj - the object
 */
function neuro_Reflect(obj)
{
	neuro_SystemOut(NEWLINE + "(" + typeof obj + ")");
	for(var i in obj)
	{
		if(i.toString().charAt(0) != "_")
		{
			neuro_SystemOut(NEWLINE + typeof obj[i] + " :: " + i);
		}
	}
}

/**
 * Function: neuro_expandError
 * Takes an error object and gives a bit more description. Some browers show more info
 * then others...
 *
 * Parameters:
 * 	e - the error object to expand
 *
 * Returns:
 * 	the expanded object in a printable string
 */
function neuro_expandError(e)
{
	var stamp = NEWLINE
	stamp += "Name: "    + e.name + NEWLINE;
	stamp += "Desc: "    + e.description + NEWLINE;
	stamp += "Number: "  + e.number + NEWLINE;
	stamp += "Message: " + e.message + NEWLINE;
	stamp += "Proto: "   + e.prototype + NEWLINE;
	stamp += "Const: "   + e.constructor + NEWLINE;
	return stamp;
}