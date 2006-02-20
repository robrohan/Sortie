<cfcomponent displayname="thinarray">
<!---
	Copyright (C) 2001, 2002, 2003, 2004 Richard Applebaum
	
	Thin Arrays, somesuch and other delights!
	
	Many of the enclosed functions use a special format designed to efficiently pass information 
	between a CFMX program on the server and a JavaScript program on the client.  This special 
	format is called a "thin array".  it encapsulates the data and structure of a symmetric grid
	of rows and columns.  This grid, is often called a recordset, a query or a regular 
	(no missing cells) 2-dimensional array.
	
	A grid is a common format to transmit between a server and a client.  Normally, WDDX or XML
	are used in this exchange.  But they add significant overhead:
	
		- processing cycles to serialize a packet at the sender
		
		- verbose tags within the serialized packet to dinineate the data and structure of the grid.
		  (Often the number of tag charcters will be 2-5 times the number of actual data characters.
		  
		- processing cycles to deserialise the packet at the receiver
		
		The overhead is especially noticable on the client where an interpreted language (JavaScript)
		is used to parse the packet and build a representation of the grid.  JavaScript does not
		provide the ease nor elegance of processing "grids" that we are accustomed to with CFMX) on 
		the server.
		
		To avoid this overhead we have designed the concept of the "Thin ArraY"
				
		Consider the following query using the cfsnippets database supplied with CFMX.
		
    	<cfquery name="variables.employeesSelect" datasource="cfSnippets">
        SELECT EMP_ID,LASTNAME,FIRSTNAME,PHONE,DEPARTMENT,EMAIL FROM Employees
    	</cfquery>

			If we display the query Column Names and data in a table we see:
			
			EMP_ID  LASTNAME  	FIRSTNAME 	PHONE  					DEPARTMENT  				EMAIL
			1 			Peterson 		Carolynn 		(612) 832-7654 	Sales 							CPETERSON
			2 			Heartsdale 	Dave 				(612) 832-7201 	Accounting 					FHEARTSDALE
			3 			Stewart 		Linda 			(612) 832-7478 	Administration 			LSTEWART
			4 			Smith 			Aaron 			(612) 832-7201 	Accountingstration 	ASMITH
			5 			Barken 			Peter 			(612) 832-7023 	Engineeringation 		PBARKEN
			6 			Jennings 		Linda 			(612) 832-7026 	Engineering 				LJENNINGS
			7 			Jacobson 		Peter 			(612) 832-7652 	Sales 							PJACOBSON
			8 			Frankin 		Richard 		(612) 832-7672 	Sales 							RFRANKLIN
			9 			Smith 			Jenna 			(612) 832-7422 	Administration 			JSMITH
			10 			Manley 			Erica 			(612) 832-7657 	Sales 							EMANLEY
			11 			Cabrerra 		Francisco 	(612) 832-7041 	Engineering 				FCABRERRA
			12 			Leary 			Michelle 		(612) 832-7047 	Engineering 				MLEARY
			13 			Branden 		Dominique 	(612) 832-7049 	Accounting 					DBRANDEN
			14 			Reardon 		Walter 			(612) 832-7427 	Administration 			WREADON
			15 			Barnes 			David 			(612) 832-7615 	Sales 							DBARNES
		
		
		Examination shows that we have 16 rows (including the column names) and 6 columns of data.
		
		Another way of saying this is we have a symmetrical grid of 96 cells organized in 16 rows
		of 6 columns.
		
		Further examination shows that the total amount of data in our grid (including the column
		names) is 740 characters.
		
		If we wanted to send our grid to a client browser for display we could format it as an HTML
		table by enclosing each cell in:
		
		<td>...</td> tags, each row in <tr>...</tr> tags, and the entire grid in <table>...</table>
		tags.
		
		This formatting would add some formatting (and data transmission) overhead:
		
		   <table>...</table> .... 15 characters *  1 occurrence   =    15 characters
		   <tr>...</tr>...........  9 characters * 16 occurrences  =   144 characters
		   <td>...</td>...........  9 characters * 96 occurrences  =   864 characters
		   --------------------------------------------------------------------------
		                                                             1,023 characters
		                                                             
		Interesting... we have 740 characters of data, but to display it in a simple grid we need
		to add 1,023 characters of formatting data (HTML tags).  This results in a formatting
		overhead of 138%.
		
		Suppose we don't want to format the data, we just want to send it to the client where it
		will be processed by a JavaScript program (that we will write).  There are several ways to
		do this.  We can use CFMX's WDDX or XML commands to parse our complex data type (a query) 
		asnd serialize it into a simple string defining both the structure and content of the query.
		
		WDDX and XML (WDDX is, in fact, a subset of XML) add tags (much like HTML tags) to define the 
		structure and content of our query. However WDDX and XML tags tend to be much more verbose
		than HTML tags.
		
		Here's our query formatted (serialized) as a WDDX packet (edited for brevity and formatted for
		presentation):
		
			<wddxPacket version='1.0'>
				<header/>
				<data>
					<recordset rowCount='15' fieldNames='EMP_ID,LASTNAME,FIRSTNAME,PHONE,DEPARTMENT,EMAIL' type='coldfusion.sql.QueryTable'>
						<field name='EMP_ID'>
							<number>1.0</number>
							<number>2.0</number>
								*
								*
								*
							<number>14.0</number>
							<number>15.0</number>
						</field>
						<field name='LASTNAME'>
							<string>Peterson</string>
							<string>Heartsdale</string>
								*
								*
								*
							<string>Reardon</string>
							<string>Barnes</string>
						</field>
						<field name='FIRSTNAME'>
							<string>Carolynn</string>
							<string>Dave</string>
								*
								*
								*
							<string>Walter</string>
							<string>David</string>
							</field>
						<field name='PHONE'>
							<string>(612) 832-7654</string>
							<string>(612) 832-7201</string>
								*
								*
								*
							<string>(612) 832-7427</string>
							<string>(612) 832-7615</string>
						</field>
						<field name='DEPARTMENT'>
							<string>Sales</string>
							<string>Accounting</string>
								*
								*
								*
							<string>Administration</string>
							<string>Sales</string>
						</field>
						<field name='EMAIL'>
							<string>CPETERSON</string>
							<string>FHEARTSDALE</string>
								*
								*
								*
							<string>WREADON</string>
							<string>DBARNES</string>
						</field>
					</recordset>
				</data>
			</wddxPacket>


		Examination shows that the entire WDDX packet contains 2,631 characters (structure and data) or
		1,891 characters of formatting data (WDDX Tags) This is a formatting overhead of 256%

		If the WDDX structure (column by column instead of row by row) seems a little odd, it's because
		it is! But it is designed that way because it permits (reasonably) efficient serialization and
		deserialization by both CMX and JavaScript.
		
		It is far more natural to structure the data row by row where each row contains all the data for
		an employee.
		
		We can use CFMX to create an XML packet in a more natural order (again edited for brevity and 
		presentation):
				

			<?xml version="1.0" encoding="UTF-8"?>
				<employees name="employee list">
					<employee emp_id="1">
						<lastname>Peterson</lastname>
						<firstname>Carolynn</firstname>
						<phone>(612) 832-7654</phone>
						<department>Sales</department>
						<email>CPETERSON</email>
					</employee>
					<employee emp_id="2">
						<lastname>Heartsdale</lastname>
						<firstname>Dave</firstname>
						<phone>(612) 832-7201</phone>
						<department>Accounting</department>
						<email>FHEARTSDALE</email>
					</employee>
						 *
						 *
						 *
					<employee emp_id="14">
						<lastname>Reardon</lastname>
						<firstname>Walter</firstname>
						<phone>(612) 832-7427</phone>
						<department>Administration</department>
						<email>WREADON</email>
					</employee>
					<employee emp_id="15">
						<lastname>Barnes</lastname>
						<firstname>David</firstname>
						<phone>(612) 832-7615</phone>
						<department>Sales</department>
						<email>DBARNES</email>
					</employee>
				</employees>
	
		
		Our more readable XML packet takes 2,729 characters.  This is 1989 characters of formatting overhead
		or 269%.  With XML we have control of the content of the tags -- we chose to use the same tags as WDDX
		for comparison and readability.  
			
		WDDX and XML contain the complete definition and content of the data structure in a human-readable
		format.  This is especially useful for exchanging data where the structure is unknown (in advance)
		by the consumer of the data... it's all right there in the packet, which can be (realitively) easily
		read and understood by programs or humans.
	  
	  However, the overhead of WDDX and XML seems excessive when both sender and receiver (publisher and
	  consumer) of the data already know the structure of the data. In other words, if we both know that I
	  am sending you a 16 x 6 grid of data, why do I need to tell you anything about the structure -- I
	  could just send you the data.   Well, it's not quite that simple.  At the very least, we need to decide
	  on some field-separator character that does not appear in the data.  On some occasions, we may want to
	  exchange more (or fewer) rows of data.  Or, even exchange a different grid with a different number of
	  columns (and different column names).
	  
	  Isn't there some way that we can generalize this so we can efficiently exchange different grids of data?
	  the key word is grid...
	  
	  Enter the "Thin Array".  Given the fact that we are going to exchange grids containin r rows and c columns,
	  we have an implied structure.
				
		Here is the thin array representation of our grid:
		
		
		|  6 | Emp_ID | LastName | FirstName | Department | Phone | email | 1 | Peterson | Carolyn | Sales | (612) 832-7654 | CPETERSON | 2 | Smith | ......
	  ----------------------------------------------------------------------------------------------------------------------------------------------------
	  ^  ^      ^         ^          ^           ^          ^       ^     ^      ^          ^        ^           ^             ^        ^     ^       ^
	  |  |      |         |          |           |          |       |     !      !          !        !           !             !        |     |       |
	  |  |      +---------+----------+-----+-----+----------+-------+     +------+----------+-----+--+-----------+-------------+        +-----+-------+...
	  |  |                                 |                                                      |                     
	  |  |                                 |                                                      |      
	  |  |                       ----------+--------                                   ----------------------
	  |  |                        Grid Column Names                                      A Row of Grid Data
	  |  |                                                                           (information for 1 employee)
	  |  |
	  |  +--------- # of Columns in this Grid
	  !
	  !
	  +------- Unique Field Separator for this Grid - | (pipe) is the default
	  
	  
	  This is just a string repreesntation of a List with some special content:
	  
	  the first character denotes the field separator
	  
	  the first list element (after the field-separator) denotes the number of columns (c) in this grid
	  
	  the next c elements denote the column names (essentialy the first, or header row, of our grid)
	  
	  the next n elements (in groups of c columns) represent the rows of our grid.
	  
	  This is a "boostrapping" or self-defining format -- all we need to know is:
	  
	  --- The first character is the field-separator
	  --- The first field (as delineated by the field-separator) defines the number of rows...
	  
	  So, what does this do to our example grid of 740 data characters
	  
			A Thin Array representation would add the following formatting (and data transmission) overhead:
						
				Field-Separator designation ........ 1  Character  *  1 occurrence  =  1 character
		    Number of Columns designation ...... 1  Character  *  1 occurrence  =  1 character
		    Data Field-Separators............... 1  Character  * 96 ocurrences  = 96 characters
		    --------------------------------------------------------------------------
		                                                                          98 characters
		                                                                          
	  Now, that's more like it!  We have 740 characters of data.  We can define the format so we can 
	  efficiently exchange this data by adding only 98 characters (slightly more than 1 charecter per
	  field).  This is a formatting overhead of 13%.
	  
	  To summarize, exchanging 740 characters of data, the amount pf formatting data/overhead:
	  
	  	HTML Formatting........... 1,023 Characters..... Overhead..... 138%
	  	WDDX Formatting........... 1,891 Characters..... Overhead..... 256%
	  	XML Formatting............ 1,989 Characters..... Overhead..... 269%
	  	Thin Array Formatting.....    98 Characters..... Overhead.....  13%
	  	
	  So, given a regular grid of data, we can define (and exchange) the content and structure (much)
	  more efficiently than HTML WDDX or XML.
	  
	  We have sacrificed some (but not all) of the readability benefits of HTML and WDDX/XML.  
	  
	  "That's fine", you say, "But what about the overhead to serialize (at the server) and deserialize
	  (at the client)?".
	  
	  Here's some good news:  Serializing (or de-serializing) a Thin Array at the server takes fewer
	  cycles and memory than the equivalent WDDX or XML operation.
	  
	  Here's some "Great News!".  Deserializing (or serializing) a Thin Array at the client browser
	  (using JavaScript) takes "Significantly" less cycles and memory than the equivalent WDDX or XML
	  operation.
	   
	  Lets look at the deserialization process at the client browser.  Assume we have sent our grid in
	  the form of a WDDX packet to the browser.  It is deserialized to a a number of arrays that
	  represent each column of the grid. WDDX, when sending a packet to JavaScript on a browser, 
	  actually sends the JavaScript commands (with embedded data) to recreate (deserialize) the grid
	  on the browser (along with about 22K of JavaScript 
	  code to handle other client-side processing.
	  
	  Here is the specialized packet sent to JavaScript (edited for brevity and presentation):
	  
				// Use WDDX to move from CFML data to JavaScript
				qj = new WddxRecordset();
				col0 = new Array();
				col0[0] = 1;
				col0[1] = 2;
					*
					*
					*
				col0[13] = 14;
				col0[14] = 15;
				qj["emp_id"] = col0;
				col0 = null;
				col1 = new Array();
				col1[0] = "Peterson";
				col1[1] = "Heartsdale";
					*
					*
					*
				col1[13] = "Reardon";
				col1[14] = "Barnes";
				qj["lastname"] = col1;
				col1 = null;
				col2 = new Array();
				col2[0] = "Carolynn";
				col2[1] = "Dave";
					*
					*
					*
				col2[13] = "Walter";
				col2[14] = "David";
				qj["firstname"] = col2;
				col2 = null;
				col3 = new Array();
				col3[0] = "(612) 832-7654";
				col3[1] = "(612) 832-7201";
					*
					*
					*
				col3[13] = "(612) 832-7427";
				col3[14] = "(612) 832-7615";
				qj["phone"] = col3;
				col3 = null;
				col4 = new Array();
				col4[0] = "Sales";
				col4[1] = "Accounting";
					*
					*
					*
				col4[13] = "Administration";
				col4[14] = "Sales";
				qj["department"] = col4;
				col4 = null;
				col5 = new Array();
				col5[0] = "CPETERSON";
				col5[1] = "FHEARTSDALE";
					*
					*
					*
				col5[13] = "WREADON";
				col5[14] = "DBARNES";
				qj["email"] = col5;
				col5 = null;

		This code/data combo contain about the same number of characters as our WDDX packet.
		
		But quite a few processing cycles memory are consumed:
		
		   -- 6 arrays are created - 1 for each column in our grid
		   -- each array is populated with 15 assignment statement ( 1 for each row except the column names )
		   -- the column names are associated with the column arrays by creating populating a recordset 
		      (WDDX construct to represent the grid format)
		   -- each column array is copied to the WDDX recordset
		   -- each column array is cleared  
	  
	  In contrast, we use a single array (the Thin Array) to represent our grid.
	  
	  We create and populate the Thin array with a single command:
	  
	  		thinArray = thinList.split('|')
	  		
	  Similarly, we can serialize the Thin Array with the command:
	  
	  		thinList = ThinArray.join('|')  		
	  		
	  or more generally:
	  
	  		thinArray = thinList.substr(1).split(thinList.substr(0,1))
	  		
	  As a result of the split, we have an array of 97 cells (in our example).
	  
	  Ta Dah! we have serialized, transmitted and de-serialized our grid in a fraction of the time 
	  (bandwidth, browser cycles, whatever)... and it's all there!
	  
	  We can easily process our grid by row,column notation (calculated) or by absolute cell# notation
	  (more about this later).
	  
	  The first cell thinArray[0] contains the number 6 -- the number of columns in our grid.
	  
	  Next, cells thinArray[1] through thinArray[6] contain the column names.
	  
	  The next 6 cells thinArray[7] ... thinArray
	  
	  Other topics
	  
	  Sparse updates using Thin Arrays
	  
	  The Display component of Thin Arrays.
	  
	  Data synchronization between client(s) and the server.	  
--->

  <cffunction name="array2thinArray" returnType="string" output="no" access="public" >
  	<cfargument name="arrayName"    type="array"     required="true" />
  	<cfargument name="columnList"   type="string"    required="true" />
  	<cfargument name="separator"    type="string"   required="false" default="|" />
  	<cfargument name="startRow"  		type="numeric" 	required="false" default="1" />
  	<cfargument name="numberOfRows"	type="numeric"	required="false" default="-1" />
  	<cfset variables.columnList = ListChangeDelims(arguments.columnlist, arguments.separator) />
    <cfset variables.thinArray = arguments.separator & ListLen(arguments.columnList) & arguments.separator & variables.columnList &  arguments.separator />
	<cfloop index=theRow from=1 to=#ArrayLen(arguments.arrayName)#>
		<cfloop index=theColumn from=1 to=#ArrayLen(arguments.arrayName[1])#>
   			<cfset variables.thinArray = variables.thinArray & arguments.arrayName[theRow][theColumn] & arguments.separator />	
		</cfloop>
	</cfloop>
    <cfset variables.thinArray = Left(variables.thinArray, Len(variables.thinArray) - 1) />
    <cfreturn variables.thinArray />
  </cffunction>

  <cffunction name="query2thinArray" returnType="string" output="no" access="public" >
  	<cfargument name="queryName"		type="query"		required="true" />
  	<cfargument name="columnList"		type="string"		required="true" />
  	<cfargument name="separator"		type="string"		required="false" default="|" />
  	<cfargument name="startRow"  		type="numeric" 	required="false" default="1" />
  	<cfargument name="numberOfRows"	type="numeric"	required="false" default="-1" />
  	
 		<cfdump var=#arguments# />
  	<cfset variables.columnList   = ListChangeDelims(arguments.columnlist, arguments.separator) />
		<!--- We will return the column headers (row 0) plus the number of rows requested --->
    <cfset variables.thinArray    = arguments.separator & ListLen(arguments.columnList) & arguments.separator & variables.columnList />
		<!--- Compute the number of Rows to return --->
    <cfset variables.numberOfRows = arguments.queryName.recordCount />
    <cfif arguments.numberOfRows GT 0>
    	<cfset variables.numberOfRows = arguments.numberOfRows />
    </cfif>
		<!--- Compute the end Row to return --->
    <cfset variables.endRow        = -1 + arguments.startRow + variables.numberOfRows/>
    <cfif  variables.endRow GT arguments.queryName.recordCount>
    	<cfset variables.endRow      = arguments.queryName.recordCount />    
    </cfif>
		<cfdump var=#variables# />
    <cfloop index="variables.theRow" from=#arguments.startRow# to=#variables.endRow#>   
			<cfloop index="theColumn" list="#arguments.columnList#" >		
					<cfset variables.thinArray = variables.thinArray & arguments.separator & arguments.queryName[theColumn][variables.theRow] />
			</cfloop>
    </cfloop>
    <cfreturn variables.thinArray />
  </cffunction>

  <cffunction name="thinArray2query" returnType="query" output="yes" access="public" >
  	<cfargument name="thinArrayName"  type="string" required="true" />
	<cfset variables.separator = Left(arguments.thinArrayName, 1) />
  	<cfset variables.numberOfColumns = ListGetAt(arguments.thinArrayName, 1, variables.separator) />
  	<cfset variables.columnListEnd = 2 + variables.numberOfColumns - 1 />
  	<cfset variables.columnList = "" />
  	<cfloop index=theElement from=2 to=#variables.columnListEnd# >
  		<cfset variables.columnList = variables.columnList & ListGetAt(arguments.thinArrayName, theElement, variables.separator) & variables.separator />
  	</cfloop>
    <cfset variables.columnList = Left(variables.columnList, Len(variables.columnList) - 1) />
	<cfset variables.newQuery = QueryNew(ListChangeDelims(variables.columnList, ",", "|")) />
	<cfset variables.numberOfRows = (ListLen(arguments.thinArrayName, variables.separator) - variables.columnListEnd ) / ListLen(variables.columnList, variables.separator) />
	<cfset variables.theListElement = variables.columnListEnd />
	<cfloop index="theRow" from=1 to=#variables.numberOfRows# >
		<cfset variables.temp =QueryAddRow(variables.newQuery, 1) />
		<cfloop index="theColumn" list=#ListChangeDelims(variables.columnList, ",", "|")#>
			<cfset variables.theListElement = variables.theListElement + 1 />
			<cfset variables.temp = QuerySetCell(variables.newQuery, theColumn, ListGetAt(arguments.thinArrayName, variables.theListElement, variables.separator), theRow) />
		</cfloop>	
	</cfloop>
	    <cfreturn variables.newQuery />
  </cffunction>

</cfcomponent>
