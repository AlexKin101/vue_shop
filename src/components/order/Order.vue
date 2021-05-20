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
      <el-row :gutter="18">
        <el-col :span="6">
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
        <el-col :span="14">
          <el-select
            v-model="selectedKey"
            clearable
            @clear="clearSelectedKey"
            @change="handleChange"
            placeholder="请选择订单状态"
          >
            <el-option
              clearable
              v-for="item in stateList"
              :key="item.id"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showUnFinishDialogVisible = true">
            长时间未确认收货的订单
          </el-button>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="ordersList" border :row-class-name="tableRowClassName">
        <!-- 展开项 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="expandInfo">
              <el-form label-position="left" inline style="width:80%">
                <el-row>
                  <el-col :span="8" margin-right="30px">
                    <el-form-item label="商品图片：">
                      <img
                        :src="scope.row.products.picture"
                        width="200px"
                        height="200px"
                      />
                    </el-form-item>
                    <el-form-item label="商品名称：">
                      <el-tag type="info">{{ scope.row.products.name }}</el-tag>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="商品数量：">
                      <span>{{ scope.row.amount }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="商品分类：">
                      <span>{{ scope.row.products.type.name }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="商品规格：">
                      <span v-if="scope.row.specs">{{ scope.row.specs }}</span>
                      <span v-else>NULL</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="商品售价：">
                      <span>{{ scope.row.products.outPrice + " 元" }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="当前商品库存：">
                      <span>{{ scope.row.products.stock }}</span>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="商品品牌：">
                      <span>{{ scope.row.products.brands.name }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="收货人名称：">
                      <span>{{ scope.row.userName }}</span>
                    </el-form-item>
                    <el-form-item label="收货人地址：">
                      <span>{{ scope.row.address }}</span>
                    </el-form-item>
                    <el-form-item label="收货人联系方式：">
                      <span>{{ scope.row.contactWay }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="订单编号"
          prop="number"
          width="150px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            {{ scope.row.products.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="订单价格（元）"
          prop="price"
          width="90px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column label="用户名称" width="90px" align="center" sortable>
          <template slot-scope="scope">
            {{ scope.row.userName }}
          </template>
        </el-table-column>
        <el-table-column
          label="订单状态"
          prop="state"
          width="100px"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.state }}
          </template>
        </el-table-column>

        <el-table-column
          label="付款方式"
          prop="payType"
          width="100px"
          align="center"
          sortable
          :filters="[
            { text: '支付宝', value: '支付宝' },
            { text: '微信', value: '微信' },
          ]"
          :filter-method="filterPayType"
        >
          <template slot-scope="scope">
            <el-tag type="Brand Color" v-if="scope.row.payType === '支付宝'">
              支付宝
            </el-tag>
            <el-tag type="success" v-else-if="scope.row.payType === '微信'">
              微信
            </el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="isSend"
          width="100px"
          align="center"
          sortable
          :filters="[
            { text: '未发货', value: 0 },
            { text: '已发货', value: 1 },
          ]"
          :filter-method="filterIsSend"
        >
          <template slot-scope="scope">
            <span
              v-if="
                (scope.row.state === '待处理' ||
                  scope.row.state === '待收货') &&
                  scope.row.isSend === 1
              "
            >
              <el-tag type="danger">
                退货中
              </el-tag>
            </span>
            <span v-else-if="scope.row.state === '已退货'">
              <el-tag type="success">
                已退货
              </el-tag>
            </span>
            <span
              v-else-if="scope.row.state === '待处理' && scope.row.isSend === 0"
            >
              <el-tag type="success">
                退款中
              </el-tag>
            </span>
            <span v-else-if="scope.row.state === '已退款'">
              <el-tag type="success">
                已退款
              </el-tag>
            </span>
            <span v-else>
              <el-tag type="info" v-if="scope.row.isSend === 0">
                未发货
              </el-tag>
              <el-tag type="success" v-else-if="scope.row.isSend === 1">
                已发货
              </el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单来源"
          prop="from"
          width="90px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="createTime"
          width="150px"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.addTime | dataFormat }}
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
                @click="showBox(scope.row.id)"
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
                :disabled="
                  (scope.row.state === '已付款' ? false : true) &&
                    (scope.row.state === '待付款' ? false : true) &&
                    (scope.row.state === '待发货' ? false : true)
                "
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
                :disabled="
                  scope.row.state === '待付款' || scope.row.state === '待发货'
                    ? true
                    : false
                "
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
        :page-sizes="[10, 15, 30, this.total]"
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
        label-width="120px"
      >
        <el-form-item label="目前收货地址:" prop="address">
          {{ addressForm.address }}
          <!-- <el-input v-model="addressForm.address"></el-input> -->
        </el-form-item>
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="options"
            clearable
            @change="addressChange"
            v-model="addressForm.address1"
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
            :disabled="
              (statusForm.state === '待付款' ? true : false) ||
                (this.isSend === true ? true : false)
            "
          ></el-switch>
        </el-form-item>
        <el-form-item label="订单价格" prop="price">
          <el-input
            oninput="value=value.replace(/[^0-9.]/g,'')"
            v-model="statusForm.price"
            :disabled="statusForm.state === '待付款' ? false : true"
          ></el-input>
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

    <!-- 展示长时间未确认订单的对话框 -->
    <el-dialog
      title="失联订单"
      :visible.sync="showUnFinishDialogVisible"
      width="70%"
    >
      <el-table :data="lostOrdersList">
        <el-table-column label="订单编号" prop="number"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="products.name"
        ></el-table-column>
        <el-table-column label="订单金额" prop="price"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.addTime | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="买家账号"
          prop="customer.account"
        ></el-table-column>
        <el-table-column
          label="买家联系方式"
          prop="contactWay"
        ></el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleLostSizeChange"
        @current-change="handleLostCurrentChange"
        :current-page="lostQueryInfo.pagenum"
        :page-sizes="[10, 15, 30, this.lostTotal]"
        :page-size="lostQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="lostTotal"
        background
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
// import cityData from "./city_data2017_element";
import { regionData, CodeToText } from "element-china-area-data";

