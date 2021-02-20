<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear(); //清空sessionStorage
      this.$router.push("/login"); //重定向
    },
  },
};
</script>

<style lang="less" scoped></style>
