<template>
  <div class="login">
    <a-form layout="vertical" :form="form" @submit="handleSubmit">
      <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
        <a-input v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your username!' }] },
        ]" :placeholder="$t('user_name_placeholder')">
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
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
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
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
@media screen and (min-width: 320px){
    .login .ant-form-item {
      margin: 0 30px;
    }
}

@media screen and (min-width: 640px){
    .login .ant-form-item {
      margin: 0 200px;
    }
}

@media screen and (min-width: 1000px){
    .login .ant-form-item {
      margin: 0 300px;
    }
}
</style>
