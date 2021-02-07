<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">{{$t('link_home')}}</router-link> |
      <router-link to="/nodes">{{$t('link_about')}}</router-link> |
      <router-link to="/operations">{{$t('link_tools')}}</router-link>
      <router-link class="top-item" to="/login">{{$t('link_login')}}</router-link>

      <a-select class="top-item language-select" label-in-value :default-value="language" style="width: 120px" @change="handleChange">
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
export default {
  data () {
    return {
      language: {
        key: localStorage.getItem('locale') ? localStorage.getItem('locale') : 'zh'
      }
    };
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
  methods: {
    handleChange (value) {
      const type = value.key;
      // 此处做了语言选择记录
      localStorage.setItem('locale', type);
      // 修改显示语言
      this.$i18n.locale = type;
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
}

#nav {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ddd;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

  .top-item {
    float: right;
    margin-right: 30px;
    vertical-align: middle;
  }

  .language-select {
    margin-top: 10px;
  }
}
</style>
