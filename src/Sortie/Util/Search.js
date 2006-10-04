/**
 * File: Util/Search.js
 * Search related objects
 * 
 * Copyright:
 * 	2004-2006 Rob Rohan (robrohan@gmail.com)
 */

if(!Sortie.Util) Sortie.Util = {};

if(!Sortie.Util.Search) Sortie.Util.Search = {};

/**
 * Class: BinarySearch
 * Binary search object
 *
 * Namespace:
 * 	Sortie.Util
 */
Sortie.Util.BinarySearch = function() {
	
	/**
	 * Method: HitArea
	 * return class from binary search. This is used
	 * As a Class
	 */
	this.HitArea = function() {
		this.upper = 0;
		this.lower = 0;
		this.match = 0;
		
		this.toString = function() {
			return "Match: " + this.match + " Lower: " + this.lower + " Upper: " + this.upper;
		}
	};
	
	
	/**
	 * Method: BinarySearch.Search
	 * 
	 * Parameters:
	 * 	array - the array to search
	 * 	lower - the lower bound (0 when whole array)
	 * 	upper - the upper bound (array.len when whole array)
	 * 	key - what you're searching for
	 *
	 * Returns:
	 * 	HitArea
	 *
	 * See Also:
	 * <HitArea>
	 */
	this.Search = function(array, lower, upper, key) {
		for(;;) {
			var m = parseInt((lower + upper) >> 1);
			
			if(key < array[m]) {
				upper = m - 1;
			} else if(key > array[m]) {
				lower = m + 1;
			} else {
				ha = new this.HitArea();
				ha.upper = upper;
				ha.lower = lower
				ha.match = m;
				return ha;
			} if(lower > upper) {
				ha = new this.HitArea();
				ha.upper = upper;
				ha.lower = lower;
				ha.match = -1;
				return ha;
			}
		}
	}
}


/////////////////////META DATA //////////////////////////////////////////////
/** 
 * Variable: Sortie.Util.Search.VERSION 
 * 	the current version 
 */
Sortie.Util.Search["VERSION"] = "0.5";
///////////////////////////////////////////////////////////////////////////

