/**
 * File: util/BrowserSniffer.js
 * Basic browser sniffer
 *
 * Copyright: 
 * 	2004 Rob Rohan (robrohan@gmail.com) All rights reserved
 */

/** 
 * Variable: BROWSER_SNIFFER_VERSION 
 * 	the library version 
 */
var BROWSER_SNIFFER_VERSION = "0.2";

/**
 * Class: SysBrowser 
 * 	object to tell what kind of browser is hitting the site 
 */
function SysBrowser(){;}

/**
 * Variable: SysBrowser.safari 
 * 	boolean for is safari 
 */
SysBrowser.safari = (
	(navigator.userAgent.indexOf("Safari") > -1) && (navigator.userAgent.indexOf("Mac") > -1)
);

/**
 * Variable: SysBrowser.gecko 
 * 	boolean for is gecko 
 */
SysBrowser.gecko = (
 	!SysBrowser.safari && (document.getElementById && !document.all)
);

/**
 * Variable: SysBrowser.explore 
 * 	boolean for is internet explorer 
 */
SysBrowser.explore = (
	(typeof document.all != "undefined") && (navigator.userAgent.indexOf("Opera") == -1)
);

/**
 * Variable: SysBrowser.opera 
 * 	boolean for is opera 
 */
SysBrowser.opera = (
	navigator.userAgent.indexOf("Opera") > -1
);

/**
 * Variable: SysBrowser.windows 
 * 	boolean for is windows 
 */
SysBrowser.windows = (
	(navigator.appVersion.indexOf("Win") != -1)
);

/**
 * Variable: SysBrowser.mac 
 * 	boolean for is mac 
 */
SysBrowser.mac = (
	(navigator.appVersion.indexOf("Mac") != -1)
);

/** 
 * Variable: SysBrowser.linux 
 * 	boolean for is linux 
 */
SysBrowser.linux = (
	(navigator.appVersion.indexOf("Linux") != -1)
);

/**
 * Variable: SysBrowser.unix 
 * 	boolean for is unix 
 */
SysBrowser.unix = (
	(navigator.appVersion.indexOf("X11") != -1)
);

/**
 * Method: SysBrowser.getMajorVersion
 * guess the major version of the browser (seems IE6 says its IE4 - why do they
 * suck so badly?)
 * 
 * Returns:
 * 	an int version or -1 if unknown
*/
SysBrowser.prototype.getMajorVersion = function __sysb__getMajorVersion()
{
	var mv = parseInt(navigator.appVersion);
	if(SysBrowser.explore && (mv == 4) && (navigator.userAgent.indexOf("msie 5.0") != -1))
	{
		return 5;
	}
	else if(SysBrowser.explore && (mv == 4) && (navigator.userAgent.indexOf("msie 5.0") == -1))
	{
		return 6;
	}
	else
	{
		return mv;
	}
	
	return -1;
};

/**
 * Method: SysBrowser.getMinorVersion
 * gets the minor version (currently broken)
 *
 * Returns:
 * 	the minor version
*/
SysBrowser.prototype.getMinorVersion = function __sysb_getMinorVersion()
{
	return parseFloat(navigator.appVersion);
};

/**
 * Method: SysBrowser.getGuessDisplay
 * shows a displayable string for the browser (best guess)
 *
 * Returns:
 * 	a string display for the browser
 */
SysBrowser.getGuessDisplay = function __sysb__getGuessDisplay()
{
	var reportstring = "";
	
	if (SysBrowser.safari) reportstring += "Safari ";
	else if (SysBrowser.gecko) reportstring += "Gecko Based ";
	else if (SysBrowser.explore) reportstring += "Internet Explorer ";
	else if (SysBrowser.opera) reportstring += "Opera ";
	else reportstring += "Unknown Browser ";
	
	//reportstring += this.getMajorVersion() + " "; // + "(" + this.getMinorVersion() + ") ";
	
	if(SysBrowser.windows) reportstring += "on Microsoft Windows ";
	else if(SysBrowser.mac) reportstring += "on Apple Macintosh ";
	else if(SysBrowser.linux) reportstring += "on Linux ";
	else if(SysBrowser.unix) reportstring += "on Unix ";
	else reportstring += "on an Unknown OS ";
	
	return reportstring;
};

/**
 * Method: SysBrowser.report
 * does a printable (log or alert) string of what the sniffer thinks the current
 * browser is
 *
 * Parameters:
 * 	t - boolean for show with br or new lines (default newline, true makes it br's)
 *
 * Return:
 * 	a dump of what this object sees
 */
SysBrowser.prototype.report = function __sysb_report(t)
{
	var endl = '\n';
	if(t == true)
		endl = '<br>';
		
	var rpt = endl + "Browser Flags: " + endl;
		rpt += "safari : " + SysBrowser.safari + endl;
		rpt += "gecko  : " + SysBrowser.gecko + endl;
		rpt += "explore: " + SysBrowser.explore + endl;
		rpt += "opera  : " + SysBrowser.opera + endl;
		rpt += "major : " + this.getMajorVersion() + endl;
		rpt += "minor : " + this.getMinorVersion() + endl;
		rpt += "==================================" + endl;
		rpt += "Agent: " + navigator.userAgent + endl;
		rpt += "Name / Version: " + navigator.appName + " " + navigator.appVersion + endl;
	return rpt;
};