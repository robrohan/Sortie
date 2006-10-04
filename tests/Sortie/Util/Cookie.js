
var COOKIE_NAME="test_cookie_name";
var COOKIE_VALUE="test_cookie_value";

Tests.test_CookieCreate = function() {
	log.debug("Testing Sortie.Util.Cookie version: " + Sortie.Util.Cookie["VERSION"])
	
	try {
		var c = new Sortie.Util.Cookie();
	} catch(e) {
		return JUAssert.fail();
	}
	
	if(c != null)
		return JUAssert.pass();
		
	return JUAssert.fail();
}

Tests.test_GetSetCookie = function() {
	var c = new Sortie.Util.Cookie();
	log.warn("!! Setting the cookie " + COOKIE_NAME + " NOTE some browsers wont work with a local file");
	log.warn("!! you may need to run this test from a live server.");
	c.SetCookie(COOKIE_NAME,COOKIE_VALUE);
	
	return JUAssert.equal(c.GetCookie(COOKIE_NAME), COOKIE_VALUE);
}

Tests.test_RemoveCookie = function() {
	var c = new Sortie.Util.Cookie();
	c.SetCookie(COOKIE_NAME,COOKIE_VALUE);
	
	if(c.GetCookie(COOKIE_NAME) == null)
	{
		log.debug("!! Could not set the cookie " + COOKIE_NAME + " NOTE some browsers wont work with a local file");
		log.debug("you may need to run this test from a live server.");
		return JUAssert.fail();
	}
	
	c.RemoveCookie(COOKIE_NAME);
	
	return JUAssert.isNull(c.GetCookie(COOKIE_NAME));
}

Tests.test_SetPermCookie = function() {
	var c = new Sortie.Util.Cookie();
	var passed = false;
	
	c.SetPermCookie(COOKIE_NAME,COOKIE_VALUE);
	
	if(c.GetCookie(COOKIE_NAME) != null)
	{
		passed = true;
	}
	
	c.RemoveCookie(COOKIE_NAME);
	
	if(passed)
		return JUAssert.pass();
	else
		return JUAssert.fail();
}