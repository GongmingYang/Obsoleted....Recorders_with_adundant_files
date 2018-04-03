<!DOCTYPE html>
<meta charset="UTF-8">
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="stylesheet" type="text/css" href="/public/css/pkc.css">
    <link href="/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/sb_admin.css" rel="stylesheet">
    <script src="/js/jsencrypt.js"></script>

    <script type="text/javascript" src="/js/sha2.js"></script>
    <script type="text/javascript" src="/js/aes.js"></script>
    <script type="text/javascript" src="/js/pkc.js"></script>
</head>

<body>
<div class="container">
  <div class="row">
    <div class="col-md-4 col-md-offset-4">
      <div class="login-panel panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">请您登录</h3>
        </div>
        <div class="panel-body">
          <form role="form"  action="/login/login"  method="POST">
            <fieldset>
              <div class="form-group">
                <input class="form-control" placeholder="用户名" name="user_name" type="text" autocomplete="off">
              </div>
              <div class="form-group">
                <input class="form-control" placeholder="密码" name="password" type="password" value="">
              </div>
              <!-- Change this to a button or input when using this as a form -->
              <button type="submit"  class="btn btn-lg btn-success btn-block" id="user_login">登录</button>
              <p id="label_login_status" style="color:red;display:block"></p>

              <a href="/login/signup">需要注册</a>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>


<div class="">
<!--    <button type="submit"  class="btn btn-lg btn-success btn-block" id="user_login">安全登录</button>-->
    <button type="button" id="login" >Safe Login</button>
    <label type="text" id="rsp" class="col-xs-12 col-sm-12"></label>
</div>

<!-- jQuery -->
<script src="/js/jquery.min.js"></script>
<!-- Bootstrap Core JavaScript -->
<script src="/js/bootstrap.min.js"></script>
<!-- copy right part -->
<script>

    function msleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

  // safe login
  jQuery('#login').on('click',function(){
      //Open 2Qbar
      //Ajax to query login status(per 2seconds)
      var url='www.publickeycenter.com';
      var data={};
      jQuery('#rsp').val('null');
      console.log('Do some thing, ' + new Date());
      msleep(3000);
      console.log('Do some thing, ' + new Date());
      while(0)
      {
          pkcajax(url, data, function (mydata) {
              jQuery('#rsp').val('null');
          });
          sleep(3000);
      }
  });
</script>
</body>


</html>