
Sortie = {};
/** 
 * Variable: Sortie.VERSION 
 * 	the current version 
 */
Sortie.VERSION = "0.5";
/**
 * Variable: Sortie.DEBUG 
 * 	set this to true to turn on debug mode
 */
Sortie.DEBUG = false;
/////////////////////////////////////////////////////////////////////

/**
 * Class: Sortie.Core
 * Core acts as a pre processor
 *
 * (code)
 * Sortie.Core.$({
 * 		include:new Array(
 * 			"Code/Util/Cookie.js",
 * 			"Code/Util/Search.js"
 * 		)
 * });
 * 
 * +======================================+
 * | Command        | Params              |
 * +======================================+
 * | require        | Array of variables  |
 * | include        | Array of filenames  |
 * +======================================|
 * (end code)
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
	
	/**
	 * Method: Core.VerifyDependencies
	 * 	
	 *
	 * Parameters:
	 * 	
	 * Returns:
	 * 	
	 */
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
	
	/*
	 * Function: neuro_registerLibrary
	 * Lets any one who cares knows that this library version was loaded
	 *
	 * Parameters:
	 * 	key
	 * 	version
	 */
	/*this.RegisterLibrary = function(key, version)
	{
		__NEURO_LOADED_LIBS[key] = version
	} */

	/**
	 * Method: Core.Import
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


