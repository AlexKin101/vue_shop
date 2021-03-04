<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部的警告区域 -->
      <el-alert
        title="注意：只允许第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            @change="handleChange"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              //checkStrictly: 'false',
            }"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" size="small" :disabled="isBtnDisabled">
            {{ this.activeBtnName }}
          </el-button>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" size="small" :disabled="isBtnDisabled">
            {{ this.activeBtnName }}
          </el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      //   级联选择框双向绑定到的数组
      selectedCateKeys: [],
      //   被激活的页签名称
      activeName: "first",
      //   tab页签按钮的名称
      activeBtnName: "添加参数",
    };
  },
  created() {
    //   获取所有的商品分类列表
    this.getCateList();
  },
  methods: {
    //   获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      console.log(res.data);
      //   把数据列表赋值给cateList
      this.cateList = res.data;

      console.log(this.cateList);
    },

    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      //   证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }

      //   证明选中的是三级分类
      console.log(this.selectedCateKeys);
    },

    // tab页签点击事件的处理函数
    handleTabClick() {
      if (this.activeName == "first") {
        this.activeBtnName = "添加参数";
      } else {
        this.activeBtnName = "添加属性";
      }
      console.log(this.activeName);
    },
  },
  computed: {
    // 如果按钮需要被禁用，返回true，否则返回false
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3;
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
