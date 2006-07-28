/**
 * File: JUTest.js
 * Simple javascript Unit testing framework.
 *
 * Copyright:
 * 	2006 Rob Rohan (robrohan@gmail.com) - All rights reserved
 *
 * Related:
 * 	util/Collections.js
 * 	util/Log.js
 */
 
var ju_test_results = new Map();
var resultsdiv = null;

/**
 * Function: run_tests
 * Called by body onload= to start the test run
 * 
 */
function run_tests(showbanner)
{
	DEBUG = true;
	log.redirect(log.CONSOLE);
	log.init();
	
	var rootcon = new Console();
	neuro_addKeyPressListener(rootcon.keyListener);
	neuro_addKeyUpListener(rootcon.keyUpListener);
	neuro_addKeyDownListener(rootcon.keyDownListener);
	
	log.info("JU Test thinks you are running: " + SysBrowser.getGuessDisplay());
	//log.info(new SysBrowser().report(true));
	
	if(showbanner)
		ju_show_banner();
	
	resultsdiv = document.getElementById("testresults");
	
	for(i in this)
	{
		//if it looks like a test function
		var arry = i.toString().match(/^test_/);
		if(arry != null && arry.length > 0)
		{
			try
			{
				eval( "ju_test_results.put('"+i+"',eval( " + i+"()))" );
			}
			catch(e)
			{
				ju_test_results.put(i, JUAssert.fail() );
				log.error(e);
			}
		}
	}
	
	ju_display_results();
}

function ju_show_banner()
{
	log.info("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;____&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;______&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__&nbsp;");
	log.info("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;&nbsp;/_&nbsp;&nbsp;__/__&nbsp;&nbsp;_____/&nbsp;/_");
	log.info("&nbsp;__&nbsp;&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;/&nbsp;/&nbsp;_&nbsp;\\/&nbsp;___/&nbsp;__/");
	log.info("/&nbsp;/_/&nbsp;/&nbsp;/_/&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;/&nbsp;/&nbsp;&nbsp;__(__&nbsp;&nbsp;)&nbsp;/_&nbsp;&nbsp;");
	log.info("\\____/\\____/&nbsp;&nbsp;&nbsp;&nbsp;/_/&nbsp;&nbsp;\\___/____/\\__/&nbsp;&nbsp;");
	log.info("Starting...");
}

function ju_display_results()
{
	var result = "unknown";
	for(var i=0; i < ju_test_results.getKeysAsArray().length; i++)
	{
		var testdiv = document.createElement("DIV");
		
		var key = ju_test_results.getKeysAsArray()[i];
		var value = ju_test_results.get(key);
		
		testdiv.setAttribute("class","jutest");
		testdiv.setAttribute("id",key);
		
		if(value == null || typeof value == "undefined")
			result = "unknown"
		else if(value == true)
			result = "passed";
		else if(value == false)
			result = "failed";
		
		var funcdiv = document.createElement("DIV");
		funcdiv.setAttribute("class","testname");
		funcdiv.innerHTML = key;
		
		var resultdiv = document.createElement("DIV");
		resultdiv.setAttribute("class","resulttext " + result);
		resultdiv.innerHTML = result;
		
		testdiv.appendChild(funcdiv);
		testdiv.appendChild(resultdiv);
		
		resultsdiv.appendChild(testdiv);
	}
}

/**
 * Class: JUAssert
 * The JUAssert object is used within JU tests. 
 * return JUAssert.equal(a,b) for example.
 */ 
function __JUAssert(){;}

/**
 * Method: JUAssert.equal
 * Compares two items for equality. If the two items are arrays their elements
 * are checked for equality.
 *
 * Parameters:
 *	a - first item
 *	b -second item
 *
 * Returns:
 * 	true if they are equal false otherwise
 */ 
__JUAssert.prototype.equal = function __juassert_equal(a, b)
{
	if( (a == null && b != null) || (a != null && b == null) )
	{
		return false;
	}
	
	if(typeof a.length == "number" && typeof b.length == "number")
	{
		if(a.length != b.length)
			return false;
		
		var matched = true;
		for(var z=0; z<a.length; z++)
		{
			if(a[z] != b[z])
			{
				matched = false;
				break;
			}
		}
		
		return matched;
	}
	else
	{
		if(a == b)
			return true;
	}
	
	return false;
}

/**
 * Method: JUAssert.notEquals
 * compares two items for inequality
 *
 * Parameters:
 *	a - first item
 *	b -second item
 *
 * Returns:
 * 	true if they are not equal false otherwise
 */ 
__JUAssert.prototype.notEqual = function __juassert_notequal(a, b)
{
	if(a != b)
		return true;
		
	return false;
}

/**
 * Method: JUAssert.notNull
 * checks if an item is null
 *
 * Parameters:
 *	a - item to check
 *
 * Returns:
 * 	true if the item is not null, false otherwise
 */ 
__JUAssert.prototype.notNull = function __juassert_notnull(a)
{
	if(a != null)
		return true;
		
	return false;
}

/**
 * Method: JUAssert.isNull
 * checks if an item is null
 *
 * Parameters:
 *	a - item to check
 *
 * Returns:
 * 	true if the item is null, false otherwise
 */ 
__JUAssert.prototype.isNull = function __juassert_isnull(a)
{
	if(a == null)
		return true;
		
	return false;
}

/**
 * Method: JUAssert.fail
 * causes the test to fail
 * 
 * Returns:
 * 	false
 */ 
__JUAssert.prototype.fail = function __juassert_fail()
{
	return false;
}

/**
 * Method: JUAssert.pass
 * causes the test to pass
 * 
 * Returns:
 * 	true
 */ 
__JUAssert.prototype.pass = function __juassert_pass()
{
	return true;
}

/**
 * Method: JUAssert.unknown
 * returns the unknown status 
 * 
 * Returns:
 * 	true
 */ 
__JUAssert.prototype.unknown = function __juassert_unknown()
{
	return null;
}

var JUAssert = new __JUAssert();
