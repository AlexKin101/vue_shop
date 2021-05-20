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
            {{ scope.row.orders.products.name }}
          </template>
        </el-table-column>
        <el-table-column label="商品规格" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.orders.specs }}
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <span
              class="font-small"
              v-if="scope.row.orders.products.isDiscount === 1"
            >
              折扣价：
            </span>
            <span class="font-small" v-else>
              价格：
            </span>
            <el-tooltip
              :disabled="
                scope.row.orders.products.isDiscount == 1 ? false : true
              "
              :content="
                '该商品参加折扣！原价为' +
                  scope.row.orders.products.outPrice +
                  '元'
              "
              placement="top"
              effect="dark"
            >
              <span>
                <span
                  class="font-small"
                  v-if="scope.row.orders.products.isDiscount === 1"
                  style="color:#F56C6C"
                >
                  {{ scope.row.orders.products.discountPrice }}
                </span>
                <span class="font-small" v-else>
                  {{ scope.row.orders.products.outPrice }}
                </span>
              </span>
            </el-tooltip>
            <br />
            <span class="font-small">货号：</span>
            <span class="font-small">
              {{ scope.row.orders.products.number }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="小计" width="100" align="center">
          <template slot-scope="scope">￥{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="数量" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.orders.amount }}
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
        :title="'当前状态：' + this.serviceForm.state"
        type="info"
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
              {{ this.serviceForm.state }}
            </el-form-item>
            <el-form-item label="订单编号:" prop="number">
              {{ this.serviceForm.number }}
            </el-form-item>
            <el-form-item label="下单时间:" prop="addTime">
              {{ this.serviceForm.addTime | dataFormat }}
            </el-form-item>
            <el-form-item label="申请时间:" prop="applyTime">
              {{ this.serviceForm.applyTime | dataFormat }}
            </el-form-item>
            <el-form-item label="用户名称:" prop="username">
              {{ this.serviceForm.userName }}
            </el-form-item>
            <el-form-item label="联系电话:" prop="tel">
              {{ this.serviceForm.tel }}
            </el-form-item>
            <el-form-item label="退货原因:" prop="cause">
              {{ this.serviceForm.reason }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单金额:">
              {{ this.serviceForm.price }} 元
            </el-form-item>
            <el-form-item
              label="确认退款金额:"
              label-width="120px"
              prop="returnPrice"
            >
              <el-input
                oninput="value=value.replace(/[^0-9.]/g,'')"
                :placeholder="serviceForm.price"
                v-model="serviceForm.returnPrice"
                :disabled="judgeDisable(this.serviceForm.state)"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="商品图片:">
              <img
                :src="this.serviceForm.picture"
                width="400px"
                height="400px"
              />
            </el-form-item>
          </el-col>

          <!--按钮-->
          <el-col :span="8">
            <div class="btns">
              <el-form-item>
                <el-button
                  type="primary"
                  @click="agreeReturn"
                  style="margin-bottom:15px"
                  :disabled="judgeReturnDisable(this.serviceForm.state)"
                >
                  同意退货
                </el-button>
                <br />
                <el-button
                  type="primary"
                  @click="rejectReturn"
                  style="margin-bottom:15px"
                  :disabled="judgeReturnDisable(this.serviceForm.state)"
                >
                  拒绝退货
                </el-button>
                <br />
                <el-button
                  type="primary"
                  @click="agree"
                  style="margin-bottom:15px"
                  :disabled="this.judgeDisable(this.serviceForm.state)"
                >
                  同意退款
                </el-button>
                <br />
                <el-button
                  type="info"
                  @click="reject"
                  :disabled="this.judgeDisable(this.serviceForm.state)"
                >
                  拒绝退款
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
    const validatePrice = (rule, value, callback) => {
      let reg = /^-?([1-9]\d*|0)(\.\d{1,2})?$/;
      if (!value) {
        callback(new Error("价格不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确格式的价格"));
      } else if (value.length > 10) {
        callback(new Error("最多可输入10个字符"));
      } else {
        callback();
      }
    };
    return {
      // 商品信息
      goodsInfoList: [],

      serviceInfo: [],

      activeIndex: 0,

      serviceForm: {
        id: 0, //服务单号
        status: "", //申请状态
        orderId: 0, //订单编号
        addTime: 0,
        applyTime: 0, //申请时间
        username: "", //用户账号
        tel: "", //联系电话
        casue: "", //退货原因
        intro: "", //问题描述
        number: "",
        amount: 0,
        opName: "",
        opNumber: "",

        price: 0.0, // 订单金额
        comment: "", // 处理备注

        returnPrice: 0.0, //确认退款金额

        status: 0, //退换货订单状态
      },
      serviceFormRules: {
        returnPrice: [
          {
            required: true,
            validator: validatePrice,
            message: "请输入正确的退款金额",
            trigger: "blur",
          },
        ],
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
      console.log(res);

      this.goodsInfoList = res.data;
      this.serviceForm = res.data[0];
      this.serviceForm.orderId = res.data[0].orders.id;
      this.serviceForm.number = res.data[0].orders.number;
      this.serviceForm.addTime = res.data[0].orders.addTime;
      this.serviceForm.tel = res.data[0].customer.tel;
      this.serviceForm.price = res.data[0].price;
      this.serviceForm.amount = res.data[0].orders.amount;
      this.serviceForm.picture = res.data[0].orders.products.picture;
      this.serviceForm.isSend = res.data[0].orders.isSend;
      // this.serviceForm.returnPrice = res.data[0].price;
      // console.log(this.serviceForm);
      this.judgeState(this.serviceForm.isSend, this.serviceForm.state);
    },

    async agreeReturn() {
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

      this.serviceForm.opName = window.sessionStorage.getItem("name");
      this.serviceForm.opNumber = window.sessionStorage.getItem("account");

      this.serviceForm.state = "允许退货";

      const { data: res } = await this.$http.put(
        `return/handle/${this.$route.query.id}`,
        this.serviceForm
      );

      if (res.meta.status !== 200) return this.$message.error("处理失败");

      this.$message.success("处理成功");
      // this.$router.push("/returns");
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

      this.serviceForm.opName = window.sessionStorage.getItem("name");
      this.serviceForm.opNumber = window.sessionStorage.getItem("account");
      this.serviceForm.handleTime = new Date();

      if (this.serviceForm.state === "允许退货") {
        this.serviceForm.state = "退货完成";
      } else {
        this.serviceForm.state = "退款完成";
      }

      const { data: res } = await this.$http.put(
        `return/handle/${this.$route.query.id}`,
        this.serviceForm
      );

      if (res.meta.status !== 200) return this.$message.error("处理失败");

      this.$message.success("处理成功");
      this.$router.push("/returns");
    },

    async rejectReturn() {
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

      // if (this.serviceForm.state === "待处理") {
      this.serviceForm.state = "已拒绝";
      // } else {
      //   this.serviceForm.state = "拒绝退款";
      // }

      this.serviceForm.opName = window.sessionStorage.getItem("name");
      this.serviceForm.opNumber = window.sessionStorage.getItem("account");
      this.serviceForm.handleTime = new Date();

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

      this.serviceForm.state = "拒绝退款";

      this.serviceForm.opName = window.sessionStorage.getItem("name");
      this.serviceForm.opNumber = window.sessionStorage.getItem("account");
      this.serviceForm.handleTime = new Date().Format("yyyy-MM-dd:hh:mm:ss");

      const { data: res } = await this.$http.put(
        `return/handle/${this.$route.query.id}`,
        this.serviceForm
      );

      if (res.meta.status !== 200) return this.$message.error("处理失败");

      this.$message.success("处理成功");
      this.$router.push("/returns");
    },

    judgeDisable(stateStr) {
      if (
        stateStr == "退款完成" ||
        stateStr == "拒绝退款" ||
        stateStr == "已拒绝" ||
        stateStr == "退货完成"
      ) {
        return true;
      } else {
        if (stateStr === "待退款" && this.serviceForm.isSend === 0) {
          return false;
        } else {
          if (stateStr == "允许退货") {
            return false;
          } else {
            return true;
          }
        }
      }
    },

    judgeReturnDisable(stateStr) {
      if (stateStr == "待处理" && this.serviceForm.isSend) {
        return false;
      } else {
        if (
          stateStr == "允许退货" ||
          stateStr == "退货完成" ||
          stateStr == "退款完成" ||
          stateStr == "拒绝退款" ||
          stateStr == "已拒绝"
        ) {
          return true;
        } else {
          if (stateStr === "待退款" && this.serviceForm.isSend === 0) {
            return true;
          } else {
            return false;
          }
        }
      }
    },

    // judgeState(isSendStr, stateStr) {
    //   if (isSendStr === 1) {
    //     // 同意退货
    //     if (stateStr == "待处理") {
    //       this.activeIndex = 1;
    //     } else if (stateStr == "同意退货") {
    //       this.activeIndex = 2;
    //     } else if (stateStr == "同意退款") {
    //       this.activeIndex = 3;
    //     } else if (stateStr == "退货完成") {
    //       this.activeIndex = 4;

    //       // 同意退货 但不同意
    //     } else if (stateStr == "拒绝退款") {
    //       this.activeIndex = 3;
    //     }
    //   } else {
    //     // 同意退款
    //     if (stateStr == "待处理") {
    //       this.activeIndex = 1;
    //     } else if (stateStr == "同意退款") {
    //       this.activeIndex = 2;
    //     } else if (stateStr == "退款完成") {
    //       this.activeIndex = 3;
    //     } else if (stateStr == "拒绝退款") {
    //       this.activeIndex = 3;
    //     }
    //   }
    // },
  },

  computed: {
    totalAmount() {
      return this.serviceForm.price * this.serviceForm.amount;
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
