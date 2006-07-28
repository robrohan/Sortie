/**
 * File: ui/Dock.js
 * Mac-esque Dock by Joshua Olson and Kristof Neirynck k.neirynck at belgacom.net
 * tweaked for Neuromancer. To use this library just include the file then make a div element 
 * on the page with an id of 'dock' and within that div add anchors and images.
 * You wont need to call any of these methods by hand.
 * An example usage:
 *
 * (start code)
 *	<div id="dock">
 *		<a href="javascript: dothing();"><img src="myicon.gif"></a>
 *		<a href="javascript: emptytrash();"><img src="trash.gif"></a>
 *	</div>
 * (end)
 * 
 * The rest will be handled for you :)
 *
 * Related:
 * 	ui/EventManager.js
 */
if(typeof EVENTMANAGER_VERSION == "undefined") 
{
	alert("Fatal Error: Dock is missing required libraries");
	throw new Error("dock.js missing required libraries");
}

/**
 * Variable: DOCK_VERSION 
 * 	the library version 
 */
var DOCK_VERSION = "0.1";

/**
 * Function: dock_prepDock
 * Does some startup items, this needs to be called on page load. It it autoset
 * with neuro_addLoadListener later in the file (which is why this depeneds on the
 * system.js lib). You shouldn't need to call this function directly
 */
function dock_prepDock(e)
{
	if(!document.getElementById) 
		return;
	
	var dock = document.getElementById('dock');
	dock.locked = true;
	
	dock.profiles = [ 
		[0,0.5,0.3,0.2],
		[0,0.4,0.3,0.15,0.10,0.05],
		[0,0.7,0.2,0.1],
		[0,0.9,0.05,0.05],
		[0,0.1,0.15,0.2,0.4,0.1,0.05] 
	];
	
	dock.profile_index = 0;
	//dock.stretch = 0.5;
	dock.stretch = 1;
	
	//reset dock a bit after mouseout, except if we've got a mouseover
	dock.onmouseout = function dockout()
	{
		if(this.timeout)
			clearTimeout(this.timeout);
		this.timeout = setTimeout('dock_restoreDock()', 500);
	};
	
	dock.onmouseover = function dockover()
	{
		if(this.timeout)
			clearTimeout(this.timeout);
		this.timeout = null;
	};
	
	//regular expresion to get the img src
	var regimgsrc = new RegExp("([^\/\.]+\.[^\.]+)$");
	
	//for all images in the dock
	dock.images = dock.getElementsByTagName('img');
	
	for(var i=0; i < dock.images.length; i++)
	{
		//remember original image
		var currImage = dock.images.item(i);
		currImage.origSrc = currImage.src;
		currImage.origWidth = currImage.width;
		currImage.origHeight = currImage.height;
		
		//preload over images
		regimgsrc.exec(currImage.src);
		currImage.overSrc = 'on_' + RegExp.$1;
		currImage.overImage = new Image(currImage.width, currImage.height);
		currImage.overImage.src = currImage.overSrc;
		//create linked list
		currImage.prev = (i == 0) ? null : dock.images.item(i - 1);
		currImage.next = (i+1 == dock.images.length) ? null : dock.images.item(i+1);
		
		//switching, moving, zooming
		currImage.onmouseover = function imgover()
		{
			//this.src = this.overSrc;
			this.src = this.origSrc;
		};
		
		currImage.onmouseout = function imgout()
		{
			this.src = this.origSrc;
		};
		
		currImage.onmousemove = dock_magnify;
		
		currImage.restore = function imgrestore()
		{
			this.width = this.origWidth;
			this.height = this.origHeight;
		};
		
		currImage.zoom = function imgzoom(scale)
		{
			this.width = Math.floor(this.origWidth * scale);
			this.height = Math.floor(this.origHeight * scale);
		};
	}
	dock.locked = false;
}

//add the dock_prep to the page load
neuro_addLoadListener(dock_prepDock);

/**
 * Function: dock_restoreDock
 * This method is called automatically. You shouldn't need to call it directly
 */
function dock_restoreDock()
{
	var dock = document.getElementById('dock');
	
	if(dock.locked) return false;
	var img = dock.images.item(0);
	
	do
	{
		img.restore();
		img = img.next;
	}while(img != null);
	
	return true;
}

/**
 * Function: dock_magnify
 * Does the little zoom thing. This method is called automatically. You 
 * shouldn't need to call it directly
 *
 * Parameters:
 * 	e - the event
 */
function dock_magnify(e)
{
	if(!e)
		var e = window.event
	
	var img = this;
	
	//if(img.overSrc)
	//	img.src = img.overSrc;
		
	var dock = img.parentNode.parentNode;
	
	if(dock.locked) 
		return false;
	
	dock.locked = true;
	
	// this is the distance from the left edge, in %
	var percentage;
	if(e.offsetX || e.offsetY)
		percentage = e.offsetX / img.width;
	else 
		percentage = (dock_mousepos(e).x - dock_objpos(img).x) / img.width;
		
	if(percentage > 1) 
		percentage = 1;
	
	invertPercentage = 1 - percentage;
	
	// resize the icon we are hovering over;
	var max = 1 + dock.stretch;
	img.zoom(max);
	
	var i, currImage;
	//update to the left
	max = 1 + dock.stretch;
	
	for(i = 0, currImage = img; currImage.prev; i++)
	{
		currImage = currImage.prev;
		if(i < dock.profiles[dock.profile_index].length -1)
		{
			max -= dock.stretch * dock.profiles[dock.profile_index][i];
			currImage.zoom( //...
				max - percentage * dock.stretch * //...
				dock.profiles[dock.profile_index][i+1]
			);
		}
		else currImage.restore();
	}
	
	//update to the right
	max = 1 + dock.stretch;
	for(i = 0, currImage = img; currImage.next; i++)
	{
		currImage = currImage.next;
		if(i < dock.profiles[dock.profile_index].length -1){
			max -= dock.stretch * dock.profiles[dock.profile_index][i];
			currImage.zoom( //...
				max - invertPercentage * dock.stretch * //...
				dock.profiles[dock.profile_index][i+1]
			);
		}
		else currImage.restore();
	}
	dock.locked = false;
	return true;
}

/**
 * Function: dock_mousepos
 * Get position of mouse relative to the page - this method is called automatically
 * when you mouse over an image on the dock. You shouldn't need to call this directly
 * TODO: this is not using the SysMouse object...
 *
 * Parameters:
 * 	e - the event.
 */
function dock_mousepos(e)
{
	var rv = {x:0, y:0};
	
	if(e.pageX || e.pageY){
		rv.x = e.pageX;
		rv.y = e.pageY;
	}else if(e.clientX || e.clientY){
		rv.x = e.clientX + document.body.scrollLeft;
		rv.y = e.clientY + document.body.scrollTop;
	}
		
	return rv;
}

/**
 * Function: dock_objpos
 * Get position of object relative to the page - this is called automatically you
 * shouldn't need to call it directly
 *
 * Parameters:
 * 	obj
 */
function dock_objpos(obj)
{
	var rv = {x:0, y:0};
	
	if(obj.offsetParent)
	{
		while(obj.offsetParent)
		{
			rv.x += obj.offsetLeft;
			rv.y += obj.offsetTop;
			obj = obj.offsetParent;
		}
	}
	else if(obj.x || obj.y)
	{
		rv.x = obj.x;
		rv.y = obj.y;
	}
	return rv;
}