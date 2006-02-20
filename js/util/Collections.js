/**
 * File: util/Collections.js
 * General collection objects modeled after java.util. Gives a Set, List, and Map object
 *
 * Copyright: 
 * 	2004 Rob Rohan robrohan@gmail.com All rights reserved
 */

/** 
 * Variable: COLLECTIONS_VERSION 
 * 	the current version 
 */
var COLLECTIONS_VERSION = "0.2";

/**
 * Class: Collection
 * Base object for the collections objects List and Set
 */
function Collection()
{
	this.avalues = new Array();
	this.asize = -1;
}

/**
 * Method: Collection.size
 * 	gets the size of this map object
 *
 * Return:
 * 	int the size of the collection
 */
Collection.prototype.size = function col_size()
{
	return this.asize + 1;
};

/**
 * Method: Collection.clear
 * Removes all of the elements from this list optional operation. 
 */
Collection.prototype.clear = function col_clear()
{
	this.avalues = new Array();
	this.asize = -1;
};
    
/**
 * Method: Collection.toArray
 * Returns an array containing all of the elements in this list in proper sequence.
 * 
 * Return: Object[]
 */
Collection.prototype.toArray = function col_toArray()
{
	return this.avalues;
};

/**
 * Method: Collection.contains
 * Returns true if this list contains the specified element.
 * 
 * Parameters: 
 *	o - the object to test for
 * 
 * Return: 
 *	boolean if the collection has the object o
 */
Collection.prototype.contains = function col_contains(o)
{
	if(this.indexOf(o) >= 0){
		return true;
	}
	return false;
};

/**
 * Method: Collection.indexOf
 * Returns the index in this list of the first occurrence of the specified 
 * element, or -1 if this list does not contain this element.
 * 
 * Parameters: 
 *	o - the object whoms index you would like to know
 *
 * Return:
 *	int the position of o in this collection
 */
Collection.prototype.indexOf = function col_indexOf(o)
{
	var l_x = 0;
	for(;l_x<this.size();l_x++){
		if(this.avalues[l_x] == o){
			return l_x;
		}
	}
	return -1;
};

/**
 * Method: Collection.isEmpty
 * Returns true if this list contains no elements.
 *
 * Return:
 *	boolean
 */	
Collection.prototype.isEmpty = function col_isEmpty()
{
	if(this.asize == -1)
		return true;
		
	return false;
};

/**
 * Method: Collection.lastIndexOf
 * Returns the index in this list of the last occurrence of the specified element, 
 * or -1 if this list does not contain this element.
 *
 * Parameter: 
 * 	o - the object to find
 *
 * Return:
 *	int the position of the object
 */
Collection.prototype.lastIndexOf = function col_lastIndexOf(o)
{
	var indx = -1;
	var l_x = 0;
	for(;l_x<this.size();l_x++)
	{
		if(this.avalues[l_x] == o)
		{
			indx = l_x;
		}
	}
	return indx;
};

/**
 * Method: Collection.get
 * Returns the element at the specified position in this list.
 * 
 * Parameters:
 * 	index - the index of the object you wish
 * 
 * Returns:
 *	Object
 */
Collection.prototype.get = function col_get(index)
{
	//log.debug("Col thinks size: " + this.size());
 	if(index > this.size() || index < 0)
 	{
		throw new Error(
			"Collection.get : index is > size or < 0 can't get element"
		);
	}
	return this.avalues[index];
}; 

/**
 * Method: Collection.remove
 * Removes the first occurrence in this list of the specified element (optional 
 * operation). 
 *
 * Parameter:
 * 	o - the object to remove
 *
 * Returns:
 *  boolean
 */
Collection.prototype.remove = function col_remove(o)
{
	var idx = this.indexOf(o);
	this.removeByIndex(idx);
};

/**
 * Method: Collection.removeByIndex
 * Removes the element at the specified position in this list (optional operation).
 * 
 * Parameters: 
 * 	index - the items index to remove
 *
 * Returns:
 * 	Object
 */
Collection.prototype.removeByIndex = function col_removeByIndex(index)
{
	if(index > this.asize)
		throw new Error("Collection.remove : index is > size can't remove element");
	//this is IE 5.5 and higher... write my own?
	this.avalues.splice(index, 1);
	this.asize--;
};

/**
 * Method: Collection.set
 * Replaces the element at the specified position in this list with the specified element 
 * (optional operation).
 *
 * Parameters:
 * 	index - which element to set
 *	element - the object put in the selected index
 */
Collection.prototype.set = function col_set(index, element)
{
	if(index > this.asize)
		throw new Error("Collection.set : index is > size can't set element");
	this.avalues[index] = element;
};

/**
 * Method: Collection.toString
 * Show the collection contents
 *
 * Returns:
 * 	this collection object in a printable string
 */
