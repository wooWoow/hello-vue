<template>
  <div id="app">
    <div id="nav">
      <router-link class="ml-20" to="/">{{$t('link_home')}}</router-link> |
      <router-link to="/nodes">{{$t('link_about')}}</router-link> |
      <router-link to="/operations">{{$t('link_tools')}}</router-link>

      <!-- 登陆 -->
      <router-link v-if="!userId" class="top-item" to="/login">{{$t('link_login')}}</router-link>
      <a-dropdown class="top-item" v-if="userId">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          {{userName}}
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item>
            <a @click="accountManage">账户管理</a>
          </a-menu-item>
          <a-menu-item>
            <a @click="loginOut">退出登录</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>

      <a-select class="top-item language-select" label-in-value :default-value="language" style="width: 120px"
        @change="handleChange">
        <a-select-option value="zh">
          中文
        </a-select-option>
        <a-select-option value="en">
          English
        </a-select-option>
      </a-select>
    </div>
    <router-view />
  </div>
</template>

<script>
import Request from './service/request';
import { mapState } from 'vuex';
import { getToken, logoutNow } from './service/tool';

export default {
  data () {
    return {
      language: {
        key: localStorage.getItem('locale') ? localStorage.getItem('locale') : 'zh'
      }
    };
  },
  computed: {
    ...mapState([
      'userName',
      'userId'
    ])
  },
  mounted () {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      if (localStorage.getItem('locale')) {
        this.language.key = localStorage.getItem('locale');
      } else {
        this.language.key = 'zh';
        localStorage.setItem('locale', 'zh');
      }
    });
  },
  created: function () {
    const isLogin = getToken();
    if (isLogin) {
      // 更新vuex用户数据
      const userId = this.$cookies.isKey('userId') && this.$cookies.get('userId');
      const userName = this.$cookies.isKey('userName') && this.$cookies.get('userName');

      if (userId || userName) {
        Request.get('/v1/users/getUserInfo', {
          params: {
            userId,
            userName
          }
        }).then(res => {
          if (res?.data?.data?.[0]) {
            const userInfo = res.data.data[0];

            this.$store.commit({
              type: 'changeUserInfo',
              userId: userInfo.user_id,
              userName: userInfo.user_name
            });
          }
        });
      } else {
        this.loginOut();
      }
    } else {
      logoutNow();
    }
  },
  methods: {
    handleChange (value) {
      const type = value.key;
      // 此处做了语言选择记录
      localStorage.setItem('locale', type);
      // 修改显示语言
      this.$i18n.locale = type;
    },
    loginOut () {
      logoutNow();
      this.$router.replace({ path: '/' });
      window.location.reload();
    },
    accountManage () {
      this.$router.push('/account');
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  min-width: 900px;
  overflow: auto;
}

#nav {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  border-bottom: 1px solid #ddd;

  a {
    font-weight: bold;
    color: #2c3e50;
    padding: 0 5px;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

  .top-item {
    float: right;
    margin-right: 20px;
    vertical-align: middle;
  }

  .language-select {
    margin-top: 10px;
  }
}
</style>
