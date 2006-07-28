/**
 * File: sort/QuickSort.js
 * 
 * Copyright:
 * 	2004 Rob Rohan (robrohan@gmail.com)
 */

/**
 * Function: qsort
 * Do a quick sort on an array. Note this operates on the array directly.
 * Example usage
 * (code)
 * qsort(arry, 0, (arry.length-1) );
 * (end code)
 *
 * Parameters:
 * 	arry - the array to sort
 * 	left - the left lower limit (call with 0 for whole array)
 * 	right - the right upper limit (call with array.length for whole array)
 */
function qsort(arry, left, right)
{
	if(left < right) 
	{
		var part = __qsort_split(arry, left, right);
		qsort(arry, left, part-1);
		qsort(arry, part+1, right);
	}
}

function __qsort_split(arry, left, right) 
{
	var pivot, i, j, t;
	pivot = arry[left];
	i = left; 
	j = right+1;
		
	while(1)
	{
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
}
