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
        <el-col :span="8">
          <el-button type="primary" @click="goAddPage">
            添加商品
          </el-button>
          <el-button type="primary" @click="showDialog">
            查看缺货产品
          </el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border script>
        <!-- 展开项 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="expandInfo">
              <el-form label-position="left" inline style="width:80%">
                <el-row>
                  <el-col :span="8" margin-right="30px">
                    <el-form-item label="商品图片：">
                      <img
                        :src="scope.row.picture"
                        width="200px"
                        height="200px"
                      />
                    </el-form-item>
                    <br />
                    <el-form-item label="商品名称：">
                      <el-tag type="info">{{ scope.row.name }}</el-tag>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" margin-right="5px">
                    <el-form-item label="商品ID：">
                      <span>{{ scope.row.id }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="商品编号：">
                      <span>{{ scope.row.number }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="商品品牌：">
                      <span>{{ scope.row.brands.name }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="商品分类：">
                      <span>{{ scope.row.type.name }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="商品上架时间：">
                      {{ scope.row.addTime | dataFormat }}
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="商品进价：">
                      <span>{{ scope.row.inPrice + " 元" }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="商品售价：">
                      <span>{{ scope.row.outPrice + " 元" }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item
                      label="商品折扣价："
                      style="margin-right: 40px"
                    >
                      <span v-if="scope.row.isDiscount === 1">
                        {{ scope.row.discountPrice + " 元" }}
                      </span>
                      <span v-else>
                        NULL
                      </span>
                    </el-form-item>
                    <el-form-item label="商品折扣率：">
                      <el-tooltip
                        :disabled="
                          scope.row.discountPrice / scope.row.outPrice <=
                            0.75 && scope.row.isDiscount === 1
                            ? false
                            : true
                        "
                        content="该商品折扣率过低，请检查折扣定价是否合理！"
                        placement="bottom"
                        effect="dark"
                      >
                        <span
                          v-if="
                            scope.row.discountPrice / scope.row.outPrice <=
                              0.75 && scope.row.isDiscount === 1
                          "
                          style="color:#F56C6C"
                        >
                          {{
                            (
                              scope.row.discountPrice / scope.row.outPrice
                            ).toFixed(2) *
                              100 +
                              "%"
                          }}
                        </span>
                        <span v-else>
                          {{
                            (
                              scope.row.discountPrice / scope.row.outPrice
                            ).toFixed(2) *
                              100 +
                              "%"
                          }}
                        </span>
                      </el-tooltip>
                    </el-form-item>
                    <br />
                    <el-form-item label="商品重量：">
                      <span v-if="scope.row.weight === ''">
                        NULL
                      </span>
                      <span v-else>{{ scope.row.weight + " Kg" }}</span>
                    </el-form-item>
                    <br />
                    <el-form-item
                      label="商品最低库存："
                      style="margin-right: 40px"
                    >
                      <span>{{ scope.row.lowStock }}</span>
                    </el-form-item>

                    <el-form-item label="当前商品库存：">
                      <span>{{ scope.row.stock }}</span>
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
          label="商品编号"
          prop="number"
          width="140px"
          align="center"
        ></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column
          label="商品分类"
          prop="type.name"
          width="80px"
          align="center"
          sortable
          column-key="type.name"
          :filters="this.cateList"
          :filter-method="filterType"
        ></el-table-column>
        <el-table-column
          label="商品品牌"
          prop="brands.name"
          width="80px"
          align="center"
          sortable
          column-key="brands.name"
          :filters="this.brandsList"
          :filter-method="filterBrand"
        ></el-table-column>
        <el-table-column
          label="当前售出价格（元）"
          prop="outPrice"
          width="95px"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <el-tooltip
              :disabled="scope.row.isDiscount === 1 ? false : true"
              content="该商品处于折扣状态"
              placement="bottom"
              effect="dark"
            >
              <span v-if="scope.row.isDiscount === 1" style="color:#E6A23C">
                {{ scope.row.discountPrice }}
              </span>
              <span v-else>
                {{ scope.row.outPrice }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          label="商品库存状态"
          width="80px"
          align="center"
          :filters="[
            { text: '充足', value: 0 },
            { text: '缺货', value: 1 },
          ]"
          :filter-method="filterTag"
        >
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.isStockout === 0">
              充足
            </el-tag>
            <el-tag v-else>
              缺货
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否新品"
          width="80px"
          align="center"
          :filters="[
            { text: '是', value: 1 },
            { text: '否', value: 0 },
          ]"
          :filter-method="filterNew"
        >
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.isNew === 1">
              是
            </el-tag>
            <el-tag v-else>
              否
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否新品"
          width="80px"
          align="center"
          :filters="[
            { text: '是', value: 1 },
            { text: '否', value: 0 },
          ]"
          :filter-method="filterNew"
        >
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.isNew === 1">
              是
            </el-tag>
            <el-tag v-else>
              否
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否折扣"
          width="80px"
          align="center"
          :filters="[
            { text: '是', value: 1 },
            { text: '否', value: 0 },
          ]"
          :filter-method="filterDiscount"
        >
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.isDiscount === 1">
              是
            </el-tag>
            <el-tag v-else>
              否
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="addTime"
          width="150px"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.addTime | dataFormat }}
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          align="center"
          width="100px"
          prop="sale"
          :filters="[
            { text: '已上架', value: true },
            { text: '未上架', value: false },
          ]"
          :filter-method="filterSale"
        >
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-tooltip
              :disabled="scope.row.stock <= 0 ? false : true"
              content="该商品库存不足，无法上架"
              placement="bottom"
              effect="dark"
            >
              <el-switch
                :disabled="scope.row.stock <= 0 ? true : false"
                v-model="scope.row.sale"
                @change="goodsStateChanged(scope.row)"
              ></el-switch>
            </el-tooltip>
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
        :page-size="queryInfo.pagesize"
        :page-sizes="[10, 20, 30, this.total]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <el-dialog
      title="缺货商品"
      :visible.sync="showStockoutDialogVisible"
      width="75%"
      :close="showStockoutDialogClosed"
    >
      <!-- gutter每个格子之间的距离，相当于列间距 -->
      <!-- span相当于列的宽度 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="stockoutQueryInfo.query"
            clearable
            @clear="showStockoutDialogClosed"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getStockOutGoodsList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 内容主体区域 -->
      <el-table
        ref="singleTable"
        :data="stockoutGoodsList"
        style="width: 100%"
        highlight-current-row
        center
      >
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品编号"
          width="130px"
          prop="number"
          align="center"
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
          label="当前商品库存"
          prop="stock"
          width="70px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          label="商品最低库存"
          prop="lowStock"
          width="70px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column label="商品库存状态" width="80px" align="center">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.isStockout === 0">
              充足
            </el-tag>
            <el-tag v-else>
              缺货
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          width="100px"
          prop="sale"
          :filters="[
            { text: '已上架', value: true },
            { text: '未上架', value: false },
          ]"
          :filter-method="filterSale"
        >
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-tooltip
              :disabled="scope.row.stock <= 0 ? false : true"
              content="该商品库存不足，无法上架"
              placement="bottom"
              effect="dark"
            >
              <el-switch
                :disabled="scope.row.stock <= 0 ? true : false"
                v-model="scope.row.sale"
                @change="goodsStateChanged(scope.row)"
              ></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="130px" align="center">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="补货"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="
                  showEditStockDialog(
                    scope.row.id,
                    scope.row.stock,
                    scope.row.lowStock
                  )
                "
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <br />

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleStockoutSizeChange"
        @current-change="handleStockoutCurrentChange"
        :current-page="stockoutQueryInfo.pagenum"
        :page-size="stockoutQueryInfo.pagesize"
        :page-sizes="[10, 20, 30, this.stockoutTotal]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="stockoutTotal"
        background
      ></el-pagination>
    </el-dialog>

    <!-- 修改库存的对话框 -->
    <el-dialog
      title="补充商品库存"
      :visible.sync="editStockDialogVisible"
      width="40%"
      @close="editStockDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="stockForm"
        :rules="stockFormRules"
        ref="stockFormRef"
        label-width="125px"
      >
        <el-form-item label="当前库存数量：" prop="stock">
          {{ this.addStock(this.stockForm.stock, this.stockForm.supplyStock) }}
        </el-form-item>
        <el-form-item label="最低库存数量：" prop="lowStock">
          {{ this.stockForm.lowStock }}
        </el-form-item>
        <el-form-item label="供货商：">
          <el-cascader
            placeholder="请选择供货商："
            v-model="selectedSupplierKeys"
            :options="supplierList"
            style="width:40%"
            :props="{
              expandTrigger: 'hover',
              value: 'name',
              label: 'name',
              //checkStrictly: 'false',
            }"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="补充库存数量：" prop="supplyStock">
          <el-input
            v-model="stockForm.supplyStock"
            type="number"
            style="width:20%"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editStockDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="supply">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { number } from "_echarts@5.0.2@echarts";
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

      // 品牌列表
      brandsList: [],
      //分类列表
      cateList: [],
      // 供货商列表
      supplierList: [],

      // 选中的供货商
      selectedSupplierKeys: "",

      // 缺货商品的数据列表，默认为空
      stockoutGoodsList: [],
      // 查询条件
      stockoutQueryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   总数据条数
      stockoutTotal: 0,

      showStockoutDialogVisible: false,

      //商品详情
      showGoodsInfoDialogVisible: false,

      goodsInfoForm: {
        name: "",
        describe: "",
        inPrice: "",
        outPrice: "",
        weight: "",
      },

      editStockDialogVisible: false,

      stockForm: {
        id: 0,
        lowStock: 0,
        stock: 0,
        supplyStock: 0,
      },

      // 添加表单的验证规则对象
      stockFormRules: {
        supplyStock: [
          { required: true, message: "请输入补充的库存数量", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
    this.getBrandsList();
    this.getCateList();
    this.getStockOutGoodsList();
    this.getSupplierList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");

      // this.total = res.data.total;
      // this.goodsList = res.data.goods;
      this.queryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.queryInfo.pagesize = res.data.size;
      //   为总数据条数赋值
      this.total = res.data.totalElements;
      this.goodsList = res.data.content;
    },

    async getStockOutGoodsList() {
      const { data: res } = await this.$http.get("goods/stockout", {
        params: this.stockoutQueryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取缺货商品列表失败");

      this.stockoutQueryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.stockoutQueryInfo.pagesize = res.data.size;
      //   为总数据条数赋值
      this.stockoutTotal = res.data.totalElements;
      this.stockoutGoodsList = res.data.content;
    },

    //   获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { pagenum: 0, pagesize: 0, type: 3 },
      });

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      //   把数据列表赋值给cateList
      // console.log(res.data);
      res.data.forEach((item) => {
        let obj = new Object();
        obj.text = item.name;
        obj.value = item.name;
        this.cateList.push(obj);
      });
      console.log(this.cateList);
      //   console.log(res.data);
    },

    // 获取品牌列表
    async getBrandsList() {
      const { data: res } = await this.$http.get("brands/list");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品品牌列表数据失败");
      //   把数据列表赋值给brandsList
      // console.log(res.data);
      res.data.forEach((item) => {
        let obj = new Object();
        obj.text = item.name;
        obj.value = item.name;
        this.brandsList.push(obj);
      });
      console.log(this.brandsList);
    },

    //   获取所有供货商数据
    async getSupplierList() {
      const { data: res } = await this.$http.get("supplier");

      if (res.meta.status !== 200)
        return this.$message.error("获取供货商数据失败");
      //   把数据列表赋值给cateList
      // console.log(res.data);
      this.supplierList = res.data;
      console.log(this.supplierList);
      //   console.log(res.data);
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

    // 监听pagenum的改变
    handleStockoutCurrentChange(newPage) {
      this.stockoutQueryInfo.pagenum = newPage;
      this.getStockOutGoodsList();
    },

    // 监听pagesize改变
    handleStockoutSizeChange(newSize) {
      this.stockoutQueryInfo.pagesize = newSize;
      this.getStockOutGoodsList();
    },

    //打开展示缺货商品的对话框
    showDialog() {
      this.getStockOutGoodsList();
      this.showStockoutDialogVisible = true;
    },

    showStockoutDialogClosed() {
      this.getStockOutGoodsList();
      this.getGoodsList();
    },

    //监听switch开关状态的改变
    async goodsStateChanged(goodsInfo) {
      const { data: res } = await this.$http.put(
        `goods/${goodsInfo.id}/state/${goodsInfo.sale}`
      );
      if (res.meta.status !== 200) {
        goodsInfo.sale = !goodsInfo.sale;
        return this.$message.error("更新商品状态失败！");
      }
      this.$message.success("更新商品状态成功！");
    },

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

    showEditStockDialog(id, stock, lowStock) {
      this.editStockDialogVisible = true;

      this.stockForm.id = id;
      this.stockForm.lowStock = lowStock;
      this.stockForm.stock = stock;
      this.showStockoutDialogVisible = false;
    },

    //监听修改品牌对话框的关闭事件
    editStockDialogClosed() {
      this.$refs.stockFormRef.resetFields();
      this.getGoodsList();
    },

    supply() {
      this.$refs.stockFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        //可以发起修改库存的网络请求

        const { data: res } = await this.$http.put(
          `goods/${this.stockForm.id}/stock`,
          null,
          {
            params: {
              supplyStock: this.addStock(
                this.stockForm.stock,
                this.stockForm.supplyStock
              ),
            },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改库存信息失败");
      });
      //重新获取库存列表
      this.$message.success("修改库存信息成功");
      this.$nextTick(() => {
        this.getStockOutGoodsList();
        this.editStockDialogVisible = false;
        this.getGoodsList();
      });
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

    addStock(stock, supply) {
      return Number(stock) + Number(supply);
    },

    resetDateFilter() {
      this.$refs.filterTable.clearFilter("brands.name");
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },

    filterBrand(value, row) {
      return row.brands.name === value;
    },

    filterTag(value, row) {
      return row.isStockout === value;
    },

    filterNew(value, row) {
      return row.isNew === value;
    },

    filterDiscount(value, row) {
      return row.isDiscount === value;
    },

    filterSale(value, row) {
      return row.sale === value;
    },

    filterType(value, row) {
      return row.type.name === value;
    },
  },
  computed: {},
};
</script>

<style lang="less" scoped>
.expandInfo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.demo-table-expand {
  font-size: 0;
}
</style>
