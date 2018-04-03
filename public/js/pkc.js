/**
 * User: ygm
 * Date: 6/20/2016
 * Time: 7:05 PM
 */
////////////////////////////////////////////////////////////////////////////////////////////
// Common functions
////////////////////////////////////////////////////////////////////////////////////////////
//We always uss post, and with h_token, so we use this ajax.
// mydata will be like : {}
// fn_ok will be fn_ok(data){};
function pkcajax(iurl,mydata,fn_ok,fail_message)
{
    // mydata[jQuery('.h_token').val()] ='';
    jQuery.ajax({
        'url':iurl,
        'type':'POST',
        "data":mydata,
        "success":fn_ok,
        'error': function fn_fail(data){
            var xx=0;
            console.log(data);
            //alert(fail_message);
        }
    });
}

function pkc_binary()
{
    jQuery.ajax({
        'url': "/my/image/name.png",
        'type': "GET",
        // "data":mydata,
        'dataType': "binary",
        'processData': false,
        'success': function (result) {
            // do something with binary data
        }
    });

    $('#myfile').ajaxSubmit(function(data) {
        $("#image").val(data);

    });
}

//
function pkcsend(iurl,mydata,fn_ok,fn_fail)
{
    fn_ok = fn_ok || null;
    fn_fail = fn_fail || null;
    jQuery.ajax({
        'url':iurl,
        'type':'POST',
        "data":mydata,
        "success":fn_ok,
        'error': fn_fail
    });
}

function thefilePicked(oEvent) {
    // Get The File From The Input
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;
    // Create A File Reader HTML5
    var reader = new FileReader();

    // Ready The Event For When A File Gets Selected
    reader.onload = function(e) {
        var data = e.target.result;
        var cfb = XLS.CFB.read(data, {type: 'binary'});
        var wb = XLS.parse_xlscfb(cfb);
        // Loop Over Each Sheet
        wb.SheetNames.forEach(function(sheetName) {
            // Obtain The Current Row As CSV
            var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
            var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);

            $("#my_file_output").html(sCSV);
            console.log(oJS)
        });
    };

    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);
}

////////////////////////////////////////////////////////////////////////////////////////////
// constant value
////////////////////////////////////////////////////////////////////////////////////////////
var user_man_width='780px';
var guid_width='750px';
var Aes_block_size=16;


////////////////////////////////////////////////////////////////////////////////////////////
// Get 
////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////
// Js for different Pages
////////////////////////////////////////////////////////////////////////////////////////////
function edit_password(user_id) {
    $("[name=edit_pw]").on('click', function () {
        $('[name=submit_pw]').show();
        $('[name=cancel_pw]').show();
        var t = $('#ZB_edit_password');
        t.show();
        $(this).hide();
    });

    $('[name=cancel_pw]').on('click', function () {
        $('[name=submit_pw]').hide();
        $('[name=edit_pw]').show();
        var t = $('#ZB_edit_password');
        t.hide();
        $(this).hide();
    });

    $('[name=submit_pw]').on('click', function () {
        $('[name=cancel_pw]').hide();
        $('[name=edit_pw]').show();
        var t = $('#ZB_edit_password');
        t.hide();
        $(this).hide();
        //submit
        var mydata = {};
        var pw = jQuery('input[name=new_password]').val();
        var repw = jQuery('input[name=re_password]').val();

        if (pw != repw) {
            alert('两次输入的密码不正确');
            return;
        } else if (pw.length < 6 && (pw.toLowerCase()==pw || pw.toUpperCase()==pw)) {
            alert('您输入的密码必须6位以上,并且需要包含大小写');
            return;
        }

        // this is for security
        mydata["old_password"] = jQuery('input[name=old_password]').val();
        mydata["password"] = jQuery('input[name=new_password]').val();
        mydata["user_id"] = user_id;
        pkcajax('/data/user_pw_update', mydata, function (data) {
            if (data['status'] != 'success') {
                alert('密码修改不成功');
            } else {
                alert('密码修改成功');
            }
            jQuery('input[name=old_password]').val('');
            jQuery('input[name=new_password]').val('');
            jQuery('input[name=re_password]').val('');
        },'error');
    });
}

