/**
 * File: Util/Sort.js
 * Sort related objects
 * 
 * Copyright:
 * 	2004-2006 Rob Rohan (robrohan@gmail.com)
 */
if(!Sortie.Util) Sortie.Util = {};

if(!Sortie.Util.Sort) Sortie.Util.Sort = {};

/**
 * Class: QuickSort
 * Quick sort object
 *
 * Namespace:
 * 	Sortie.Util
 */
Sortie.Util.QuickSort = function() {
	
	/**
	 * Method: QuickSort.Sort
	 * Do a quick sort on an array. Note this operates on the array directly.
	 * Example usage
	 * (code)
	 * mysort.Sort(arry, 0, (arry.length-1) );
	 * (end code)
	 *
	 * Parameters:
	 * 	arry - the array to sort
	 * 	left - the left lower limit (call with 0 for whole array)
	 * 	right - the right upper limit (call with array.length for whole array)
	 */
	this.Sort = function(arry, left, right) {
		if(left < right) {
			var part = this.__qsort_split(arry, left, right);
			this.Sort(arry, left, part-1);
			this.Sort(arry, part+1, right);
		}
	};
	
	this.__qsort_split = function(arry, left, right) {
		var pivot, i, j, t;
		pivot = arry[left];
		i = left; 
		j = right+1;
			
		for(;;) {
			do ++i; while(arry[i] <= pivot && i <= right);
			do --j; while(arry[j] > pivot);
			
			if(i >= j)
				break;
			
			t = arry[i]; 
			arry[i] = arry[j]; 
			arry[j] = t;
		}
		
		t = arry[left]; 
		arry[left] = arry[j]; 
		arry[j] = t;
		
		return j;
	};
	
}

/////////////////////META DATA //////////////////////////////////////////////
/** 
 * Variable: Sortie.Util.Sort.VERSION 
 * 	the current version 
 */
Sortie.Util.Sort["VERSION"] = "0.5";
///////////////////////////////////////////////////////////////////////////
