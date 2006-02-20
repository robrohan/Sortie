/**
 * File: util/ThinArray.js
 * The ThinArray is a special type of object that can be used to pass a query
 * back and forth from a server in a simple format.
 * The format looks like the following:
 *
 * (start code)
 * |3|COL1|COL2|COL3|data1|data2|data3
 * \_/\____________/\_______________...
 *  header  |              |
 *         columns        data ...
 * (end)
 * 
 * which is easy to produce and read
 *
 * Copyright: 
 * 	2004 Rob Rohan and Dick Applebaum (robrohan@gmail.com) All rights reserved
 *
 * Related:
 * 	io/collections.js
 */
if(typeof COLLECTIONS_VERSION == "undefined") {
	alert("Fatal Error: ThinArray is missing required libraries");
	throw new Error("thinarray.js missing required libraries");
}

/**
 * Variable: THINARRAY_VERSION 
 * 	the library version 
 */
var THINARRAY_VERSION = "0.1";

//this limits the column count to 99
var __THINARRAY__HEADEROFFSET = 2;

/**
 * Class: TARecord
 * A thin array record. These are normally gotten with a 
 * ThinArray.getRecord(num) call and they are *not* attached to
 * the thin array after creation. i.e. changes to a TARecord object
 * do not reflect in the original ThinArray.
 *
 * Parameters:
 * 	cols
 * 	vals
*/
function TARecord(cols,vals) 
{
	this.colnames = cols;
	this.values = vals;
	
	// patch by Barney Boisvert
	this.nameMapper = new Object();
	
	for (i in this.colnames) 
	{
		this.nameMapper[this.colnames[i]] = parseInt(i) + 1;
	}
}


/**
 * Method: TARecord.get
 * gets the value of a column in this row
 *
 * Parameters:
 * 	i - the column int position *or* string name
 * 	
 * Returns:
 * 	the value of that cell
 */
TARecord.prototype.get = function _tarec_get(i)
{
	if (typeof i == "string") 
	{
		i = this.nameMapper[i];
	}
	return this.values[i-1];
};	

/**
 * Method: TARecord.set
 * sets the value of a column in this row
 *
 * Parameters:
 * 	i - the column int position *or* string name
 *	value - the new value to set
 */
TARecord.prototype.set = function _tarec_set(i,value)
{
	if (typeof i == "string")
		i = this.nameMapper[i];
	this.values[i-1] = value;
};

/**
 * Method: TARecord.toArray
 * turns this record into a javascript array
 *
 * Returns:
 * 	this record (row) as an array
 */
TARecord.prototype.toArray = function _tarec_toArray()
{
	return this.values;
};

/**
 * Method: TARecord.toString
 * gets this record as a printable string
 *
 * Returns:
 * 	this record as a string
 */	
TARecord.prototype.toString = function _tarec_toString()
{
	var d="";
	for(var z=0;z<this.values.length;z++)
	{
		d += "[" + this.colnames[z] + "=" + this.values[z] + "] ";
	}
	
	return d;
};

/**
 * Class: ThinArray
 * This is the actual thin array object
 */
function ThinArray()
{
	this.a = new Array();
	/* for column name lookups */
	this.colnames = new Array();
	this.collen = 0;
	//you might want to change this to something a bit more obscure
	this.delim = "|";
};

/**
 * Method: ThinArray.fromPacket
 * <pre>
 * makes the thin array from a packet
 * |3|COL1|COL2|COL3|data1|data2|data3
 * \_/\____________/\_______________...
 *  header  |              |
 *         columns        data ...
 * </pre>
 * @param str the packet
 */
ThinArray.prototype.fromPacket = function _ta_fromPacket(str) 
{
	/* patch by Barney Boisvert cleans white space */
	str = str.replace(/^[ \t\n\r]+/, "").replace(/[ \t\n\r]+$/, "");
	
	this.delim = str.charAt(0); //str[0];
	
	this.a = str.split(this.delim);
	this.collen = parseInt(this.a[1]);
	this.colnames = this.getRecordAsArray(0);
};

