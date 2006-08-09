
Tests.test_LoadXMLFile = function()
{	
	var httpcon = new HTTPConnectFactory().getInstance();
	var remote = new JSRemote(httpcon,true);

	xmldoc = new XMLDocumentFactory().getInstance();
	
	function myHandler(e,raw)
	{
		ju_test_results.put("test_loadXMLFile", JUAssert.notNull(e) );
				
		//xmldoc.loadXML(e);
		//elements = xmldoc.getElementsByTagNameNS("http://neuromancer.sf.net/tests","MyElement");
		//elements.item(0).setAttribute("editable","** SET THIS TO THIS **");
		//document.getElementById("showloaded").value = xmldoc.toString();
	}
	
	try
	{
		remote.doGetRequest("form.xml", myHandler);
	}
	catch(e)
	{
		remote = null;
		myHandler = null;
		xmldoc = null;
		return JUAssert.fail();
	}
}