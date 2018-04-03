<!DOCTYPE html>
<meta charset="UTF-8">
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link href="../../../public/css/login.css" rel="stylesheet" type="text/css" />
    <script src="../../../public/js/jsencrypt.js"></script>

    <script type="text/javascript" src="../../../public/js/sha2.js"></script>
    <script type="text/javascript" src="../../../public/js/aes.js"></script>
    <script type="text/javascript" src="../../../public/js/pkc.js"></script>

    <script type="text/javascript"  src="../../../public/js/jquery-1.12.3.min.js"></script>
    <script type="text/javascript" src="../../../public/js/qrcodejs/qrcode.js"></script>

</head>


<div class="login_box">
    <div class="login_l_img">
        <div id="tqrcode" style="width:150px; height:150px; margin-top:50px;margin-bottom:39px;"></div>

        <!--        Or you can get your public key from:<a href="http://www.publickeycenter.com">publickeycenter</a>-->
    </div>
    <div class="login">
<!--        <div class="login_logo"><a href="#"><img src="../../../public/icon/table_tennes.jpg" /></a></div>-->
        <div class="login_name">
            <p>HowdyPay 支付系统</p>
        </div>
        <form action="/login/login"  method="POST">
            <input id="user_name" name="user_name" type="text" class="form-control" placeholder="用户名">
            <input class="form-control" placeholder="密码" name="password" type="password" value="">
            <button type="submit"  class="btn btn-lg btn-success btn-block" id="user_login">登录</button>
        </form>
        <div> Please scan it to login using your <a href="http://www.publickeycenter.com">public-key-APP</a></div>
    </div>
</div>
<body>

<script type="text/javascript">
    var qrcode = new QRCode(document.getElementById("tqrcode"), {
        width : 150,
        height : 150
    });
    function makeCode (data) {
        // var elText = document.getElementById("text");
        // elText.value=data;
        if (!data) {
            return;
        }
        qrcode.makeCode(data);
    }
    makeCode("<?= $data ?>");
</script>
</body>

</html>