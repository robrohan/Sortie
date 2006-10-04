
Tests.test_SortieExists = function() {
	
	log.debug("Testing Sortie version: " + Sortie["VERSION"]);
	
	//return JUAssert.equal(area.match, 13);
	try {
		if(Sortie)
			return JUAssert.pass();
	} catch (e) {
		return JUAssert.fail();
	}
}

Tests.test_SortieCoreExists = function() {
	
	log.debug("Testing Sortie version: " + Sortie.Core["VERSION"]);
	
	//return JUAssert.equal(area.match, 13);
	try {
		if(Sortie.Core)
			return JUAssert.pass();
	} catch (e) {
		return JUAssert.fail();
	}
}

Tests.test_SortieCoreImport = function() {
	Sortie.Core.$({
		include:new Array(
			"Sortie/Util/Cookie.js",
			"Sortie/Util/Sort.js"
		),
		
		require:new Array(
			{ c:"Sortie.Util.Sort", v:"0.1"},
			{ c:"Sortie.Util.Cookie", v:"0.1"}
		)
	});
		
	Sortie.Core.Import(true);
	
	return JUAssert.pass();
	//return JUAssert.fail();
}