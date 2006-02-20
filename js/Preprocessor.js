/**
 * File: Preprocessor.js
 *
 * (code)
 * +======================================+
 * | Command        | Params              |
 * +======================================+
 * | require        | Array of variables  |
 * | include        | Array of filenames  |
 * +======================================|
 * (end code)
 *
 * Copyright: 
 * 	2005 Rob Rohan (robrohan@gmail.com) All rights reserved
 */

/////////////// loaded libs /////////////////////
var __NEURO_LOADED_LIBS = new Object();

/////////////// requested imports ///////////////
var __NEURO_IMPORTS = new Array();

/////////////// commands ////////////////////////
var __PRE_COMMAND_REQUIRE			= "require";
var __PRE_COMMAND_LOAD			= "include";

/**
 * Function: $
 * Main pre processor function.
 */
function $(e)
{
	if(typeof e[__PRE_COMMAND_REQUIRE] != "undefined")
	{
		__buildRequireStructure(e);
	}
	
	if(typeof e[__PRE_COMMAND_LOAD] != "undefined")
	{
		__buildImportStructure(e)
	}
}

/**
 * builds a list of includes from the preprocessor. This struct will be used
 * to write the script includes later (in neuro_import())
 */
function __buildImportStructure(e)
{
	var loadlen = e[__PRE_COMMAND_LOAD].length;
	for(var i=0; i<loadlen; i++)
	{
		
		__NEURO_IMPORTS[__NEURO_IMPORTS.length] = e[__PRE_COMMAND_LOAD][i];
		
		//this would be the best way to do it, but safari doesnt work this way
		//var head = document.getElementsByTagName("head");
		//srptele = document.createElement("script");
		//srptele.setAttribute("type","text/javascript");
		//srptele.setAttribute("src",e[__PRE_COMMAND_LOAD][i]);
		//head.item(0).appendChild(srptele);
	}
}

/**
 */
function __buildRequireStructure(e)
{
	var reqlen = e[__PRE_COMMAND_REQUIRE].length;
	for(var i=0; i<reqlen; i+=2)
	{
		var reqlib = e[__PRE_COMMAND_REQUIRE][i]
		if(typeof __NEURO_LOADED_LIBS[reqlib]  == 'undefined')
		{
			alert("Missing library: " + reqlib);
			continue;
		}
		
		if(__NEURO_LOADED_LIBS[reqlib] < e[__PRE_COMMAND_REQUIRE][i+1])
		{
			alert("Wrong library version: " + reqlib);
		}
	}
}

/**
 * Function: neuro_registerLibrary
 * Lets any one who cares knows that this library version was loaded
 *
 * Parameters:
 * 	key
 * 	version
 */
function neuro_registerLibrary(key, version)
{
	__NEURO_LOADED_LIBS[key] = version
}

/**
 * Function: neuro_import
 * Function to write out all the files to be included
 */
function neuro_import()
{
	var importlen = __NEURO_IMPORTS.length;
	
	//this is like this because for some reason firefox gacks when you
	//try to write script all in one go.
	for(var i=0; i<importlen; i++)
	{
		var line = "<script type='text/javascript' src='" 
			+ __NEURO_IMPORTS[i]
			+ "'";
	
		document.write(line + "></script" + ">");
	}
}
