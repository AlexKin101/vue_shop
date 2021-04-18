<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt" :gutter="12">
        <el-col :span="8">
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            @change="handleChange"
            style="margin-right:24px"
            :props="{
              expandTrigger: 'hover',
              value: 'name',
              label: 'name',
              //checkStrictly: 'false',
            }"
          ></el-cascader>
          <el-button
            type="primary"
            @click="addDialogVisible = true"
            clearable
            :disabled="this.selectedCateKeys.length === 0 ? true : false"
          >
            添加规格
          </el-button>
        </el-col>
      </el-row>

      <!-- 参数表格 -->
      <el-table :data="tableData" border stripe>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column label="规格名称" prop="name"></el-table-column>
        <el-table-column label="操作" width="280px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeParams(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加规格的对话框 -->
    <el-dialog
      title="添加规格"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加规格的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑规格"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 规格参数的表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">
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
      // 商品分类列表
      cateList: [],
      //   选择框双向绑定到的数组
      selectedCateKeys: [],
      //   被激活的页签名称
      activeName: "many",
      //   tab页签按钮的名称
      activeBtnName: "添加参数",

      tableData: [],

      // 动态参数的数据
      manyTableData: [],
      //   静态属性的数据
      onlyTableData: [],
      //   控制添加对话框
      addDialogVisible: false,
      //验证是参数还是属性
      attr_type: "",
      // 添加参数的表单数据对象
      addForm: {
        name: "",
      },
      //   添加表单的验证规则对象
      addFormRules: {
        name: [
          {
            required: true,
            message: "请输入规格名称",
            trigger: "blur",
          },
        ],
      },

      //   控制编辑对话框
      editDialogVisible: false,
      // 编辑参数的表单数据对象
      editForm: {
        name: "",
      },
      //   编辑表单的验证规则对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入规格名称",
            trigger: "blur",
          },
        ],
      },

      // 查询条件
      queryInfo: {
        type: 0,
        pagenum: 0,
        pagesize: 0,
      },
    };
  },
  created() {
    //   获取所有的商品分类列表
    this.getCateList();
  },
  methods: {
    //   获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      // console.log(res.data);
      //   把数据列表赋值给cateList
      this.cateList = res.data;

      //   console.log(this.cateList);
    },

    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      this.getParamsData();
    },

    // 获取参数的列表数据
    async getParamsData() {
      //   根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.selectedCateKeys}/attributes`
      );

      // console.log(res.data);

      if (res.meta.status !== 200)
        return this.$message.error("获取规格列表失败");

      // console.log(res.data);
      this.tableData = res.data;
    },

    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 添加动态参数/静态属性
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.selectedCateKeys}/attributes`,
          null,
          {
            params: {
              name: this.addForm.name,
            },
          }
        );
        if (res.meta.status !== 200) return this.$message.error("添加失败");

        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },

    // 点击按钮，显示编辑对话框
    async showEditDialog(id) {
      //   通过Id查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.selectedCateKeys}/attributes/${id}`
      );

      // console.log(res.data);
      if (res.meta.status !== 200) return this.$message.error("获取规格失败");
      this.editForm.id = res.data.id;
      this.editForm.name = res.data.name;
      this.editDialogVisible = true;
    },

    // 点击按钮，编辑参数信息
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.selectedCateKeys}/editAttributes/${this.editForm.id}`,
          null,
          {
            params: {
              name: this.editForm.name,
            },
          }
        );
        if (res.meta.status !== 200) return this.$message.error("编辑规格失败");
        this.$message.success("编辑规格成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },

    // 监听添加对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 删除参数
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该规格, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      //   用户取消了删除操作
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      //   删除业务
      const { data: res } = await this.$http.delete(
        `categories/${this.selectedCateKeys}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除规格失败");

      this.$message.success("删除规格成功");
      this.getParamsData();
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input_new_tag {
  width: 120px;
}
</style>
