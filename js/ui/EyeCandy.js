/**
 * File: ui/EyeCandy.js
 * Transition and fading library. You know... eyecandy :)
 * Coded by Travis Beckham http://www.squidfingers.com | http://www.podlob.com
 * If want to use this code, feel free to do so, but please leave this message intact.
 * If you do remove this, I will hunt you down :)
 * Several functions added or modified by Scott Upton, Uptonic.com
 *
 * Copyright: 
 * 	Travis Beckham
 */

/**
 * Variables: EYECANDY_VERSION 
 * 	the library version 
 */
var EYECANDY_VERSION = "0.1";

/*
 * Coded by Travis Beckham
 * http://www.squidfingers.com | http://www.podlob.com
 * If want to use this code, feel free to do so, but please leave this message intact.
 * If you do remove this, I will hunt you down :)
 *
 * |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 * --- myapi version date: 03/29/02 --------------------------------------------
 *
 * -----------------------------------------------------------------------------
 * Several functions added or modified by Scott Upton, Uptonic.com
 * December 2004
 * -----------------------------------------------------------------------------
 */

/**
 * Function: findPosX
 * Finds the current X position of the passed in object
 *
 * From:
 * 	http://blog.firetree.net/2005/07/04/javascript-find-position/ 
 *
 * Author: 
 * Peter-Paul Koch and Alex Tingle. 
 *
 * License:
 * 	You are free to use this script for any purpose.
 *
 * Parameters:
 * 	obj - a proper html item, div for example
 *
 * Returns:
 *	the x position on screen
 */
function findPosX(obj)
{
	var curleft = 0;
	if(obj.offsetParent)
	{
		while(1)
		{
			curleft += obj.offsetLeft;
			if(!obj.offsetParent)
				break;
			obj = obj.offsetParent;
		}
	}
	else if(obj.x)
	{
		curleft += obj.x;
	}
	
	return curleft;
}

/**
 * Function: findPosY
 * Finds the current Y position of the passed in object
 * 
 * From:
 * 	http://blog.firetree.net/2005/07/04/javascript-find-position/
 *
 * Author: 
 * 	Peter-Paul Koch and Alex Tingle.
 *
 * License:
 * 	You are free to use this script for any purpose.
 *
 * Parameters:
 * 	obj - a proper html item, div for example
 *
 * Returns:
 *	the y position on screen
 */
function findPosY(obj)
{
	var curtop = 0;
	if(obj.offsetParent)
	{
		while(1)
		{
			curtop += obj.offsetTop;
			if(!obj.offsetParent)
				break;
			obj = obj.offsetParent;
		}
	}
	else if(obj.y)
	{
		curtop += obj.y;
	}
	
	return curtop;
}


/**
 * Function: linearTween
 * Easing Equations by Robert Penner - robertpenner.com -
 * 
 * Parameters:
 * 	t
 * 	b
 * 	c
 * 	d
 */
function linearTween(t, b, c, d){
	return c*t/d + b;
}

/**
 * Function: easeInQuad
 *
 * Parameters:
 * 	t
 * 	b
 * 	c
 * 	d
 */
function easeInQuad(t, b, c, d){
	t /= d;
	return c*t*t + b;
}

/**
 * Function: easeOutQuad
 * 
 * Parameters:
 * 	t
 * 	b
 * 	c
 * 	d
 */
function easeOutQuad(t, b, c, d){
	t /= d;
	return -c * t*(t-2) + b;
}

/**
 * Function: easeInOutQuad
 *
 * Parameters:
 *	t
 *	b
 * 	c
 * 	d
 */
function easeInOutQuad(t, b, c, d){
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
}

/**
 * Function: easeInExpo
 *
 * Parameters:
 * 	t
 * 	b
 * 	c
 * 	d
 */
function easeInExpo(t, b, c, d){
	return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
}

/**
 * Function: easeOutExpo
 *
 * Parameters:
 * 	t
 * 	b
 * 	c
 *	d
 */
function easeOutExpo(t, b, c, d){
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
}


/**
 * Class: Detect
 * Constructor. This is another way to detect the browser version and abilites. 
 * This is more DHTML and graphics focused than browsersniffer.js
 */
function Detect()
{
	var agent = navigator.userAgent.toLowerCase(); 
	this._mac = agent.indexOf('mac') != -1;
	this._win = !this._mac;
	this._w3c = document.getElementById;
	this._iex = document.all;
	this._ns4 = document.layers;
}

/**
 * Method: Detect.getObj
 *
 * Parameters:
 * 	name
 */
Detect.prototype.getObj = function _det_getObj(name){
	if(this._w3c){
		return document.getElementById(name);
	}else if(this._iex){
		return document.all[name];
	}else if(this._ns4){
		return this.getObjNS4(document,name);
	}
};

