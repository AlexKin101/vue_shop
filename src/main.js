/** @format */

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入全局样式表
import "./assets/css/global.css";
// 导入全局样式表
import "./assets/fonts/iconfont.css";
import TreeTable from "vue-table-with-tree-grid";

import axios from "axios";
// 配置请求的根路径
axios.defaults.baseURL = "http://1.15.39.179:8088/api/private/v1/";
// axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

axios.interceptors.request.use((config) => {
  //console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  //最后必须return config;
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

Vue.component("tree-table", TreeTable);

Vue.filter("dataFormat", function(originVal) {
  const dt = new Date(originVal * 1000);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  //padStart（） 第一位参数：数据应有的位数；第二位参数：数据若不足时，所使用的填充符号
  const d = (dt.getDate() + "").padStart(2, "0");
  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
