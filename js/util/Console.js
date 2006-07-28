/**
 * File: util/Console.js
 * This is libraries for an interactive console tied to a div. To use this
 * will require more info than what I have time to type at the minute :(
 *
 * Copyright: 
 * 	2004 Rob Rohan (robrohan@gmail.com) All rights reserved
 *
 * Related:
 * 	util/Output.js
 */
if(typeof OUTPUT_VERSION == "undefined") 
{
	alert("Fatal Error: Console is missing required libraries");
	throw new Error("console.js missing required libraries");
}

/**
 * Variable: CONSOLE_VERSION 
 * 	the library version 
 */
var CONSOLE_VERSION = "0.4";

var PROMPT_A = "[neuro@" + (window.location.host || "widget") + "]:~# ";
var PROMPT_B = "[neuro@" + (window.location.host || "widget") + "]:~$ ";

/** 
 * Variables: current_command 
 * 	command used when in widget mode to do system calls
 */
var current_command;

/** 
 * Variables: PROMPT 
 * 	default console prompt 
 */
var PROMPT = PROMPT_A;

/**
 * Variables: TERMINAL_TYPE
 * 	can be either "javascript" or "system". System is only valid if this
 * 	is running in a Mac OS X widget context 
 */
var TERMINAL_TYPE = "javascript";

/**
 * Variable: _command_buffer
 * 	global command buffer - this will be a problem where there is more then 
 * one terminal 
 */
var _command_buffer = "";

/**
 * Function: __con__help
 * not an API call. Shows a simple help
 */
function __con__help()
{
	neuro_SystemOut(NEWLINE);
	neuro_SystemOut("----------------------------------------------------------------" + NEWLINE);
	neuro_SystemOut("| Neuromancer Shell v: " + CONSOLE_VERSION + " " + NEWLINE);
	neuro_SystemOut("|"+ NEWLINE);
	neuro_SystemOut("| Commands:" + NEWLINE);
	neuro_SystemOut("|---------------------------------------------------------------" + NEWLINE);
	neuro_SystemOut("| reflect(object)   - show object innards"+NEWLINE);
	neuro_SystemOut("| echo(object)      - show on stdout"+NEWLINE);
	neuro_SystemOut("| clear             - clears the console"+NEWLINE); 
	neuro_SystemOut("| help              - this cruft"+NEWLINE);
	neuro_SystemOut("| all normal js commands (in javascript mode)"+NEWLINE);
	neuro_SystemOut("----------------------------------------------------------------"+NEWLINE);
	neuro_Runner("");
}

//setup some simple commands for the console
echo = neuro_SystemOut;
reflect = neuro_Reflect;

/**
 * Function: env
 * shows the current environment
 */
function env()
{
	reflect(this);
}

/**
 * Function: neuro_Runner
 * Used mostly by the console, this runs a command and writes the output to standard out
 *
 * Parameters:
 * 	str - the command to run
 */
function neuro_Runner(str)
{
	try
	{
		if(TERMINAL_TYPE == "javascript")
		{
			var ret = eval(str);
			
			if(typeof ret != "undefined")
			{
				neuro_SystemOut(NEWLINE + ret);
			}
			
			neuro_SystemOut(NEWLINE + PROMPT);
		}
		else if(TERMINAL_TYPE == "system")
		{
			//if this is a widget try to execute a 
			//system command
			if(window.widget)
			{
				if(str.length > 0)
				{
					neuro_SystemOut(window.NEWLINE);
					if(current_command != null) 
					{
        					current_command.cancel();
    					}
					current_command = widget.system("PATH=/bin:/usr/local/bin:/usr/bin:/sbin;" + str, handler_EndSystemCall);
					current_command.onreadoutput = handler_OutputHandler;
					//current_command.onreaderror = handler_OutputHandler;
				}
				else
				{
					neuro_SystemOut(NEWLINE + PROMPT);
				}
			}
			else
			{
				TERMINAL_TYPE = "javascript";
				PROMPT = PROMPT_A;
				throw new Error("Not in a widget! System mode is not available");
			}
		}
	}
	catch(e)
	{
		neuro_SystemErr(NEWLINE + neuro_expandError(e));
		neuro_SystemOut(NEWLINE + PROMPT);
	}
}

////////////////////////////////////////////////////////////////////////////////
// widget stuff...

/**
 * Function: handler_EndSystemCall
 * Used when in a widget ...
 */
function handler_EndSystemCall()
{
	var textele = document.getElementById("neurostdout");
	neuro_SystemOut(window.NEWLINE + window.PROMPT);
	textele.scrollTop = textele.scrollHeight;
	current_command.close();
}

/**
 * Function: handler_OutputHandler
 * Used when in a widget ...
 */
