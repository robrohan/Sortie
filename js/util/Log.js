/**
 * File: util/Log.js
 * Creates a simple logger to help debug javascript. It will open a new window so popup
 * blocking may keep it from working.
 *
 * Copyright: 
 * 	2005 Rob Rohan (robrohan@gmail.com)
 */

/**
 * Variable: DEBUG_VERSION 
 * 	the library version 
 */
var DEBUG_VERSION = "0.1";

/**
 * Variable: DEBUG 
 * 	set this to true to turn on debug mode (get the console going) 
 */
var DEBUG = false;

/** 
 * Variable: TYPE_DEBUG 
 * 	used within the class to tell what type of event 
 */
var TYPE_DEBUG = "DEBUG";
/**
 * Variable: TYPE_WARN 
 * 	used within the class to tell what type of event 
 */
var TYPE_WARN  = "WARN";
/**
 * Variable: TYPE_INFO 
 *	used within the class to tell what type of event 
 */
var TYPE_INFO  = "INFO";
/**
 * Variable: TYPE_ERROR 
 * 	used within the class to tell what type of event 
 */
var TYPE_ERROR = "ERROR";

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: Log
 * Constructor for the logging window (or other std output if implemented)
 */
function Log()
{
	/** 
	 * Variables: Log.NEW_WINDOW
	 * Basic log. Opens a new window and appends output to the new window
	 */
	this.NEW_WINDOW		= 0;
	this.TEXT_AREA 		= 1;
	this.STRING_BUFFER 	= 2;
	/** 
	 * Variables: Log.CONSOLE
	 * Writes log output to the id defined as "neurostdout"
	 */
	this.CONSOLE	        = 3;

	/** 
	 * Variables: Log.USER_DIV
	 * Writes log output to the id defined as "neurolog"
	 */
	this.USER_DIV           = 4;
	
	this.running = false;
	
	this.textele_handle = null;
	
	this.logbuffer = "";
	
	this.type = this.NEW_WINDOW;
}

/**
 * Method: Log.redirect
 * Changes the output of the error log to go to the predefined area (see the Log
 * constants)
 */
Log.prototype.redirect = function redirect(to)
{
	this.type = to;
};

/**
 * Method: Log.init
 * Start up the log object and make sure any supporting items are created
 * a new window for example. Will check the DEBUG flag and send
 * any text to /dev/null if not in debug mode (i.e. DEBUG set to false)
 */
Log.prototype.init = function __log__init()
{
	if(DEBUG)
	{
		//there will be more of these at some point
		switch(this.type)
		{
			case this.NEW_WINDOW:
				this.__openwindow();
				break;
			case this.CONSOLE:
				this.__linkdiv();
				break;
			case this.USER_DIV:
				this.__linkinlinediv();
				break;
		}
		
		this.running = true;
		this.info("Log (re)init...",this);
	}
};

/* 
 * not an api call 
 */
Log.prototype.__linkdiv = function __log__linkdiv()
{
	this.output_handle = window;
	this.textele_handle = document.getElementById("neurostdout");
};

/* 
 * not an api call 
 */
Log.prototype.__linkinlinediv = function __log__linkinlinediv()
{
	this.output_handle = window;
	this.textele_handle = document.getElementById("neurolog");
	if(this.textele_handle == null || typeof this.textele_handle == "undefined")
	{
		alert("Warning: log set to output to a div with an id of 'neurolog', but no div was found. \n Log items will go nowhere.");
	}
};

/*
 * not an api call 
 */
