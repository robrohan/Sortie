

<cfcomponent name="DemoObject">
	
	<cffunction access="remote" returntype="string" name="getString">
		<cfreturn "The time is #Now()#" />
	</cffunction>
	
	<cffunction access="remote" returntype="numeric" name="getNumber">
		<cfset var n = 3 />
		<cfreturn n * n />
	</cffunction>
	
	<cffunction access="remote" returntype="date" name="getDate">
		<cfreturn now() />
	</cffunction>
	
	<cffunction access="remote" returntype="array" name="getArray">
		<cfset a = arrayNew(1)>
		<cfset a[1] = "hi there">
		<cfset a[2] = "from an array">
		
		<cfreturn a />
	</cffunction>
	
	<cffunction access="remote" returntype="array" name="getBoolean">
		<cfreturn true />
	</cffunction>
	
	<cffunction access="remote" returntype="struct" name="getMap">
		<cfset var s = structNew()>
		<cfset s["hi"] ="This is a map">
		<cfset s["com_number"] = getNumber() />
		<cfset s["lit_number"] = 42 />
		<cfset s["there"] = structNew()>
		<cfset s["there"]["neat"] = "aint that grand">
		<cfset s["there"]["com_number"] = getNumber() />
		<cfset s["there"]["lit_number"] = 42 />
		<cfset s["now"] = now() />
		
		<cfreturn s />
	</cffunction>
	
	<!--- /////////////////////////////////////////////////////////////////////// --->
	
	<cffunction access="remote" returntype="string" name="changeString">
	    <cfargument name="inputstr" type="string">
		<cfreturn inputstr & " server added booga!!" />
	</cffunction>
	
	<cffunction access="remote" returntype="array" name="changeArray">
	    <cfargument name="inputarr" type="array">
	    
	    <cfset arrayappend(inputarr,"I added this what do you think?") />
	    
		<cfreturn inputarr />
	</cffunction>
	
	<cffunction access="remote" returntype="struct" name="changeMap">
	    <cfargument name="inputmap" type="struct">
	    
	    <cfset inputmap["server_added"] = "howdy buck-a-roo" />
	    
		<cfreturn inputmap />
	</cffunction>
	
	<!--- /////////////////////////////////////////////////////////////////////// --->
	
	<cffunction access="remote" returntype="string" name="causeError">
	    <cfargument name="errarry" type="array">
	    
	    <cfset x = errarry[2]>
	    
		<cfreturn "should never get here..." />
	</cffunction>
	
	<cffunction access="remote" returntype="string" name="multiArg">
		<cfargument name="inmap" type="struct">
		<cfargument name="inarr" type="array">
		<cfargument name="instr" type="string">
		
		<cfreturn "Server got..." & inmap["inval"] & " and " & inarr[1] & " and " & instr />
	</cffunction>
	
	
</cfcomponent>