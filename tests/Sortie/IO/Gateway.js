Tests.test_GatewayCreate = function() {
	log.debug("Testing Sortie.IO.Gateway version: " + Sortie.IO.Gateway["VERSION"])
	
	try {
		var p = new Sortie.IO.Pipe();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(p != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}


Tests.test_LoadXMLFile = function()
{	
	var pipe = new Sortie.IO.Pipe().GetInstance();
	var gateway = new Sortie.IO.Gateway(pipe, true);

	//xmldoc = new XMLDocumentFactory().getInstance();
	
	function myHandler(raw) {
		ju_test_results.put(
			"test_loadXMLFile", JUAssert.notNull(raw.responseText)
		);
		
		//xmldoc.loadXML(e);
		//elements = xmldoc.getElementsByTagNameNS("http://neuromancer.sf.net/tests","MyElement");
		//elements.item(0).setAttribute("editable","** SET THIS TO THIS **");
		//document.getElementById("showloaded").value = xmldoc.toString();
	}
	
	try {
		gateway.DoRequest({
			method:"GET",
			url:"form.xml", 
			handler:myHandler
		});
	} catch(e) {
		remote = null;
		myHandler = null;
		xmldoc = null;
		return JUAssert.fail();
	}
}