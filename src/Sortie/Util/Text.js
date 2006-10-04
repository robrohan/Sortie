/**
 * File: Util/Text.js
 * Output text functions used by the console and the log
 *
 * Copyright: 
 * 	2004-2006 Rob Rohan (robrohan@gmail.com) All rights reserved
 *
 */
if(!Sortie.Util) Sortie.Util = {};

Sortie.Util.Text = function() {
	/**
	 * Variables: NEWLINE
	 * 	the default new line character to add to strings made by the system
	 * (default [br])
	 */
	this.NEWLINE = "\n";
	
	/**
	 * Function: XmlFormat
	 * Escapes the basic bad xml characters from a string
	 *
	 * Parameters:
	 *	str - possible dirty string 
	 * 
	 * Returns:
	 * 	xml friendly string
	 */
	this.XmlFormat = function(str) {
		str = str.replace(/&/g,"&amp;");
		str = str.replace(/</g,"&lt;");
		str = str.replace(/>/g,"&gt;");
		return str;
	};
	
	/**
	 * Function: ParseBoolean
	 * looks at a string and guesses if its a true or false value
	 *
	 * Parameters:
	 * 	str - boolean string 
	 *
	 * Returns:
	 * 	boolean true or false value
	 */
	this.ParseBoolean = function(str) {
		if(str == null || typeof str == "undefined")
			return false;
			
		if(str.toString() == "TRUE" || str.toString() == "true")
			return true;
		return false;
	};
	
	/**
	 * Function: neuro_Reflect
	 * shows information about an object - lists functions and variables
	 *
	 * Parameters:
	 * 	obj - the object
	 * 
	 * Returns:
	 * 	a string representation of the object
	 */
	this.Reflect = function(obj) {
		var str = NEWLINE + "(" + typeof obj + ")";
		for(var i in obj) {
			if(i.toString().charAt(0) != "_") {
				str += NEWLINE + typeof obj[i] + " :: " + i;
			}
		}
		
		return str;
	};
	
	/**
	 * Function: ExpandError
	 * Takes an error object and gives a bit more description. Some browers show more info
	 * then others...
	 *
	 * Parameters:
	 * 	e - the error object to expand
	 *
	 * Returns:
	 * 	the expanded object in a printable string
	 */
	this.ExpandError = function(e) {
		var stamp = NEWLINE
		stamp += "Name: "    + e.name + NEWLINE;
		stamp += "Desc: "    + e.description + NEWLINE;
		stamp += "Number: "  + e.number + NEWLINE;
		stamp += "Message: " + e.message + NEWLINE;
		stamp += "Proto: "   + e.prototype + NEWLINE;
		stamp += "Const: "   + e.constructor + NEWLINE;
		return stamp;
	}
}

/////////////////////META DATA //////////////////////////////////////////////
/** 
 * Variable: Sortie.Util.Text.VERSION 
 * 	the current version 
 */
Sortie.Util.Text["VERSION"] = "0.1";
///////////////////////////////////////////////////////////////////////////


