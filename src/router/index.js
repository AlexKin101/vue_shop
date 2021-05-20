/** @format */

import Vue from "vue";
import Router from "vue-router";

// import Login from "../components/Login";
// import Home from "../components/Home";
// import Welcome from "../components/Welcome";
const Login = () =>
  import(/* webpackChunkName:"login_home_welcome" */ "../components/Login");
const Home = () =>
  import(/* webpackChunkName:"login_home_welcome" */ "../components/Home");
const Welcome = () =>
  import(/* webpackChunkName:"login_home_welcome" */ "../components/Welcome");

// import Users from "../components/user/Users";
const Users = () =>
  import(/* webpackChunkName:"user" */ "../components/user/Users");
const ChangePassword = () =>
  import(
    /* webpackChunkName:"change_password"*/ "../components/user/ChangePassword"
  );

// import Rights from "../components/power/Rights";
// import Roles from "../components/power/Roles";
const Rights = () =>
  import(/* webpackChunkName:"power" */ "../components/power/Rights");
const Roles = () =>
  import(/* webpackChunkName:"user" */ "../components/power/Roles");

// import Cate from "../components/goods/Cate";
// import Params from "../components/goods/Params";
// import GoodsList from "../components/goods/List";
// import Add from "../components/goods/Add";
// import Edit from "../components/goods/Edit";
// import Brand from "../components/goods/Brand";
const Cate = () =>
  import(/* webpackChunkName:"goods" */ "../components/goods/Cate");
const Params = () =>
  import(/* webpackChunkName:"goods" */ "../components/goods/Params");
const GoodsList = () =>
  import(/* webpackChunkName:"goods" */ "../components/goods/List");
const Add = () =>
  import(/* webpackChunkName:"goods" */ "../components/goods/Add");
const Edit = () =>
  import(/* webpackChunkName:"goods" */ "../components/goods/Edit");
const Brand = () =>
  import(/* webpackChunkName:"goods" */ "../components/goods/Brand");

// import Order from "../components/order/Order";
// import Return from "../components/order/Return";
// import ReturnReason from "../components/order/ReturnReason";
// import ReturnInfo from "../components/order/ReturnInfo";
const Order = () =>
  import(/* webpackChunkName:"order" */ "../components/order/Order");
const Return = () =>
  import(/* webpackChunkName:"order" */ "../components/order/Return");
const ReturnReason = () =>
  import(/* webpackChunkName:"order" */ "../components/order/ReturnReason");
const ReturnInfo = () =>
  import(/* webpackChunkName:"order" */ "../components/order/ReturnInfo");

// import Report from "../components/report/Report";
const Report = () =>
  import(/* webpackChunkName:"report" */ "../components/report/Report");

// import Activity from "../components/marketing/Activity";
// import Carousel from "../components/marketing/Carousel";
const Activity = () =>
  import(/* webpackChunkName:"marketing" */ "../components/marketing/Activity");
const Carousel = () =>
  import(/* webpackChunkName:"marketing" */ "../components/marketing/Carousel");
const Discount = () =>
  import(/* webpackChunkName:"marketing" */ "../components/marketing/Discount");

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(Router);

const router = new Router({
  routes: [
    { path: "/", redirect: "/login" },
    {
      path: "/login",
      name: "登录",
      component: Login,
      meta: {
        title: "登录",
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title;
        }
        next();
      },
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          name: "首页",
          path: "/welcome",
          component: Welcome,
          meta: {
            title: "首页",
          },
        },
        {
          name: "用户管理",
          path: "/users",
          component: Users,
          meta: {
            title: "用户管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }

            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "businessAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "修改密码",
          path: "/changepassword",
          meta: {
            title: "修改密码",
          },
          component: ChangePassword,
        },
        {
          name: "权限管理",
          path: "/rights",
          component: Rights,
          meta: {
            title: "权限管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "businessAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "角色管理",
          path: "/roles",
          component: Roles,
          meta: {
            title: "角色管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "businessAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/categories",
          component: Cate,
          meta: {
            title: "分类管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "productAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "规格管理",
          path: "/params",
          component: Params,
          meta: {
            title: "规格管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "productAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "商品管理",
          path: "/goods",
          component: GoodsList,
          meta: {
            title: "商品管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "productAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "商品添加",
          path: "/goods/add",
          component: Add,
          meta: {
            title: "商品添加",
          },
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "productAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "商品编辑",
          path: "/goods/edit",
          component: Edit,
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "productAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "品牌管理",
          path: "/brands",
          component: Brand,
          meta: {
            title: "品牌管理",
          },
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "productAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "订单管理",
          path: "/orders",
          component: Order,
          meta: {
            title: "订单管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "orderAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "数据报表",
          path: "/reports",
          component: Report,
          meta: {
            title: "数据报表",
          },
        },
        {
          name: "退换货管理",
          path: "/returns",
          component: Return,
          meta: {
            title: "退换货管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "orderAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "退换货订单详情",
          path: "/returns/returninfo",
          component: ReturnInfo,
          meta: {
            title: "退换货订单详情",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "orderAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "新品推荐",
          path: "/activities",
          component: Activity,
          meta: {
            title: "新品推荐",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "轮播图管理",
          path: "/carousel",
          component: Carousel,
          meta: {
            title: "轮播图管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "商品折扣",
          path: "/discount",
          component: Discount,
          meta: {
            title: "商品折扣",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          name: "退换货原因管理",
          path: "/reason",
          component: ReturnReason,
          meta: {
            title: "退换货原因管理",
          },
          beforeEnter: (to, from, next) => {
            if (to.meta.title) {
              document.title = to.meta.title;
            }
            const role = window.sessionStorage.getItem("role");
            if (role === "superAdmin" || role === "orderAdmin") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
      ],
    },
  ],
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数,表示放行
  //  next() 放行         next('/login') 强制跳转
  // const nameStr = window.localStorage.getItem("name");
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.path === "/welcome") return next();

  if (to.path === "/login") return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem("token");

  if (!tokenStr) return next("/login");
  next();
});

export default router;