function edit_user_info(user_id,is_admin) {
    $("[name=edit_info]").on('click', function () {
      $('[name=submit_info]').show();
      $('[name=cancel_edit]').show();
      var t = $('.ZB_edit_user_name');
      t.removeAttr('readonly');
      $(this).hide();
      jQuery('[name=gender]').removeAttr('disabled');
      jQuery('[name=user_type]').removeAttr('disabled');
      jQuery('[name=user_learning_type]').removeAttr('disabled');
      if (!is_admin) {
        $('.ZB_admin').attr('readonly', 'readonly').css('color', 'gray');
        jQuery('[name=user_type]').attr('disabled', 'disabled');
        jQuery('[name=user_learning_type]').attr('disabled', 'disabled');
      }
    });

    $('[name=cancel_edit]').on('click', function () {
      $('[name=edit_info]').show();
      $('[name=submit_info]').hide();
      var t = $('.ZB_edit_user_name');
      t.attr('readonly', 'readonly');
      $(this).hide();
      jQuery('[name=gender]').attr('disabled', 'disabled');
      jQuery('[name=user_type]').attr('disabled', 'disabled');
      jQuery('[name=user_learning_type]').attr('disabled', 'disabled');
      if(!is_admin){
        $('.ZB_admin').attr('readonly', 'readonly').css('color', 'gray');
        jQuery('[name=user_type]').attr('disabled', 'disabled');
        jQuery('[name=user_learning_type]').attr('disabled', 'disabled');
      }
    });

    $('[name=submit_info]').on('click', function () {
      $('[name=edit_info]').show();
      $('[name=cancel_edit]').hide();
      var t = $('.ZB_edit_user_name');
      t.attr('readonly', 'readonly');
      $(this).hide();
      jQuery('[name=gender]').attr('disabled', 'disabled');
      jQuery('[name=user_type]').attr('disabled', 'disabled');
      jQuery('[name=user_learning_type]').attr('disabled', 'disabled');
      if (!is_admin) {
        $('.ZB_admin').attr('readonly', 'readonly').css('color', 'gray');
        jQuery('[name=user_type]').attr('disabled', 'disabled');
        jQuery('[name=user_learning_type]').attr('disabled', 'disabled');
      }
      //submit
      var mydata = {};
      mydata["user_id"] = user_id;
      mydata["user_name"] = jQuery('[name=user_name]').val();
      mydata["user_type"] = jQuery('[name=user_type]').val();
      mydata["learning_type"] = jQuery('[name=user_learning_type]').val();
      mydata["real_name"] = jQuery('[name=real_name]').val();
      mydata["province"] = jQuery('[name=province]').val();
      mydata["country"] = jQuery('[name=country]').val();
      mydata["birth_year"] = parseInt(jQuery('[name=birth_year]').val());
      mydata["gender"] = jQuery('.ZB_edit_user_name[name=gender]').val();
      mydata["remarks"] = jQuery('.ZB_edit_user_name[name=remarks]').val();

      pkcajax('/data/user_update', mydata, function (data) {
        var t = 0;
      }, '');
    });
}



////////////////////////////////////////////////////////////////////////////////////////////
// Js for encryption
////////////////////////////////////////////////////////////////////////////////////////////
// add pad pks7
function pad_add(textBytes,block_size)
{
  var plen = block_size  - (textBytes.length % block_size);
  for(var i=0;i<plen;i++){
    textBytes.push(plen);
  }
  return textBytes;

}
// del pad pks7
function pad_del(textBytes,block_size)
{
  var plen = textBytes[textBytes.length-1];
  for(var i=0;i<plen;i++){
    textBytes.pop();
  }
  return textBytes;

}

//aes encrypt the input text_str is utf16 string.
function aes_utf8_128_encript_cbc(key,text_str)
{
  var block_size=16;
  var text64 = str_sha256(key);
  var a_key = str_to_bytes_array(text64.substr(0,block_size));
  var a_iv  = str_to_bytes_array(text64.substr(0,block_size));


  //var textBytes = aesjs.util.convertStringToBytes(text_str,'utf8');
  var textBytes = str_to_bytes_array(text_str);
  textBytes = pad_add(textBytes,block_size);

  var aesCbc = new aesjs.ModeOfOperation.cbc(a_key, a_iv);
  var encryptedBytes = aesCbc.encrypt(textBytes);

  return bytes_array_to_str(encryptedBytes);
//        return  aesjs.util.convertBytesToString(encryptedBytes);

}

//aes decrypt withi compatible with prsa.php
function aes_utf8_128_decript_cbc(key,text_str)
{
  var block_size=16;
  var text64 = str_sha256(key);
  var a_key = str_to_bytes_array(text64.substr(0,block_size));
  var a_iv  = str_to_bytes_array(text64.substr(0,block_size));


  var aesCbc = new aesjs.ModeOfOperation.cbc(a_key, a_iv);


//        var textBytes = aesjs.util.convertStringToBytes(text_str,'utf8');
  var textBytes=str_to_bytes_array(text_str);

  var decryptedBytes = aesCbc.decrypt(textBytes);
  decryptedBytes = pad_del(decryptedBytes,block_size);

  return bytes_array_to_str(decryptedBytes);

//        return  aesjs.util.convertBytesToString(decryptedBytes);
}


