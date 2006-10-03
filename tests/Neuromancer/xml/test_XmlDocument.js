

var TESTXML = '<root xmlns="blarg.com"><inner xmlns="hook.com">this item</inner><inner xmlns="wrong.com">wrong test</inner></root>';

Tests.test_XMLDocFromString = function()
{
	log.debug("Starting XML load...")
	var myDoc = new XMLDocumentFactory().getInstance();
	myDoc.loadXML(TESTXML);
	log.debug("Done.");
	
	return JUAssert.equal(myDoc.documentElement.nodeName, "root");
}

Tests.test_XMLGetElementsNameNS = function()
{
	var myDoc = new XMLDocumentFactory().getInstance();
	myDoc.loadXML(TESTXML);
	
	var nodeset1 = myDoc.getElementsByTagNameNS("hook.com","inner");
	
	return JUAssert.equal(nodeset1.length, 1);
}

Tests.test_XMLCreateElement = function()
{
	var myDoc = new XMLDocumentFactory().getInstance();
	myDoc.loadXML(TESTXML);
	var element = myDoc.createElement("name");
	
	return JUAssert.notNull(element);
}
