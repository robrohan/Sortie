
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

Tests.test_PropertiesParse = function()
{
	var props = new Properties();
	props.parse(PROPERTIESFILE);
	
	return JUAssert.equal(props.propertyNames(), (["one","two","three"]) );
}


Tests.test_PropertiesGetProperty = function()
{
	var props = new Properties();
	props.parse(PROPERTIESFILE);
	
	var rtn = props.getProperty("one");
	
	return JUAssert.equal(rtn, "won");
}

Tests.test_PropertiesSetProperty = function()
{
	var props = new Properties();
	props.parse(PROPERTIESFILE);
	
	var rtn = props.getProperty("one");
	
	//load failed for some reason
	if(JUAssert.notEqual(rtn, "won"))
	{
		return JUAssert.fail();
	}
	
	props.setProperty("one","obi-wan");
	
	var rtn = props.getProperty("one");
	
	return JUAssert.equal(rtn, "obi-wan");
}

Tests.test_PropertiesStore = function()
{
	var props = new Properties();
	props.parse(PROPERTIESFILE);
	
	return JUAssert.equal(props.store(), PROPERTIESSTORE);
}