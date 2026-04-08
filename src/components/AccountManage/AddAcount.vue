<template>
  <div class="main-box">
    <h2 class="top-title-box">账户注册</h2>
    <div class="m-30">
      <a-form :model="formState" :rules="rules" ref="formRef" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @finish="handleSubmit">
        <a-form-item label="用户名" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="密码" name="passWord">
          <a-input-password v-model:value="formState.passWord" />
        </a-form-item>
        <a-form-item label="密码确认" name="passWordAgain">
          <a-input-password v-model:value="formState.passWordAgain" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item label="电话" name="phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item label="地址" name="address">
          <a-input v-model:value="formState.address" />
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
import { Vue, Options } from 'vue-class-component';
import Request from '../../service/request';

@Options({})
export default class AddAcount extends Vue {
  userId = '';

  formState = {
    name: '',
    passWord: '',
    passWordAgain: '',
    email: '',
    phone: '',
    address: ''
  };

  rules = {
    name: [
      { required: true, message: 'Please input your name!', trigger: 'blur' }
    ],
    passWord: [
      { required: true, message: 'Please input your passWord!', trigger: 'blur' }
    ],
    passWordAgain: [
      { required: true, message: 'Please input your passWord!', trigger: 'blur' }
    ]
  };

  created() {
    this.userId = this.$store.state.userId;
  }

  handleSubmit(values) {
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
