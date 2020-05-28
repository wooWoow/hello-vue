<template>
  <div class="hello">
    <div class="input-box">
      <a-input class="hello-input-box" :placeholder="$t('user_name_placeholder')" type="text" v-model="username" />
      <a-input class="hello-input-box" :placeholder="$t('password_placeholder')" type="password" v-model="password" />
    </div>
    <a-button class="login-btn" v-on:click="loginNow">{{ $t('btn_submit') }}</a-button>
    <a-button class="login-btn" v-on:click="changeLanguage">{{$t('btn_language')}}</a-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Request from '../service/request';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  username = '';
  password = '';

  // 登陆
  loginNow (): void {
    Request.post('/v1/users/login', {
      username: this.username,
      password: this.password
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // 语言切换
  changeLanguage (): void {
    const type = localStorage.getItem('locale') === 'zh' ? 'en' : 'zh';
    // 此处做了语言选择记录
    localStorage.setItem('locale', type);
    // 修改显示语言
    this.$i18n.locale = type;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.input-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.hello-input-box {
  width: 30%;
  margin: 10px 0;
}
.login-btn:last-child {
  margin-left: 30px;
}
</style>