/**
 * Method: Detect.getObjNS4
 *
 * Parameters:
 * 	obj
 * 	name
 */
Detect.prototype.getObjNS4 = function _det_getObjNS4(obj, name){
	var d = obj.layers;
	var result,temp;
	for(var i=0; i<d.length; i++){
		if(d[i].id == name){
		 	result = d[i];
		}else if(d[i].layers.length){
			var temp = this.getObjNS4(d[i],name);
		}
		if(temp){
			result = temp;
		}
	}
	return result;
};

/**
 * Method: Detect.getStyle
 *
 * Parameters:
 * 	obj
 */
Detect.prototype.getStyle = function _det_getStyle(obj){
	return (this._ns4) ? obj : obj.style;
};

/**
 * Method: Detect.getWindowWidth
 * width of the window
 */
function getWindowWidth(){
	return this._iex ? document.body.clientWidth : window.innerWidth;
}
Detect.prototype.getWindowWidth = getWindowWidth;

/**
 * Method: Detect.getWindowHeight
 * height of the window
 */
Detect.prototype.getWindowHeight = function _det_getWindowHeight(){
	return this._iex ? document.body.clientHeight : window.innerHeight;
};

/**
 * Method: Detect.getScrollTop
 * top scroll position of the window
 */
Detect.prototype.getScrollTop = function _det_getScrollTop(){
	return this._iex ? document.body.scrollTop : window.pageYOffset;
};

/**
 * Method: Detect.getScrollLeft
 * left scroll position of the window
 */
Detect.prototype.getScrollLeft = function _det_getScrollLeft(){
	return this._iex ? document.body.scrollLeft : window.pageXOffset;
};

/**
 * Method: Detect.setScrollTop
 * set the vertical scroll position of the window
 *
 * Parameters:
 * 	n
 */
Detect.prototype.setScrollTop = function _det_setScrollTop(n){
	window.scrollTo(this.getScrollLeft(),n);
};

/**
 * Method: Detect.setScrollLeft
 * set the horizontal scroll position of the window
 * 
 * Parameters:
 * 	n
 */
Detect.prototype.setScrollLeft = function _det_setScrollLeft(n){
	window.scrollTo(n,this.getScrollTop());
};

/**
 * Method: Detect.setScroll
 * set the x,y scroll position of the window
 *
 * Parameters:
 * 	x
 *	y
 */
Detect.prototype.setScroll = function _det_setScroll(x,y){
	window.scrollTo(x,y);
};

//////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: HTMLobj
 * HTMLobj Constructor 
 *
 * See Also: 
 * 	<Detect>
 */
function HTMLobj(name)
{
	if(name){
		this._inherit = Detect; this._inherit(name);
		this._id  = name;
		this._el  = this.getObj(this._id);
		this._css = this.getStyle(this._el);
		this._obj = name+'Object'; eval(this._obj+'=this');	
		this._timer = null;
		this._glideRunning = false;
		this._tweenRunning = false;
		this._fadeRunning = false;	// Added by SU, Couloir
		this._randNum = null;		// Added by SU, Couloir
		this._startFade = false;	// Added by SU, Couloir
		return this;
	}
}
HTMLobj.prototype = new Detect();

/**
 * Method: HTMLobj.getLeft
 * left position of the element
 */
HTMLobj.prototype.getLeft = function _htmo_getLeft(){
	return parseInt(this._css.left || 0);
};

/**
 * Method: HTMLobj.getTop
 * top position of the element
 */
HTMLobj.prototype.getTop = function _htmo_getTop(){ 
	return parseInt(this._css.top || 0);
};

/**
 * Method: HTMLobj.getWidth
 * width of the element
 */		
HTMLobj.prototype.getWidth = function _htmo_getWidth(){ 
	if(this._ns4){
		 return this._el.document.width;
	}else{
		return this._el.offsetWidth;
	}
};

/**
 * Method: HTMLobj.getHeight
 * height of the element
 */
HTMLobj.prototype.getHeight = function _htmo_getHeight(){ 
	if(this._ns4){
		 return this._el.document.height;
	}else{
		return this._el.offsetHeight;
	}
};

/**
 * Method: HTMLobj.getClipWidth
 * clip width of the element
 */
HTMLobj.prototype.getClipWidth = function _htmo_getClipWidth(){ 
	if(this._ns4){
		 return this._el.clip.width;
	}else{
		return this._el.offsetWidth;
	}
};

/**
 * Method: HTMLobj.getClipHeight
 * clip height of the element
 */
HTMLobj.prototype.getClipHeight = function _htmo_getClipHeight(){ 
	if(this._ns4){
		 return this._el.clip.height;
	}else{
		return this._el.offsetHeight;
	}
};

