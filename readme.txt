 _   _                                                          
| \ | |                                                         
|  \| | ___ _   _ _ __ ___  _ __ ___   __ _ _ __   ___ ___ _ __ 
| . ` |/ _ \ | | | '__/ _ \| '_ ` _ \ / _` | '_ \ / __/ _ \ '__|
| |\  |  __/ |_| | | | (_) | | | | | | (_| | | | | (_|  __/ |   
|_| \_|\___|\__,_|_|  \___/|_| |_| |_|\__,_|_| |_|\___\___|_|   
 - http://www.robrohan.com/projects/neuromancer/ -
 - Copyright 2004-2006 Rob Rohan - Richard Applebaum - Barney Boisvert -

Neuromancer is a set of javascript libraries that provide a common interface between 
browsers and allow for javascript remoting.

To use the libraries, unzip the the archive and put it into a web accessible 
directory and include them on your pages. See the demos and documentation for usage.

Directory breakdown:

readme.txt		= this file.
doc/				= when the Ant doc target is run this is where the output will be
js/				= the Neruomancer library tree - copy this folder to your test 
					server
bin/				= the compressed neuromancer tree - same as the js direcotry only 
					compressed (you'll want to use this in production)
tests/			= unit tests of sorts to make sure nothing gets broken when coding 
					the libs
jsmin.c 			= the C program to compress the libraries
CompressJS.sh	= a shell script to compress the source tree
      