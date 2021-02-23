/* eslint-disable */
import Vue from "vue";
import VueCookies from "vue-cookies";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

// 引入Antd
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// 引入i18n国际化插件
import VueI18n from "vue-i18n";

// 公共样式
import "./assets/css/global.scss";
import "./assets/css/common.scss";

// mavon-editor
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";

// iconfont svg
import "@/assets/iconfont/iconfont";
import "@/assets/iconfont/iconfont.css";

Vue.config.productionTip = false;
// 使用vue-i18n
Vue.use(VueI18n);
// 使用Antd
Vue.use(Antd);
// 使用mavon-editor
Vue.use(mavonEditor);
// 使用vue-cookies
Vue.use(VueCookies);

// 注册i18n实例并引入语言文件，文件格式等下解析
const i18n = new VueI18n({
  locale: localStorage.getItem("locale") || "zh",
  messages: {
    zh: require("@/assets/i18n/ZH_CN/zh.json"),
    en: require("@/assets/i18n/EN_US/en.json")
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

/* eslint-disable no-new */
