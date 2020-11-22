<template>
  <div class="about">
    <h1>Raspberry Pi</h1>
    <div class="about-box">
      <div class="about-box-item">
        <h3>温度实时监控</h3>
        <p>watch -n 0.1 cat /sys/class/thermal/thermal_zone0/temp</p>
      </div>
      <div class="about-box-item">
        <h3>开启/关闭 显示</h3>
        <p>xset dpms force on</p>
        <p>xset -display :0.0 dpms force on</p>
      </div>
      <div class="about-box-item">
        <h3>树莓派信息</h3>
        <p>pinout</p>
        <p>cpuinfo</p>
        <p>cat /proc/cpuinfo</p>
        <p>cat /proc/device-tree/model</p>
        <p>sudo ifconfig</p>
      </div>
      <div class="about-box-item">
        <h3>重启/关闭</h3>
        <p>sudo reboot</p>
        <p>sudo shutdown -h now</p>
      </div>
      <div class="about-box-item">
        <h3>软件更新</h3>
        <p>sudo apt-get update</p>
        <p>sudo apt-get upgrade</p>
        <p>sudo apt-get dist-upgrade</p>
        <p>sudo rpi-update</p>
      </div>
      <div class="about-box-item">
        <h3>nginx配置</h3>
        <p>sudo nano /etc/nginx/sites-available/default</p>
        <p>sudo /etc/init.d/nginx test</p>
        <p>nginx -V/-v</p>
        <p>前端 /var/www</p>
        <p>后端 /var/server</p>
      </div>
      <div class="about-box-item">
        <h3>端口使用情况</h3>
        <p>netstat -anp</p>
      </div>
      <div class="about-box-item">
        <h3>root用户切换</h3>
        <p>sudo su</p>
      </div>
      <div class="about-box-item">
        <h3>文件夹权限调整</h3>
        <p>chmod 777 /home/user</p>
        <p>chmod -R 777 /home/user</p>
        <p>读取 4</p>
        <p>执行 1</p>
        <p>写入 2</p>
      </div>
      <div class="about-box-item">
        <h3>重命名/移动</h3>
        <p>mv  A(/A)  B(/B)</p>
      </div>
      <div class="about-box-item">
        <h3>花生壳</h3>
        <p>sudo phddns</p>
      </div>
      <div class="about-box-item">
        <h3>pm2</h3>
        <p>pm2 start xxx.js</p>
        <p>pm2 list</p>
        <p>pm2 monit</p>
        <p>pm2 stop all</p>
        <p>pm2 reload all</p>
        <p>pm2 --help</p>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@media screen and (min-width: 320px){
    .about-box {
      margin: 10px;
      padding: 10px;
    }
}

@media screen and (min-width: 640px){
    .about-box {
      margin: 10px 50px;
      padding: 20px;
    }
}

@media screen and (min-width: 1000px){
    .about-box {
      margin: 10px 100px;
      padding: 20px;
    }
}

.about-box {
  display: block;
  background: #eee;

  & .about-box-item {
    margin-bottom: 30px;
  }
  & .about-box-item:last-child {
    border-bottom: none;
  }

  & p {
    padding: 10px 20px;
    margin-left: 20px;
  }
}
</style>
