
Tests.test_BrowserMetaData = function() {
	
	log.debug("Testing Sortie.Util.Browser version: " + Sortie.Util.Browser["VERSION"]);
	
	try {
		log.debug("---------[ Browser Items ]-----------");
		log.debug("Safari:   " + Sortie.Util.Browser.Safari);
		log.debug("Gecko :   " + Sortie.Util.Browser.Gecko);
		log.debug("Explorer: " + Sortie.Util.Browser.Explorer);
		log.debug("Opera:    " + Sortie.Util.Browser.Opera);
		log.debug("Windows:  " + Sortie.Util.Browser.Windows);
		log.debug("Mac:      " + Sortie.Util.Browser.Mac);
		log.debug("Linux:    " + Sortie.Util.Browser.Linux);
		log.debug("Unix:     " + Sortie.Util.Browser.Unix);
		log.debug("---------[ Browser Items ]-----------");
		
		return JUAssert.pass();
	} catch (e) {
		return JUAssert.fail();
	}
}