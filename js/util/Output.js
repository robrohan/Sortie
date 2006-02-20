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
 * Variable: keyStr
 * Used as the key with base64 encoding
 */
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Function: neuro_encode64
 * Base64 encodes the passed input
 * This [function] was written by Tyler Akins and has been placed in the
 * public domain.  It would be nice if you left this header intact.
 * Base64 code from Tyler Akins -- http://rumkin.com
 *
 * Parameters:
 * 	input - the input to encode
 */
function neuro_encode64(input) 
{
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
         enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
         enc4 = 64;
      }

      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
         keyStr.charAt(enc3) + keyStr.charAt(enc4);
   } while (i < input.length);
   
   return output;
}

/**
 * Function: neuro_decode64
 * Base64 decodes the passed input
 * This [function] was written by Tyler Akins and has been placed in the
 * public domain.  It would be nice if you left this header intact.
 * Base64 code from Tyler Akins -- http://rumkin.com
 *
 * Parameters:
 * 	input - the input to decode
 */
function neuro_decode64(input) 
{
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);

   return output;
}

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