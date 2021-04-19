<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>营销管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品推荐</el-breadcrumb-item>
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
            v-model="promoteQueryInfo.query"
            clearable
            @clear="getPromoteGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getPromoteGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog">
            添加商品
          </el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="promoteGoodsList" border script>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品编号"
          prop="number"
          width="130px"
          align="center"
        ></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column
          label="商品分类"
          prop="type.name"
          width="95px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="outPrice"
          width="95px"
          align="center"
          sortable
        ></el-table-column>

        <el-table-column label="状态" align="center" width="100px" prop="state">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-tag type="success" v-if="scope.row.isPromote === 1">
              推荐中
            </el-tag>
            <el-tag type="danger" v-else>未推荐</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="130px" align="center">
          <template slot-scope="scope">
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
        @size-change="handlePromoteSizeChange"
        @current-change="handlePromoteCurrentChange"
        :current-page="promoteQueryInfo.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="promoteQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="promoteTotal"
        background
      ></el-pagination>
    </el-card>

    <!-- 添加商品的对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addDialogVisible"
      width="75%"
      @close="addDialogClosed"
    >
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
      </el-row>

      <!-- 内容主体区域 -->
      <el-table
        ref="multipleTable"
        :data="goodsList"
        tooltip-effect="dark"
        style="width: 100%"
        center
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品编号"
          width="130px"
          prop="number"
          sortable
        ></el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="商品分类"
          prop="type.name"
          width="95px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="outPrice"
          width="95px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          label="商品库存"
          prop="stock"
          width="70px"
          align="center"
          sortable
        ></el-table-column>

        <el-table-column
          label="创建时间"
          prop="addTime"
          width="140px"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.addTime | dataFormat }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <div style="margin-top: 20px" align="right">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button @click="agree">确定</el-button>
        </div>
      </span>
    </el-dialog>
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
        pagesize: 5,
      },
      //   总数据条数
      total: 0,

      multipleSelection: [],

      // 促销商品的数据列表，默认为空
      promoteGoodsList: [],
      // 查询条件
      promoteQueryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   总数据条数
      promoteTotal: 0,

      addDialogVisible: false, //控制添加商品促销的对话框
    };
  },
  created() {
    this.getPromoteGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods/nopromote", {
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

    async getPromoteGoodsList() {
      const { data: res } = await this.$http.get("goods/promote", {
        params: this.promoteQueryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      //   为总数据条数赋值
      this.promoteQueryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.promoteQueryInfo.pagesize = res.data.size;
      this.promoteTotal = res.data.totalElements;
      this.promoteGoodsList = res.data.content;
    },

    //对话框中的表格
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

    // 监听pagesize改变
    handlePromoteSizeChange(newSize) {
      this.promoteQueryInfo.pagesize = newSize;
      this.getPromoteGoodsList();
    },
    // 监听pagenum的改变
    handlePromoteCurrentChange(newPage) {
      this.promoteQueryInfo.pagenum = newPage;
      this.getPromoteGoodsList();
    },

    // 根据Id删除商品促销
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
      const { data: res } = await this.$http.delete(
        `goods/promote/delete/${id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除商品失败");
      this.$message.success("删除商品成功");
      //重新获取用户列表
      this.getPromoteGoodsList();
    },

    //显示对话框
    showDialog() {
      this.getGoodsList();
      this.addDialogVisible = true;
    },

    //监听修改对话框的关闭事件
    addDialogClosed() {
      this.$refs.multipleTable.clearSelection();
    },

    async agree() {
      //弹窗询问用户是否确认数据
      const confirmResult = await this.$confirm(
        "此操作将修改商品促销状态, 是否继续?",
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
      const { data: res } = await this.$http.put(
        `goods/promote`,
        this.multipleSelection
      );
      if (res.meta.status !== 200)
        return this.$message.error("添加促销商品失败");
      this.getPromoteGoodsList();
      this.addDialogVisible = false;
      //   console.log(this.multipleSelection);
      this.$message.success("添加促销商品成功");
    },

    handleSelectionChange: function(val) {
      this.multipleSelection = val;
      //   console.log(val);
    },
  },
};
</script>

<style lang="less" scoped></style>
