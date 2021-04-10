<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/returns' }">
        退换货管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>退换货订单详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="退换货订单详情"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>

      <el-table border script class="standard-margin" :data="goodsInfoList">
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.goods.name }}
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <span class="font-small">价格：</span>
            <span class="font-small">{{ scope.row.goods.price }}</span>
            <br />
            <span class="font-small">货号：</span>
            <span class="font-small">{{ scope.row.goods.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小计" width="100" align="center">
          <template slot-scope="scope">￥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="数量" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.goodsNumber }}
          </template>
        </el-table-column>
      </el-table>
      <div style="float:right;margin-top:15px;margin-bottom:15px">
        <span class="font-title-medium">合计：</span>
        <span class="font-title-medium color-danger">￥{{ totalAmount }}</span>
      </div>
    </el-card>

    <el-card style="margin-top:10px">
      <!-- 提示区域 -->
      <el-alert
        title="服务单详情"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <el-alert
        :title="'当前状态：' + judgeStatus(this.serviceForm.status)"
        :type="judgeType(this.serviceForm.status)"
        effect="dark"
        center
        :closable="false"
      ></el-alert>
      <br />
      <el-form
        :model="serviceForm"
        :rules="serviceFormRules"
        ref="serviceFormRef"
        label-width="80px"
        label-position="left"
        style="margin-left:20px"
      >
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="服务单号:" prop="id">
              {{ this.serviceForm.id }}
            </el-form-item>
            <el-form-item label="申请状态:" prop="status">
              {{ judgeStatus(this.serviceForm.status) }}
            </el-form-item>
            <el-form-item label="订单编号:" prop="orderId">
              {{ this.serviceForm.orders.number }}
            </el-form-item>
            <el-form-item label="下单时间:" prop="applyTime">
              {{ this.serviceForm.orders.createTime | dataFormat }}
            </el-form-item>
            <el-form-item label="申请时间:" prop="applyTime">
              {{ this.serviceForm.applyTime | dataFormat }}
            </el-form-item>
            <el-form-item label="用户名称:" prop="username">
              {{ this.serviceForm.username }}
            </el-form-item>
            <el-form-item label="联系电话:" prop="tel">
              {{ this.serviceForm.tel }}
            </el-form-item>
            <el-form-item label="退货原因:" prop="cause">
              {{ this.serviceForm.cause }}
            </el-form-item>
            <el-form-item label="问题描述:" prop="cause">
              {{ this.serviceForm.intro }}
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="订单金额:" prop="price">
              {{ this.serviceForm.orders.price }} 元
            </el-form-item>
            <el-form-item
              label="确认退款金额:"
              prop="price"
              label-width="100px"
            >
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                placeholder="请输入退款金额"
                v-model="serviceForm.price"
                :disabled="this.serviceForm.status === 0 ? false : true"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="处理备注:" prop="comment" label-width="100px">
              <el-input
                placeholder="请输入处理备注"
                v-model="serviceForm.comment"
                :disabled="this.serviceForm.status === 0 ? false : true"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>

          <!--按钮-->
          <el-col :span="8">
            <div class="btns">
              <el-form-item>
                <el-button
                  type="primary"
                  @click="agree"
                  style="margin-bottom:15px"
                  :disabled="this.serviceForm.status === 0 ? false : true"
                >
                  同意退货
                </el-button>
                <br />
                <el-button
                  type="info"
                  @click="reject"
                  :disabled="this.serviceForm.status === 0 ? false : true"
                >
                  拒绝退货
                </el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品信息
      goodsInfoList: [],

      serviceForm: {
        id: 0, //服务单号
        status: "", //申请状态
        orderId: 0, //订单编号
        applyTime: 0, //申请时间
        username: "", //用户账号
        tel: "", //联系电话
        casue: "", //退货原因
        intro: "", //问题描述

        price: 0.0, // 订单金额
        comment: "", // 处理备注

        returnPrice: 0.0, //确认退款金额

        status: 0, //退换货订单状态
      },
    };
  },
  created() {
    this.getReturnOrder();
  },

  mounted() {},
  methods: {
    async getReturnOrder() {
      const { data: res } = await this.$http.get(
        `return/${this.$route.query.id}`
      );

      if (res.meta.status !== 200) return this.$message.error("查询失败");
      //console.log(res);

      this.goodsInfoList = res.data;
      this.serviceForm = res.data[0];
      this.serviceForm.orderId = res.data[0].orders.id;
      this.serviceForm.username = res.data[0].user.username;
      this.serviceForm.tel = res.data[0].user.tel;
      console.log(this.serviceForm);
    },

    judgeStatus(status) {
      if (status === 1) {
        return "退货中";
      } else if (status === 2) {
        return "已完成";
      } else if (status === 3) {
        return "已拒绝";
      } else {
        return "待处理";
      }
    },

    judgeType(status) {
      if (status === 1) {
        return "warning";
      } else if (status === 2) {
        return "success";
      } else if (status === 3) {
        return "error";
      } else {
        return "info";
      }
    },

    async agree() {
      const confirmResult = await this.$confirm(
        "此操作将永久修改该服务单状态, 是否继续?",
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

      this.serviceForm.status = 1;

      const { data: res } = await this.$http.put(
        `return/handle/${this.$route.query.id}`,
        this.serviceForm
      );

      if (res.meta.status !== 200) return this.$message.error("处理失败");

      this.$message.success("处理成功");
      this.$router.push("/returns");
    },

    async reject() {
      const confirmResult = await this.$confirm(
        "此操作将永久修改该服务单状态, 是否继续?",
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

      this.serviceForm.status = 3;

      const { data: res } = await this.$http.put(
        `return/handle/${this.$route.query.id}`,
        this.serviceForm
      );

      if (res.meta.status !== 200) return this.$message.error("处理失败");

      this.$message.success("处理成功");
      this.$router.push("/returns");
    },
  },

  computed: {
    totalAmount() {
      return this.goodsInfoList[0].price * this.goodsInfoList[0].goodsNumber;
    },
  },
};
</script>

<style lang="less" scoped>
.btns {
  display: flex;
  justify-content: flex-end;
  margin-right: 100px;
  margin-top: 80px;
}
</style>
