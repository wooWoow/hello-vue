<template>
  <div class="main-box">
    <h2 class="top-title-box">密码修改</h2>
    <div class="m-30">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item label="当前密码">
          <a-input-password
            v-decorator="['passWord', { rules: [{ required: true, message: 'Please input your Password!' }] }]" />
        </a-form-item>
        <a-form-item label="新密码">
          <a-input-password
            v-decorator="['newPassword', { rules: [{ required: true, message: 'Please input your newPassword!' }] }]" />
        </a-form-item>
        <a-form-item label="新密码确认">
          <a-input-password
            v-decorator="['newPasswordAgain', { rules: [{ required: true, message: 'Please input your newPasswordAgain!' }] }]" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit">
            Submit
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Request from '../../service/request';
import { logoutNow } from '../../service/tool';

@Component
export default class ChangePassword extends Vue {
  userId = '';

  form = this.$form.createForm(this, { name: 'changePassword' });

  created() {
    this.userId = this.$store.state.userId;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (!err) {
        if (values.newPassword !== values.newPasswordAgain) {
          this.$message.warning('新密码不一致');
        } else if (values.newPassword === values.passWord) {
          this.$message.warning('新旧密码一致');
        } else {
          // 接口
          const data = Object.assign({}, values, {
            userId: this.userId
          });
          Request.post('/v1/users/changePassword', data).then((res) => {
            if (res.data.code !== 200) {
              this.$message.error(res.data.msg);
            } else {
              this.$message.success(res.data.msg);
              logoutNow();
              this.$store.commit({
                type: 'changeUserInfo',
                userId: '',
                userName: ''
              });
              this.$router.replace({ path: '/' });
            }
          });
        }
      } else {
        this.$message.warning(err[Object.keys(err)[0]].errors[0].message);
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-box {
  text-align: left;
  padding-bottom: 100px;
}
.top-title-box {
  display: block;
  margin-left: 30px;
}
</style>
