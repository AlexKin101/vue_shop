<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>营销管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
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
            v-model="carouselQueryInfo.query"
            clearable
            @clear="getCarouselGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getCarouselGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog">
            添加轮播图
          </el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="carouselGoodsList" border script>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="轮播图编号"
          prop="id"
          width="90px"
          align="center"
        ></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>

        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <!-- 查看图片按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="轮播图预览"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-picture-outline"
                size="mini"
                @click="showPicBox(scope.row.pic)"
              ></el-button>
            </el-tooltip>

            <!-- 跳转到商品页面 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="商品页面"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-reading"
                size="mini"
                @click="gotoGoodsPath(scope.row.url)"
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
                @click="removeBannerById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleCarouselSizeChange"
        @current-change="handleCarouselCurrentChange"
        :current-page="carouselQueryInfo.pagenum"
        :page-sizes="[10, 20, 30, this.carouselTotal]"
        :page-size="carouselQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="carouselTotal"
        background
      ></el-pagination>
    </el-card>

    <!-- 轮播图预览 -->
    <el-dialog title="轮播图预览 " :visible.sync="previewVisible" width="50%">
      <img
        :src="previewPath"
        alt=""
        class="previewImg"
        width="100%"
        height="100%"
      />
    </el-dialog>

    <!-- 添加轮播图的对话框 -->
    <el-dialog
      title="添加轮播图"
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
            @clear="addDialogClosed"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top:20px">
        <el-col>
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="70px"
          >
            <!-- 内容主体区域 -->
            <el-table
              ref="singleTable"
              :data="goodsList"
              style="width: 100%"
              highlight-current-row
              center
              @current-change="handleSelectionChange"
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
                label="商品数量"
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
            <br />
            <hr />
            <el-form-item label="轮播图：">
              <el-upload
                drag
                ref="myUpload"
                :action="uploadURL"
                :on-remove="handleRemove"
                list-type="picture"
                :on-success="handleSuccess"
                :headers="headerObj"
              >
                <i class="el-icon-upload">轮播图</i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <div style="margin-top: 20px" align="right">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button @click="addCarousel">确定</el-button>
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

      singleSelection: [],

      // 促销商品的数据列表，默认为空
      carouselGoodsList: [],
      // 查询条件
      carouselQueryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   总数据条数
      carouselTotal: 0,

      addDialogVisible: false, //控制添加商品轮播的对话框

      previewVisible: false,

      // 预览图片URL
      previewPath: "",

      //   商品URL
      goodsPath: "",

      //   添加轮播图的表单数据
      addForm: {
        id: "",
        name: "",
        pic: "",
        url: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {},

      //  上传图片的URL
      uploadURL: "http://localhost:1106/upload",

      // 图片上传组件的headers请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
    };
  },
  created() {
    this.getCarouselGoodsList();
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

    async getCarouselGoodsList() {
      const { data: res } = await this.$http.get("banner", {
        params: this.carouselQueryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败");
      //   为总数据条数赋值
      this.carouselQueryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.carouselQueryInfo.pagesize = res.data.size;
      this.carouselTotal = res.data.totalElements;
      this.carouselGoodsList = res.data.content;
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
    handleCarouselSizeChange(newSize) {
      this.carouselQueryInfo.pagesize = newSize;
      this.getCarouselGoodsList();
    },
    // 监听pagenum的改变
    handleCarouselCurrentChange(newPage) {
      this.carouselQueryInfo.pagenum = newPage;
      this.getCarouselGoodsList();
    },

    // 根据Id删除轮播图
    async removeBannerById(id) {
      //弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该轮播图, 是否继续?",
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
      const { data: res } = await this.$http.delete(`banner/delete/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除轮播图失败");
      this.$message.success("删除轮播图成功");
      //重新获取列表
      this.getCarouselGoodsList();
    },

    //显示对话框
    showDialog() {
      this.getGoodsList();
      this.addDialogVisible = true;
    },

    //监听修改对话框的关闭事件
    addDialogClosed() {
      this.$refs.singleTable.clearSelection();
      this.$nextTick(() => {
        this.$refs["myUpload"].clearFiles();
      });
    },

    // 处理图片移除操作
    handleRemove(file) {
      this.addForm.pic = [];
    },

    // 监听图片上传成功的事件
    handleSuccess(response) {
      //   1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pic = response.data;
      //   console.log(response);
    },

    async addCarousel() {
      this.addForm.name = this.singleSelection.name;
      if (this.addForm.name == "" || this.addForm.pic == "")
        return this.$message.error("请填写必要的表单项");

      const { data: res } = await this.$http.post(`banner/add`, this.addForm);
      if (res.meta.status !== 200) return this.$message.error("添加轮播图失败");
      this.getCarouselGoodsList();
      this.addDialogVisible = false;
      this.$message.success("添加轮播图成功");
      this.$nextTick(() => {
        this.$refs["myUpload"].clearFiles();
        this.addForm.pic = "";
        this.addForm.name = "";
      });
    },

    handleSelectionChange: function(val) {
      this.singleSelection = val;
      //   console.log(val);
    },

    showPicBox(pic) {
      this.previewPath = pic;
      this.previewVisible = true;
    },

    gotoGoodsPath(url) {
      this.goodsPath = url;
      window.location.href = this.goodsPath;
    },
  },
};
</script>

<style lang="less" scoped></style>
