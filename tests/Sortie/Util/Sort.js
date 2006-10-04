
Tests.test_QuickSortCreate = function() {
	log.debug("Testing Sortie.Util.Sort version: " + Sortie.Util.Sort["VERSION"])
	
	try {
		var search = new Sortie.Util.QuickSort();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(search != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}

Tests.test_QuickSortNumeric = function(){
	var mysort = new Sortie.Util.QuickSort();
	
	var arry = [10, 23, 49, 23, -93, 0, -1, 45, 11, 89,78, 2, 5, 48, 20, 44, 49, 123, 6, 1];

	mysort.Sort(arry, 0, (arry.length-1) );
	
	return JUAssert.equal(arry,[-93,-1,0,1,2,5,6,10,11,20,23,23,44,45,48,49,49,78,89,123]);
}

Tests.test_QuickSortAlpha = function() {
	var mysort = new Sortie.Util.QuickSort();
	
	arry = ["hello", "there", "my", "name", "is", "rob","what", "is", "your", "name", "again", "hi"];
	
	mysort.Sort(arry, 0, (arry.length-1) );
	
	return JUAssert.equal(arry,["again","hello","hi","is","is","my","name","name","rob","there","what","your"]);
}