/*
 * This is the the same as loading a file like this (with a get perhaps)
 * -------------------------------
 * #this is a comment
 * one=won
 * #comment here too
 * two=too
 * three=thee
 * ------------------------------
 */
var PROPERTIESFILE = "#this is a comment\none=won\n#comment here too\ntwo=too\nthree=thee";
var PROPERTIESSTORE = "one=won\ntwo=too\nthree=thee";

Tests.test_PropertiesCreate = function() {
	log.debug("Testing Sortie.Util.Properties version: " + Sortie.Util.Properties["VERSION"])
	
	try {
		var p = new Sortie.Util.Properties();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(p != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}

Tests.test_PropertiesParse = function()
{
	var props = new Sortie.Util.Properties();
	props.Parse(PROPERTIESFILE);
	
	return JUAssert.equal(props.PropertyNames(), (["one","two","three"]) );
}


Tests.test_PropertiesGetProperty = function()
{
	var props = new Sortie.Util.Properties();
	props.Parse(PROPERTIESFILE);
	
	var rtn = props.GetProperty("one");
	
	return JUAssert.equal(rtn, "won");
}

Tests.test_PropertiesSetProperty = function()
{
	var props = new Sortie.Util.Properties();
	props.Parse(PROPERTIESFILE);
	
	var rtn = props.GetProperty("one");
	
	//load failed for some reason
	if(JUAssert.notEqual(rtn, "won")) {
		return JUAssert.fail();
	}
	
	props.SetProperty("one","obi-wan");
	
	var rtn = props.GetProperty("one");
	
	return JUAssert.equal(rtn, "obi-wan");
}

Tests.test_PropertiesStore = function()
{
	var props = new Sortie.Util.Properties();
	props.Parse(PROPERTIESFILE);
	
	return JUAssert.equal(props.Store(), PROPERTIESSTORE);
}