/**
 * Method: HTMLobj.setStyle
 * change the value of any css property
 *
 * Parameter:
 * 	prop
 * 	val
 */
HTMLobj.prototype.setStyle = function _htmo_setStyle(prop, val){ 
	if(!this._ns4){
		this._el.style[prop] = val;
		if(this._iex && this._mac){
			this._el.innerHTML = this._el.innerHTML;
		}
	}
};

/**
 * Method: HTMLobj.show
 * show the visibility of the element
 */
HTMLobj.prototype.show = function _htmo_show(){ 
	this._css.visibility = 'visible';
};

/**
 * Method: HTMLobj.hide
 * hide the visibility of the element
 */
HTMLobj.prototype.hide = function _htmo_hide(){ 
	this._css.visibility = 'hidden';
};

/**
 * Method: HTMLobj.showhide
 * toggle the visibility of the element
 */
HTMLobj.prototype.showhide = function _htmo_showhide(){
	if(this._css.visibility == 'hidden' || this._css.visibility == 'hide'){
		this._css.visibility = 'visible';
	}else{
		this._css.visibility = 'hidden';
	}
};

/**
 * Method: HTMLobj.setInner
 * change the contents of the element
 * 
 * Paramerter:
 * 	html
 */
HTMLobj.prototype.setInner = function _htmo_setInner(html){ 
	if(this._ns4){
		this._el.document.open();
		this._el.document.write(html);
		this._el.document.close();
	}else{
		this._el.innerHTML = html;
	}
};

/**
 * Method: HTMLobj.moveTo
 * move the element to a new position
 *
 * Parameters:
 * 	x
 *	y
 */
HTMLobj.prototype.moveTo = function _htmo_moveTo(x,y){ 
	if(this._ns4){
		this._el.moveTo(x,y);
	}else{
		this._css.left = x;
		this._css.top  = y;
	}
};

/**
 * Method: HTMLobj.moveBy
 * move the element to a new position relative to it's current position
 *
 * Parameters:
 * 	x
 * 	y
 */
HTMLobj.prototype.moveBy = function _htmo_moveBy(x,y){ 
	if(this._ns4) {
		this._el.moveBy(x,y);
	}else{
		this._css.left = this.getLeft()+x;
		this._css.top  = this.getTop()+y;
	}
};

/**
 * Method: HTMLobj.sizeTo
 * set the size of the element
 *
 * Parameters:
 * 	w
 * 	h
 */
HTMLobj.prototype.sizeTo = function _htmo_sizeTo(w,h){ 
	if(!this._ns4){
		this._css.width = w+'px';
		this._css.height = h+'px';
	}
};

/**
 * Method: HTMLobj.sizeBy
 * set the size of the element relative to it's current size
 *
 * Parameters:
 * 	w - the width
 *	h - the height
 */
HTMLobj.prototype.sizeBy = function _htmo_sizeBy(w,h){ 
	if(!this._ns4){
		this._css.width = this.getWidth()+w+'px';
		this._css.height = this.getHeight()+h+'px';
	}
};

/**
 * Method: HTMLobj.glideTo
 * ease-out animation, callback function optional
 *
 * Parameters:
 * 	x
 * 	y
 * 	callback
 */
HTMLobj.prototype.glideTo = function _htmo_glideTo(x,y,callback){ 
	if(this._glideRunning){
		var left = this.getLeft();
		var top  = this.getTop();
		if(Math.abs(left-x)<=1 && Math.abs(top-y)<=1){
			this.moveTo(x,y);
			this.cancelGlide();
			if(callback){
				eval(this._obj+'.'+callback+'()');
			}
		}else{
			this.moveTo(left+(x-left)/2, top+(y-top)/2);
		}
	}else{
		var c = (callback) ? ',\"'+callback+'\"' : '' ;
		this._timer  = setInterval(this._obj+'.glideTo('+x+','+y+c+')',100);
		this._glideRunning = true;
	}
};

/**
 * Method: HTMLobj.cancelGlide
 * cancel the glideTo method
 */
HTMLobj.prototype.cancelGlide = function _htmo_cancelGlide(){ 
	clearInterval(this._timer);
	this._timer = null;
	this._glideRunning = false;
};

/**
 * Method: HTMLobj.swapDepth
 * swap the z-index of 2 elements
 *
 * Parameters:
 * 	obj
 */
HTMLobj.prototype.swapDepth = function _htmo_swapDepth(obj){ 
	var temp = this._css.zIndex;
	this._css.zIndex = obj._css.zIndex;
	obj._css.zIndex = temp;
};

