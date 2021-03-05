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
      <!-- 头部的警告区域 -->
      <el-alert
        title="注意：只允许第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            @change="handleChange"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              //checkStrictly: 'false',
            }"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <!-- only - 静态属性     many - 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
          >
            {{ this.activeBtnName }}
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
          >
            {{ this.activeBtnName }}
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性&参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
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
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 编辑参数的表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
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
      //   级联选择框双向绑定到的数组
      selectedCateKeys: [],
      //   被激活的页签名称
      activeName: "many",
      //   tab页签按钮的名称
      activeBtnName: "添加参数",
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
        attr_name: "",
      },
      //   添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数/属性名称",
            trigger: "blur",
          },
        ],
      },

      //   控制编辑对话框
      editDialogVisible: false,
      // 编辑参数的表单数据对象
      editForm: {
        attr_name: "",
      },
      //   编辑表单的验证规则对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数/属性名称",
            trigger: "blur",
          },
        ],
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
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      //   console.log(res.data);
      //   把数据列表赋值给cateList
      this.cateList = res.data;

      //   console.log(this.cateList);
    },

    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      this.getParamsData();
    },

    // tab页签点击事件的处理函数
    handleTabClick() {
      if (this.activeName == "many") {
        this.activeBtnName = "添加参数";
      } else {
        this.activeBtnName = "添加属性";
      }
      //   console.log(this.activeName);
      this.getParamsData();
    },

    // 获取参数的列表数据
    async getParamsData() {
      //   证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }

      //   证明选中的是三级分类
      //   console.log(this.selectedCateKeys);
      //   根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );

      if (res.meta.status !== 200)
        return this.$message.error("获取" + this.titleText + "列表失败");

      //   console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
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
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加失败");

        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },

    // 点击按钮，显示编辑对话框
    async showEditDialog(attr_id) {
      //   通过Id查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取" + this.titleText + "失败");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 点击按钮，编辑参数信息
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("编辑" + this.titleText + "失败");
        this.$message.success("编辑" + this.titleText + "成功");
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
        "此操作将永久删除该文件, 是否继续?",
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
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200)
        return this.$message.error("删除" + this.titleText + "失败");

      this.$message.success("删除" + this.titleText + "成功");
      this.getParamsData();
    },
  },

  computed: {
    // 如果按钮需要被禁用，返回true，否则返回false
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3;
    },
    // 当前选中的三级分类的Id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
