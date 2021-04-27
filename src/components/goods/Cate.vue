<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">
            添加分类
          </el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="cateList" border script>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="expandInfo">
              <el-form label-position="left" inline style="width:80%">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="左侧宣传图：">
                      <img
                        :src="scope.row.leftURL"
                        height="400px"
                        width="200px"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="顶部宣传图：">
                      <img :src="scope.row.topURL" width="800px" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="分类名称" prop="name"></el-table-column>
        <el-table-column label="分类描述" prop="describe"></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <!-- 操作 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCateById(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false" -->

      <!-- 是否有效
        <template v-slot:isOk="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.deleted !== false"
            style="color:green"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template> -->
      <!-- 排序
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.level === 1" type="success" size="mini">
            二级
          </el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template> -->

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, this.total]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="95px"
      >
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="addCateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类描述：" prop="describe">
          <el-input v-model="addCateForm.describe"></el-input>
        </el-form-item>

        <el-alert
          title="每个只能上传一张商品图片"
          type="warning"
          show-icon
          style="margin-bottom:10px"
          :closable="false"
        ></el-alert>

        <el-form-item label="左侧宣传图：" prop="leftURL">
          <el-upload
            :class="{ hide: hideUpload }"
            drag
            :limit="1"
            ref="myUpload"
            :action="uploadURL"
            :file-list="addLeftList"
            :on-remove="handleAddLeftRemove"
            list-type="picture-card"
            :on-success="handleAddLeftSuccess"
            :headers="headerObj"
          >
            <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="顶部宣传图：" prop="topURL">
          <el-upload
            style="margin-top:30px"
            drag
            :limit="1"
            ref="myUpload"
            :action="uploadURL"
            :file-list="addTopList"
            :on-remove="handleAddTopRemove"
            list-type="picture-card"
            :on-success="handleAddTopSuccess"
            :headers="headerObj"
          >
            <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类信息"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="95px"
      >
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>

        <el-form-item label="分类描述：" prop="describe">
          <el-input v-model="editForm.describe"></el-input>
        </el-form-item>

        <el-alert
          title="每个只能上传一张商品图片"
          type="warning"
          show-icon
          style="margin-bottom:10px"
          :closable="false"
        ></el-alert>

        <el-form-item label="左侧宣传图：" prop="leftURL">
          <el-upload
            drag
            :limit="1"
            ref="myUpload"
            :action="uploadURL"
            :file-list="editLeftList"
            :on-remove="handleEditLeftRemove"
            :on-preview="handlePreview"
            list-type="picture-card"
            :on-success="handleEditLeftSuccess"
            :headers="headerObj"
          >
            <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="顶部宣传图：" prop="topURL">
          <el-upload
            drag
            :limit="1"
            ref="myUpload"
            :action="uploadURL"
            :file-list="editTopList"
            :on-remove="handleEditTopRemove"
            :on-preview="handlePreview"
            list-type="picture-card"
            :on-success="handleEditTopSuccess"
            :headers="headerObj"
            style="margin-top:30px"
          >
            <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog title="轮播图预览 " :visible.sync="previewVisible" width="50%">
      <img
        :src="previewPath"
        alt=""
        class="previewImg"
        width="100%"
        height="100%"
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      hideUpload: false,

      addLeftList: [],
      addTopList: [],
      editLeftList: [],
      editTopList: [],

      // 商品分类的数据列表，默认为空
      cateList: [],
      //   总数据条数
      total: 0,
      //   为table指定列的定义
      // {
      //   label: "是否有效",
      //   // 表示将当前列定义为模版列
      //   type: "template",
      //   // 表示当前这一列使用的模版名称
      //   template: "isOk",
      // },
      // {
      //   label: "排序",
      //   // 表示将当前列定义为模版列
      //   type: "template",
      //   // 表示当前这一列使用的模版名称
      //   template: "order",
      // },

      //   控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,

      //预览
      previewVisible: false,

      // 预览图片URL
      previewPath: "",

      // 添加分类的表单数据对象
      addCateForm: {
        //将要添加的分类的名称
        name: "",
        describe: "",
        leftURL: "", //左侧宣传图
        topURL: "", //横幅宣传图
      },
      // 添加分类的表单的验证规则对象
      addCateFormRules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        leftURL: [{ required: true }],
        topURL: [{ required: true }],
      },
      //   父级分类的列表
      parentCateList: [],
      //   选中的父级分类的Id数组
      selectedKeys: [],
      //   控制添加分类对话框的显示与隐藏
      editCateDialogVisible: false,
      // 编辑分类的表单数据对象
      editForm: {
        id: 0,
        name: "",
        describe: "",
        leftURL: "", //左侧宣传图
        topURL: "", //横幅宣传图
      },
      // 编辑分类的表单的验证规则对象
      editFormRules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        leftURL: [{ required: true }],
        topURL: [{ required: true }],
      },

      // 预览
      previewPath: "",

      //  上传图片的URL
      uploadURL: "http://localhost:8082/upload",

      // 图片上传组件的headers请求头
      headerObj: {
        role: window.sessionStorage.getItem("role"),
        name: window.sessionStorage.getItem("name"),
        Authorization: window.sessionStorage.getItem("token"),
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      // console.log(res.data);
      //   把数据列表赋值给cateList
      this.cateList = res.data.content;
      //   为总数据条数赋值
      this.total = res.data.totalElements;
    },

    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },

    //点击按钮显示添加分类的对话框
    showAddCateDialog() {
      // 获取父级分类的数据列表，再显示对话框
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { pagenum: 0, pagesize: 0, type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类数据失败");

      // console.log(res.data);
      this.parentCateList = res.data;
    },

    // 左侧图片添加页显示
    showLeftFileList(row) {
      let obj = new Object();
      obj.url = row.leftURL;
      obj.name = "pic";
      this.editLeftList.push(obj);
    },

    // 顶部图片添加页显示
    showTopFileList(row) {
      let obj = new Object();
      obj.url = row.topURL;
      obj.name = "pic";
      this.editTopList.push(obj);
    },

    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        // console.log(this.addCateForm);
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 200) return this.$message.error("添加分类失败");
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },

    handleLeft() {
      // this.hideUpload = this.addLeftList.length > 1;
    },

    // 处理图片预览效果
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.url;
      // console.log(this.previewPath);
      this.previewVisible = true;
    },

    //添加分类
    // 处理图片移除操作
    handleAddLeftRemove(file) {
      this.addCateForm.leftURL = [];
      // this.hideUpload = this.addLeftList.length > 1;
    },

    // 监听图片上传成功的事件
    handleAddLeftSuccess(response) {
      //   1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中
      this.addCateForm.leftURL = response.data;
      //   console.log(response);
    },

    // 处理图片移除操作
    handleAddTopRemove(file) {
      this.addCateForm.topURL = [];
    },

    // 监听图片上传成功的事件
    handleAddTopSuccess(response) {
      //   1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中
      this.addCateForm.topURL = response.data;
      //   console.log(response);
    },

    // 编辑
    // 处理图片移除操作
    handleEditLeftRemove(file) {
      this.editForm.leftURL = [];
      // this.hideUpload = this.addLeftList.length > 1;
    },

    // 监听图片上传成功的事件
    handleEditLeftSuccess(response) {
      //   1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中
      this.editForm.leftURL = response.data;
      //   console.log(response);
    },

    // 处理图片移除操作
    handleEditTopRemove(file) {
      this.editForm.topURL = [];
    },

    // 监听图片上传成功的事件
    handleEditTopSuccess(response) {
      //   1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中
      this.editForm.topURL = response.data;
      //   console.log(response);
    },

    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.$nextTick(() => {
        this.$refs["myUpload"].clearFiles();
      });
      this.addLeftList = [];
      this.addTopList = [];
    },

    // 展示编辑分类的对话框
    async showEditDialog(row) {
      // console.log(id);
      const { data: res } = await this.$http.get(`categories/${row.id}`);
      if (res.meta.status !== 200) return this.$message.error("分类查询失败");

      this.editForm = res.data;
      this.showLeftFileList(row);
      this.showTopFileList(row);
      this.editCateDialogVisible = true;
      // console.log(this.editForm);
    },

    //监听编辑分类对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
      this.$nextTick(() => {
        this.$refs["myUpload"].clearFiles();
      });
      this.editLeftList = [];
      this.editTopList = [];
    },

    // 编辑分类信息并提交
    editCateInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        //可以发起编辑分类的网络请求
        const { data: res } = await this.$http.put(
          `categories/${this.editForm.id}`,
          this.editForm
        );

        if (res.meta.status !== 200)
          return this.$message.error("编辑分类信息失败");
        //隐藏编辑分类的对话框
        this.editCateDialogVisible = false;
        //重新获取分类列表
        this.getCateList();
        //提示修改用户信息成功
        this.$message.success("编辑分类信息成功");
      });
    },

    // 根据Id删除对应的分类信息
    async removeCateById(id) {
      //弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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
      const { data: res } = await this.$http.delete(`categories/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除分类失败");
      this.$message.success("删除分类成功");
      //重新获取用户列表
      this.getCateList();
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
.el-icon-upload {
  width: 178px;
  height: 178px;
  display: block;
}
.hide .el-upload--picture-card {
  display: none;
}
</style>
