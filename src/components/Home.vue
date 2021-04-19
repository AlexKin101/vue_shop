<!-- @format -->

<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div id="app">
        <img src="../assets/vue.png" alt="" />
        <span>社区商城商家服务平台</span>
      </div>
      <el-dropdown>
        <div class="block">
          <el-avatar
            :size="50"
            :src="require('../assets/商家默认头像.jpeg')"
            style="cursor: pointer;"
            @error="errorHandler"
          ></el-avatar>
        </div>
        <el-dropdown-menu slot="dropdown" trigger="click">
          <el-dropdown-item>
            <span type="danger" @click="gotoWelcome()">
              <span class="el-icon-house"></span>
              &nbsp;系统首页
            </span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span type="danger" @click="logout">
              <span class="el-icon-switch-button"></span>
              &nbsp;退出登入
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->

      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          |||
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          class="el-menu-vertical"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-menu-item index="/home" @click="saveNavState('/home')">
            <i class="el-icon-s-platform"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模版区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.name }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 二级菜单模版区 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        "125": "el-icon-user-solid",
        "103": "el-icon-s-management",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "100": "iconfont icon-baobiao",
        "147": "el-icon-s-finance",
        "148": "el-icon-s-claim",
      },
      //是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear(); //清空sessionStorage
      this.$router.push("/login"); //重定向
    },
    //获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200)
        return this.$message.error("左侧菜单栏请求数据失败");
      this.menulist = res.data;
      // console.log(res);
    },

    //点击按钮,切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },

    //回到首页
    gotoWelcome() {
      this.$router.push("/welcome");
    },

    errorHandler() {
      return true;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}

.el-icon-more {
  margin-right: 10px;
}
.toggle-button {
  background: #4a5064;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