import progress from "./progress";

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
      // 商品的数据列表，默认为空
      ordersList: [],

      lostOrdersList: [],

      selectedKey: "",

      orderState: "",

      // 查询条件
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      // 查询条件
      lostQueryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      lostQueryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      //   总数据条数
      total: 0,

      lostTotal: 0,

      // 物流信息
      progressInfo: [],

      selectedOptions: [],

      // 控制修改地址的对话框
      addressDialogVisible: false,

      // 控制展示物流进度的对话框
      progressDialogVisible: false,

      // 控制修改订单状态的对话框
      editStatusDialogVisible: false,

      // 控制展示长时间为确认订单列表的对话框
      showUnFinishDialogVisible: false,

      statusForm: {
        isSend: 0,
        price: 0.0,
      },

      stateList: [
        { id: 1, name: "已退款", value: "已退款" },
        { id: 2, name: "已退货", value: "已退货" },
        { id: 3, name: "已拒绝", value: "已拒绝" },
        { id: 4, name: "待付款", value: "待付款" },
        { id: 5, name: "待发货", value: "待发货" },
        { id: 6, name: "待处理", value: "待处理" },
        { id: 7, name: "已发货", value: "已发货" },
        { id: 8, name: "已收货", value: "已收货" },
        { id: 9, name: "已评价", value: "已评价" },
      ],

      statusFormRules: {
        price: [
          {
            required: true,
            validator: validatePrice,
            message: "请输入正确的订单价格",
            trigger: "blur",
          },
        ],
      },

      addressForm: {
        address: "",
        address1: [],
        address2: "",
      },
      addressFormRules: {
        // address: [
        //   {
        //     required: true,
        //     message: "请填写地址",
        //     trigger: "blur",
        //   },
        // ],
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

      // 全国省市区/
      options: regionData,
      // selectedOptions: []
      // cityData,

      //目前订单收货地址
      nowAddress: "",

      // 静态物流信息
      progress,

      //是否发货
      isSend: false,
    };
  },
  created() {
    this.getOrdersList();
    this.getLostOrdersList();
  },
  methods: {
    async getOrdersList() {
      console.log(this.$route.params.data);
      if (this.$route.params.data) {
        this.selectedKey = this.$route.params.data;
      }

      const { data: res } = await this.$http.get("orders", {
        params: {
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize,
          query: this.queryInfo.query,
          state: this.selectedKey,
        },
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

      // res.data.content.forEach((item) => {
      //   if (item.state !== "待处理") {
      //     this.ordersList.push(item);
      //   }
      // });
      console.log(this.ordersList);
    },

    // 获取失联订单信息
    async getLostOrdersList() {
      var date = new Date(); //当天
      const { data: res } = await this.$http.get("orders/lost", {
        params: {
          pagenum: this.lostQueryInfo.pagenum,
          pagesize: this.lostQueryInfo.pagesize,
          query: this.lostQueryInfo.query,
          date: date,
        },
      });

      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取失联订单列表失败");
      //   为总数据条数赋值
      //  this.$message.success("获取订单列表成功");

      this.lostQueryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.lostQueryInfo.pagesize = res.data.size;
      this.lostTotal = res.data.totalElements;
      this.lostOrdersList = res.data.content;
    },

    isCheck(arr1, arr2) {
      // 拼接两个数组
      let newArr = arr1.concat(arr2);
      // 数据去重
      let noRepetitionArr = [...new Set(newArr)];
      // 如果 去重数组长度小于原数组长度，则表示有重复
      if (noRepetitionArr.length < newArr.length) {
        // 获取数组中重复的值
        let defArr = newArr.filter(function(v, i, arr) {
          return arr.indexOf(v) !== arr.lastIndexOf(v);
        });
        // 重复的值再次去重 也可省掉此步骤
        let newdefarr = [...new Set(defArr)];
        return newdefarr;
      }
      return [];
    },

    // 选择框选中项变化，会触发这个函数
    handleChange() {
      this.$route.params.data = "";
      this.getOrdersList();
    },

    clearSelectedKey() {
      this.$route.params.data = "";
      this.selectedKey = "";
      this.getOrdersList();
    },

    async getOrder(id) {
      const { data: res } = await this.$http.get(`orders/${id}`);

      if (res.meta.status !== 200) return this.$message.error("查询失败");
      // console.log(res.data);
      this.statusForm = res.data;
      this.addressForm.id = res.data.id;
      this.addressForm.address = res.data.address;

      this.isSend = res.data.state;

      if (this.statusForm.isSend === 1) {
        this.statusForm.isSend = true;
        this.isSend = true;
      } else {
        this.statusForm.isSend = false;
        this.isSend = false;
      }
      // console.log(this.isSend);
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

    // 监听pagesize改变
    handleLostSizeChange(newSize) {
      this.lostQueryInfo.pagesize = newSize;
      this.getLostOrdersList();
    },
    // 监听pagenum的改变
    handleLostCurrentChange(newPage) {
      this.lostQueryInfo.pagenum = newPage;
      this.getLostOrdersList();
    },

    // 展示修改地址的对话框
    showBox(id) {
      this.getOrder(id);

      this.addressDialogVisible = true;
    },

    // 修改地址的对话框关闭
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },

    // 修改地址
    editAddress() {
      this.$refs.addressFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        //可以发起修改订单地址的网络请求

        this.addressForm.address =
          CodeToText[this.addressForm.address1[0]] +
          " " +
          CodeToText[this.addressForm.address1[1]] +
          " " +
          CodeToText[this.addressForm.address1[2]] +
          " " +
          " (" +
          this.addressForm.address2 +
          ")";
        // console.log(this.addressForm.address);
        // this.selectedOptions.forEach((item) => {
        //   this.addressForm.address1 =
        //     this.addressForm.address1 + CodeToText[item];
        // });
        // console.log(this.addressForm);

        const { data: res } = await this.$http.put(
          `orders/${this.addressForm.id}/address`,
          null,
          {
            params: {
              address: this.addressForm.address,
            },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改订单地址失败");
        //重新获取列表
        this.getOrdersList();
        //提示修改订单地址成功
        this.$message.success("修改订单地址成功");
      });

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

      // console.log(this.progressInfo);
    },

    // 展示修改订单状态的对话框
    showStatusBox(id) {
      this.getOrder(id);
      this.editStatusDialogVisible = true;
      // console.log(this.statusForm);
    },

    // 修改订单状态的对话框关闭
    editStatusDialogClosed() {
      this.$refs.statusFormRef.resetFields();
    },

    // 修改订单状态
    async editStatus() {
      const confirmResult = await this.$confirm(
        "此操作将永久修改该订单, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消修改");
      }

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
          },
        }
      );

      if (res.meta.status !== 200)
        return this.$message.error("修改订单状态失败");
      //隐藏修改订单状态的对话框
      // this.editStatusDialogVisible = false;
      //重新获取用户列表
      this.getOrdersList();
      //提示修改订单状态成功
      this.editStatusDialogVisible = false;

      this.$message.success("修改订单状态成功");
    },

    tableRowClassName({ row, rowIndex }) {
      if (
        row.state === "待处理" ||
        row.state === "待付款" ||
        row.state === "待发货"
      ) {
        return "warning-row";
      } else if (
        row.state === "已收货" ||
        row.state === "已评价" ||
        row.state === "开通成功" ||
        row.state === "已退款" ||
        row.state === "已退货" ||
        row.state === "已拒绝"
      ) {
        return "success-row";
      } else {
        return "";
      }
    },

    resetDateFilter() {
      this.$refs.filterTable.clearFilter("brands.name");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },

    filterUser(value, row) {
      return row.userName === value;
    },

    filterState(value, row) {
      return row.state === value;
    },

    filterPayType(value, row) {
      return row.payType === value;
    },

    filterIsSend(value, row) {
      return row.isSend === value;
    },

    addressChange(arr) {
      // console.log(arr);
      // arr.forEach((item) => {
      //   CodeToText[item];
      // });
      console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]);
      // this.addressForm.address1 =
      //   CodeToText[arr[0]] + CodeToText[arr[1]] + CodeToText[arr[2]];
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

<style lang="less">
.el-cascader {
  width: 100%;
}
.el-cascader-menu {
  height: 300px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.expandInfo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
