
function test_BinarySearchFindItem()
{
	var word = "African"
	var words = new Array(
		"A",	 "ACM", "ANSI", "ASAP", "ASCII", "ATM's", "Achilles",
		"Ada", "Ada's", "Afghanistan", "Afghanistan's", "Africa",
		"Africa's", "African", "African's", "Africans", "Airedale",
		"Airedale's", "Alabama", "Alabama's", "Alabamian", "Alabamian's"
	);
	
	var area = binarySearch(words, 0, words.length, word);
	
	return JUAssert.equal(area.match, 13);
}

function test_BinarySearchNotFoundItem()
{
	var word = "Abba"
	var words = new Array(
		"A",	 "ACM", "ANSI", "ASAP", "ASCII", "ATM's", "Achilles",
		"Ada", "Ada's", "Afghanistan", "Afghanistan's", "Africa",
		"Africa's", "African", "African's", "Africans", "Airedale",
		"Airedale's", "Alabama", "Alabama's", "Alabamian", "Alabamian's"
	);
	
	var area = binarySearch(words, 0, words.length, word);
	
	return JUAssert.equal(area.match, -1);
}
