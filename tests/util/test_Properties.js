
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

function test_PropertiesParse()
{
	var props = new Properties();
	props.parse(PROPERTIESFILE);
	
	return JUAssert.equal(props.propertyNames(), (["one","two","three"]) );
}


function test_PropertiesGetProperty()
{
	var props = new Properties();
	props.parse(PROPERTIESFILE);
	
	var rtn = props.getProperty("one");
	
	return JUAssert.equal(rtn, "won");
}

function test_PropertiesSetProperty()
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

function test_PropertiesStore()
{
	var props = new Properties();
	props.parse(PROPERTIESFILE);
	
	return JUAssert.equal(props.store(), PROPERTIESSTORE);
}