/**
 * Method: HTMLobj.tweenTo
 * time-based animation, with multiple easing methods
 * Modified by SU, Uptonic.com
 *
 * Parameters:
 * 	method - a function that takes 4 arguments: time, start, change, and duration
 * 	start - array of starting width, height dimensions [w, h]
 *	end - array of ending width, height dimensions [w, h]
 *	time - number of 'frames' it takes to get to the end position
 */
HTMLobj.prototype.tweenTo = function _htmo_tweenTo(method, start, end, time){ 
	if(!this._tweenRunning){
		this._tweenTime = 0;
		var s = '['+start.toString()+']';
		var e = '['+end.toString()+']';
		this._timer = setInterval(this._obj+'.tweenTo('+method+','+s+','+e+','+time+')', 33);
		this._tweenRunning = true;
	}
	if(++this._tweenTime > time){
		this.cancelTween();
	}else{
		var w = method(this._tweenTime, start[0], end[0]-start[0], time);
		var h = method(this._tweenTime, start[1], end[1]-start[1], time);
		this.sizeTo(w,h);
	}
};

/**
 * Method: HTMLobj.cancelTween
 * cancel the tweenTo method
 */
HTMLobj.prototype.cancelTween = function _htmo_cancelTween(){ 
	clearInterval(this._timer);
	this._timer = null;
	this._tweenRunning = false;
	this._startFade = true;
};

/**
 * Method: HTMLobj.getRandom
 * generate new random number
 * Added by SU, Uptonic.com
 * December 2004
 */
HTMLobj.prototype.getRandom = function _htmo_getRandom(start,end){ 
    this._randNum= Math.round(start + ((end-start) * Math.random()));
    return this._randNum;
};

/**
 * Method: HTMLobj.setOpacity
 * set opacity of the element
 */
HTMLobj.prototype.setOpacity = function _htmo_setOpacity(opacity){ 
	// Fix for math error in some browsers
	opacity = (opacity == 100)?99.999:opacity;
	// IE/Windows
	this._css.filter = "alpha(opacity:"+opacity+")";
	// Safari < 1.2, Konqueror
	this._css.KHTMLOpacity = opacity/100;	
	// Older Mozilla and Firefox
	this._css.MozOpacity = opacity/100;
	// Safari 1.2, newer Firefox and Mozilla, CSS3
	this._css.opacity = opacity/100;
};

/**
 * Method: HTMLobj.fadeOut
 * gradually decrease the opacity of the element
 *
 * Parameters:
 *	opacity - starting opacity of element
 *	change - the size of the increments between steps
 *	speed - the rate of the animation
 */
HTMLobj.prototype.fadeOut = function _htmo_fadeOut(opacity, change, speed){ 
	if (opacity >= 0){
	  this._fadeRunning = true;
	  this.setOpacity(opacity);
	  opacity -= change;
	  setTimeout(this._obj+'.fadeOut('+opacity+','+change+','+speed+')', speed);
	} else {
		this._fadeRunning = false;
		this.hide();
	}
};

/**
 * Method: HTMLobj.fadeIn
 * gradually increase the opacity of the element
 *
 * Parameters:
 * 	opacity - starting opacity of element
 *	change - the size of the increments between steps
 *	speed - the rate of the animation	
 */
HTMLobj.prototype.fadeIn = function _htmo_fadeIn(opacity, change, speed){ 
	if (opacity <= 100){
	  this.show();
	  this._fadeRunning = true;
	  this.setOpacity(opacity);
	  opacity += change;
	  setTimeout(this._obj+'.fadeIn('+opacity+','+change+','+speed+')', speed);
	} else {
		this._fadeRunning = false;
		this.setOpacity(100);
	}
};

/**
 * Method: HTMLobj.displayShow
 * display the element as 'block'
 */
HTMLobj.prototype.displayShow = function _htmo_displayShow(){ 
	this._css.display = 'block';
};

/**
 * Method: HTMLobj.displayHide
 * do not display the element
 */
HTMLobj.prototype.displayHide = function _htmo_displayHide(){ 
	this._css.display = 'none';
};

/**
 * Method: HTMLobj.setSrc
 * set the element's source to target
 *
 * Parameters:
 *	target
 */
HTMLobj.prototype.setSrc = function _htmo_setSrc(target){ 
	this._el.src = target;
};

/**
 * Method: HTMLobj.setHref
 * set the element's link to target
 *
 * Parameters:
 *	target
 */
HTMLobj.prototype.setHref = function _htmo_setHref(target){
	this._el.href = target;
};

/**
 * Method: HTMLobj.setInnerHtml
 * set the element's inner HTML to content
 * 
 * Parameters:
 * 	content
 */
HTMLobj.prototype.setInnerHtml = function _htmo_setInnerHtml(content){ 
	this._el.innerHTML = content;
};