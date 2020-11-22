/* eslint-disable */
import axios from "axios";
import { getToken } from "./tool";

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
axios.interceptors.request.use(
  config => {
    if (window) {
      let token = getToken();
      if (token) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.method === "get") {
      config.url = config.url + "timestamp=" + Date.now().toString();
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

export default request;

/* eslint-disable no-new */