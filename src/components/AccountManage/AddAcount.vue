<template>
  <div class="main-box">
    <h2 class="top-title-box">账户注册</h2>
    <div class="m-30">
      <a-form :form="form" ref="testRef" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item label="用户名">
          <a-input v-decorator="['name', { rules: [{ required: true, message: 'Please input your name!' }] }]" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password
            v-decorator="['passWord', { rules: [{ required: true, message: 'Please input your passWord!' }] }]" />
        </a-form-item>
        <a-form-item label="密码确认">
          <a-input-password
            v-decorator="['passWordAgain', { rules: [{ required: true, message: 'Please input your passWord!' }] }]" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-decorator="['email', { rules: [] }]" />
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-decorator="['phone', { rules: [] }]" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-decorator="['address', { rules: [] }]" />
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

@Component
export default class AddAcount extends Vue {
  userId = '';

  form = this.$form.createForm(this, { name: 'addAcount' });

  created() {
    this.userId = this.$store.state.userId;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.form.validateFields((err, values) => {
      if (!err) {
        if (values.passWord !== values.passWordAgain) {
          this.$message.warning('密码输入不一致！');
        } else {
          Request.post('/v1/users/addUser', values).then((res) => {
            if (res.data.code !== 200) {
              this.$message.error(res.data.msg);
            } else {
              this.$message.success(res.data.msg);
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
