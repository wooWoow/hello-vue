/* eslint-disable */
import axios from "axios";
import { getToken } from "./tool";
import * as _ from "lodash";
import { logoutNow } from "./tool";
import { message } from "ant-design-vue";

const DevBaseUrl = "/";
const ProdBashUrl = "/";

let config = {
  baseURL: process.env.NODE_ENV !== "production" ? DevBaseUrl : ProdBashUrl // 配置API接口地址
};

let token = getToken();
if (token) {
  config.headers = { Authorization: "Bearer " + token };
}

let request = axios.create(config);

// http request 拦截器
request.interceptors.request.use(
  config => {
    if (window) {
      let token = getToken();
      if (token) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.method === "get") {
      // get请求统一加上时间戳，防止浏览器缓存
      if (config.params) {
        config.params["timestamp"] = Date.now().toString();
      } else {
        config.params = {};
        config.params["timestamp"] = Date.now().toString();
      }
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// 防抖动
const throttleInstance = _.throttle(
  function() {
    // 401时移除登陆信息
    logoutNow();

    message.error('用户未登录!!'); 
  },
  5000,
  {
    leading: true,
    trailing: false
  }
);

// 响应拦截
request.interceptors.response.use(
  response => {
    // 响应成功回调
    return response;
  },
  err => {
    if (err.response.status === 401) {
      throttleInstance();
    }
    return Promise.reject(err.response.status); // 返回接口返回的错误信息
  }
);

export default request;

/* eslint-disable no-new */
