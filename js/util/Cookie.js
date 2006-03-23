/**
 * File: util/Cookie.js
 * Simple functions to get and set cookie information
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
	setRawCookie(
		name + "=" +escape(value) +
		( (expires) ? ";expires=" + expires.toGMTString() : "") +
		( (path) ? ";path=" + path : "") + 
		( (domain) ? ";domain=" + domain : "") +
		( (secure) ? ";secure" : "")
	);
}

/**
 * Function: removeCookie
 * Removes a cookie (sets the expires to the past really)
 * 
 * Parameters:
 * 	name - the name
 * 	path - (optional)
 * 	domain - (optional)
 * 	secure - (optional)
 */
function removeCookie(name, path, domain, secure)
{
	var thepast = new Date();
	thepast.setYear(thepast.getYear() - 2);
	
	setCookie(name, "", thepast, path, domain, secure);
}

/**
 * Function: setPermCookie
 * sets a cookie that will last 20 years
 * 
 * Parameters:
 * 	name - the name
 *	value - the value of the cookie
 * 	path - (optional)
 * 	domain - (optional)
 * 	secure - (optional)
 */
function setPermCookie(name, value, path, domain, secure)
{
	var thefuture = new Date();
	var year = (thefuture.getYear() < 1000) ? thefuture.getYear() + 1900 : thefuture.getYear();
	thefuture.setYear(year + 5);
	setCookie(name, value, thefuture, path, domain, secure);
}

/**
 * Function: setRawCookie
 * Sets the preformatted string to the cookie
 * 
 * Parameters:
 * 	cookie - the raw cookie string
 */
function setRawCookie(cookie)
{
	document.cookie = cookie;
}
