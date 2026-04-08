/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createApp } from "vue";
import VueCookies from 'vue3-cookies';
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

// 引入Antd
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
// 引入i18n国际化插件
import { createI18n } from 'vue-i18n';

// 公共样式
import "./assets/css/global.scss";
import "./assets/css/common.scss";

// v-md-editor
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// 配置v-md-editor
VMdEditor.use(githubTheme);

// iconfont svg
import "@/assets/iconfont/iconfont";
import "@/assets/iconfont/iconfont.css";

// 注册i18n实例并引入语言文件，文件格式等下解析
const i18n = createI18n({
  locale: localStorage.getItem("locale") || "zh",
  messages: {
    zh: require("@/assets/i18n/ZH_CN/zh.json"),
    en: require("@/assets/i18n/EN_US/en.json")
  }
});

const app = createApp(App as any);

// 使用插件
app.use(router);
app.use(store);
app.use(i18n);
app.use(Antd);
app.use(VMdEditor);
app.use(VueCookies);

app.mount("#app");

/* eslint-disable no-new */
