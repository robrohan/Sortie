/**
 * File: util/Cookie.js
 * Simple functions to get and set cookie information. Examples used from
 * http://www.webreference.com/js/column8/functions.html
 * 
 * Copyright: 
 * 	2004 Rob Rohan robrohan@gmail.com All rights reserved
 */

/**
 * Variable: COOKIE_VERSION 
 * 	the library version 
 */
var COOKIE_VERSION = "0.1";

/**
 * Function: getCookie
 * gets a value from the current cookie
 * 
 * Parameters:
 * 	name - the name of the key in the cookie
 *
 * Returns:
 * 	the cookies value
 */
function getCookie(name) 
{
    var start = document.cookie.indexOf(name+"=");
    var len = start+name.length+1;
    
    if ((!start) && (name != document.cookie.substring(0,name.length))) 
    		return null;
    		
	if (start == -1) 
		return null;
	
	var end = document.cookie.indexOf(";",len);
    
	if (end == -1) end = document.cookie.length;
    
    return unescape(document.cookie.substring(len,end));
}

/**
 * Function: setCookie
 * sets a value in a cookie
 *
 * Parameters:
 * 	name - the name
 * 	value - the value
 * 	expires - (optional) date of expires
 * 	path - (optional)
 * 	domain - (optional)
 * 	secure - (optional)
 */
function setCookie(name, value, expires, path, domain, secure) 
{
	document.cookie = name + "=" +escape(value) +
		( (expires) ? ";expires=" + expires.toGMTString() : "") +
		( (path) ? ";path=" + path : "") + 
		( (domain) ? ";domain=" + domain : "") +
		( (secure) ? ";secure" : "");
}