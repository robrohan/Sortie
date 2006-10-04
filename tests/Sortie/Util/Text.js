
Tests.test_TextCreate = function() {
	log.debug("Testing Sortie.Util.Text version: " + Sortie.Util.Text["VERSION"])
	
	try {
		var t = new Sortie.Util.Text();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(t != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}

Tests.test_TextXmlFormat = function() {
	var t = new Sortie.Util.Text();

	//log.debug(t.XmlFormat("<test>thing & stuff</test>"));
	
	return JUAssert.equal(
		t.XmlFormat("<test>thing & stuff</test>"), 
		"&lt;test&gt;thing &amp; stuff&lt;/test&gt;"
	);
}

Tests.test_TextParseBoolean = function() {
	var t = new Sortie.Util.Text();
	
	return JUAssert.equal(t.ParseBoolean("TRUE"), true);
}

Tests.test_TextReflect = function() {
	var t = new Sortie.Util.Text();
	
	log.debug(t.Reflect(t));
	
	return JUAssert.unknown();
}

Tests.test_TextExpandError = function() {
	var t = new Sortie.Util.Text();
	
	log.debug(t.ExpandError(Error("testing")))
	
	return JUAssert.unknown();
}