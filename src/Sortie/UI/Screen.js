/**
 * File: UI/Screen.js
 * Functions that help get information from and about the screen
 *
 * Copyright:
 * 	2006 Rob Rohan (robrohan@gmail.com). All rights reserved
 */
if(!Sortie.UI) Sortie.UI = {};

/**
 * Class: Screen
 * Functions that help get information from and about the screen
 *
 * Namespace:
 * 	Sortie.UI
 */
Sortie.UI.Screen = function() {

	/**
	 * Method: Screen.FindPosX
	 * Finds the current X position of the passed in object
	 *
	 * From:
	 * 	http://blog.firetree.net/2005/07/04/javascript-find-position/ 
	 *
	 * Parameters:
	 * 	obj - a proper html item, div for example
	 *
	 * Returns:
	 *	the x position on screen
	 */
	this.FindPosX = function(obj) {
		var curleft = 0;
		if(obj.offsetParent) {
			while(1) {
				curleft += obj.offsetLeft;
				if(!obj.offsetParent)
					break;
				obj = obj.offsetParent;
			}
		} else if(obj.x) {
			curleft += obj.x;
		}
		
		return curleft;
	};
	
	/**
	 * Method: Screen.FindPosY
	 * Finds the current Y position of the passed in object
	 * 
	 * From:
	 * 	http://blog.firetree.net/2005/07/04/javascript-find-position/
	 *
	 * Parameters:
	 * 	obj - a proper html item, div for example
	 *
	 * Returns:
	 *	the y position on screen
	 */
	this.FindPosY = function(obj) {
		var curtop = 0;
		if(obj.offsetParent) {
			while(1) {
				curtop += obj.offsetTop;
				if(!obj.offsetParent)
					break;
				obj = obj.offsetParent;
			}
		} else if(obj.y) {
			curtop += obj.y;
		}
		
		return curtop;
	};
}


/////////////////////META DATA //////////////////////////////////////////////
/** 
 * Variable: Sortie.UI.Screen.VERSION 
 * 	the current version 
 */
Sortie.UI.Screen["VERSION"] = "0.1";
///////////////////////////////////////////////////////////////////////////