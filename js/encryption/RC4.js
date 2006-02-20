/**
 * Function: RC4
 * A function does RC4 encryption by using a key and the string.
 * Original source: http://www.4guysfromrolla.com/webtech/010100-1.shtml
 *
 * License:
 * 	
 * This library is part of the Common Function Library Project. An open source
 *	collection of UDF libraries designed for ColdFusion 5.0. For more information,
 *	please see the web site at		
 *		http://www.cflib.org
 *	This code may be used freely. 
 *	You may modify this code as you see fit, however, this header, and the header
 *	for the functions must remain intact.
 *	This code is provided as is.  We make no warranty or guarantee.  Use of this code is at your own risk.
 * 
 * @param strPwd 	 The key to use for encryption. (Required)
 * @param plaintxt 	 Text to encrypt. (Required)
 * @return Returns a string. 
 * @author Michael Krock (michael.krock@avv.com) 
 * @version 1, January 12, 2006 
 */
function RC4(strPwd, plaintxt) 
{
	var sbox = new Array();
	var key = new Array();
	var tempSwap = 0;
	var a = 0;
	var b = 0;
	var intLength = strPwd.length;
	var temp = 0;
	var i = 0;
	var j = 0;
	var k = 0;
	var cipherby = 0;
	var cipher = "";
	
	for(a=0; a <= 255; a++) 
	{	
		//key[a + 1] = asc( mid(strPwd,(a MOD intLength)+1,1) );
		//key[a + 1] = strPwd.charCodeAt( parseInt((a % intLength) + 1) );
		key[a] = strPwd.charCodeAt( parseInt((a % intLength)) );
		//alert(key[a]);
		//sbox[a + 1] = a;
		sbox[a] = a;
	}

	for(a=0; a <= 255; a++) 
	{	
		//b = (b + sbox[a + 1] + key[a + 1]) Mod 256;
		//b = parseInt( (b + sbox[a + 1] + key[a + 1]) % 256);
		b = parseInt( (b + sbox[a] + key[a]) % 256);
		//tempSwap = sbox[a + 1];
		//sbox[a + 1] = sbox[b + 1];
		//sbox[b + 1] = tempSwap; 
		tempSwap = sbox[a];
		sbox[a] = sbox[b];
		sbox[b] = tempSwap;    
	}

	for(a=1; a <= plaintxt.length; a++) 
	{	
		//i = (i + 1) mod 256;
		//i = (i + 1) % 256;
		i = (i) % 256;
		//j = (j + sbox[i + 1]) Mod 256;
		//j = parseInt((j + sbox[i + 1]) % 256);
		j = parseInt((j + sbox[i]) % 256);
		//temp = sbox[i + 1];
		//sbox[i + 1] = sbox[j + 1];
		//sbox[j + 1] = temp;
		temp = sbox[i];
		sbox[i] = sbox[j];
		sbox[j] = temp;
		//k = sbox[((sbox[i + 1] + sbox[j + 1]) mod 256) + 1];
		//k = sbox[( parseInt( (sbox[i + 1] + sbox[j + 1]) % 256 )) + 1];
		k = sbox[( parseInt( (sbox[i] + sbox[j]) % 256 ))];
		//cipherby = BitXor(asc(mid(plaintxt, a, 1)), k);
		cipherby =  plaintxt.charCodeAt(a) | k;
		//cipher = cipher & chr(cipherby);  		
		cipher += String.fromCharCode(cipherby);
	}
	return cipher;
}