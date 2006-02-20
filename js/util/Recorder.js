/**
 * File: util/Recorder.js
 * This library is used to track client movements and form fill ins. It can be used
 * to spy on site visitors or as a QA / Unit testing tool - its your conscience.
 * To get the tool bar and cursor for the neat-o UI add the following to the page.
 * 
 * (start code)
 *	//add the cursor icon and the contorl for the recorder
 *	neuro_addLoadListener(replay_addCursor);
 *	neuro_addLoadListener(replay_addSimpleControl);
 * (end)
 *
 * You'll also need to have a file called cur.gif in the root of the site for the
 * pointer graphic
 *
 * Copyright: 
 * 	2004 Rob Rohan (robrohan@gmail.com) All rights reserved
 *
 * Related:
 * 	ui/Mouse.js
 * 	ui/EventManager.js
 * 	util/Log.js
 */
if(typeof SYSMOUSE_VERSION == "undefined" || typeof EVENTMANAGER_VERSION == "undefined" 
	|| typeof DEBUG_VERSION == "undefined")
{
	alert("Fatal Error: Recorder is missing required libraries");
	throw new Error("recorder.js missing required libraries");
}

/**
 * Variable: RECORDER_VERSION 
 * 	library version 
 */
var RECORDER_VERSION = "0.3";

/**
 * Variable: replay_items 
 * 	this is where the replay commands are stored. 
 */
var replay_items = new Array();

var replay_clock_text;

var recording = false;

/**
 * Function: replay_addCursor
 * This method needs to be set to run on page load. It creates a div and an image
 * reference to an cursor image for playback display
 *
 * Parameters:
 * 	e - the event
*/
function replay_addCursor(e)
{
	var mybody = document.getElementsByTagName("body").item(0);

	cdiv = document.createElement("div");
	cimg = document.createElement("img");
	
	cdiv.setAttribute("id","replaycursor");
	cdiv.setAttribute("style","position: absolute; top: 0 px; left: 0 px;");
	cimg.setAttribute("src","cur.gif");
	
	cdiv.appendChild(cimg);
	
	mybody.appendChild(cdiv);
	
	curele = document.getElementById("replaycursor");
}

/**
 * Function: replay_addSimpleControl
 * Make a simple tool bar to control the record and play back
 */
function replay_addSimpleControl()
{
	var mybody = document.getElementsByTagName("body").item(0);
	
	var div_wrapper = document.createElement("div");
	div_wrapper.setAttribute("id","recorder_toolbar");
	
	var a_start = document.createElement("span");
	a_start.setAttribute("id","recorder_text");
	a_start_txt = document.createTextNode("      Stopped");
	a_start.appendChild(a_start_txt);
	div_wrapper.appendChild(a_start);
	
	a_start = document.createElement("a");
	a_start.setAttribute("href","javascript: replay_start();");
	a_start_txt = document.createTextNode("start ");
	a_start.appendChild(a_start_txt);
	div_wrapper.appendChild(a_start);
	
	a_start = document.createElement("a");
	a_start.setAttribute("href","javascript: replay_stop();");
	a_start_txt = document.createTextNode("stop ");
	a_start.appendChild(a_start_txt);
	div_wrapper.appendChild(a_start);
	
	a_start = document.createElement("a");
	a_start.setAttribute("href","javascript: replay_replay();");
	a_start_txt = document.createTextNode("replay ");
	a_start.appendChild(a_start_txt);
	div_wrapper.appendChild(a_start);
	
	a_start = document.createElement("a");
	a_start.setAttribute("href","javascript: replay_clear();");
	a_start_txt = document.createTextNode("clear ");
	a_start.appendChild(a_start_txt);
	div_wrapper.appendChild(a_start);
	
	mybody.appendChild(div_wrapper);
	
	var barele = document.getElementById("recorder_toolbar");
	replay_clock_text = document.getElementById("recorder_text");
	
	replay_clock_text.style.width = "20px";
	replay_clock_text.style.paddingRight = "3px";
	
	barele.style.position = "absolute";
	barele.style.left = "50%";
	barele.style.top = "1px";
}


/**
 * Callback: click_happened 
 * 	used to record clicks. Added to the add click listeners
 */
click_happened = function(event)
{
	var t = event.target;
	log.debug("@@click: " + t.name + " " + t.value + " " + (typeof event.target), event); 
	
	if(recording) {
		replay_items[replay_items.length] = 
			"replay_ElementFilled('" + t.name + "','" + t.value + "')"
			+ "~" + replay_TimeStamp();
	}
};
neuro_addClickListener(click_happened);

/**
 * Callback: key_happened
 * 	record key presses
 */
