/**
 * File: Util/Collections.js
 * General collection objects modeled after java.util. Gives a Set, List, and Map object
 *
 * Copyright: 
 * 	2004 Rob Rohan robrohan@gmail.com All rights reserved
 */

if(!Sortie.Util) Sortie.Util = {};

/**
 * Namespace: Sortie.Util.Collections
 */
if(!Sortie.Util.Collections) Sortie.Util.Collections = {};

/**
 * Class: Sortie.Util.Collection
 * Base object for the collections objects List and Set
 */
Sortie.Util.Collection = function() {
	this.avalues = new Array();
	this.asize = -1;
	
	
	/**
	 * Method: Sortie.Util.Collection.Size
	 * 	gets the size of this map object
	 *
	 * Return:
	 * 	int the size of the collection
	 */
	this.Size = function() {
		return this.asize + 1;
	};
	
	/**
	 * Method: Sortie.Util.Collection.Clear
	 * Removes all of the elements from this list optional operation. 
	 */
	this.Clear = function() {
		this.avalues = null;
		this.avalues = new Array();
		this.asize = -1;
	};
	
	/**
	 * Method: Sortie.Util.Collection.ToArray
	 * Returns an array containing all of the elements in this list in proper sequence.
	 * 
	 * Return: Object[]
	 */
	this.ToArray = function() {
		return this.avalues;
	};
	
	/**
	 * Method: Sortie.Util.Collection.Contains
	 * Returns true if this list contains the specified element.
	 * 
	 * Parameters: 
	 *	o - the object to test for
	 * 
	 * Return: 
	 *	boolean if the collection has the object o
	 */
	this.Contains = function(o) {
		if(this.IndexOf(o) >= 0){
			return true;
		}
		return false;
	};
	
	/**
	 * Method: Sortie.Util.Collection.IndexOf
	 * Returns the index in this list of the first occurrence of the specified 
	 * element, or -1 if this list does not contain this element.
	 * 
	 * Parameters: 
	 *	o - the object whoms index you would like to know
	 *
	 * Return:
	 *	int the position of o in this collection
	 */
	this.IndexOf = function(o) {
		var l_x = 0;
		for(;l_x<this.Size();l_x++){
			if(this.avalues[l_x] == o){
				return l_x;
			}
		}
		return -1;
	};
	
	/**
	 * Method: Sortie.Util.Collection.IsEmpty
	 * Returns true if this list contains no elements.
	 *
	 * Return:
	 *	boolean
	 */	
	this.IsEmpty = function() {
		if(this.asize == -1)
			return true;
			
		return false;
	};
	
	/**
	 * Method: Sortie.Util.Collection.LastIndexOf
	 * Returns the index in this list of the last occurrence of the specified element, 
	 * or -1 if this list does not contain this element.
	 *
	 * Parameter: 
	 * 	o - the object to find
	 *
	 * Return:
	 *	int the position of the object
	 */
	this.LastIndexOf = function(o) {
		var indx = -1;
		var l_x = 0;
		for(;l_x<this.Size();l_x++) {
			if(this.avalues[l_x] == o) {
				indx = l_x;
			}
		}
		return indx;
	};
	
	/**
	 * Method: Sortie.Util.Collection.Get
	 * Returns the element at the specified position in this list.
	 * 
	 * Parameters:
	 * 	index - the index of the object you wish
	 * 
	 * Returns:
	 *	Object
	 */
	this.Get = function(index) {
		//log.debug("Col thinks size: " + this.size());
		if(index > this.Size() || index < 0) {
			throw new Error(
				"Collection.get : index is > size or < 0 can't get element"
			);
		}
		return this.avalues[index];
	};
	
	/**
	 * Method: Sortie.Util.Collection.Remove
	 * Removes the first occurrence in this list of the specified element (optional 
	 * operation). 
	 *
	 * Parameter:
	 * 	o - the object to remove
	 *
	 * Returns:
	 *  boolean
	 */
	this.Remove = function(o) {
		var idx = this.IndexOf(o);
		this.RemoveByIndex(idx);
	};
	
	/**
	 * Method: Sortie.Util.Collection.RemoveByIndex
	 * Removes the element at the specified position in this list (optional operation).
	 * 
	 * Parameters: 
	 * 	index - the items index to remove
	 *
	 * Returns:
	 * 	Object
	 */
	this.RemoveByIndex = function(index) {
		if(index > this.asize)
			throw new Error("Collection.remove : index is > size can't remove element");
		//this is IE 5.5 and higher... write my own?
		this.avalues.splice(index, 1);
		this.asize--;
	};
	
	/**
	 * Method: Sortie.Util.Collection.Set
	 * Replaces the element at the specified position in this list with the specified element 
	 * (optional operation).
	 *
	 * Parameters:
	 * 	index - which element to set
	 *	element - the object put in the selected index
	 */
	this.Set = function(index, element) {
		if(index > this.asize)
			throw new Error("Collection.set : index is > size can't set element");
		this.avalues[index] = element;
	};
	
	/**
	 * Method: Sortie.Util.Collection.ToString
	 * Show the collection contents
	 *
	 * Returns:
	 * 	this collection object in a printable string
	 */
	this.ToString = function() {
		var z=0;
		var str = "[";
		var con = "";
		
		if(this.IsEmpty()) {
			con = "Empty";
		} else {
			for(;z<this.Size();z++) {
				con += this.avalues[z] + ",";
			}
			con = con.substring(con,con.length-1);
		}
		str += con + "]"
		return str;
	};
}

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: Sortie.Util.List
 * A list of elements. More or less an array with search functions
 * An ordered collection (also known as a sequence). The user of this object
 * has precise control over where in the list each element is inserted. The user 
 * can access elements by their integer index (position in the list), and search for 
 * elements in the list. Extends Collection
 *
 * See Also: 
 * 	<Collection>
 */
