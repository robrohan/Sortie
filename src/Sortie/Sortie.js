/**
 * File: Sortie/Sortie.js
 * Main file for Sortie. Contains the Sortie namespace and the
 * Sorite.Core preprocessor
 *
 * Copyright:
 * 	2005-2006 Rohan (robrohan@gmail.com). All rights reserved
 */
 
Sortie = {};

/** 
 * Variable: Sortie.VERSION 
 * 	the current version 
 */
Sortie.VERSION = "0.5";

/**
 * Variable: Sortie.DEBUG 
 * 	set this to true to turn on debug mode and use this in
 * your code if you want to branch based on debug mode
 */
Sortie.DEBUG = false;
/////////////////////////////////////////////////////////////////////

/**
 * Class: Core
 * Core acts as a pre processor. You can use Core in include javascript
 * libraries from with javascript code, and you can also ad "require"
 * statements to your libraries if your library depends on some other
 * library. For example, to include libraries - from your applications
 * main startup area you could do the following:
 * (code)
 * Sortie.Core.$({
 * 		include:new Array(
 * 			"Code/Util/Cookie.js",
 * 			"Code/Util/Search.js"
 * 		)
 * });
 * (end code)
 * After you have all the js files the application needs you call
 * _Sortie.Core.Include()_ to load all the libraries. See the Events.html example
 * for a working example.
 * In addition to including files, your library can use Core to check to
 * see if a required library exists.
 * To check, in your library code, you add something like the following 
 * at the start of the file:
 * (code)
 * Sortie.Core.$({
 *		require:new Array(
 *			{ c:"Sortie.Util.Collections", v:"0.2"},
 *			{ c:"Some.Other.Class" }
 *		)
 * });
 * (end code)
 * _c_ stands for class, and _v_ stands for version. Version is optional, but
 * if the libaray adds metadata to the class (the "VERSION" property) the
 * version is checked and if older than required there is an error.
 * After the Sortie.Core.Include() is run, the environment is checked for the
 * existence of the class (or function) passed in _c_.
 * At present the _require_ and _include_ commands are the only supported pre
 * processor commands.
 * (code) 
 *  \======================================/
 *  | Command        | Params              |
 *  \======================================/
 *  | require        | Array of variables  |
 *  | include        | Array of filenames  |
 *  \======================================/
 * (end code)
 *
 * Namespace:
 * 	Sortie
 */
Sortie.CoreImpl = function() {
	/////////////// loaded libs /////////////////////
	this.__NEURO_REQUIRES = new Array();
	
	/////////////// requested imports ///////////////
	this.__NEURO_IMPORTS = new Array();
	
	/////////////// commands ////////////////////////
	this.__PRE_COMMAND_REQUIRE = "require";
	this.__PRE_COMMAND_LOAD	= "include";
	
	/**
	 * Function: $
	 * Main pre processor function.
	 */
	this["$"] = function(e) {
		if(typeof e[this.__PRE_COMMAND_REQUIRE] != "undefined") {
			this.__buildRequireStructure(e);
		}
		
		if(typeof e[this.__PRE_COMMAND_LOAD] != "undefined") {
			this.__buildImportStructure(e)
		}
	};
	
	/**
	 * builds a list of includes from the preprocessor. This struct will be used
	 * to write the script includes later (in neuro_import())
	 */
	this.__buildImportStructure = function(e) {
		var loadlen = e[this.__PRE_COMMAND_LOAD].length;
		
		for(var i=0; i<loadlen; i++) {
			this.__NEURO_IMPORTS[this.__NEURO_IMPORTS.length] = e[this.__PRE_COMMAND_LOAD][i];
			
			//this would be the best way to do it, but safari doesnt work this way
			//var head = document.getElementsByTagName("head");
			//srptele = document.createElement("script");
			//srptele.setAttribute("type","text/javascript");
			//srptele.setAttribute("src",e[__PRE_COMMAND_LOAD][i]);
			//head.item(0).appendChild(srptele);
		}
	};

	/**
	 */
	this.__buildRequireStructure = function(e) {
		var loadlen = e[this.__PRE_COMMAND_REQUIRE].length;
		
		for(var i=0; i<loadlen; i++) {
			this.__NEURO_REQUIRES[this.__NEURO_REQUIRES.length] = e[this.__PRE_COMMAND_REQUIRE][i];
			
			//this would be the best way to do it, but safari doesnt work this way
			//var head = document.getElementsByTagName("head");
			//srptele = document.createElement("script");
			//srptele.setAttribute("type","text/javascript");
			//srptele.setAttribute("src",e[__PRE_COMMAND_LOAD][i]);
			//head.item(0).appendChild(srptele);
		}
	};
	
	/* internal only */
	this.VerifyDependencies = function() {
		var reqlen = this.__NEURO_REQUIRES.length;
		
		for(var i=0; i<reqlen; i++) {
			var reqlib = this.__NEURO_REQUIRES[i];
			
			//log.debug(reqlib.c + " " + reqlib.v);
			
			if(typeof eval(reqlib.c) == "undefined") {
				throw Error("Missing Library: " + reqlib.c);
				//log.error("Missing Library: " + reqlib.c)
				continue;
			}
			
			if(typeof reqlib.v != "undefined") {
				var x = 0;
				eval("x = " + reqlib.c + "['VERSION']");
				x = (parseFloat(x) != Number.NaN) ? parseFloat(x) : parseFloat(0);
				if(x < parseFloat(reqlib.v)) {
					throw Error("Bad Library Version: " + reqlib.c + " v:" + reqlib.v);
					//log.error("Bad Library Version: " + reqlib.c + " v:" + reqlib.v)
				}
			}
		}
	};
	
	/**
	 * Method: Core.Include
	 * Function to write out all the files to be included
	 */
	this.Include = function(debug) {
		var importlen = this.__NEURO_IMPORTS.length;
		
		//this is like this because for some reason firefox gacks when you
		//try to write script all in one go.
		for(var i=0; i<importlen; i++) {
			var line = "<script charset='utf-8' type='text/javascript' src='" 
				+ this.__NEURO_IMPORTS[i]
				+ "'";
			if(debug)
				log.debug(line + "></script" + ">");
			else
				document.write(line + "></script" + ">");
		}
		
		this.VerifyDependencies();
	};
}

Sortie.Core = new Sortie.CoreImpl();

//////////////// META DATA////////////
/** 
 * Variable: Sortie.Core.VERSION 
 * 	the current version 
 */
Sortie.Core.VERSION = "0.5";
//////////////// META DATA////////////
