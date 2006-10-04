
Tests.test_SearchCreate = function() {
	log.debug("Testing Sortie.Util.Search version: " + Sortie.Util.Search["VERSION"])
	
	try {
		var search = new Sortie.Util.BinarySearch();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(search != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}

Tests.test_BinarySearchFindItem = function() {
	var search = new Sortie.Util.BinarySearch();
	
	var word = "African"
	var words = new Array(
		"A",	 "ACM", "ANSI", "ASAP", "ASCII", "ATM's", "Achilles",
		"Ada", "Ada's", "Afghanistan", "Afghanistan's", "Africa",
		"Africa's", "African", "African's", "Africans", "Airedale",
		"Airedale's", "Alabama", "Alabama's", "Alabamian", "Alabamian's"
	);
	
	var area = search.Search(words, 0, words.length, word);
	
	return JUAssert.equal(area.match, 13);
}

Tests.test_BinarySearchNotFoundItem = function() {
	var search = new Sortie.Util.BinarySearch();
	
	var word = "Abba"
	var words = new Array(
		"A",	 "ACM", "ANSI", "ASAP", "ASCII", "ATM's", "Achilles",
		"Ada", "Ada's", "Afghanistan", "Afghanistan's", "Africa",
		"Africa's", "African", "African's", "Africans", "Airedale",
		"Airedale's", "Alabama", "Alabama's", "Alabamian", "Alabamian's"
	);
	
	var area = search.Search(words, 0, words.length, word);
	
	return JUAssert.equal(area.match, -1);
}
