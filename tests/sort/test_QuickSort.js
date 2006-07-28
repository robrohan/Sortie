
function test_QuickSortNumeric()
{
	var arry = [10, 23, 49, 23, -93, 0, -1, 45, 11, 89,78, 2, 5, 48, 20, 44, 49, 123, 6, 1];

	qsort(arry, 0, (arry.length-1) );
	
	return JUAssert.equal(arry,[-93,-1,0,1,2,5,6,10,11,20,23,23,44,45,48,49,49,78,89,123]);
}

function test_QuickSortAlpha()
{
	arry = ["hello", "there", "my", "name", "is", "rob","what", "is", "your", "name", "again", "hi"];
	
	qsort(arry, 0, (arry.length-1) );
	
	return JUAssert.equal(arry,["again","hello","hi","is","is","my","name","name","rob","there","what","your"]);
}