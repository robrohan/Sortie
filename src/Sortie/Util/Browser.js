/**
 * File: Util/Browser.js
 * Basic browser sniffer
 *
 * Copyright: 
 * 	2004-2006 Rob Rohan (robrohan@gmail.com) All rights reserved
 */

if(!Sortie.Util) Sortie.Util = {};

/**
 * Namespace: Sortie.Util.Browser
 */
if(!Sortie.Util.Browser) Sortie.Util.Browser = {};

/**
 * Variable: SysBrowser.safari 
 * 	boolean for is safari 
 */
Sortie.Util.Browser.Safari = (
	(navigator.userAgent.indexOf("Safari") > -1) && (navigator.userAgent.indexOf("Mac") > -1)
);

/**
 * Variable: Sortie.Util.Browser.Gecko 
 * 	boolean for is gecko 
 */
Sortie.Util.Browser.Gecko = (
 	!this.Safari && (document.getElementById && !document.all)
);

/**
 * Variable: Sortie.Util.Browser.Explore 
 * 	boolean for is internet explorer 
 */
Sortie.Util.Browser.Explorer = (
	(typeof document.all != "undefined") && (navigator.userAgent.indexOf("Opera") == -1)
);

/**
 * Variable: Sortie.Util.Browser.Opera 
 * 	boolean for is opera 
 */
Sortie.Util.Browser.Opera = (
	navigator.userAgent.indexOf("Opera") > -1
);

/**
 * Variable: Sortie.Util.Browser.Windows 
 * 	boolean for is windows 
 */
Sortie.Util.Browser.Windows = (
	(navigator.appVersion.indexOf("Win") != -1)
);

/**
 * Variable: Sortie.Util.Browser.Mac 
 * 	boolean for is mac 
 */
Sortie.Util.Browser.Mac = (
	(navigator.appVersion.indexOf("Mac") != -1)
);

/** 
 * Variable: Sortie.Util.Browser.Linux 
 * 	boolean for is linux 
 */
Sortie.Util.Browser.Linux = (
	(navigator.appVersion.indexOf("Linux") != -1)
);

/**
 * Variable: Sortie.Util.Browser.Unix 
 * 	boolean for is unix 
 */
Sortie.Util.Browser.Unix = (
	(navigator.appVersion.indexOf("X11") != -1)
);

/////////////////////META DATA//////////////////////////////////////////////
/** 
 * Variable: Sortie.Util.Browser.VERSION 
 * 	the library version 
 */
Sortie.Util.Browser["VERSION"] = "0.3";
///////////////////////////////////////////////////////////////////////////
