#!/bin/sh

# 1 = the directory where the js files live (the ones to combine)
# 2 = the new file name
# 3 = the copyright

ALL_JS_FILES=`find $1 -name "*.js"`
OUT_FILE=$2
COPYRIGHT=$3

cat $ALL_JS_FILES > "$1/$2_temp"

./jsmin < "$1/$2_temp" > "$1/$2" "$COPYRIGHT"

rm "$1/$2_temp"
