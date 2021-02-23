/* eslint-disable */
let Tool = {
  // 写 cookies
  setCookie: (name, value, time) => {
    if (time) {
      let strsec = getsec(time);
      let exp = new Date();
      exp.setTime(exp.getTime() + parseInt(strsec));
      document.cookie =
        name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    } else {
      document.cookie = name + "=" + escape(value);
    }
  },
  // 读 cookies
  getCookie: name => {
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    let arr = document.cookie.match(reg);
    return arr ? unescape(arr[2]) : null;
  },
  // 删 cookies
  delCookie: name => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = Tool.getCookie(name);
    if (cval != null) {
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
  },
  // 获取Token
  getToken: () => {
    if (window.sessionStorage && window.sessionStorage.Bearer) {
      return window.sessionStorage.Bearer;
    } else if (window.localStorage && window.localStorage.Bearer) {
      return window.localStorage.Bearer;
    } else if (window.document.cookie) {
      return Tool.getCookie("Bearer");
    }
  },
  // 设置Token
  setToken: (token, rememberTime) => {
    if (window.sessionStorage) {
      window.sessionStorage.Bearer = token;
    }

    if ((rememberTime && window.localStorage) || !window.sessionStorage) {
      window.localStorage.Bearer = token;
    }

    if (
      window.document.cookie &&
      !window.sessionStorage &&
      !window.localStorage
    ) {
      if (rememberTime) {
        Tool.setCookie("Bearer", token, rememberTime);
      } else {
        Tool.setCookie("Bearer", token);
      }
    }
  },
  // 删除Token
  delToken: () => {
    if (window.sessionStorage && window.sessionStorage.Bearer) {
      window.sessionStorage.removeItem("Bearer");
    }

    if (window.localStorage && window.localStorage.Bearer) {
      window.localStorage.removeItem("Bearer");
    }

    if (window.document.cookie) {
      Tool.delCookie("Bearer");
    }
  },
  dateFormat: date => {
    const opt = {
      year: date.getFullYear().toString(), // 年
      month: (date.getMonth() + 1).toString(), // 月
      day: date.getDate().toString(), // 日
      hour: date.getHours().toString(), // 时
      minute: date.getMinutes().toString(), // 分
      sec: date.getSeconds().toString() // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    return opt;
  },
  logoutNow: () => {
    Tool.delToken();
    Tool.delCookie("userName");
    Tool.delCookie("userId");
  }
};
module.exports = {
  ...Tool
};

/* eslint-disable no-new */