Collection.prototype.toString = function col_toString()
{
	var z=0;
	var str = "[";
	var con = "";
	
	if(this.isEmpty())
	{
		con = "empty";
	}
	else
	{
    		for(;z<this.size();z++)
    		{
    			con += this.avalues[z] + ",";
    		}
    		con = con.substring(con,con.length-1);
	}
	str += con + "]"
	return str;
};

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: List
 * A list of elements. More or less an array with search functions
 * An ordered collection (also known as a sequence). The user of this object
 * has precise control over where in the list each element is inserted. The user 
 * can access elements by their integer index (position in the list), and search for 
 * elements in the list. Extends Collection
 *
 * See Also: 
 * 	<Collection>
 */
function List()
{
    this.avalues = new Array();
    this.asize = -1;
}
List.prototype = new Collection();

/**
 * Method: List.add
 * Appends the specified element to the end of this list (optional operation).
 *
 * Parameters:
 * 	o - the object to add
 *
 * Returns: 
 * 	boolean
 */
List.prototype.add = function list_add(o)
{
	this.asize++;
	this.avalues[this.asize] = o;
};

/**
 * Method: List.toThinList
 * Turns this List (array backed) into a string list, or "thin list" using
 * sep as the separator
 *
 * Parameters: 
 * 	sep - what to use as the separator
 *
 * Returns: 
 * 	a string in thin list format
 */
List.prototype.toThinList = function list_toThinList(sep)
{
	return this.avalues.join(sep)
};

/**
 * Method: List.fromThinList
 * creates a list from a "thin list" list using separator sep
 *
 * Parameters:
 * 	list - the thin list object
 *	sep - what is used as the separator in the thin list
 */
List.prototype.fromThinList = function list_fromThinList(list,sep)
{
	this.avalues = list.split(sep);
	this.asize = this.avalues.length;
};

/**
 * Method: List.toString
 * Show the list contents
 *
 * Returns:
 * 	this list object in a printable string
 */
List.prototype.toString = function list_toString()
{
	var z=0;
	var str = "[";
	var con = "";
	
	if(this.isEmpty()){
		con = "empty";
	}else{
    		con = this.toThinList(",");
    		// for(;z<this.size();z++)
    		//{
    		//	con += this.avalues[z] + ",";
    		//}
    		//con = con.substring(con,con.length-1);
	}
	
	str += con + "]"
	
	return str;
};

/**
 * Method: List.toWSArray
 * This is kind of weak and not very expandable, but its only used when
 * this object is supposed to go to a web service and it requires the
 * gateway
 *
 * Parameters:
 * 	varname
 *	type
 *
 * Returns:
 * 	an xml fragment in a string
 */
List.prototype.toWSArray = function list_toWSArray(varname,type) 
{
	//xsi:type=\"" + type + "\" 
	var wsstr = "<" + varname;
	wsstr    += " xsi:type=\"soapenc:Array\" soapenc:arrayType=\"ns2:anyType["+this.size()+"]\">";
	
	for(v=0;v<this.size();v++)
	{
		wsstr += "<item xsi:type=\"ns2:string\">" + this.avalues[v].toString() + "</item>";
	}
	//soapxml	+= "<" + pname + " xsi:type=\"" + ptype + "\">" + pvalue + "</" + pname + "> ";
	//"<item xsi:type="ns2:string">item1</item>"
	wsstr    += "</" + varname + "> ";
	return wsstr;
};

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: Set
 * Set keeps a unique list of elements and wont allow nulls or
 * undefined values. Extends Collection
 *
 * See Also: 
 * 	<Collection>
 */
function Set()
{
    this.avalues = new Array();
    this.asize = -1;
}
Set.prototype = new Collection();

/**
 * Method: Set.add
 * Adds the specified element to this set if it is not already present optional operation.
 *
 * Returns:
 * 	boolean
 */	
Set.prototype.add = function set_add(o)
{
	if(!this.contains(o) && o != null && typeof o != "undefined")
	{
		this.asize++;
		this.avalues[this.asize] = o;
	}	
};

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: Map
 * Simple Map object with a lame seaching algorithm.
 */
function Map()
{
	this.aname = new Array();
	this.avalue = new Array();
	this.asize = -1;
};

/**
 * Method: Map.put
 * adds a name value pair
 *
 * Parameters: 
 * 	nkey - the object to use as the key
 * 	nvalue - the object to use as the value
 */
Map.prototype.put = function map_put(nkey,nvalue)
{
	//if this value is already in here
	//remove it
	if(this.contains(nkey)){
		//remove the old value
		this.remove(nkey);
	}
	//increase to add to the end
   	this.asize++;	
   	
	this.aname[this.asize]  = nkey;
   	this.avalue[this.asize] = nvalue;
};

