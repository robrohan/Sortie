

Tests.test_MakeMap = function()
{
	log.debug("Making a map");
	var map = new Map();
	for(var q=0; q<3; q++)
	{
		map.put("item"+q,"value"+q);
	}
	log.debug(map);
	return JUAssert.equal(
		map.toString(),"[item0=value0,item1=value1,item2=value2]"
	);
}

Tests.test_ContainsNoCase = function()
{
	var map = new Map();
	for(var q=0; q<3; q++)
	{
		map.put("item"+q,"value"+q);
	}
	
	return JUAssert.equal(
		map.containsNoCase("ITEM1"),
		true
	);
}

Tests.test_MakeList = function()
{
	log.debug("Making a list");
	var list = new List();
	for(var q=0; q<3; q++)
	{
		list.add("item"+q);
	}
	log.debug(list);
	
	return JUAssert.equal(
		list.toString(),
		"[item0,item1,item2]"
	);
}

Tests.test_MakeSet = function()
{
	log.debug("Making a set");
	var set = new Set();
	for(var q=0; q<3; q++)
	{
		set.add("item"+q);
	}
	log.debug(set);
	
	return JUAssert.equal(
		set.toString(),
		"[item0,item1,item2]"
	);
}

