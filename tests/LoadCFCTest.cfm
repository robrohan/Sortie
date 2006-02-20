<!DOCTYPE html PUBLIC 
	"-//W3C//DTD XHTML 1.0 Strict//EN" 
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>untitled</title>
	
	<script language="javascript" type="text/javascript" src="../js/util/Log.js"></script>
	<script language="javascript" type="text/javascript" src="../js/util/Collections.js"></script>
	<script language="javascript" type="text/javascript" src="../js/util/BrowserSniffer.js"></script>
	
	<script language="javascript" type="text/javascript" src="../js/ui/mouse.js"></script>
	<script language="javascript" type="text/javascript" src="../js/ui/EventManager.js"></script>

	<script language="javascript" type="text/javascript" src="../js/xml/xmlsax.js"></script>
	<script language="javascript" type="text/javascript" src="../js/xml/xmlw3cdom.js"></script>
	<script language="javascript" type="text/javascript" src="../js/xml/xmldocument.js"></script>

	<script language="javascript" type="text/javascript" src="../js/io/Gateway.js"></script>
	<script language="javascript" type="text/javascript" src="../js/io/remoteobject.js"></script>
	
	<script language="javascript" type="text/javascript">
		DEBUG = true;
		log.init();
		
		//loading and making a page global object
		//you'd probably want a loading screen or something here since this is 
		//asyc (the true parameter)
		RemoteObjectLoader("http://localhost:8500/Neuromancer/tests/DemoObject.cfc", myCallback, true) 
		var core = null;
		function myCallback(obj)
		{
			core = obj;
		}
		//loading and making a page global object
		
		//all the test things call this callback
		function doThing(s)
		{
			alert(s.toString());
		}
		
		//the following are all UI driven
		function getStringForDemo()
		{
			dh = new DefaultHandler(doThing);
			core.getString(dh.handle);
		}
		
		function getArrayForDemo()
		{
			dh = new DefaultHandler(doThing);
			core.getArray(dh.handle);
		}
		
		function getMapForDemo()
		{
			dh = new DefaultHandler(doThing);
			core.getMap(dh.handle);
		}
		
		function setStringForDemo()
		{
			var str = "hi from the page";
			
			dh = new DefaultHandler(doThing);
			core.changeString(str, dh.handle);
		}
		
		function setArrayForDemo()
		{
			var lst = new List();
			lst.add("Item 1");
			
			dh = new DefaultHandler(doThing);
			core.changeArray(lst, dh.handle);
		}
		
		function setMapForDemo()
		{
			var map = new Map();
			map.put("frompage","this is the start value");
			
			dh = new DefaultHandler(doThing);
			core.changeMap(map, dh.handle);
		}
		
		function bogusCall()
		{
			var lst = new List();
			dh = new DefaultHandler(doThing);
			//this should cause an index out of bounds error
			core.causeError(lst, dh.handle);
		}
		
		function doMultiArg()
		{
			var map = new Map();
			map.put("inval","map in");
			var lst = new List();
			lst.add("list in")
			var str = "string in"
			
			dh = new DefaultHandler(doThing);
			
			core.multiArg(map,lst,str,dh.handle);
		}
	</script>
	
</head>
<body>
	<p>If this gets an error, make sure that the page is pointing to the correct place for the CFC. By default it
	points to http://localhost:8500/Neuromancer/tests/DemoObject.cfc which may be different on your
	system. (and of course requires Coldfusion to be running)</p>
	<form>
		<input type="button" value="getString" onclick="javascript: getStringForDemo()">
	    <input type="button" value="getArray" onclick="javascript: getArrayForDemo()">
	    <input type="button" value="getMap" onclick="javascript: getMapForDemo()">
	    <br/>
	    <br/>
	    <input type="button" value="changeString" onclick="javascript: setStringForDemo()">
	    <input type="button" value="changeArray" onclick="javascript: setArrayForDemo()">
	    <input type="button" value="changeMap" onclick="javascript: setMapForDemo()">
	    <br/>
	    <br/>
	    <input type="button" value="multiArg" onclick="javascript: doMultiArg()">
	    <input type="button" value="cause server error" onclick="javascript: bogusCall()">
	</form>
</body>
</html>