/**
 * Method: Map.getKeysAsArray
 * gets all the keys from this map as an array
 *
 * Returns:
 * 	an array of the keys
 */
Map.prototype.getKeysAsArray = function map_getKeysAsArray(){
	return this.aname;
};

/**
 * Method: Map.get
 * Gets a value from a key
 *
 * Parameters:
 * 	keyname - the key for the object to get
 * 
 * Returns:
 * 	the value or null if not found
 */
Map.prototype.get = function map_get(keyname)
{
	var m_x = 0;
	for(; m_x<this.size(); m_x++){
		if(this.aname[m_x] == keyname){
			return this.avalue[m_x];
		}
	}
	return null
};
	
/**
 * Method: Map.remove
 * Removes the first occurrence in this map of the specified key
 *
 * Parameter:
 * 	key - the key to remove
 */
Map.prototype.remove = function map_remove(key)
{
	var idx = this.indexOf(key);
	this.removeByIndex(idx);
};

/**
 * Method: Map.contains
 * see if keyname is already in this map lame algorithm
 *
 * Parameters: 
 *	keyname - the key to check for
 *
 * Returns:
 * 	true if this map as the key
 */
Map.prototype.contains = function map_contains(keyname)
{
	var s = this.size();
	var m_i = 0;
	for(;m_i<s;m_i++){
		if(this.aname[m_i] == keyname){
			return true;
		}
	}
	
	return false;
};

/**
 * Method: Map.indexOf
 * Returns the index the key or -1 if this map does not contain the key
 *
 * Parameters:
 * 	key - the key to look for
 *
 * Returns:
 * 	the position or -1 if not found
 */
Map.prototype.indexOf = function map_indexOf(key)
{
	var l_x = 0;
	for(;l_x<this.size();l_x++){
		if(this.aname[l_x] == key){
			return l_x;
		}
	}
	
	return -1;
};

/**
 * Method: Map.removeByIndex
 * Removes the element at the specified position in this list (optional operation).
 */
Map.prototype.removeByIndex = function map_removeByIndex(index)
{
	if(index > this.asize)
		throw new Error(
			"Map remove index is > size can't remove key/value"
		);	
	//this is IE 5.5 and higher... write my own?
	this.aname.splice(index, 1);
	this.avalue.splice(index, 1);
	this.asize--;
};

/**
 * Method: Map.size
 * gets the size of this map object
 *
 * Returns:
 * 	The size of this map (number of name value pairs)
 */
Map.prototype.size = function map_size()
{
	return this.asize + 1;
};

/**
 * Method: Map.toWSStruct
 * Put this whole map, including sub maps, into a xml fragment to send to the web service
 *
 * Parameters:
 * 	varname
 * 	id
 * 	depth
 * 	
 * Returns:
 * 	xml fragment
 */
Map.prototype.toWSStruct = function map_toWSStruct(varname,id,depth)
{
	var frag = "<" + varname + " xsi:type=\"ns2:Map\" xmlns:ns2=\"http://xml.apache.org/xml-soap\">";
	frag += this.__recurse_map();
	frag += "</" + varname + ">";
	return frag;
};

/*
 * this is not an API call
 * this goes over each element and creates a "proper" soap map fragment for this map
 * This is kind of weak and not very expandable but it works 
 */
Map.prototype.__recurse_map = function()
{
	var wsstr = "";
	
	for(var z=0; z < this.aname.length; z++)
	{
		wsstr += "<item>";
		wsstr += "<key xsi:type=\"xsd:string\">" + this.aname[z].toString() + "</key>";
		
		if(this.avalue[z] == null || typeof this.avalue == undefined)
		{
			wsstr += "<value xsi:type=\"xsd:string\" />";
		}
		else if(this.avalue[z] instanceof Map)
		{
			wsstr += "<value xsi:type=\"ns2:Map\">"
			wsstr += this.avalue[z].__recurse_map();
			wsstr += "</value>"
		}
		else
		{
			wsstr += "<value xsi:type=\"xsd:string\">" + this.avalue[z].toString() + "</value>";
		}
		wsstr += "</item>";
	}
	return wsstr; 
}

/**
 * Method: Map.toString
 * the ol'toString
 *
 * Returns:
 * 	this map as a printable string
 */
Map.prototype.toString = function map_toString()
{
	var str = "[";
	
	if(this.size() > 0){
		var m_x=0;
    	for(;m_x<this.size();m_x++){
    		str += this.aname[m_x] + "=" + this.avalue[m_x] + ",";
    	}
    	//remove that last comma
    	str = str.substring(0,str.length -1);
    }else{
    	str += "empty"
    }
	str += "]";
	
	return str;
};