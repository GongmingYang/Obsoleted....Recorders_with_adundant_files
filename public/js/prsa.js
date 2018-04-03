/**
 * User: ygm
 * Date: 6/20/2016
 * Time: 7:05 PM
 */
////////////////////////////////////////////////////////////////////////////////////////////
// Prsa
////////////////////////////////////////////////////////////////////////////////////////////
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['exports'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // Node, CommonJS-like
        factory(module.exports);
    } else {
        factory(root);
    }
})(this, function (exports)
{
////////////////////////////////////////////////////////////////////////////////////////////
// Js for encryption
////////////////////////////////////////////////////////////////////////////////////////////
//

var str_password='2345678ABDEFGHJLMNPQRTYabdefghjmnpqrsty';/** 39 remove confusing chars like lI1 oO wW Uu Vv Kk**/
var str_url_base64 ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$%=";//$ 36,%37
var url_base64_map = [62, 63, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

var str_url_base64_std ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";//$ 36,%37
var url_base64_map_std = [-1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

var str_url_base64_m2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
var url_base64_map_m2 = [62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

// add pad pks7
    function pad_add(textBytes, block_size) {
        var plen = block_size - (textBytes.length % block_size);
        for (var i = 0; i < plen; i++) {
            textBytes.push(plen);
        }
        return textBytes;

    }

// del pad pks7
    function pad_del(textBytes, block_size) {
        var plen = textBytes[textBytes.length - 1];
        for (var i = 0; i < plen; i++) {
            textBytes.pop();
        }
        return textBytes;

    }

//aes encrypt the input text_str is utf16 string.
    function aes_utf8_128_encript_cbc(key, text_str) {
        // var block_size = 16;
        var block_size = 32;
        var text64 = str_sha256(key);
        var a_key = str_to_bytes_array(text64.substr(0, block_size));
        var a_iv = str_to_bytes_array(text64.substr(0, block_size));


        //var textBytes = aesjs.util.convertStringToBytes(text_str,'utf8');
        var textBytes = str_to_bytes_array(text_str);
        textBytes = pad_add(textBytes, block_size);

        var aesCbc = new aesjs.ModeOfOperation.cbc(a_key, a_iv);
        var encryptedBytes = aesCbc.encrypt(textBytes);

        return bytes_array_to_str(encryptedBytes);
//        return  aesjs.util.convertBytesToString(encryptedBytes);

    }

//aes decrypt withi compatible with prsa.php
    function aes_utf8_128_decript_cbc(key, text_str) {
        var block_size = 16;
        var text64 = str_sha256(key);
        var a_key = str_to_bytes_array(text64.substr(0, block_size));
        var a_iv = str_to_bytes_array(text64.substr(0, block_size));


        var aesCbc = new aesjs.ModeOfOperation.cbc(a_key, a_iv);


//        var textBytes = aesjs.util.convertStringToBytes(text_str,'utf8');
        var textBytes = str_to_bytes_array(text_str);

        var decryptedBytes = aesCbc.decrypt(textBytes);
        decryptedBytes = pad_del(decryptedBytes, block_size);

        return bytes_array_to_str(decryptedBytes);

//        return  aesjs.util.convertBytesToString(decryptedBytes);
    }


//aes encrypt withi compatible with prsa.php
    function prsa_aes_128_encript_cbc(key, text_str) {
        var block_size = 16;
        var text64 = str_sha256(key);
        var a_key = str_to_bytes_array(text64.substr(0, block_size));
        var a_iv = str_to_bytes_array(text64.substr(0, block_size));


        //var textBytes = aesjs.util.convertStringToBytes(text_str,'utf8');
        var textBytes = str_to_bytes_array(text_str);
        textBytes = pad_add(textBytes, block_size);

        var aesCbc = new aesjs.ModeOfOperation.cbc(a_key, a_iv);
        var encryptedBytes = aesCbc.encrypt(textBytes);

        return bytes_array_to_str(encryptedBytes);
//        return  aesjs.util.convertBytesToString(encryptedBytes);

    }

//aes decrypt withi compatible with prsa.php
    function prsa_aes_128_decript_cbc(key, text_str) {
        var block_size = 16;
        var text64 = str_sha256(key);
        var a_key = str_to_bytes_array(text64.substr(0, block_size));
        var a_iv = str_to_bytes_array(text64.substr(0, block_size));


        var aesCbc = new aesjs.ModeOfOperation.cbc(a_key, a_iv);


//        var textBytes = aesjs.util.convertStringToBytes(text_str,'utf8');
        var textBytes = str_to_bytes_array(text_str);

        var decryptedBytes = aesCbc.decrypt(textBytes);
        decryptedBytes = pad_del(decryptedBytes, block_size);

        return bytes_array_to_str(decryptedBytes);

//        return  aesjs.util.convertBytesToString(decryptedBytes);
    }


// this is byte string only.
    function prsa_base64_encode(in_str,str_map) {
        var base64_map;
        if(str_map && str_map=='url') {
            base64_map = str_url_base64;
        }else{
            base64_map = str_url_base64_std;
        }
        //get away utf8, stay away from ++ or -- .
        var o = "";
        var c1, c2, c3, e1, e2, e3, e4;

        for (var i = 0; i < in_str.length; i += 3) {
            c1 = in_str.charCodeAt(i + 0);
            c2 = in_str.charCodeAt(i + 1);
            c3 = in_str.charCodeAt(i + 2);
            e1 = c1 >> 2; //first  6 bits
            e2 = (c1 & 3) << 4 | c2 >> 4; // second 6 bits
            e3 = (c2 & 15) << 2 | c3 >> 6; // third 6 bits
            e4 = c3 & 63;//
            if (isNaN(c2)) {
                e3 = e4 = 64;
            } //what is a NaN.??? forgot about those strange things.
            else if (isNaN(c3)) {
                e4 = 64;
            }
            // is + efficient? it is ok just use + to concat them.
            o += base64_map.charAt(e1) + base64_map.charAt(e2) + base64_map.charAt(e3) + base64_map.charAt(e4);
        }
        if (o.length > 0) {
            if (String.fromCharCode(o[o.length - 1]) == 0) {
                o[o.length - 1] = '=';
            }
            if (String.fromCharCode(o[o.length - 2]) == 0) {
                o[o.length - 2] = '=';
            }
        }
        return o;
    }

// this is the help function, to generate base64_map_array by the base64_map.
    function gen_base64_mapping_array() {
        var base64_map = str_url_base64_std;
        var a = [];
        var i;
        for (i = 36; i <= 122; i++) {
            a.push(0);//empty array
        }
        //var base64_map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
        // 45 is the Ascii value of '-', the minimal one. so we create a array from 45-122 about 79 elements
        for (i = 36; i <= 122; i++) {
            a[i - 36] = base64_map.indexOf(String.fromCharCode(i));
        }
        console.log(a);
    }

// this is byte string only.
// Notes:
// the base64_map_array is use to get the 6bits value by the Ascii value of base64 string.
// we can generate this mapping array by
//dfault one: base64_map_array  for "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_="
//[62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]
//default is for "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
//[-1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]
    function prsa_base64_decode(in_str,array_map) {
        var base64_map_array;
        if(array_map && array_map=='url') {
            base64_map_array = url_base64_map;
        }else{
            base64_map_array = url_base64_map_std;
        }

        var start_pos=36;
        var o = "";
        var c1, c2, c3;
        var e1, e2, e3, e4;

        //some one my miss = at the last sign.
        if (in_str.length % 4 != 0) {
            in_str = in_str + '=';
        }
        if (in_str.length % 4 != 0) {
            in_str = in_str + '=';
        }
        if (in_str.length % 4 != 0) {
            //it will be wrong string
            // don't waste cpu time
            return '';
        }
        // what this re? don't do that inefficient things. Open source is free but only free.
        //    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        for (var i = 0; i < in_str.length; i += 4) {
            // indexOf is searching for a value of. Who use this here?
            //      e1 = base64_map.indexOf(in_str.charAt(i+0));
            //      e2 = base64_map.indexOf(in_str.charAt(i+1));
            //      e3 = base64_map.indexOf(in_str.charAt(i+2));
            //      e4 = base64_map.indexOf(in_str.charAt(i+3));
            e1 = base64_map_array[in_str.charCodeAt(i + 0) - start_pos];//get the position in base64_map= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_="
            e2 = base64_map_array[in_str.charCodeAt(i + 1) - start_pos];
            e3 = base64_map_array[in_str.charCodeAt(i + 2) - start_pos];
            e4 = base64_map_array[in_str.charCodeAt(i + 3) - start_pos];

            c1 = 0xff & ((e1 << 2) | (e2 >> 4));
            c2 = 0xff & ((e2 << 4) | e3 >> 2);
            c3 = 0xff & ((e3 & 3) << 6 | e4);
            o += String.fromCharCode(c1);

            if (e3 != 64) {
                o += String.fromCharCode(c2);
            }
            if (e4 != 64) {
                o += String.fromCharCode(c3);
            }
        }
        return o;
    }


////////////////////////////////////////////////////////////////////////////////
//其他来自网路的函数
////////////////////////////////////////////////////////////////////////////////
// javascript store using utf-16. so, text_str.charCodeAt will got 2 bytes.
// Yet, this text_str should be the binary byte string.
    function str_to_bytes_array(text_str) {
        aret = [];
        var ch;
        for (var i = 0; i < text_str.length; i++) {
            ch = text_str.charCodeAt(i);
            do {
                aret.push(ch & 0xFF);  // push byte to stack
                ch = ch >> 8;          // shift value down by 1 byte
            } while (ch);
//            aret.push(text_str.charCodeAt(i));
        }
        return aret;
    }

// this may low efficient, but it works.
    function bytes_array_to_str(bytes_array) {
        result = '';
        for (var i = 0; i < bytes_array.length; i++) {
            result = result + (String.fromCharCode(bytes_array[i]));
        }
        return result;
    }

// google https://github.com/google/closure-library
// Converts a JS string to a UTF-8 "byte" array.
// str: 16-bit unicode string.
    function string_to_utf8_byte_array(str) {
        var out = [], p = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c < 128) {
                out[p++] = c;
            } else if (c < 2048) {
                out[p++] = (c >> 6) | 192;
                out[p++] = (c & 63) | 128;
            } else if (
                ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
                ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
                // Surrogate Pair
                c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
                out[p++] = (c >> 18) | 240;
                out[p++] = ((c >> 12) & 63) | 128;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            } else {
                out[p++] = (c >> 12) | 224;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
        }
        return out;
    };

//Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
    function utf8_bytes_array_to_string(bytes) {
        var out = [], pos = 0, c = 0;
        while (pos < bytes.length) {
            var c1 = bytes[pos++];
            if (c1 < 128) {
                out[c++] = String.fromCharCode(c1);
            } else if (c1 > 191 && c1 < 224) {
                var c2 = bytes[pos++];
                out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
            } else if (c1 > 239 && c1 < 365) {
                // Surrogate Pair
                var c2 = bytes[pos++];
                var c3 = bytes[pos++];
                var c4 = bytes[pos++];
                var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
                    0x10000;
                out[c++] = String.fromCharCode(0xD800 + (u >> 10));
                out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
            } else {
                var c2 = bytes[pos++];
                var c3 = bytes[pos++];
                out[c++] =
                    String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            }
        }
        return out.join('');
    };

/************ Prsa exports interfaces **********************/
    function Prsa(){
        this.rsakey = new JSEncrypt();
    }
    function prsa_pub_encrypt(in_str) {
        // this.rsakey.setPublicKey(pub_key);
        var ret = this.rsakey.encrypt_pub(in_str);
        return ret;
    }
    function prsa_pub_decrypt(in_str) {
        // var jsen = new JSEncrypt();
        // this.rsakey.setPublicKey(pub_key);
        var ret = this.rsakey.decrypt_pub(in_str);
        return ret;
    }
    function prsa_pri_encrypt(in_str) {
        // var jsen = new JSEncrypt();
        // this.rsakey.setPrivateKey(pri_key);
        var ret = this.rsakey.encrypt_pri(in_str);
        return ret;
    }
    function prsa_pri_decrypt(in_str) {
        // var jsen = new JSEncrypt();
        // this.rsakey.setPrivateKey(pri_key);
        var ret = this.rsakey.decrypt_pri(in_str);
        return ret;
    }
    function prsa_load_pub(pub_key)
    {
        this.rsakey.setPublicKey(pub_key);
    }
    function prsa_load_pri(pri_key)
    {
        this.rsakey.setPrivateKey(pri_key);
    }

    function prsa_hash(str)
    {
        return this.rsakey.str_sha256(str);
    }

    function prsa_random(len,mode)
    {
        len = len || 8;
        mode = mode || 'all'; // 'all'->256; 'pw':str_password; 'b64':str_url_base64
        if(mode=='pw'){
            var clen=str_password.length;
            var pw = '';
            for(i=0;i<len;i++){
                pw = pw + str_password.charAt(Math.floor((Math.random()*clen)));
            }
            return pw;
        }else{
            var clen=256;
            var pw = '';
            for(i=0;i<len;i++){
                pw = pw + String.fromCharCode(Math.floor((Math.random()*clen)));
            }
            return pw;
        }
    }

Prsa.prototype.pub_encrypt=prsa_pub_encrypt;
Prsa.prototype.pub_decrypt=prsa_pub_decrypt;
Prsa.prototype.pri_encrypt=prsa_pri_encrypt;
Prsa.prototype.pri_decrypt=prsa_pri_decrypt;
Prsa.prototype.load_pub=prsa_load_pub;
Prsa.prototype.load_pri=prsa_load_pri;
Prsa.prototype.hash=prsa_hash;
Prsa.prototype.base64_encode=prsa_base64_encode;
Prsa.prototype.base64_decode=prsa_base64_decode;

Prsa.prototype.rand=prsa_random;

Prsa.prototype.aes_encrypt=prsa_aes_128_encript_cbc;
Prsa.prototype.aes_decrypt=prsa_aes_128_decript_cbc;
// Prsa.prototype.base_16=prsa_base_16;


    exports.Prsa = Prsa;
})