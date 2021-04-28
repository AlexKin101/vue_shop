<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>营销管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品折扣</el-breadcrumb-item>
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
            v-model="discountQueryInfo.query"
            clearable
            @clear="getDiscountGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getDiscountGoodsList"
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
      <el-table
        :data="discountGoodsList"
        border
        :row-class-name="tableRowClassName"
      >
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
                    <el-form-item label="商品当前折扣价：">
                      <span>{{ scope.row.discountPrice + " 元" }}</span>
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
          label="商品品牌"
          prop="brands.name"
          width="95px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          label="商品原价（元）"
          prop="outPrice"
          width="130px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          label="商品折扣价（元）"
          width="150px"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.discountPrice }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="商品折扣率"
          width="110px"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <el-tooltip
              :disabled="
                scope.row.discountPrice / scope.row.outPrice <= 0.75
                  ? false
                  : true
              "
              content="该商品折扣率过低，请检查折扣定价是否合理！"
              placement="bottom"
              effect="dark"
            >
              <span
                v-if="scope.row.discountPrice / scope.row.outPrice <= 0.75"
                style="color:#F56C6C"
              >
                {{
                  (scope.row.discountPrice / scope.row.outPrice).toFixed(2) *
                    100 +
                    "%"
                }}
              </span>
              <span v-else>
                {{
                  (scope.row.discountPrice / scope.row.outPrice).toFixed(2) *
                    100 +
                    "%"
                }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" width="100px" prop="state">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-tag type="success" v-if="scope.row.isDiscount === 1">
              折扣中
            </el-tag>
            <el-tag type="danger" v-else>未折扣</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="showEditDialog(scope.row)"
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
        @size-change="handleDiscountSizeChange"
        @current-change="handleDiscountCurrentChange"
        :current-page="discountQueryInfo.pagenum"
        :page-sizes="[10, 20, 30, this.discountTotal]"
        :page-size="discountQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="discountTotal"
        background
      ></el-pagination>
    </el-card>

    <!-- 添加商品的对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addDialogVisible"
      width="80%"
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
          label="商品进价（元）"
          prop="inPrice"
          width="95px"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column
          label="商品售价（元）"
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
        <el-table-column
          label="折扣价"
          prop="discountPrice"
          width="100px"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <el-input
              oninput="value=value.replace(/[^\d.]/g,'')"
              clearable
              v-model="scope.row.discountPrice"
              width="90px"
            ></el-input>
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
        layout="total, sizes ,prev, pager, next, jumper"
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

    <!-- 修改折扣商品的对话框 -->
    <el-dialog
      title="修改商品折扣信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="120px"
      >
        <el-form-item label="当前商品进价：">
          {{ this.editForm.inPrice + "元" }}
        </el-form-item>

        <el-form-item label="当前商品售价：">
          {{ this.editForm.outPrice + "元" }}
        </el-form-item>

        <el-row>
          <el-col :span="8">
            <el-form-item label="商品折扣率：">
              <el-tooltip
                :disabled="
                  this.editForm.discountPrice / this.editForm.outPrice <= 0.75
                    ? false
                    : true
                "
                content="该商品折扣率过低，请检查折扣定价是否合理！"
                placement="bottom"
                effect="dark"
              >
                <span
                  v-if="
                    this.editForm.discountPrice / this.editForm.outPrice <= 0.75
                  "
                  style="color:#F56C6C"
                >
                  {{
                    (
                      this.editForm.discountPrice / this.editForm.outPrice
                    ).toFixed(2) *
                      100 +
                      "%"
                  }}
                </span>
                <span v-else>
                  {{
                    (
                      this.editForm.discountPrice / this.editForm.outPrice
                    ).toFixed(2) *
                      100 +
                      "%"
                  }}
                </span>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品折扣价(元)：" prop="discountPrice">
              <el-input
                v-model="editForm.discountPrice"
                type="number"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDiscountInfo">
          确 定
        </el-button>
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
      discountGoodsList: [],
      // 查询条件
      discountQueryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   总数据条数
      discountTotal: 0,

      addDialogVisible: false, //控制添加商品促销的对话框

      editDialogVisible: false, //控制修改商品促销的对话框

      //修改表单的验证规则对象
      editForm: {
        inPrice: 0.0,
        outPrice: 0.0,

        discountPrice: 0.0,
      },

      editFormRules: {
        discountPrice: [
          {
            required: false,
            message: "请输入折扣价格",
            trigger: "blur",
          },
        ],
      },
      name: "",
    };
  },
  created() {
    this.getDiscountGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods/nodiscount", {
        params: this.queryInfo,
      });
      // console.log(res);
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

    async getDiscountGoodsList() {
      const { data: res } = await this.$http.get("goods/discount", {
        params: this.discountQueryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      //   为总数据条数赋值
      this.discountQueryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.discountQueryInfo.pagesize = res.data.size;
      this.discountTotal = res.data.totalElements;
      this.discountGoodsList = res.data.content;
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
    handleDiscountSizeChange(newSize) {
      this.discountQueryInfo.pagesize = newSize;
      this.getDiscountGoodsList();
    },
    // 监听pagenum的改变
    handleDiscountCurrentChange(newPage) {
      this.discountQueryInfo.pagenum = newPage;
      this.getDiscountGoodsList();
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
        `goods/discount/delete/${id}`
      );
      if (res.meta.status !== 200)
        return this.$message.error("删除商品折扣失败");
      this.$message.success("删除商品折扣成功");
      //重新获取用户列表
      this.getDiscountGoodsList();
    },

    tableRowClassName({ row, rowIndex }) {
      //   console.log(discountRate);
      if (row.discountPrice / row.outPrice <= 0.75) {
        return "warning-row";
      }
      return "";
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
      //   console.log(this.multipleSelection);
      //弹窗询问用户是否确认数据
      const confirmResult = await this.$confirm(
        "此操作将修改商折扣销状态, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果用户确定删除，则返回值为字符串confirm
      //如果用户取消了删除，则返回值为字符串cancel
      this.multipleSelection.forEach((item) => {
        if (item.discountPrice === null) {
          return this.$message.error("选中商品的折扣价格不能为空");
        }
      });
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.put(
        `goods/discount`,
        this.multipleSelection
      );
      if (res.meta.status !== 200)
        return this.$message.error("添加折扣商品失败");
      this.getDiscountGoodsList();
      this.addDialogVisible = false;
      //   console.log(this.multipleSelection);
      this.$message.success("添加促销商品成功");
    },

    // 修改信息并提交
    editDiscountInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        //可以发起修改的网络请求
        // console.log(this.editForm);
        const { data: res } = await this.$http.put(
          `goods/discount/${this.editForm.id}`,
          null,
          {
            params: { discountPrice: this.editForm.discountPrice },
          }
        );

        if (res.meta.status !== 200)
          return this.$message.error("修改折扣信息失败");
        //隐藏修改的对话框
        this.editDialogVisible = false;
        //重新获取列表
        this.getDiscountGoodsList();
        //提示修改信息成功
        this.$message.success("修改折扣信息成功");
      });
    },

    handleSelectionChange: function(val) {
      this.multipleSelection = val;
      //   console.log(val);
    },

    // 展示编辑的对话框
    async showEditDialog(row) {
      console.log(row);
      this.editForm.id = row.id;
      this.editForm.discountPrice = row.discountPrice;
      this.editForm.inPrice = row.inPrice;
      this.editForm.outPrice = row.outPrice;
      console.log(this.editForm);
      this.editDialogVisible = true;
      // console.log(this.editForm);
    },

    //监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
  },
};
</script>

<style lang="less">
.expandInfo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.demo-table-expand {
  font-size: 0;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
