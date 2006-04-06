/**
 * File: search/BinarySearch.js
 * 
 * Copyright:
 * 	2004 Rob Rohan (robrohan@gmail.com)
 *
 */

/**
 * used in the binary search 
 */
function HitArea()
{
	this.upper = 0;
	this.lower = 0;
	this.match = 0;
	
	this.toString = function()
	{
		return "Match: " + this.match + " Lower: " + this.lower + " Upper: " + this.upper;
	}
}

/**
 * Function: binarySearch
 * 
 * Parameters:
 *	array - the array to search
 *	lower - the lower bound (0 when whole array)
 * 	upper - the upper bound (array.len when whole array)
 * 	key - what you're searching for
 */
function binarySearch(array, lower, upper, key)
{
	for(;;)
	{
		var m = parseInt((lower + upper)/2);
		
		if(key < array[m])
		{
			upper = m - 1;
		}
		else if(key > array[m])
		{
			lower = m + 1;
		}
		else
		{
			ha = new HitArea();
			ha.upper = upper;
			ha.lower = lower
			ha.match = m;
			return ha;
		}
		if(lower > upper)
		{
			ha = new HitArea();
			ha.upper = upper;
			ha.lower = lower;
			ha.match = -1;
			return ha;
		}
	}
}