key_happened = function(event)
{
	var t = event.target;
	log.debug("@@key: " + t.name + " " + t.value, event);
	
	if(recording) {
		replay_items[replay_items.length] = 
			"replay_ElementFilled('" + t.name + "','" + t.value + "')"
			+ "~" + replay_TimeStamp();
	}		
};
neuro_addKeyUpListener(key_happened);

/**
 * Callback: mouse_moved
 * 	record mouse movements
 */
mouse_moved = function(event)
{
	log.debug("@@move: " + SysMouse.X + " " + SysMouse.Y);
	if(recording) {
		replay_items[replay_items.length] = 
			"replay_MouseMove(" + SysMouse.X + "," + SysMouse.Y + ")"
			+ "~" + replay_TimeStamp();
	}
};
neuro_addMoveListener(mouse_moved);

/**
 * Function: replay_TimeStamp
 * gets a time stamp
 */
function replay_TimeStamp()
{
	return new Date().getTime();
}


/**
 * Function: replay_MouseMove
 * This is a system generated callback. When the mouse is moved one of these
 * gets put into the command array. You should not need to call it directly
 *
 * Parameters:
 * 	x - the x position to move to
 * 	y - the y position to move to
 */
function replay_MouseMove(x,y)
{
	curele.style.top = y;
	curele.style.left = x;
}

/**
 * Function: replay_ElementFilled
 * This is a system generated callback. When the client clicks a control (ticks a
 * check box or fills in a text box). You should not need to call it directly
 *
 * Parameters:
 * 	control - the control that this happened on 
 * 	value - the value of the control
 */
function replay_ElementFilled(control, value)
{	
	log.debug("@@replay_elementfilled: going to lookup: " + control + " with value " + value);
	var focusele = document.forms[0][control];
	
	if(focusele != null)
	{
		//if there are many nodes (i.e. radios)
		if(focusele.length != null && focusele.length > 0)
		{
			for(var i=0; i<focusele.length; i++)
			{
				var cur = focusele[i];
				log.debug("@@got: " + cur);
				replay_setSingleElement(cur, value);
			}
		}
		else
		{	
			replay_setSingleElement(focusele,value);
		}
	}
}

//used to compare form types below
var SELECTONE = "select-one";
var TEXTBOX   = "text";
var CHECKBOX  = "checkbox";
var RADIO     = "radio";
var TEXTAREA  = "textarea";

/**
 * Function: replay_setSingleElement
 * helper function called from replay_ElementFilled
 *
 * Parameters:
 * 	control
 * 	value
 */
function replay_setSingleElement(control, value)
{
	log.debug("@@replay_single: " + control.type);
	
	if(control.type == TEXTBOX || control.type == TEXTAREA)
	{
		log.debug("@@replay_single: Running Text");
		control.value = value;
	}
	else if(control.type == CHECKBOX || control.type == RADIO)
	{
		log.debug("@@replay_single: Running Checkbox or Radio");
		if(value == control.value && control.checked)
			control.checked = false;
		else if(value == control.value)
			control.checked = true;
	}
	else
	{
		log.debug("@@replay_single: Assuming an option");
		//if(control.value == value)
			control.selected = true;
	}
}

/**
 * Function: replay_start
 * Call this function when you wish to begin recording client input
 */
function replay_start()
{
	recording = true;
	replay_clock_text.innerHTML = "Running...";
}

/**
 * Function: replay_stop
 * Call this function when you wish to stop recording client input
 */
function replay_stop()
{
	recording = false;
	replay_clock_text.innerHTML = "Stopped";
}

/**
 * Function replay_replay
 * Call this function when you wish to replay the client actions (actions must
 * be stored in the replay_items array - which they are by default)
 */
function replay_replay()
{
	var cmdstmp;
	for(var i=0; i<replay_items.length; i++)
	{
		cmdstmp = new Array();
		cmdstmp = replay_items[i].split("~"); 
		//10 frames per second
		replay_clock_text.innerHTML = cmdstmp[1];
		//setTimeout("eval(" + cmdstmp[0] + ")", (i*10) + 1000);
		setTimeout("replay_item_with_stamp(" + cmdstmp[0] + "," + cmdstmp[1] + ")", (i*10) + 1000);
	}
}

/**
 * Function: replay_item_with_stamp
 * Replay the items displaying the time stamp
 *
 * Parameters:
 * 	cmd - the command to run
 * 	stamp - the time stamp to display
 */
function replay_item_with_stamp(cmd,stamp)
{
	replay_clock_text.innerHTML = stamp;
	eval(cmd);
}

/**
 * Function: replay_clear
 * Clear the replay items array. In other words, remove all the currently recorded
 * actions
 */
function replay_clear()
{
	replay_items = new Array();
}

/**
 * Function: replay_dumpReplayItems
 * Dump all the currently saved actions to the log
 */
function replay_dumpReplayItems()
{
	for(var q=0; q<replay_items.length; q++)
	{
		log.info("ITEM: " + replay_items[q]);	
	}
}