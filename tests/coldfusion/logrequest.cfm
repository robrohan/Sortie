
<cffile file="#ExpandPath('.')#output.txt" action="write"
	output="#GetHttpRequestData().content#"
	addnewline="true"
>