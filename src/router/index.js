/** @format */

import Vue from "vue";
import Router from "vue-router";
import Login from "../components/Login";
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
import Rights from "../components/power/Rights";
import Roles from "../components/power/Roles";
import Cate from "../components/goods/Cate";
import Params from "../components/goods/Params";
import GoodsList from "../components/goods/List";
import Add from "../components/goods/Add";
import Edit from "../components/goods/Edit";
import Order from "../components/order/Order";
import Return from "../components/order/Return";
import ReturnReason from "../components/order/ReturnReason";
import ReturnInfo from "../components/order/ReturnInfo";
import Report from "../components/report/Report";
import Brand from "../components/goods/Brand";
import Activity from "../components/marketing/Activity";
import Carousel from "../components/marketing/Carousel";

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
      component: Login,
      beforeEnter: (to, from, next) => {
        next();
      },
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome,
        },
        {
          path: "/users",
          component: Users,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "人事管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/rights",
          component: Rights,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "人事管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/roles",
          component: Roles,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "人事管理员") {
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
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "商品管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/params",
          component: Params,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "商品管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/goods",
          component: GoodsList,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "商品管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/goods/add",
          component: Add,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "商品管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/goods/edit",
          component: Edit,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "商品管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/brands",
          component: Brand,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "商品管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/orders",
          component: Order,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "订单管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/reports",
          component: Report,
        },
        {
          path: "/returns",
          component: Return,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "订单管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/returns/returninfo",
          component: ReturnInfo,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "订单管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/activities",
          component: Activity,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/carousel",
          component: Carousel,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员") {
              next();
            } else {
              alert("抱歉，您无权限进入该页面");
              next(false);
            }
          },
        },
        {
          path: "/reason",
          component: ReturnReason,
          beforeEnter: (to, from, next) => {
            const role = window.sessionStorage.getItem("role");
            if (role === "超级管理员" || role === "订单管理员") {
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
  if (to.path === "/welcome") return next();

  if (to.path === "/login") return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem("token");

  if (!tokenStr) return next("/login");
  next();
});

export default router;