//aes encrypt withi compatible with prsa.php
function aes_128_encript_cbc(key,text_str)
{
  var block_size=16;
  var text64 = str_sha256(key);
  var a_key = str_to_bytes_array(text64.substr(0,block_size));
  var a_iv  = str_to_bytes_array(text64.substr(0,block_size));


  //var textBytes = aesjs.util.convertStringToBytes(text_str,'utf8');
  var textBytes = str_to_bytes_array(text_str);
  textBytes = pad_add(textBytes,block_size);

  var aesCbc = new aesjs.ModeOfOperation.cbc(a_key, a_iv);
  var encryptedBytes = aesCbc.encrypt(textBytes);

  return bytes_array_to_str(encryptedBytes);
//        return  aesjs.util.convertBytesToString(encryptedBytes);

}

//aes decrypt withi compatible with prsa.php
function aes_128_decript_cbc(key,text_str)
{
  var block_size=16;
  var text64 = str_sha256(key);
  var a_key = str_to_bytes_array(text64.substr(0,block_size));
  var a_iv  = str_to_bytes_array(text64.substr(0,block_size));


  var aesCbc = new aesjs.ModeOfOperation.cbc(a_key, a_iv);


//        var textBytes = aesjs.util.convertStringToBytes(text_str,'utf8');
  var textBytes=str_to_bytes_array(text_str);

  var decryptedBytes = aesCbc.decrypt(textBytes);
  decryptedBytes = pad_del(decryptedBytes,block_size);

  return bytes_array_to_str(decryptedBytes);

//        return  aesjs.util.convertBytesToString(decryptedBytes);
}

var g_base64_url_map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
var g_base64_map_array=[62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
// this is byte string only.
function base64_encode(in_str)
{
  var base64_map = g_base64_url_map;
  //get away utf8, stay away from ++ or -- .
  //var base64_map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o = "";
  var c1, c2, c3, e1, e2, e3, e4;

  for(var i = 0; i < in_str.length;i+=3 )
  {
    c1 = in_str.charCodeAt(i+0);
    c2 = in_str.charCodeAt(i+1);
    c3 = in_str.charCodeAt(i+2);
    e1 = c1 >> 2; //first  6 bits
    e2 = (c1 & 3) << 4 | c2 >> 4; // second 6 bits
    e3 = (c2 & 15) << 2 | c3 >> 6; // third 6 bits
    e4 = c3 & 63;//
    if (isNaN(c2)) { e3 = e4 = 64; } //what is a NaN.??? forgot about those strange things.
    else if (isNaN(c3)) { e4 = 64; }
    // is + efficient? it is ok just use + to concat them.
    o += base64_map.charAt(e1) + base64_map.charAt(e2) + base64_map.charAt(e3) + base64_map.charAt(e4);
  }
  if(o.length>0) {
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
  base64_map = g_base64_url_map;
  var a = [];
  var i;
  for (i = 45; i <= 122; i++) {
    a.push(0);//empty array
  }
  //var base64_map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
  // 45 is the Ascii value of '-', the minimal one. so we create a array from 45-122 about 79 elements
  for (i = 45; i <= 122; i++) {
    a[i - 45] = base64_map.indexOf(String.fromCharCode(i));
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
function base64_decode(in_str)
{
  var base64_map_array = g_base64_map_array;
  var o = "";
  var c1, c2, c3;
  var e1, e2, e3, e4;

  //some one my miss = at the last sign.
  if(in_str.length%4!=0){
    in_str= in_str+'=';
  }
  if(in_str.length%4!=0){
    in_str=in_str+'=';
  }
  if(in_str.length%4!=0) {
    //it will be wrong string
    // don't waste cpu time
    return '';
  }
  // what this re? don't do that inefficient things. Open source is free but only free.
  //    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  for (var i = 0; i < in_str.length;i+=4)
  {
    // indexOf is searching for a value of. Who use this here?
    //      e1 = base64_map.indexOf(in_str.charAt(i+0));
    //      e2 = base64_map.indexOf(in_str.charAt(i+1));
    //      e3 = base64_map.indexOf(in_str.charAt(i+2));
    //      e4 = base64_map.indexOf(in_str.charAt(i+3));
    e1= base64_map_array[in_str.charCodeAt(i+0)-45];//get the position in base64_map= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_="
    e2= base64_map_array[in_str.charCodeAt(i+1)-45];
    e3= base64_map_array[in_str.charCodeAt(i+2)-45];
    e4= base64_map_array[in_str.charCodeAt(i+3)-45];

    c1 = 0xff&((e1 << 2) | (e2 >> 4));
    c2 = 0xff&( (e2 << 4) | e3 >> 2 );
    c3 = 0xff&((e3 & 3) << 6 | e4);
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
function str_to_bytes_array(text_str)
{
  aret = [];
  var ch;
  for (var i = 0; i < text_str.length; i++) {
    ch = text_str.charCodeAt(i);
    do {
      aret.push( ch & 0xFF );  // push byte to stack
      ch = ch >> 8;          // shift value down by 1 byte
    }while ( ch );
//            aret.push(text_str.charCodeAt(i));
  }
  return aret;
}
// this may low efficient, but it works.
function bytes_array_to_str(bytes_array)
{
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


