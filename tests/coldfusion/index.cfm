<html>
	<head>
		<title>JS Test</title>
		<cfset urlbase = "http://localhost:8500/neuromancer/" />
		<cfoutput>
		<script language="javascript" type="text/javascript" src="#urlbase#js/util/Log.js"></script>
		<script language="javascript" type="text/javascript" src="#urlbase#js/util/Collections.js"></script>
		<script language="javascript" type="text/javascript" src="#urlbase#js/util/BrowserSniffer.js"></script>

		<script language="javascript" type="text/javascript" src="#urlbase#js/xml/XmlSax.js"></script>
		<script language="javascript" type="text/javascript" src="#urlbase#js/xml/XmlW3CDom.js"></script>
		<script language="javascript" type="text/javascript" src="#urlbase#js/xml/XmlDocument.js"></script>

		<script language="javascript" type="text/javascript" src="#urlbase#js/io/Gateway.js"></script>

		<!--- <script language="javascript" type="text/javascript" src="js/system.js"></script>
		<script language="javascript" type="text/javascript" src="js/console.js"></script> --->
		</cfoutput>
	</head>
	<body>
		<h1>I just did a bunch of stuff</h1>
		<!--- <cfoutput>#ExpandPath('.')#</cfoutput> --->

		<script type="text/javascript" language="javascript">
			httpcon = new HTTPConnectFactory().getInstance();
			remote = new JSRemote(httpcon,false);

			xmldoc = new XMLDocumentFactory().getInstance();

			function myHandler(e)
			{
				xmldoc.loadXML(e);
				alert(e);
			}

			remote.doGetRequest("http://localhost:8500/neuromancer/loadxmlfile.cfm",myHandler);

			alert(xmldoc.toString());

			elements = xmldoc.getElementsByTagNameNS("http://www.macromedia.com/2003/mxml","DataGrid");
			elements.item(0).setAttribute("editable","nope");

			function nullHandler(e){;}
			remote.doPostRequest("http://localhost:8500/neuromancer/logrequest.cfm",nullHandler,xmldoc.toString());
		</script>

		<!--- <script type="text/javascript" language="javascript1.2">
			mydoc = new XMLDocumentFactory().getInstance();

			//neuro_SystemOut(typeof mydoc);

			mydoc.loadXML(
				"<test>\n<thing id='a123'>hi</thing>\n\t<thing id='a321'>test</thing>\n</test>"
			);

			//neuro_SystemOut(typeof mydoc);

			//neuro_SystemOut(mydoc.toString());

			element = mydoc.getElementById("123");
			//document.write(element.firstChild.nodeValue + "<br><br>");

			//neuro_SystemOut(typeof element);

			nodelist = mydoc.getElementsByTagName("thing");
			//alert(nodelist.length);
			for(var i=0; i<nodelist.length; i++)
			{
				//document.write(nodelist.item(i).firstChild.nodeValue + "<br>");
				//nodelist.item(i).firstChild.nodeValue = "el roberto";

				inputtag = document.createElement("input");
				inputtag.setAttribute("type","text");
				value = nodelist.item(i).firstChild.nodeValue;
				inputtag.setAttribute("name","testvalue"+i);
				inputtag.setAttribute("value",value);

				//alert(inputtag.innerHTML);

				label = document.createElement("span");
				value = nodelist.item(i).nodeName;
				label.innerHTML = value + ": ";

				//document.getElementById("mytest").appendChild(label);
				//document.getElementById("mytest").appendChild(inputtag);
			}
		</script> --->
	</body>
</html>