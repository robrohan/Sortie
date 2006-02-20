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
 * Array A, int Lb, int Ub, int Key
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

////////////////////////////////////////////////////////////////////////
