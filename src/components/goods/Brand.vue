<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>品牌管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getBrandsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getBrandsList()"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加品牌
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="brandsList" stripe border>
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="name"></el-table-column>
        <el-table-column label="品牌描述" prop="desc"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
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
                @click="showEditDialog(scope.row.id)"
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
                size="small"
                @click="removeBrandsById(scope.row.id)"
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
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加品牌的对话框 -->
    <el-dialog
      title="添加品牌"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="110px"
      >
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌描述" prop="desc">
          <el-input v-model="addForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBrands">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改品牌的对话框 -->
    <el-dialog
      title="修改品牌信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="110px"
      >
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌描述" prop="desc">
          <el-input v-model="editForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBrandsInfo">
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
      //获取用户列表的参数
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 5,
      },
      brandsList: [],
      total: 0,
      //控制添加对话框的显示与隐藏
      addDialogVisible: false, //控制添加品牌的对话框
      editDialogVisible: false, //控制修改品牌的对话框

      // 需要被分配品牌的用户信息
      brandsInfo: "",

      //   添加品牌的表单数据
      addForm: {
        name: "",
        desc: "",
      },

      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 30,
            message: "用户名的长度在2~30个字符之间",
            trigger: "blur",
          },
        ],
      },
      // 查询到的品牌信息对象
      editForm: {},
      //修改表单的验证规则对象
      editForm: {},
      editFormRules: {
        name: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 30,
            message: "用户名的长度在2~30个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getBrandsList();
  },
  methods: {
    async getBrandsList() {
      const { data: res } = await this.$http.get("brands", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取品牌列表失败！");
      this.queryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.queryInfo.pagesize = res.data.size;
      this.total = res.data.totalElements;
      this.brandsList = res.data.content;

      // console.log(res);
      // console.log(this.queryInfo);
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getBrandsList();
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getBrandsList();
    },

    //监听添加品牌对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    //点击按钮,添加新品牌
    addBrands() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加品牌的网络请求
        const { data: res } = await this.$http.post("brands", this.addForm);

        if (res.meta.status !== 200) return this.$message.error("添加品牌失败");
        //隐藏添加用户的对话框
        this.addDialogVisible = false;
        //重新获取用户列表
        this.getBrandsList();
        //提示添加用户信息成功
        this.$message.success("添加品牌成功");
      });
    },

    // 展示编辑品牌的对话框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get(`brands/${id}`);
      if (res.meta.status !== 200) return this.$message.error("品牌查询失败");
      // console.log(res.data);
      this.editForm = res.data;
      this.editDialogVisible = true;
      // console.log(this.editForm);
    },

    //监听修改品牌对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 修改品牌信息并提交
    editBrandsInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        //可以发起修改品牌的网络请求

        const { data: res } = await this.$http.put(
          `brands/update/${this.editForm.id}`,
          null,
          {
            params: { name: this.editForm.name, desc: this.editForm.desc },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改品牌信息失败");
        //隐藏修改品牌的对话框
        this.editDialogVisible = false;
        //重新获取品牌列表
        this.getBrandsList();
        //提示修改品牌信息成功
        this.$message.success("修改品牌信息成功");
      });
    },

    // 根据Id删除对应的用户信息
    async removeBrandsById(id) {
      //弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该品牌, 是否继续?",
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
      const { data: res } = await this.$http.delete(`brands/delete/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除品牌失败");
      this.$message.success("删除品牌成功");
      //重新获取品牌列表
      this.getBrandsList();
    },
  },
};
</script>

<style lang="less" scoped></style>
