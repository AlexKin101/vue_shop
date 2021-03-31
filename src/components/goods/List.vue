<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->

    <el-card>
      <!-- gutter每个格子之间的距离，相当于列间距 -->
      <!-- span相当于列的宽度 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">
            添加商品
          </el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border script>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column
          label="商品分类"
          prop="categories.catName"
          width="95px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="price"
          width="95px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="weight"
          width="70px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="number"
          width="70px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="addTime"
          width="140px"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.addTime | dataFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="130px" align="center">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="goEditPage(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeGoodsById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品的数据列表，默认为空
      goodsList: [],
      // 查询条件
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   总数据条数
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      //   为总数据条数赋值
      //  this.$message.success("获取商品列表成功");
      // this.total = res.data.total;
      // this.goodsList = res.data.goods;
      this.queryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.queryInfo.pagesize = res.data.size;
      this.total = res.data.totalElements;
      this.goodsList = res.data.content;
    },

    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    //显示编辑对话框
    showEditDialog() {},

    // 根据Id删除商品
    async removeGoodsById(id) {
      //弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果用户确定删除，则返回值为字符串confirm
      //如果用户取消了删除，则返回值为字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除商品失败");
      this.$message.success("删除商品成功");
      //重新获取用户列表
      this.getGoodsList();
    },

    goAddPage() {
      this.$router.push("/goods/add");
    },

    goEditPage(id) {
      // this.$router.push("/goods/edit", { id: goods_id });
      // this.$router.push({ path: "/goods/edit/goods_id=" + this.$route.path });
      this.$router.push({
        path: "/goods/edit",
        query: { id: id },
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
