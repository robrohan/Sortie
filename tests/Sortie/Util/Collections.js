
Tests.test_CollectionCreate = function() {
	log.debug("Testing Sortie.Util.Collections version: " + Sortie.Util.Collections["VERSION"])
	
	try {
		var coltest = new Sortie.Util.Collection();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(coltest != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}

function createDummyCollection() {
	var mycol = new Sortie.Util.Collection();
	mycol.avalues = [1,2,3,4,5,4,4,2];
	mycol.asize = 7;
	return mycol;
}

Tests.test_CollectionSize = function() {
	var mycol = createDummyCollection();
	
	return JUAssert.equal(mycol.Size(), 8);
}

Tests.test_CollectionClear = function() {
	var mycol = createDummyCollection();
	mycol.Clear();
	
	return JUAssert.equal(mycol.Size(), 0);
}

Tests.test_CollectionToArray = function() {
	var mycol = createDummyCollection();
	
	return JUAssert.equal(mycol.ToArray(), [1,2,3,4,5,4,4,2]);
}

Tests.test_CollectionContains = function() {
	var mycol = createDummyCollection();
	
	return JUAssert.equal(mycol.Contains(2), true);
}

Tests.test_CollectionNotContains = function() {
	var mycol = createDummyCollection();
	
	return JUAssert.equal(mycol.Contains(9), false);
}

Tests.test_CollectionIndexOf = function() {
	var mycol = createDummyCollection();
	
	return JUAssert.equal(mycol.IndexOf(2), 1);
}

Tests.test_CollectionIsEmpty = function() {
	var mycol = createDummyCollection();
	
	return JUAssert.equal(mycol.IsEmpty(), false);
}

Tests.test_CollectionIsEmpty2 = function() {
	var mycol = createDummyCollection();
	mycol.Clear();
	return JUAssert.equal(mycol.IsEmpty(), true);
}

Tests.test_CollectionLastIndexOf = function() {
	var mycol = createDummyCollection();
	
	//log.debug(mycol.LastIndexOf(4));
	return JUAssert.equal(mycol.LastIndexOf(4), 6);
}

Tests.test_CollectionGet = function() {
	var mycol = createDummyCollection();
	return JUAssert.equal(mycol.Get(4), 5);
}

Tests.test_CollectionRemove = function() {
	var mycol = createDummyCollection();
	
	//log.debug(mycol.ToString());
	mycol.Remove(4);
	//log.debug(mycol.ToString());
	return JUAssert.equal(mycol.ToArray(), [1,2,3,5,4,4,2]);
}

Tests.test_CollectionRemoveByIndex = function() {
	var mycol = createDummyCollection();
	mycol.RemoveByIndex(4);
	return JUAssert.equal(mycol.ToArray(), [1,2,3,4,4,4,2]);
}

Tests.test_CollectionSet = function() {
	var mycol = createDummyCollection();
	mycol.Set(1,2000);
	return JUAssert.equal(mycol.ToArray(), [1,2000,3,4,5,4,4,2]);
}

Tests.test_CollectionToString = function() {
	var mycol = createDummyCollection();
	
	return JUAssert.equal(mycol.ToString(), "[1,2,3,4,5,4,4,2]");
}

Tests.test_CollectionToStringEmpty = function() {
	var mycol = createDummyCollection();
	mycol.Clear();
	return JUAssert.equal(mycol.ToString(), "[Empty]");
}

/////////////////////////////////////////////////////////////////////////////////////

Tests.test_ListCreate = function() {
	try {
		var listtest = new Sortie.Util.List();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(listtest != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}

function createDummyList() {
	var listtest = new Sortie.Util.List();
	listtest.avalues = [1,2,3,4,5]
	listtest.asize = 4;
	return listtest;
}

Tests.test_ListAdd = function() {
	var mylist = createDummyList();
	mylist.Add(6)
	//log.debug(mylist.ToString());
	return JUAssert.equal(mylist.ToArray(),[1,2,3,4,5,6]);
}

Tests.test_ListToThinList = function() {
	var mylist = createDummyList();
	//log.debug(mylist.ToThinList());
	return JUAssert.equal(mylist.ToThinList(),"1,2,3,4,5");
}

Tests.test_ListFromThinList = function() {
	var mylist = createDummyList();
	mylist.Clear();
	mylist.FromThinList("1,2,3,4,5",",");
	//log.debug(mylist.Size());
	return JUAssert.equal( mylist.ToArray(), [1,2,3,4,5] );
}

Tests.test_ListToString = function() {
	var mylist = createDummyList();
	return JUAssert.equal( mylist.ToString(), "[1,2,3,4,5]");
}

Tests.test_ListToWSArray = function() {
	var mylist = createDummyList();
	//log.debug(mylist.ToWSArray("testing","String"));
}

/////////////////////////////////////////////////////////////////////////////////////

Tests.test_SetCreate = function() {
	try {
		var settest = new Sortie.Util.Set();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(settest != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}

function createDummySet() {
	var settest = new Sortie.Util.Set();
	settest.avalues = [1,2,3,4,5]
	settest.asize = 4;
	return settest;
}

Tests.test_SetAdd = function() {
	var myset = createDummySet();
	myset.Add(6)
	return JUAssert.equal(myset.ToArray(),[1,2,3,4,5,6]);
}

Tests.test_SetAddDuplicate = function() {
	var myset = createDummySet();
	myset.Add(3);
	//log.debug(myset.ToString());
	return JUAssert.equal(myset.ToArray(),[1,2,3,4,5]);
}

/////////////////////////////////////////////////////////////////////////////////////

Tests.test_MapCreate = function() {
	try {
		var mymap = new Sortie.Util.Map();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(mymap != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}

function createDummyMap() {
	var mymap = new Sortie.Util.Map();
	mymap.Put("test1","test");
	mymap.Put("test2","test");
	return mymap;
}

Tests.test_MapPut = function() {
	var mymap = createDummyMap();
	mymap.Put("test3","test3");
	//log.debug(mymap.ToString());
	return JUAssert.equal(mymap.ToString(),"[test1=test,test2=test,test3=test3]");
}


Tests.test_MapGetKeysAsArray = function() {
	var mymap = createDummyMap();

	return JUAssert.equal(mymap.GetKeysAsArray(),["test1","test2"]);
}

Tests.test_MapGet = function() {
	var mymap = createDummyMap();

	return JUAssert.equal(mymap.Get("test2"),"test");
}

Tests.test_MapRemove = function() {
	var mymap = createDummyMap();
	mymap.Remove("test2");
	return JUAssert.equal(mymap.ToString(),"[test1=test]");
}

Tests.test_MapContains = function() {
	var mymap = createDummyMap();

	return JUAssert.equal(mymap.Contains("test1"),true);
}

Tests.test_MapNotContains = function() {
	var mymap = createDummyMap();

	return JUAssert.equal(mymap.Contains("testadsf6"),false);
}

Tests.test_MapContainsNoCase = function() {
	var mymap = createDummyMap();

	return JUAssert.equal(mymap.ContainsNoCase("TeSt1"),true);
}

Tests.test_MapIndexOf = function() {
	var mymap = createDummyMap();

	return JUAssert.equal(mymap.IndexOf("test1"),0);
}


Tests.test_MapRemoveByIndex = function() {
	var mymap = createDummyMap();
	mymap.RemoveByIndex(0);
	return JUAssert.equal(mymap.ToString(),"[test2=test]");
}


Tests.test_MapSize = function() {
	var mymap = createDummyMap();

	return JUAssert.equal(mymap.Size(),2);
}

Tests.test_MapToWSStruct = function() {
	var mymap = createDummyMap();
}

Tests.test_MapToString = function() {
	var mymap = createDummyMap();
	return JUAssert.equal(mymap.ToString(),"[test1=test,test2=test]");
}