Log.prototype.__openwindow = function __log__openwindow() 
{
	var wndptr = window.open(
		'',
		'Log_Viewer',
		'height=630,width=550,scrollbars=yes,resizable=yes,left=300,top=100,status=no,toolbar=no,location=no'
	);

	//write the main part of the page
	wndptr.document.open();
	wndptr.document.write('<html><head><style type="text/css">.error{ color: red; } .info{ color: navy; } .warn{ color: yellow; } .debug{ color: black; }</style></head><body style="margin: 1px;"></body></html>');
	wndptr.document.close();

	bdy = wndptr.document.getElementsByTagName("body");

	toolbarele = wndptr.document.createElement("div");
	toolbarele.setAttribute("id","LogToolBar");
	toolbarele.setAttribute("style","background-color: silver; padding: 0px; margin: 0px; width: 100%; top: 0px; position: fixed !important; position: absolute; white-space: nowrap;	z-Index: 1000000;");
	toolbarele.innerHTML="<input type='button' value='Clear' onclick='document.getElementById(\"LogText\").innerHTML=\"\";' title='Clear'>";

	logtextele = wndptr.document.createElement("div");
	logtextele.setAttribute("id","LogText");
	logtextele.setAttribute("style","top: 22px; width: 100%; height: 96%; position: relative;");

	bdy.item(0).appendChild(toolbarele);
	bdy.item(0).appendChild(logtextele);

	this.textele_handle = logtextele;
	this.output_handle = wndptr;
};

/* 
 * not an api call 
 */
Log.prototype.__write = function __log__write(type, object, line) 
{
	//do nothing if the log was not started
	if(this.running == false) return;

	if(typeof object == "undefined") object = "NO OBJECT";

	if(this.type == this.NEW_WINDOW)
	{
		if(!this.output_handle.document)
		{
			this.__openwindow();
		}
	}
	
	var date = new Date();
	var datestring = (date.getYear() < 1900) ? date.getYear()+1900  : date.getYear();
		datestring += "-" + (date.getMonth() + 1)
		datestring += "-" + date.getDate();
		datestring += " " 
			+ date.getHours() + ":" 
			+ ((date.getMinutes() >= 10) ? date.getMinutes() : "0" + date.getMinutes()) + ":" 
			+ ((date.getSeconds() >= 10) ? date.getSeconds() : "0" + date.getSeconds());
	
	var newline = null;
	
	if(this.output_handle != null)
		newline = this.output_handle.document.createElement("div");
	else
		newline = document.createElement("div");
	
	switch(type)
	{
		case TYPE_DEBUG:
			newline.setAttribute("class","debug");
			break;
		case TYPE_INFO:
			newline.setAttribute("class","info");
			break;
		case TYPE_WARN:
			newline.setAttribute("class","warn");
			break;	
		case TYPE_ERROR:
			newline.setAttribute("class","error");
			break;
	}
	newline.innerHTML =	"[" + datestring + "] " + type + " :: " + (typeof object) + " :: " + line;
	this.textele_handle.appendChild(newline);
	this.output_handle.scrollTo(0,this.textele_handle.scrollHeight);
};

/**
 * Method: Log.debug
 * Write a debug line to the log
 *
 * Parameters:
 * 	line - the text for the log
 * 	object - (optional) the object this line is from "NO OBJECT" default
*/
Log.prototype.debug = function __log__debug(line, object)
{
	this.__write(TYPE_DEBUG, object, line);
};

/**
 * Method: Log.info
 * Write an info line to the log
 *
 * Parameters:
 * 	line - the text for the log
 * 	object - (optional) the object this line is from "NO OBJECT" default
*/
Log.prototype.info = function __log__info(line, object)
{
	this.__write(TYPE_INFO, object, line);
};

/**
 * Method: Log.warn
 * Write a warn line to the log
 *
 * Parameter:
 * 	line - the text for the log
 * 	object - (optional) the object this line is from "NO OBJECT" default
 */
Log.prototype.warn = function __log__warn(line, object)
{
	this.__write(TYPE_WARN, object, line);
};

/**
 * Method: Log.error
 * Write an error line to the log
 * Parameter:
 * 	line - the text for the log
 * 	object - (optional) the object this line is from "NO OBJECT" default
 *
 */
Log.prototype.error = function __log__error(line, object)
{
	this.__write(TYPE_ERROR, object, line);
};

/**
 * Variable: log 
 * 	a default log for page use. 
 */
var log = new Log();
if(DEBUG) log.init();