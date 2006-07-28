/**
 * File: ui/EventManager.js
 * This library attempts to abstract events so that many controls can 
 * use, say, mouse down for example, instead of taking total control of the event
 * The main point of this library is to delegate events to controls that
 * care. Often times, DHTML contorls (tree controls for instance) will take hold of
 * the document on click event, and then no other contorl or process can get that
 * event. This library takes control of the events then allows you to register with
 * it so that everyone can get notified in turn.
 * To register, make a function that takes one parameter. The parameter will be
 * the event object, and will get passed in by the manager to your function when
 * the event gets fired. So for example the following code creates an alert box
 * when anything on the page is clicked:
 * (code)
 * 	click_happened = function(event){ alert(event.target) };
 * 	neuro_addClickListener(click_happened);
 * (end code)
 * The event object has a few tweaks to make it act the same on all browsers, but 
 * the most common part of the event is the _target_ property which points 
 * to the item that fired the event.
 * 
 * Copyright:
 * 	2004 Rob Rohan (robrohan@gmail.com) All rights reserved
 *
 * Related:
 * 	util/BrowserSniffer.js
 * 	util/Log.js
 */
if(typeof BROWSER_SNIFFER_VERSION == "undefined" || DEBUG_VERSION == "undefined" ) {
	alert("Fatal Error: EventManager is missing required libraries");
	throw new Error("ui/events/eventmanager.js missing required libraries");
}

/** 
 * Variable: EVENTMANAGER_VERSION - the library version 
 */
var EVENTMANAGER_VERSION = "0.1";

/** 
 * Variable: SysDocument - a handle to (or wrapper for) the document 
 */
SysDocument = document;

if(SysDocument.captureEvents)
{
	//non IE
	if(Event.MOUSEMOVE)
	{
		//NS 4, NS 6, Mozilla 0.9.x
		SysDocument.captureEvents(Event.MOUSEMOVE);
	}
}

////////////////////////////////////////////////////////////////////////////////
/** 
 * Variable: neuro_onloadListeners all the load listeners 
 */
var neuro_onloadListeners		= new Array();
/** 
 * Variable:  neuro_clickListeners array of click listeners 
 */
var neuro_clickListeners		= new Array();
/** 
 * Variable: neuro_mdownListeners all the mouse down listeners 
 */
var neuro_mdownListeners		= new Array();
/** 
 * Variable:  neuro_mupListeners mouse up listeners 
 */
var neuro_mupListeners			= new Array();
/** 
 * Variable:  neuro_moveListeners array of mouse move listeners
 */
var neuro_moveListeners			= new Array();
/** 
 * Variable:  neuro_keyDownListeners key down listeners 
 */
var neuro_keyDownListeners 		= new Array();
/** 
 * Variable:  neuro_keyUpListeners  key up listeners 
 */
var neuro_keyUpListeners		= new Array();
/** 
 * Variable:  neuro_keyPressListeners key press listeners 
 */
var neuro_keyPressListeners		= new Array();
////////////////////////////////////////////////////////////////////////////////

/**
 * Function: neuro_addLoadListener
 * register an onload listner
 * 
 * Parameters:
 * 	func - the call back function to run when this event occurs
 */
function neuro_addLoadListener(func)
{
	__addListener(neuro_onloadListeners,func);
}

/**
 * Function: neuro_addMouseDownListener
 * register a mouse down listener
 * 
 * Parameters:
 * 	func - the call back function to run when this event occurs
 */
function neuro_addMouseDownListener(func)
{
	__addListener(neuro_mdownListeners,func);
}

/**
 * Function: neuro_addMouseUpListener
 * register a mouse up listener
 * 
 * Parameters: 
 * 	func - the call back function to run when this event occurs
 */
function neuro_addMouseUpListener(func)
{
	__addListener(neuro_mupListeners,func);
}

/**
 * Function: neuro_addClickListener
 * register a click listener
 *
 * Parameters: 
 * 	func - the call back function to run when this event occurs
 */
function neuro_addClickListener(func)
{
	//neuro_clickListeners[neuro_clickListeners.length] = func;
	__addListener(neuro_clickListeners,func);
}

/**
 * Function: neuro_addMoveListener
 * register a move listener
 *
 * Parameters: 
 * 	func - the call back function to run when this event occurs
 */
function neuro_addMoveListener(func)
{
	//neuro_moveListeners[neuro_moveListeners.length] = func;
	__addListener(neuro_moveListeners,func);
}

/**
 * Function: neuro_addKeyDownListener
 * add a keyDownListener
 *
 * Parameters: 
 * 	func - the call back function to run when this event occurs
 */
function neuro_addKeyDownListener(func)
{
	__addListener(neuro_keyDownListeners,func);
}

/**
 * Function: neuro_addKeyUpListener
 * add a keyUpListener
 *
 * Parameters: 
 * 	func - the call back function to run when this event occurs
 */
function neuro_addKeyUpListener(func)
{
	__addListener(neuro_keyUpListeners,func);
}