Sortie.Util.List = function() {
	this.avalues = new Array();
	this.asize = -1;
	
	/**
	 * Method: Sortie.Util.List.Add
	 * Appends the specified element to the end of this list (optional operation).
	 *
	 * Parameters:
	 * 	o - the object to add
	 *
	 * Returns: 
	 * 	boolean
	 */
	this.Add = function(o) {
		this.asize++;
		this.avalues[this.asize] = o;
	};
	
	/**
	 * Method: Sortie.Util.List.ToThinList
	 * Turns this List (array backed) into a string list, or "thin list" using
	 * sep as the separator
	 *
	 * Parameters: 
	 * 	sep - what to use as the separator
	 *
	 * Returns: 
	 * 	a string in thin list format
	 */
	this.ToThinList = function(sep) {
		return this.avalues.join(sep)
	};
	
	/**
	 * Method: Sortie.Util.List.FromThinList
	 * creates a list from a "thin list" list using separator sep
	 *
	 * Parameters:
	 * 	list - the thin list object
	 *	sep - what is used as the separator in the thin list
	 */
	this.FromThinList = function(list,sep) {
		this.avalues = null;
		this.avalues = list.split(sep);
		this.asize = this.avalues.length-1;
	};
	
	/**
	 * Method: Sortie.Util.List.ToString
	 * Show the list contents
	 *
	 * Returns:
	 * 	this list object in a printable string
	 */
	this.ToString = function() {
		var z=0;
		var str = "[";
		var con = "";
		
		if(this.IsEmpty()) {
			con = "empty";
		}else{
			con = this.ToThinList(",");
		}
		
		str += con + "]"
		
		return str;
	};
	
		
	/**
	 * Method: Sortie.Util.List.ToWSArray
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
	this.ToWSArray = function(varname,type) {
		//xsi:type=\"" + type + "\" 
		var wsstr = "<" + varname;
		wsstr += " xsi:type=\"soapenc:Array\" soapenc:arrayType=\"ns2:anyType["+this.Size()+"]\">";
		
		for(v=0;v<this.Size();v++) {
			wsstr += "<item xsi:type=\"ns2:string\">" + this.avalues[v].toString() + "</item>";
		}
		//soapxml	+= "<" + pname + " xsi:type=\"" + ptype + "\">" + pvalue + "</" + pname + "> ";
		//"<item xsi:type="ns2:string">item1</item>"
		wsstr += "</" + varname + "> ";
		return wsstr;
	};
}
Sortie.Util.List.prototype = new Sortie.Util.Collection();

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: Sortie.Util.Set
 * Set keeps a unique list of elements and wont allow nulls or
 * undefined values. Extends Collection
 *
 * See Also: 
 * 	<Collection>
 */
Sortie.Util.Set = function()
{
	this.avalues = new Array();
	this.asize = -1;
	
	/**
	 * Method: Sortie.Util.Set.Add
	 * Adds the specified element to this set if it is not already present optional operation.
	 *
	 * Returns:
	 * 	boolean
	 */	
	this.Add = function(o) {
		if(!this.Contains(o) && o != null && typeof o != "undefined") {
			this.asize++;
			this.avalues[this.asize] = o;
		}
	};
}
Sortie.Util.Set.prototype = new Sortie.Util.Collection();

/////////////////////////////////////////////////////////////////////////////////////

/**
 * Class: Map
 * Simple Map object with a lame seaching algorithm.
 */
Sortie.Util.Map = function()
{
	this.aname = new Array();
	this.avalue = new Array();
	this.asize = -1;
	
	/**
	 * Method: Map.put
	 * adds a name value pair
	 *
	 * Parameters: 
	 * 	nkey - the object to use as the key
	 * 	nvalue - the object to use as the value
	 */
	this.Put = function(nkey,nvalue) {
		//if this value is already in here
		//remove it
		if(this.Contains(nkey)) {
			//remove the old value
			this.Remove(nkey);
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
	this.GetKeysAsArray = function() {
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
	this.Get = function(keyname) {
		var m_x = 0;
		for(; m_x<this.Size(); m_x++){
			if(this.aname[m_x] == keyname){
				return this.avalue[m_x];
			}
		}
		return null;
	};
	
	/**
	 * Method: Map.remove
	 * Removes the first occurrence in this map of the specified key
	 *
	 * Parameter:
	 * 	key - the key to remove
	 */
	this.Remove = function(key) {
		var idx = this.IndexOf(key);
		this.RemoveByIndex(idx);
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
	this.Contains = function(keyname) {
		var s = this.Size();
		var m_i = 0;
		for(;m_i<s;m_i++){
			if(this.aname[m_i] == keyname){
				return true;
			}
		}
		
		return false;
	};
	
	/**
	 * Method: Map.containsNoCase
	 * see if keyname is already in this map ignoring case
	 *
	 * Parameters: 
	 *	keyname - the key to check for
	 *
	 * Returns:
	 * 	true if this map as the key
	 */
	this.ContainsNoCase = function(keyname) {
		var s = this.Size();
		var m_i = 0;
		for(;m_i<s;m_i++) {
			var re = new RegExp(this.aname[m_i],"i");
			var a = keyname.match(re);
			if(a != null && a.length > 0) {
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
	this.IndexOf = function(key) {
		var l_x = 0;
		for(;l_x<this.Size();l_x++){
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
	this.RemoveByIndex = function(index) {
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
	this.Size = function(){
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
	this.ToWSStruct = function(varname,id,depth)
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
	this.__recurse_map = function() {
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
	};
	
	
	/**
	 * Method: Map.toString
	 * the ol'toString
	 *
	 * Returns:
	 * 	this map as a printable string
	 */
	this.ToString = function() {
		var str = "[";
		
		if(this.Size() > 0){
			var m_x=0;
			for(;m_x<this.Size();m_x++) {
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
};


/////////////////////META DATA //////////////////////////////////////////////
/** 
 * Variable: Sortie.Util.Collections.VERSION 
 * 	the current version 
 */
Sortie.Util.Collections["VERSION"] = "0.2";
///////////////////////////////////////////////////////////////////////////
