
var COOKIE_NAME="test_cookie_name";
var COOKIE_VALUE="test_cookie_value";

function test_GetSetCookie()
{
	log.debug("!! Setting the cookie " + COOKIE_NAME + " NOTE some browsers wont work with a local file");
	log.debug("you may need to run this test from a live server.");
	setCookie(COOKIE_NAME,COOKIE_VALUE);
	
	return JUAssert.equal(getCookie(COOKIE_NAME), COOKIE_VALUE);
}

function test_RemoveCookie()
{
	setCookie(COOKIE_NAME,COOKIE_VALUE);
	
	if(getCookie(COOKIE_NAME) == null)
	{
		log.debug("!! Could not set the cookie " + COOKIE_NAME + " NOTE some browsers wont work with a local file");
		log.debug("you may need to run this test from a live server.");
		return JUAssert.fail();
	}
	
	removeCookie(COOKIE_NAME);
	
	return JUAssert.isNull(getCookie(COOKIE_NAME));
}

function test_SetPermCookie()
{
	var passed = false;
	
	setPermCookie(COOKIE_NAME,COOKIE_VALUE);
	
	if(getCookie(COOKIE_NAME) != null)
	{
		passed = true;
	}
	
	removeCookie(COOKIE_NAME);
	
	if(passed)
		return JUAssert.pass();
	else
		return JUAssert.fail();
}