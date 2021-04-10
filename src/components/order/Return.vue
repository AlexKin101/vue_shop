<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>
        退换货管理
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getReturnOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getReturnOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="returnOrdersList" border script>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="服务单号"
          prop="number"
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="申请时间"
          prop="applyTime"
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.applyTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="goods.name"></el-table-column>
        <el-table-column
          label="退款金额（元）"
          prop="price"
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户账号"
          prop="user.username"
          align="center"
          width="180px"
        ></el-table-column>
        <el-table-column
          label="申请情况"
          prop="status"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 1">
              退货中
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2">
              已完成
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 3">
              已拒绝
            </el-tag>
            <el-tag type="danger" v-else>待处理</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="是否已发货"
          prop="orders.isSend"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag type="Brand Color" v-if="scope.row.orders.isSend === 0">
              未发货
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.orders.isSend === 1">
              已发货
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="付款方式"
          prop="orders.pay"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag type="Brand Color" v-if="scope.row.orders.pay === 1">
              支付宝
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.orders.pay === 2">
              微信
            </el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="处理时间"
          prop="handleTime"
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.handleTime | dataFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详情"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="gotoReturnInfoPage(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 确认完成按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="确认完成"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-check"
                size="mini"
                @click="affirm(scope.row.id)"
                :disabled="scope.row.status === 2 ? true : false"
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
        :page-sizes="[5, 10, 30, 50]"
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
      // 退换货订单的数据列表，默认为空
      returnOrdersList: [],
      // 查询条件
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //   总数据条数
      total: 0,
    };
  },
  created() {
    this.getReturnOrdersList();
  },
  methods: {
    async getReturnOrdersList() {
      const { data: res } = await this.$http.get("return", {
        params: this.queryInfo,
      });

      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败");
      //   为总数据条数赋值
      //  this.$message.success("获取订单列表成功");
      this.queryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.queryInfo.pagesize = res.data.size;
      this.total = res.data.totalElements;
      this.returnOrdersList = res.data.content;
    },

    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    },
    gotoReturnInfoPage(id) {
      this.$router.push({
        path: "/returns/returninfo",
        query: { id: id },
      });
    },

    // 确认服务单完成
    async affirm(id) {
      const confirmResult = await this.$confirm(
        "该服务单是否已经处理完毕?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消");
      }

      const { data: res } = await this.$http.put(
        `return/handle/${id}/status`,
        null,
        {
          params: { status: 2 },
        }
      );

      if (res.meta.status !== 200) return this.$message.error("处理失败");

      this.$message.success("处理成功");

      this.getReturnOrdersList();
    },
  },
};
</script>

<style lang="less" scoped></style>