function handler_OutputHandler(currentStringOnStdout)
{
	var textele = document.getElementById("neurostdout");
	
	if(currentStringOnStdout.length)
	{
		var withNewLine = currentStringOnStdout.replace(/(\n)/g, NEWLINE);
		neuro_SystemOut(withNewLine);
		textele.scrollTop = textele.scrollHeight;
	}
}

/**
 * Function: stopCurrentSystemCommand
 * Used when in a widget ...
 */
function stopCurrentSystemCommand()
{
	if(current_command != null)
	{
		neuro_SystemOut(window.NEWLINE + PROMPT);
		current_command.cancel();
		current_command.close();
	}
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Class: Console
 * Console constructor
 */
function Console() {;}

/**
 * Method: Console.keyListener
 * The listener function is a bit odd as when it registers with the system it 
 * kind of breaks off of this object so we loose all communication with it
 * thats why some of the vars are a bit strange.
 *
 * Parameters:
 *	 evt - the event that should be a key event
 */
Console.prototype.keyListener = function _console_keyListener(evt)
{
	if(evt != null)
	{
		var textele = document.getElementById("neurostdout");
		
		var code = neuro_getKeyCodeFromEvent(evt);
		var key  = neuro_getKeyFromEvent(evt);
	
		if(_command_buffer == null) _command_buffer = "";
		
		//alert(code);
		switch(code)
		{
			//enter
			case 13:
				var cmd = _command_buffer;
				_command_buffer = "";
				if(cmd == "clear")
				{
					textele.innerHTML = "";
					neuro_Runner("");
				}
				else if(cmd == "help")
				{
					__con__help();
				}
				else if(cmd == "reboot")
				{
					reboot();
				}
				else if(cmd == "javascript")
				{
					PROMPT = PROMPT_A;
					TERMINAL_TYPE = "javascript";
					neuro_Runner("");
				}
				else if(cmd == "system")
				{
					PROMPT = PROMPT_B;
					TERMINAL_TYPE = "system";
					neuro_Runner("");
				}
				else
				{
					if(cmd.length > 0)
						neuro_Runner(cmd);
					else
						neuro_Runner("");
				}
				
				textele.scrollTop = textele.scrollHeight;
				break;
			//backspace
			case 8:
				if(_command_buffer.length > 0)
				{
					_command_buffer = _command_buffer.substring(0,_command_buffer.length-1);
					textele.innerHTML = textele.innerHTML.toString().substring(0,textele.innerHTML.toString().length-1);
				}
				break;
			case 0:
				break;
			case 27:
				//alert(this.history[this.history.length-1]);
				break;
			default:
				if(key != null && typeof key != "undefined")
				{
					//log.debug(code);
					//first take care of ctrl+c if it happens
					if((evt.ctrlKey && code == 99) || code == 3)
					{
						//from system...
						log.debug("ctrl+c");
						stopCurrentSystemCommand();
						break;
					}
					
					_command_buffer += key;
					if(code == 32)
					{
						textele.innerHTML += "&nbsp;";
					}
					else if(code == 60)
					{
						textele.innerHTML += "&lt;";
					}
					else if(code == 38)
					{
						textele.innerHTML += "&amp;";
					}
					else
					{
						textele.innerHTML += key;
					}
				}
				break;
		}
		
		evt.cancelBubble = true;
		evt.returnValue = false;
		return false;
	}       
};

/**
 * Method: Console.keyUpListener
 *
 * Parameters:
 * 	evt - the event
*/
Console.prototype.keyUpListener = function _console_keyUpListener(evt)
{
	var code = neuro_getKeyCodeFromEvent(evt);
	var textele = document.getElementById("neurostdout");
	//alert(code);
	switch(code)
		{
    		//enter
    		case 13:
    			//if(textele){
	    		//	textele.value = textele.value.toString().substring(0, (textele.value.length -1) );
	    		//}
    			//evt.cancelBubble = true;
     		//evt.returnValue = false;
    			//return false;
    			break;
    		//backspace
    		case 8:
    			if(SysBrowser.explore)
    			{
        			if(_command_buffer.length > 0)
        				_command_buffer = _command_buffer.substring(0,_command_buffer.length-1);
        		}
    			break;
    		case 38:
    			evt.cancelBubble = true;
     		evt.returnValue = false;
    			return false;
    			break;
    	}
};

/**
 * Method: Console.keyDownListener
 *
 * Parameters:
 * 	evt
 */
Console.prototype.keyDownListener = function _console_keyDownListener(evt)
{
	var code = neuro_getKeyCodeFromEvent(evt);
	var textele = document.getElementById("neurostdout");
	//alert(code);
	switch(code)
		{
    		//up
    		case 38:
    		//down
    		case 40:
    		//backspace
    		case 8:
    		//left
    		case 37:
    		//right
    		case 39:
    			if(SysBrowser.explore)
    			{
		    		evt.cancelBubble = true;
    	 			evt.returnValue = false;
    	 		}
    			return false;
    			break;
    	}
};
