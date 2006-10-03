
Tests.test_neuro_decToHex = function()
{
	for(var q=0; q<10; q++)
	{
		if(!neuro_decToHex(q) == q)
			return JUAssert.fail();
	}
	
	if(!neuro_decToHex(10) == "A")
		return JUAssert.fail();
	else if(!neuro_decToHex(11) == "B")
		return JUAssert.fail();
	else if(!neuro_decToHex(12) == "C")
		return JUAssert.fail();
	else if(!neuro_decToHex(13) == "D")
		return JUAssert.fail();
	else if(!neuro_decToHex(14) == "E")
		return JUAssert.fail();
	else if(!neuro_decToHex(15) == "F")
		return JUAssert.fail();
	
	if(!neuro_decToHex(8675309) == "845FED")
		return JUAssert.fail();
	
	return JUAssert.pass();
}

Tests.test_neuro_xmlFormat = function()
{
	return JUAssert.equal(neuro_xmlFormat("<test>&</test>"),"&lt;test&gt;&amp;&lt;/test&gt;");
}

Tests.test_neuro_parseBoolean = function()
{
	if(!neuro_parseBoolean("TRUE"))
		return JUAssert.fail();
	
	if(!neuro_parseBoolean("true"))
		return JUAssert.fail();
	
	if(neuro_parseBoolean("FALSE"))
		return JUAssert.fail();
	
	if(neuro_parseBoolean("false"))
		return JUAssert.fail();
	
	return JUAssert.pass();
}

Tests.test_neuro_Reflect = function()
{
	log.debug("!!!test_neuro_Reflect: Reflecting information about the Log object...");
	neuro_Reflect(log);
	
	return JUAssert.unknown();
}
