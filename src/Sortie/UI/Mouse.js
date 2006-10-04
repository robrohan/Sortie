/**
 * File: UI/Mouse.js
 * This library creates an object that can be used to track the current 
 * mouse position. This library creates and object called *Mouse* which is 
 * an instance of MouseImpl described here (meaning you'll probably never need
 * to make an instance of MouseImpl).
 *
 * (start code)
 *		em.AddMoveListener(
 *			function(e) {
 *				Sortie.UI.Mouse.SetCoords(e);
 *				window.status = "X: " + Sortie.UI.Mouse.X + " Y:" + Sortie.UI.Mouse.Y;
 *			}
 *		);
 * (end)
 * that will set the windows status to the X and Y position on every mouse move for example.
 *
 * Copyright: 
 * 	2005-2006 Rob Rohan (robrohan@gmail.com)
 */
if(!Sortie.UI) Sortie.UI = {};

/** 
 * Class: MouseImpl
 * Constructor for SystemMouse this holds the current mouse position on the 
 * screen in X and Y
 *
 * Namespace:
 * 	Sortie.UI
 */
Sortie.UI.MouseImpl = function() {
	this.X = 0;
	this.Y = 0;
	
	/**
	 * Method: MouseImpl.SetCoords
	 * gets the current mouse position and puts it into the MouseImpl object
	 *
	 * Parameters:
	 * 	e - the event
	 */
	this.SetCoords = function(e) {
		if(typeof(e.pageX) == 'number') {
			//NS 4, NS 6+, Mozilla 0.9+
			var xcoord = e.pageX;
			var ycoord = e.pageY;
		} else {
			if(typeof( e.clientX ) == 'number') {
				//IE, Opera, NS 6+, Mozilla 0.9+
				//except that NS 6+ and Mozilla 0.9+ did pageX ...
				var xcoord = e.clientX;
				var ycoord = e.clientY;
				
				//should this be in the sniffer?
				/* if(!((window.navigator.userAgent.indexOf( 'Opera' ) + 1 )
					|| (window.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) 
					|| window.navigator.vendor == 'KDE' ))
				{*/
					if(document.body && (document.body.scrollLeft || document.body.scrollTop)) {
						//IE 4, 5 & 6 (in non-standards compliant mode)
						xcoord += document.body.scrollLeft;
						ycoord += document.body.scrollTop;
					} else if(document.documentElement
						&& (document.documentElement.scrollLeft || document.documentElement.scrollTop))
					{
						//IE 6 (in standards compliant mode)
						xcoord += document.documentElement.scrollLeft;
						ycoord += document.documentElement.scrollTop;
					}
				//}
			} else {
				return;
			}
		}
		
		//populate the object
		this.X = xcoord;
		this.Y = ycoord;
	};
}

/**
 * Variable: Sortie.UI.Mouse 
 * An instance of MouseImpl for use in everyday code 
 */
Sortie.UI.Mouse = new Sortie.UI.MouseImpl();

/////////////////////META DATA //////////////////////////////////////////////
/** 
 * Variable: Sortie.UI.Mouse.VERSION 
 * 	the current version 
 */
Sortie.UI.Mouse["VERSION"] = "0.2";
///////////////////////////////////////////////////////////////////////////

