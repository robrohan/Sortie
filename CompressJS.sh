#!/bin/sh

###########################################################################################
# CompressJS.sh
# Copyright 2005 Rob Rohan - All rights reserved.
#
# USAGE:
#
# This script removes NatrualDoc, single line comments, and whitespace from javascript files
# (excluding unix type newlines - makes DOS newlines unix newlines).
#
# The script, however, it is a bit raw and you must follow some rules to have the comments 
# and whitespace come out correctly. Any top level comments must be the /* form with [space]* 
# at the start of the line for every line (see example below). If you want the comment to 
# appear in the documenation use /** otherwise use /*.  
# For example:
#
# /*
#  * non-api
#  */
# var wont_show = true;
#
# /**
#  * Function: willShow()
#  */
# function willShow(){...}
#
# Within a function or method only // comments can be used and they must not start at 
# the begining of a line.
# for example:
#
# function willShow() 
# {	
# 		//this kind of comment is ok
#		var x=1;
# //this comment is not ok and will mess up your code
#		var z=2;		//this comment is ok
#
#		//this kind comment, again, is ok
#		if(x==1)	{
#			/* this will mess up your code don't use within the body of a function */
#			blarg = true	
#		}//this will mess the code up as well (special case)
# }
#
# While it may seem a bit limiting at first, it's better to have consistent comments, and the
# code size reduction is pretty significant.
#
# COMMAND LINE USAGE:
# 	CompressJS.sh <source_dir> <output_dir>
#
###########################################################################################
usage()
{
    echo "$0 <source_dir> <bin_dir>"
}

error_occurred()
{
    echo "Error: $1" 
    exit 1
}

compress_file()
{
    #$1 - input file
    #$2 - output file
    
    echo "Compressing: $1 into $2..."

    #pass 1 - remove most of the major javadoc comments and DOS end of lines if we
    #see any (if this line looks funny it's because of the ^M control character don't fix (or use
    # emacs to edit) ;) 
    cat $1 | sed 's/$//' | sed s/^[\ \	]*\\*.*?\*//g > $2_pass1

    #pass 2 - remove the / that that last one left behind
    cat $2_pass1 | sed s/[\ \	]*[^:]\\/\\/.*$//g > $2_pass2
    rm $2_pass1

    #pass 3 - remove single line comments
    cat $2_pass2 | sed s/^[\	]*\\/*$\//g | sed s/^[\ \	]*\\/[\\*]*//g > $2_pass3
    rm $2_pass2

    #delete BOTH leading and trailing whitespace from each line
    cat $2_pass3 | sed 's/^[\ \	]*//; s/[\ \	]*$//' | sed '/^[\ \	]*$/d' > $2_pass4
    rm $2_pass3

    #get everything that looks like an important line
    #cat $2_pass4 | grep "[(^*$){}]" > $2_pass5
    #rm $2_pass4

    mv $2_pass4 $2
    
    echo "Done."
}

compress_and_mkdir()
{
    for i in `ls $1`
    do
		FULL_FILE_SRC_PATH=`find . -name "$i"`
		
		#this is a bit lame, but the right way wasn't working in ant properly :-/
		cat $FULL_FILE_SRC_PATH > /dev/null 2>&1
		
		if [ $? != 0 ]; then
		    echo "Entering Directory $i..."
	
		    LC_CURRENT_DIR="$CURRENT_DIR/$i"
		    LC_CURRENT_BIN_DIR="$CURRENT_BIN_DIR/$i"
			
		    #make the bin dir if it's not there
		    if [ ! -d $LC_CURRENT_BIN_DIR ]; then
				mkdir $LC_CURRENT_BIN_DIR > /dev/null 2>&1
	
				if [ $? != 0 ]; then
				    error_occurred "Could not make bin directory $LC_CURRENT_BIN_DIR"
				fi
			fi
			compress_and_mkdir $LC_CURRENT_DIR $2/$i
		else
			if [ `echo $FULL_FILE_SRC_PATH | grep \.js` != "" ]; then
		   		echo "About to compress: $FULL_FILE_SRC_PATH -> $CURRENT_BIN_DIR/$2/$i"
		    		compress_file "$FULL_FILE_SRC_PATH" "$CURRENT_BIN_DIR/$2/$i"
		    	else
		    		echo "$FULL_FILE_SRC_PATH doesn't look like a javascript file"
		    fi
		fi
    done
}

CURRENT_DIR="$1"
CURRENT_BIN_DIR="$2"

if [ "$1" = "" ]; then
    usage
fi

compress_and_mkdir $1

exit 0
