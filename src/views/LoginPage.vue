<template>
  <div class="login mt-10">
    <a-form layout="vertical" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" :form="form" @submit="handleSubmit">
      <a-form-item label="Name" :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
        <a-input v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your username!' }] },
        ]" :placeholder="$t('user_name_placeholder')">
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item label="Password" :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
        <a-input v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] },
        ]" type="password" :placeholder="$t('password_placeholder')">
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError())">
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
      form: this.$form.createForm(this, { name: 'horizontal_login' })
    };
  },
  created: function () {
    console.log('created');
  },
  destroyed: function () {
    console.log('destroyed');
  },
  mounted () {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
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
            const userId = response.data.data.userId;
            const userName = response.data.data.userName;
            this.$cookies.set('userName', userName);
            this.$cookies.set('userId', userId);

            this.$store.commit({
              type: 'changeUserInfo',
              userId,
              userName
            });
          } else {
            this.$message.error('登陆失败');
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 姓名校验
    userNameError () {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('username') && getFieldError('username');
    },

    // 密码校验
    passwordError () {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('password') && getFieldError('password');
    },

    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loginNow(values);
        }
      });
    },

    hasErrors (fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
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
