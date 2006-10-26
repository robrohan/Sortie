                      
                         ____         __  _    
                        / __/__  ____/ /_(_)__ 
                       _\ \/ _ \/ __/ __/ / -_)
                      /___/\___/_/  \__/_/\__/ 
                      
                     http://sortie.robrohan.com/
             Copyright 2004-2006 Rob Rohan - Barney Boisvert
                          All Rights Reserved

Sortie is a set of javascript libraries that provide a common interface between 
browsers and javascript libraries. While Sortie itself has built in libraries 
(such as XMLHttpRequest wrappers and some UI functions), it's goal is to allow 
the use of any libraries. Meaning you could use Spry widgets or Yahoo! widgets 
or fragments of the Dojo framework from within the same application. The 
interaction and inclusion of the libraries being control by Sortie.

To use the libraries, unzip the the archive and put it into a web accessible 
directory and include them on your pages. See the demos and documentation for 
usage.

Directory breakdown:

readme.txt      = this file.
doc/            = when the Ant doc target is run this is where the documentation
                  output will be
src/            = the Sorite library tree - copy this folder to your test 
                  server
bin/            = the compressed Sortie tree - same as the src direcotry only 
                  compressed (you'll want to use this in production)
tests/          = unit tests
jsmin.c         = the C program to compress the libraries
CompressJS.sh   = a shell script to compress the source tree
CombineJS.sh    = a shell script to combine the whole compressed source tree 
                  into a single file