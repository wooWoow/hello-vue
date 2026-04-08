<template>
  <div class="login mt-10">
    <a-form layout="vertical" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" :model="formState" :rules="rules" ref="formRef" @finish="handleSubmit">
      <a-form-item label="Name" name="userName">
        <a-input v-model:value="formState.userName" :placeholder="$t('user_name_placeholder')">
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item label="Password" name="passWord">
        <a-input v-model:value="formState.passWord" type="password" :placeholder="$t('password_placeholder')">
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          {{ $t('btn_submit') }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import Request from '../service/request';
import { setToken } from '../service/tool';

export default {
  name: 'Login',
  data () {
    return {
      formState: {
        userName: '',
        passWord: ''
      },
      rules: {
        userName: [
          { required: true, message: 'Please input your username!', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: 'Please input your Password!', trigger: 'blur' }
        ]
      }
    };
  },
  created: function () {
    console.log('created');
  },
  destroyed: function () {
    console.log('destroyed');
  },
  methods: {
    // 登陆
    loginNow (data) {
      Request.post('/v1/users/login', data)
        .then(response => {
          if (response.data.code === 200) {
            this.$message.success('登陆成功');

            // 将token持久化，请求时带入header
            setToken(response.data.data.token);

            // 用户信息同步至cookie
            const userId = response.data.data.user.userId;
            const userName = response.data.data.user.userName;
            this.$cookies.set('userId', userId);
            this.$cookies.set('userName', userName);

            const userStatus = response.data.data.user.status;
            const userRoles = response.data.data.user.roles;
            this.$store.commit({
              type: 'changeUserInfo',
              userId,
              userName,
              userStatus,
              userRoles
            });

            this.$router.push('/');
          } else {
            this.$message.error('登陆失败');
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    handleSubmit (values) {
      this.loginNow(values);
    }
  }
};
</script>

<style scoped lang="scss">
@media screen and (min-width: 320px) {
  .login .ant-form-item {
    margin: 0 30px;
  }
}

@media screen and (min-width: 640px) {
  .login .ant-form-item {
    margin: 0 150px;
  }
}

@media screen and (min-width: 1000px) {
  .login .ant-form-item {
    margin: 0 200px;
  }
}
</style>