/**
 * Function: neuro_addKeyPressListener
 * add a key press Listener
 *
 * Parameters: 
 * 	func - the call back function to run when this event occurs
 */
function neuro_addKeyPressListener(func)
{
	__addListener(neuro_keyPressListeners,func);
}

/*
 * non API - helper function to add listeners
 */
function __addListener(arry, func)
{
	arry[arry.length] = func;
}

////////////////////////////////////////////////////////////////////////////////

/*
 * handles any click events that happen in the system. anything that needs to
 * know about a click event should register with this
 * non-API functions
 */
function _checkClick(e)
{	
	e = __normalizeEvent(e);
	__fireEventListeners(neuro_clickListeners,e);
	return true;
	//return false;
}

function _checkMDown(e)
{	
	e = __normalizeEvent(e);
	__fireEventListeners(neuro_mdownListeners,e);
	
	//if they are mouse down on an image stop it from bubbling. This
	//is so they don't drag and image (as an OS copy image) and think
	//they are draging a UI component.
	if(e.target.tagName == "IMG" || e.target.className.indexOf("Item") > 0)
	{
		//e.cancelBubble = true;
		//if (e.stopPropagation) e.stopPropagation();
		return false;
	}
	
	return true;
}

function _checkMUp(e)
{	
	e = __normalizeEvent(e);
	__fireEventListeners(neuro_mupListeners,e);
	return true;
	//return false;
}

/*
 * handles any mouse move events that happen in the system. anything that needs to
 * know about a move event should register with this
 * non-API functions
 */
function _checkMove(e)
{
	e = __normalizeEvent(e);
	__fireEventListeners(neuro_moveListeners,e);
	return true;
	//return false;
}

function _checkOnLoad(e)
{	
	e = __normalizeEvent(e);
	__fireEventListeners(neuro_onloadListeners,e);
}

function _checkKeyDown(e)
{
	e = __normalizeEvent(e);
	__fireEventListeners(neuro_keyDownListeners,e);
	
	return true;
}
/*
 * set off key up listeners
 */
function _checkKeyUp(e)
{
	e = __normalizeEvent(e);
	__fireEventListeners(neuro_keyUpListeners,e);
	return true;
}

/*
 * set off key press listeners
 */
function _checkKeyPress(e)
{
	e = __normalizeEvent(e);
	__fireEventListeners(neuro_keyPressListeners,e);
	return true;
}

/**
 * helper function to fire listeners
 */
function __fireEventListeners(arry, evt)
{
	var len = arry.length;
	for(var i=0; i < len; i++)
	{
		try
		{
			arry[i](evt);
		}
		catch(e)
		{
			alert(e);
		    log.error("Tryed to fire an event on " + arry[i] + " and failed because: " + e.toString());
		}
	}
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Function: __normalizeEvent
 * helper function to handle IE bug for even handling - mostly makes just makes 
 * sure an event is an event. Not really an API function but it might be useful
 * out side this library.
 *
 * Parameters:
 *	evt - an event (could be IE could be Mozilla)
 *
 * Returns:
 *	 a uniform event object
 */
function __normalizeEvent(evt)
{
	if((!evt || evt == null || typeof evt == "undefined") && SysBrowser.explore)
	{
		evt = window.event;
	}
	
	if(typeof evt.target == "undefined" && typeof evt.srcElement != "undefined")
	{
		evt.target = evt.srcElement;
	}
	
	return evt;
}

/**
 * Function: neuro_getKeyCodeFromEvent
 * Gets the key code from an event i.e. 65
 *
 * Parameter: 
 * 	evt - the event to get the key code from
 *
 * Returns:
 *	the ascii key code
 */
function neuro_getKeyCodeFromEvent(evt)
{
	if(SysBrowser.explore)
		return evt.keyCode;
    else if(SysBrowser.gecko || SysBrowser.safari)
        return evt.which;
}

/**
 * Function: neuro_getKeyFromEvent
 * Gets the key from an event i.e. "A"
 *
 * Parameters:
 * 	evt - the event in which to look
 *
 * Returns:
 * 	char from a key event
 */
function neuro_getKeyFromEvent(evt)
{
	return String.fromCharCode(neuro_getKeyCodeFromEvent(evt));
}

/* 
 * Register the handler with the document
 * setup Neuromancer to handle events.
 * onClick(), onDblClick(), onKeyDown(), 
 * onKeyPress(), onKeyUp(), onMouseDown(), 
 * onMouseUp() 
 */
SysDocument.onmousemove 	= _checkMove;
SysDocument.onmousedown 	= _checkMDown;
SysDocument.onmouseup   	= _checkMUp;
SysDocument.onclick     	= _checkClick;
SysDocument.onkeydown   	= _checkKeyDown;
SysDocument.onkeyup     	= _checkKeyUp;
SysDocument.onkeypress  	= _checkKeyPress;
window.onload 			= _checkOnLoad;
