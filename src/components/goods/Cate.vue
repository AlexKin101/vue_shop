<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template v-slot:isOk="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:green"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
          >
            二级
          </el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-search" size="mini">
            搜索
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">
            删除
          </el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      //   总数据条数
      total: 0,
      //   为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模版列
          type: "template",
          // 表示当前这一列使用的模版名称
          template: "isOk",
        },
        {
          label: "排序",
          // 表示将当前列定义为模版列
          type: "template",
          // 表示当前这一列使用的模版名称
          template: "order",
        },
        {
          label: "操作",
          // 表示将当前列定义为模版列
          type: "template",
          // 表示当前这一列使用的模版名称
          template: "opt",
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      console.log(res.data);
      //   把数据列表赋值给cateList
      this.cateList = res.data.result;
      //   为总数据条数赋值
      this.total = res.data.total;
    },
  },
};
</script>

<style lang="less" scoped></style>
