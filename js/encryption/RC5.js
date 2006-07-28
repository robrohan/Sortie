/*!
@header rc5.js
This file provides rc5 encryption - it is not implemented
@copyright Copyright 2004 Rob Rohan (robrohan\@gmail.com) All rights reserved
@updated 2005-01-27
*/

function rc5() {
	/* word size in bits */
	this.w = 32;
	/* number of rounds */
	this.r = 12;
	/* number of bytes in key */
	this.b =  8;
	/* number  words in key = ceil(8*b/w)*/
	this.c =  2;
	/* size of table S = 2*(r+1) words   */
	this.t = 26;
	
	this.ROTL = function(x,y)
	{
		return (((x)<<(y)) | (x)>>>(w-(y)));
	}

	this.ROTR = function(x,y)
	{
		return ((x)>>>(y) | (x)<<(w-(y)));
	}
	
	
	this.keySize = function()
	{
		return this.b;
	}
	
	this.encrypt = function(pt)
	{
	
	}
		
	this.decrypt = function(In[],Out[],Key[])
	{
    	var a,b,c,d;
    	
    	a = In[0];
		b = In[1];
    	
    	for(int i=ROUNDS; i>0; i--)
    	{
			b = (char)(ROTR(b-Key[2*i+1],a)^a);
			a = (char)(ROTR(a-Key[2*i],b)^b);
		}
		
		Out[1] = (char)(b-Key[1]);
		Out[0] = (char)(a-Key[0]);
	}

	this.setTestKey = function()
	{
		key = new Array();
        key[0] = 0x82;
        key[1] = 0xe5;
        key[2] = 0x1b;
        key[3] = 0x9f;
        key[4] = 0x9c;
        key[5] = 0xc7;
        key[6] = 0x18;
        key[7] = 0xf9;
        
        this.setup(key);
	}

	this.test = function()
	{
		var ct = 0x496def29b74be041;
    	var iv = 0xc41f78c1f839a5d9;
    	return this.decrypt(ct) ^ iv;
	}
}
