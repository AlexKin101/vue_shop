<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="ordersList" border script>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="订单编号"
          prop="number"
          width="250px"
          align="center"
        ></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column
          label="订单价格（元）"
          prop="price"
          width="90px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否付款"
          prop="payStatus"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.payStatus === 1">
              已付款
            </el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="付款方式"
          prop="pay"
          width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag type="Brand Color" v-if="scope.row.pay === 1">
              支付宝
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.pay === 2">
              微信
            </el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="isSend"
          width="90px"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag type="Brand Color" v-if="scope.row.isSend === 0">
              未发货
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.isSend === 1">
              已发货
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="下单时间"
          prop="createTime"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime | dataFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <!-- 修改地址按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showBox"
              ></el-button>
            </el-tooltip>

            <!-- 修改订单状态按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改订单状态"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showStatusBox(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 物流进度按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="物流进度"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location-outline"
                size="mini"
                @click="showProgressBox"
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

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="90px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改订单状态的对话框 -->
    <el-dialog
      title="修改订单状态"
      :visible.sync="editStatusDialogVisible"
      width="50%"
      @close="editStatusDialogClosed"
    >
      <el-form
        :model="statusForm"
        :rules="statusFormRules"
        ref="statusFormRef"
        label-width="90px"
      >
        <el-form-item label="是否已发货" prop="isSend">
          <el-switch
            v-model="statusForm.isSend"
            active-text="已发货"
            inactive-text="未发货"
          ></el-switch>
        </el-form-item>
        <el-form-item label="订单价格" prop="price">
          <el-input type="number" v-model="statusForm.price"></el-input>
        </el-form-item>
        <el-form-item label="订单数量" prop="number">
          <el-input type="number" v-model="statusForm.number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editStatusDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStatus">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <!-- timeLine时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./city_data2017_element";
import progress from "./progress";

export default {
  data() {
    return {
      // 商品的数据列表，默认为空
      ordersList: [],
      // 查询条件
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //   总数据条数
      total: 0,

      // 物流信息
      progressInfo: [],

      // 控制修改地址的对话框
      addressDialogVisible: false,

      // 控制展示物流进度的对话框
      progressDialogVisible: false,

      // 控制修改订单状态的对话框
      editStatusDialogVisible: false,

      statusForm: {
        isSend: 0,
        price: 0.0,
        number: 0,
      },

      statusFormRules: {
        price: [
          {
            required: true,
            message: "请输入订单价格",
            trigger: "blur",
          },
        ],
        number: {
          required: true,
          message: "请输入订单数量",
          trigger: "blur",
        },
      },

      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "请选择省市区/县",
            trigger: "blur",
          },
        ],

        address2: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur",
          },
        ],
      },

      // 全国省市区/县数据
      cityData,

      // 静态物流信息
      progress,
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
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
      this.ordersList = res.data.content;
    },

    async getOrder(id) {
      const { data: res } = await this.$http.get(`orders/${id}`);

      if (res.meta.status !== 200) return this.$message.error("查询失败");
      console.log(res.data);
      this.statusForm = res.data;
      this.statusForm.number = res.data.goodsNumber;

      if (this.statusForm.isSend === 1) {
        this.statusForm.isSend = true;
      } else {
        this.statusForm.isSend = false;
      }

      this.editStatusDialogVisible = true;
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

    // 展示修改地址的对话框
    showBox() {
      this.addressDialogVisible = true;
    },

    // 修改地址的对话框关闭
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },

    // 修改地址
    editAddress() {
      this.addressDialogVisible = false;
    },

    async showProgressBox() {
      // 后端接口有BUG，get请求后服务器直接崩溃
      // 使用静态假数据进行测试该功能
      // const { data: res } = await this.$http.get(`kuaidi/1106975712662`);

      const res = this.progress;

      if (res.meta.status !== 200)
        return this.$message.error("获取物流信息失败");

      this.progressInfo = res.data;
      this.progressDialogVisible = true;

      console.log(this.progressInfo);
    },

    // 展示修改订单状态的对话框
    showStatusBox(id) {
      this.getOrder(id);
      console.log(this.statusForm);
      this.editStatusDialogVisible = true;
    },

    // 修改订单状态的对话框关闭
    editStatusDialogClosed() {
      this.$refs.statusFormRef.resetFields();
    },

    // 修改订单状态
    editStatus() {
      this.$refs.statusFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;

        if (this.statusForm.isSend === true) {
          this.statusForm.isSend = 1;
        } else {
          this.statusForm.isSend = 0;
        }

        //可以发起修改订单状态的网络请求
        // console.log(this.statusForm);
        const { data: res } = await this.$http.put(
          `orders/${this.statusForm.id}`,
          null,
          {
            params: {
              isSend: this.statusForm.isSend,
              price: this.statusForm.price,
              numbers: this.statusForm.number,
            },
          }
        );

        if (res.meta.status !== 200)
          return this.$message.error("修改订单状态失败");
        //隐藏修改订单状态的对话框
        this.editStatusDialogVisible = false;
        //重新获取用户列表
        this.getOrdersList();
        //提示修改订单状态成功
        this.$message.success("修改订单状态成功");
      });
      this.editStatusDialogVisible = false;
    },
  },

  computed: {
    booleanTransfer(isSend) {
      if (isSend === 1) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.el-cascader-menu {
  height: 300px;
}
</style>
