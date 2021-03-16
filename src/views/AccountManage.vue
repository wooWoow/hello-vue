<template>
  <div class="operations-box">
    <div class="left-menu">
      <a-menu :default-selected-keys="['1']" @select="selectMenu" mode="inline" theme="light" :inline-collapsed="false">
        <a-menu-item key="1">
          <a-icon type="pie-chart" />
          <span>用户信息</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="desktop" />
          <span>密码修改</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="desktop" />
          <span>账户注册</span>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="desktop" />
          <span>账号管理</span>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="right-center">
      <UserInfo v-if="showMenu === '1'"/>
      <ChangePassword v-if="showMenu === '2'"/>
      <AddAcount v-if="showMenu === '3'"/>
      <UserManage v-if="showMenu === '4'"/>
    </div>
  </div>
</template>

<script>
import UserInfo from '@/components/AccountManage/UserInfo';
import ChangePassword from '@/components/AccountManage/ChangePassword';
import AddAcount from '@/components/AccountManage/AddAcount';
import UserManage from '@/components/AccountManage/userManage';

export default {
  name: 'AccountManage',
  components: {
    UserInfo,
    ChangePassword,
    AddAcount,
    UserManage
  },
  data () {
    return {
      showMenu: '1'
    };
  },
  methods: {
    selectMenu: function($event) {
      this.showMenu = $event.key;
    }
  }
};
</script>

<style scoped lang="scss">
.operations-box {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}
.left-menu {
  margin-top: 10px;
  width: 200px;
  ul {
    height: 100%;
  }
}
.right-center {
  margin-top: 20px;
  flex: 1;
}
</style>
