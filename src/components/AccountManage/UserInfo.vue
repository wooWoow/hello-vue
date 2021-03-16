<template>
  <div class="main-box">
    <h2 class="top-title-box">用户信息</h2>
    <a-descriptions class="m-30 pl-30" :column="3">
      <a-descriptions-item label="用户名称" :span="3">
        {{userInfo.user_name}}
      </a-descriptions-item>
      <a-descriptions-item label="用户ID" :span="3">
        {{userInfo.user_id}}
      </a-descriptions-item>
      <a-descriptions-item label="用户状态" :span="3">
        {{userInfo.statusStr}}
      </a-descriptions-item>
      <a-descriptions-item label="电话" :span="3">
        {{userInfo.user_phone || '--'}}
      </a-descriptions-item>
      <a-descriptions-item label="邮箱" :span="3">
        {{userInfo.user_email || '--'}}
      </a-descriptions-item>
      <a-descriptions-item label="地址" :span="3">
        {{userInfo.user_address || '--'}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Request from '../../service/request';
import { userStatusFormat } from '../../service/tool';

@Component
export default class UserInfo extends Vue {
  userId = '';
  userInfo: any = {};
  created() {
    this.userId = this.$store.state.userId;
    this.getUserInfo(this.userId);
  }

  getUserInfo(userId) {
    Request.get('/v1/users/getUserInfo', {
      params: {
        userId
      }
    }).then((res) => {
      if (res?.data?.data?.[0]) {
        this.userInfo = res.data.data[0];
        this.userInfo.statusStr = userStatusFormat(this.userInfo.user_status);
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
