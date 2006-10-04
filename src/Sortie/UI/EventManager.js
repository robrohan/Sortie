/**
 * File: UI/EventManager.js
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
 * 	2004-2006 Rob Rohan (robrohan@gmail.com) All rights reserved
 *
 * Related:
 * 	Util/Browser.js
 * 	Util/Log.js
 */
if(!Sortie.UI) Sortie.UI = {};

/* if(typeof BROWSER_SNIFFER_VERSION == "undefined" || DEBUG_VERSION == "undefined" ) {
	alert("Fatal Error: EventManager is missing required libraries");
	throw new Error("ui/events/eventmanager.js missing required libraries");
} */

Sortie.Core.$({
	require:new Array(
		{ c:"Sortie.Util.Browser", v:"0.2" }
	)
});

/** 
 * Variable: SysDocument - a handle to (or wrapper for) the document 
 */
/* SysDocument = document;

if(SysDocument.captureEvents)
{
	//non IE
	if(Event.MOUSEMOVE)
	{
		//NS 4, NS 6, Mozilla 0.9.x
		SysDocument.captureEvents(Event.MOUSEMOVE);
	}
}*/

Sortie.UI.EventManager = function() {
		
	////////////////////////////////////////////////////////////////////////////////
	/** 
	 * Variable: onloadListeners all the load listeners 
	 */
	this.onloadListeners		= new Array();
	/** 
	 * Variable:  neuro_clickListeners array of click listeners 
	 */
	this.clickListeners		= new Array();
	/** 
	 * Variable: neuro_mdownListeners all the mouse down listeners 
	 */
	this.mdownListeners		= new Array();
	/** 
	 * Variable:  neuro_mupListeners mouse up listeners 
	 */
	this.mupListeners			= new Array();
	/** 
	 * Variable:  neuro_moveListeners array of mouse move listeners
	 */
	this.moveListeners			= new Array();
	/** 
	 * Variable:  neuro_keyDownListeners key down listeners 
	 */
	this.keyDownListeners 		= new Array();
	/** 
	 * Variable:  neuro_keyUpListeners  key up listeners 
	 */
	this.keyUpListeners		= new Array();
	/** 
	 * Variable:  neuro_keyPressListeners key press listeners 
	 */
	this.keyPressListeners		= new Array();
	
	this.doc = null;
	
	////////////////////////////////////////////////////////////////////////////////
	
	this.Init = function(docu) {
		this.doc = docu;
		var emptr = this;
		this.doc.onmousemove     = function(e){ emptr._checkMove(e); }
		this.doc.onmousedown     = function(e){ emptr._checkMDown(e); }
		this.doc.onmouseup       = function(e){ emptr._checkMUp(e); }
		this.doc.onclick         = function(e){ emptr._checkClick(e); }
		this.doc.onkeydown       = function(e){ emptr._checkKeyDown(e); }
		this.doc.onkeyup         = function(e){ emptr._checkKeyUp(e); }
		this.doc.onkeypress      = function(e){ emptr._checkKeyPress(e); }
		//window.onload          = _checkOnLoad;
	}
	
	
	/**
	 * Function: addLoadListener
	 * register an onload listner
	 * 
	 * Parameters:
	 * 	func - the call back function to run when this event occurs
	 */
	this.AddLoadListener = function(func) {
		this.__addListener(this.onloadListeners,func);
	}
	
	/**
	 * Function: neuro_addMouseDownListener
	 * register a mouse down listener
	 * 
	 * Parameters:
	 * 	func - the call back function to run when this event occurs
	 */
	this.AddMouseDownListener = function(func) {
		this.__addListener(this._mdownListeners,func);
	}
	
	/**
	 * Function: neuro_addMouseUpListener
	 * register a mouse up listener
	 * 
	 * Parameters: 
	 * 	func - the call back function to run when this event occurs
	 */
	this.AddMouseUpListener = function(func) {
		this.__addListener(this.mupListeners,func);
	}
	
	/**
	 * Function: neuro_addClickListener
	 * register a click listener
	 *
	 * Parameters: 
	 * 	func - the call back function to run when this event occurs
	 */
	this.AddClickListener = function(func) {
		//neuro_clickListeners[neuro_clickListeners.length] = func;
		this.__addListener(this.clickListeners,func);
	}
	
	/**
	 * Function: neuro_addMoveListener
	 * register a move listener
	 *
	 * Parameters: 
	 * 	func - the call back function to run when this event occurs
	 */
	this.AddMoveListener = function(func) {
		//neuro_moveListeners[neuro_moveListeners.length] = func;
		this.__addListener(this.moveListeners,func);
	}
	
	/**
	 * Function: neuro_addKeyDownListener
	 * add a keyDownListener
	 *
	 * Parameters: 
	 * 	func - the call back function to run when this event occurs
	 */
	this.AddKeyDownListener = function(func) {
		this.__addListener(this.keyDownListeners,func);
	}
	
	/**
	 * Function: neuro_addKeyUpListener
	 * add a keyUpListener
	 *
	 * Parameters: 
	 * 	func - the call back function to run when this event occurs
	 */
	this.AddKeyUpListener = function(func) {
		this.__addListener(this.keyUpListeners,func);
	}
	
	/**
	 * Function: neuro_addKeyPressListener
	 * add a key press Listener
	 *
	 * Parameters: 
	 * 	func - the call back function to run when this event occurs
	 */
	this.AddKeyPressListener = function(func) {
		this.__addListener(this.keyPressListeners,func);
	}
	
	/*
	 * non API - helper function to add listeners
	 */
	this.__addListener = function(arry, func) {
		arry[arry.length] = func;
	}
	

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
	this.__normalizeEvent = function(evt) {
		if((!evt || evt == null || typeof evt == "undefined") && Sortie.Util.Browser.Explorer) {
			evt = window.event;
		}
		
		if(typeof evt.target == "undefined" && typeof evt.srcElement != "undefined") {
			evt.target = evt.srcElement;
		}
		
		return evt;
	}
	
	////////////////////////////////////////////////////////////////////////////////
	
	/*
	 * handles any click events that happen in the system. anything that needs to
	 * know about a click event should register with this
	 * non-API functions
	 */
	this._checkClick = function(e) {
		e = this.__normalizeEvent(e);
		this.__fireEventListeners(this.clickListeners,e);
		return true;
		//return false;
	}
	
	this._checkMDown = function(e) {
		e = this.__normalizeEvent(e);
		this.__fireEventListeners(this.mdownListeners,e);
		
		//if they are mouse down on an image stop it from bubbling. This
		//is so they don't drag and image (as an OS copy image) and think
		//they are draging a UI component.
		if(e.target.tagName == "IMG" || e.target.className.indexOf("Item") > 0) {
			//e.cancelBubble = true;
			//if (e.stopPropagation) e.stopPropagation();
			return false;
		}
		
		return true;
	};
	
	
	this._checkMUp = function(e) {
		e = this.__normalizeEvent(e);
		this.__fireEventListeners(this.mupListeners,e);
		return true;
		//return false;
	}

	/*
	 * handles any mouse move events that happen in the system. anything that needs to
	 * know about a move event should register with this
	 * non-API functions
	 */
	this._checkMove = function(e) {
		e = this.__normalizeEvent(e);
		this.__fireEventListeners(this.moveListeners,e);
		return true;
		//return false;
	}
	
	this._checkOnLoad = function(e) {
		e = this.__normalizeEvent(e);
		this.__fireEventListeners(this.onloadListeners,e);
	}
	
	this._checkKeyDown = function(e) {
		e = this.__normalizeEvent(e);
		this.__fireEventListeners(this.keyDownListeners,e);	
		return true;
	}
	
	/*
	 * set off key up listeners
	 */
	this._checkKeyUp = function(e) {
		e = this.__normalizeEvent(e);
		this.__fireEventListeners(this.keyUpListeners,e);
		return true;
	}
	
	/*
	 * set off key press listeners
	 */
	this._checkKeyPress = function(e) {
		e = this.__normalizeEvent(e);
		this.__fireEventListeners(this.keyPressListeners,e);
		return true;
	}
		
	/**
	 * helper function to fire listeners
	 */
	this.__fireEventListeners = function(arry, evt) {
		var len = arry.length;
		for(var i=0; i < len; i++) {
			try {
				arry[i](evt);
			} catch(e) {
				alert(e);
				//log.error("Tryed to fire an event on " + arry[i] + " and failed because: " + e.toString());
			}
		}
	}
	////////////////////////////////////////////////////////////////////////////////
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
	this.GetKeyCodeFromEvent = function(evt) {
		if(Sortie.Util.Browser.Explorer)
			return evt.keyCode;
		else if(Sortie.Util.Browser.Gecko || Sortie.Util.Browser.Safari)
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
	this.GetKeyFromEvent = function(evt) {
		return String.fromCharCode(this.GetKeyCodeFromEvent(evt));
	}
}


/////////////////////META DATA //////////////////////////////////////////////
/** 
 * Variable: Sortie.Util.Properties.VERSION 
 * 	the current version 
 */
Sortie.UI.EventManager["VERSION"] = "0.2";
///////////////////////////////////////////////////////////////////////////


/* 
 * Register the handler with the document
 * setup Neuromancer to handle events.
 * onClick(), onDblClick(), onKeyDown(), 
 * onKeyPress(), onKeyUp(), onMouseDown(), 
 * onMouseUp() 
 */
/* SysDocument.onmousemove     = _checkMove;
SysDocument.onmousedown     = _checkMDown;
SysDocument.onmouseup       = _checkMUp;
SysDocument.onclick         = _checkClick;
SysDocument.onkeydown       = _checkKeyDown;
SysDocument.onkeyup         = _checkKeyUp;
SysDocument.onkeypress      = _checkKeyPress;
window.onload               = _checkOnLoad; */
