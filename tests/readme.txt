          
                 ____  __   ______          __ 
                / / / / /  /_  __/__  _____/ /_
           __  / / / / /    / / / _ \/ ___/ __/
          / /_/ / /_/ /    / / /  __(__  ) /_  
          \____/\____/    /_/  \___/____/\__/  
               Copyright (c) 2006 Rob Rohan    

JU Test is a simple javascript unit testing framework. It's goal
is to be simple and straight forward. You'll probably be able to use
it simply by looking a the index.html file and the current tests.

You write your test cases by creating a "test" file and adding it to
the index.html import.

Test case functions must be attached to the "Test" object and
must begin with "test_". Here is a quick example of a test case:

Tests.test_SortieCoreExists = function() {
	log.debug("Testing Sortie version: " + Sortie.Core["VERSION"]);
	
	try {
		if(Sortie.Core)
			return JUAssert.pass();
	} catch (e) {
		return JUAssert.fail();
	}
}

When included into index.html and run, the framework will look at 
the Test object and automatically run any function that starts with
"test_". The order is undefined, so each test must be self 
contained.

When the text is run, output can be shown to the command console 
with log.debug, log.warn, and log.error. After the test is run, the
console becomes interactive so you can look at the running 
enviroment - press Enter to make the console interactive.