<?php
/**
 * Author: Gongming Yang
 * Date: 6/20/2016
 * Time: 7:05 PM
 */

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    public function initialize()
    {
        $p = new prsa();
        $this->_SRSA_pri = $p->load_pri(Server_pri_key);
        $this->_SRSA_pub = $p->load_pri(Server_pub_key);
        // Please remember to enable check_session_idletm.
    }

    //This function need to install curl and php_curl.
    // require public_key from public key center using Http requrest.
    public function _send_post($url, $post_data)
    {
        $curl = curl_init();
        $ret = curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)');
        $ret = curl_setopt($curl, CURLOPT_URL,$url);//set query url
        //Output the header or not. 0 means don't output header information
//        $ret = curl_setopt($curl, CURLOPT_HEADER, 1);
        $ret = curl_setopt($curl, CURLOPT_HEADER, 0);
        $ret = curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);//Return with Stream
        $ret = curl_setopt($curl, CURLOPT_POST, 1);//Post
        $ret = curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
        $data = curl_exec($curl);
        curl_close($curl);
        return $data;
    }

    /*** Get key from RSA pool ****/
    //$guid_kid = $guid+#+$kid
    public function rsa_find($guid_kid)
    {
        $m = $this->cache_init(Memcached_port);
        try
        {
            list($m_s,$m_sk) = explode('#', $guid_kid);
            $mem_key = Memcache_rsa . $guid_kid;
            $ret = $this->cache_get($m, $mem_key);
            if ($ret == null) {
                //find in database;
                $srv = Pub_key::findFirst(['guid=:guid: and keyid=:keyid:', 'bind' => ['guid' => $m_s, 'keyid' => $m_sk]]);
                if ($srv != null) {
                    $ret = $this->object_array($srv);
                    $this->cache_set($m, $mem_key, $ret,3600*24*7);
                }
            }
            return $ret;
        }catch(Exception $e){
            return null;
        }
    }

  ###############################################################
  #utility functions
  ###############################################################

    public function object_array($object){
        return json_decode(json_encode($object),true);
    }
  # make sending data back easier. 's' means success
  public function rsend($robj,$s='s'){
    $robj['op']=$s;
    $this->response->setJsonContent($robj);
    $this->response->send();
  }

  #Drop the login status of $sid.
  public function remove_session_by_id($sid){
    $csid = $this->session->getId();
    session_commit();
    #destroy specified session
    session_id($sid);
    session_start();
    session_destroy();
    session_commit();
    #back to the new one;
    session_id($csid);
    session_start();
    session_commit();
  }

  #Recorder's implement. --- this just for fun.
  public function _load_class()
  {
      //This is Chinese Characters. If you need an English version , please contact me.
      //观修
      for ($c = 1; $c <= 82; $c++) {
          $name = '观修第' . $c . '课';
          $stype = new S_type();
          $stype->typename = $name;
          $stype->type = 'g';
          $stype->require_count = Guanxiu_times;
          $stype->require_sum_time = Guanxiu_sum_time;
          try{
            $stype->save();
          }catch (Exception $e){}
      }
      //课程
      for ($c = 1; $c <= 139; $c++) {
          $name = '前行第' . $c . '课';
          $stype = new S_type();
          $stype->typename = $name;
          $stype->type = 'c';
          $stype->require_read = Class_read;
          $stype->require_listen = Class_listen;
          try {
              $stype->save();
          }catch (Exception $e){}
      }

      $n=['顶礼','莲师心咒','皈依','发心','百字明','供曼扎'];
      foreach($n as $m){
          $this->_load_niansong($m,100000);
      }

      //学期
      $c = new S_peroid();
      $c->pname = '总学期';
      try {
          $c->save();
      }catch (Exception $e){}
  }
  public function _load_niansong($name='发心',$count=100000)
  {
      //念诵
      $stype = new S_type();
      $stype->typename = $name;
      $stype->type = 'n';
      $stype->requre_count = $count;
      try {
          $stype->save();
      } catch (Exception $e) {
      }

  }
  public function _load_user_record($uid=1){
      //record
      $period = S_peroid::find();
      foreach($period as $p){
          $tp = S_type::find();
          foreach($tp as $t){
              $s=new S_record();
              $s->uid = $uid;
              $s->type_id=$t->type_id;
              $s->period_id=$p->period_id;
              $s->count = 0;
              $s->sum_time = 0;
              $s->listen_count = 0;
              $s->read_count = 0;
              $s->update_time = time();
              try {
                  $s->save();
              }catch (Exception $e){}
          }
      }
  }

  #this shortid url is displayed in the 2D bar-code. which should be scanned by APP to login.
    public function _gen_shortid_url($sid)
    {
        //should be unique
        return substr($sid,0,6);
    }

    # Check the session is valid or not. -- you can define your own
    public function _check_session($idle = Session_idle)
    {
        try
        {
            if (!$this->session->has('st'))
            {
                $this->response->redirect(Url_login);//go back to login
            }

            //check idle time(idle_tm)
            $st = $this->session->get('st');
            $utm = $this->session->get('utm');
            $this->session->set('utm',time());//update the 'utm'

            if ($st != Fid_False)
            {
                if(false==$utm || time()-$utm > Session_idle){//idle too long
                    $this->response->redirect(Url_login);//go back to login
                }else {
                    return true;//success
//                    $this->response->redirect(Url_main);//success
                }
            }else{
//                $this->response->redirect(Url_login);//go back to login
                return true;
            }

        }catch (Exception $e){
            $this->response->redirect(Url_login);//go back to login
        }
        return false;
    }

    /*
     * It is your job to apply your own methods for password storage and transporting
     */
    public function _check_password($db_pw, $pw)
    {
        if($db_pw==$pw)return true;
        else  return false;
    }

  ###############################################################
  #memcache functions. to addapt to other memcache memcached or redis?
  ###############################################################
    public function cache_init($port=Memcached_port){
        # memcache (windows)
        $m = new Memcache;
        $m->connect("localhost",$port);
        return $m;
    }
    public function cache_set($m,$key,$value,$time_out=3600){
        # memcache (windows)
        $m->set($key,$value,false,$time_out);
    }

    public function cache_get($m,$key){
        # memcache (windows)
        return $m->get($key);
    }
    public function cache_delete_key($m,$key){
        # memcache (windows)
        return $m->delete($key);
    }
}