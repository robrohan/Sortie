

var TESTXML = '<root xmlns="blarg.com"><inner xmlns="hook.com">this item</inner><inner xmlns="wrong.com">wrong test</inner></root>';

function test_XMLDocFromString()
{
	log.debug("Starting XML load...")
	var myDoc = new XMLDocumentFactory().getInstance();
	myDoc.loadXML(TESTXML);
	log.debug("Done.");
	
	return JUAssert.equal(myDoc.documentElement.nodeName, "root");
}

function test_XMLGetElementsNameNS()
{
	var myDoc = new XMLDocumentFactory().getInstance();
	myDoc.loadXML(TESTXML);
	
	var nodeset1 = myDoc.getElementsByTagNameNS("hook.com","inner");
	
	return JUAssert.equal(nodeset1.length, 1);
}

function test_XMLCreateElement()
{
	var myDoc = new XMLDocumentFactory().getInstance();
	myDoc.loadXML(TESTXML);
	var element = myDoc.createElement("name");
	
	return JUAssert.notNull(element);
}