/**
 * Method: ThinArray.toPacket
 * Makes this ThinArray a string ready to be 
 * transfered
 *
 * Returns:
 * 	this thinarray as a packet
 */
ThinArray.prototype.toPacket = function _ta_toPacket()
{
 	return this.a.join(this.delim);
};

/**
 * Method: ThinArray.getRecordAsArray
 * gets a record from this thin array updateds to the record do not effect the 
 * original
 *
 * Parameters:
 * 	i - the index of the record to get
 * 
 * Returns:
 * 	A record as an array
 */
ThinArray.prototype.getRecordAsArray = function _ta_getRecordAsArray(i)
{
	var na = new Array();
 		
 	var c = (i * this.collen) + __THINARRAY__HEADEROFFSET;
 	var cl = c + (this.collen - 1);
 	for(;c<=cl;c++){
 		na[na.length] = this.a[c];
 	}
 		
 	return na;
};

/**
 * Method: ThinArray.getCellValue
 * gets the value of a cell by row and column index. The indexes are 1 based
 *
 * Parameters:
 * 	r - the row (record) index of the cell's value you're after
 * 	c - the column index of the cell's value you're after
 */
ThinArray.prototype.getCellValue = function _ta_getCellValue(r,c)
{	
	var v = this.a[this.__getAbsPosition(r,c)];	
	return v;
};

/**
 * Method: ThinArray.getRecordCount
 * gets the number of records in this thinarray
 *
 * Returns
 * 	the number of records (rows) in this TA
 */
ThinArray.prototype.getRecordCount = function _ta_getRecordCount()
{
	var rawsize = this.a.length;
	rawsize -= __THINARRAY__HEADEROFFSET;
	//-1 for the column headers
	return (rawsize / this.collen) - 1;
};

/**
 * Method: ThinArray.setCellValue
 * Sets the value of a cell. Changes the original
 *
 * Parameters:
 *	r - the row to change
 * 	c - the column to change
 * 	value - the new value
 */
ThinArray.prototype.setCellValue = function _ta_setCellValue(r,c,value)
{
	this.a[this.__getAbsPosition(r,c)] = value;
};

/**
 * Method: ThinArray.getRecord
 * Breaks off part of the thin array as a record object. updates to the record do 
 * not effect this object
 *
 * Parameters:
 *	i - the record to get
 * 
 * Returns:
 *	a new TARecord object
 */
ThinArray.prototype.getRecord = function _ta_getRecord(i)
{
	return new TARecord(
		this.__copy(this.colnames), 
		this.getRecordAsArray(i)
	);
};

/**
 * Method: ThinArray.__getAbsPosition
 * not an API call - get the abs position in the flat array
 *
 * Parameters:
 * 	r - row
 * 	c - column
 *
 * Returns:
 *	int the abs position
 */
ThinArray.prototype.__getAbsPosition = function _ta___getAbsPosition(r,c)
{
	var row = (r * this.collen) + __THINARRAY__HEADEROFFSET;
	var rcol = row + (c - 1);
	
	return rcol;
};

/**
 * Method: ThinArray.__copy
 * This should be part of some base object... *not* and API call of TA
 * Parameters: 
 * 	obj 
 *
 * Returns:
 * 	a copy of whatever was passed in
 */
ThinArray.prototype.__copy = function _ta___copy(obj)
{
	var cp = new Object();
	for(var z in obj){
		cp[z] = obj[z];
	}
	return cp;
};

/**
 * Method: ThinArray.toString
 * this thinarray as a printable string
 *
 * Returns:
 * 	this thinarray as a string
 */
ThinArray.prototype.toString = function _ta_toString()
{
	var str = "";
	if(this.colnames.length > 0)
	{
		str = this.colnames + "<br>";
		str += "---------------------------------------<br>";
		for(var z=1;z<=this.getRecordCount();z++)
		{
			str += this.getRecordAsArray(z) + "<br>";
		}
	}
	return str;
};
