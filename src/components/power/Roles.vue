<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <!-- <el-button type="primary" @click="addDialogVisible = true">
            添加角色
          </el-button> -->
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border script>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>
                  {{ item1.name }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success">
                      {{ item2.name }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                    >
                      {{ item3.name }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="角色描述" prop="desc"></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
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
                @click="showEditDialog(scope.row.id)"
                :disabled="scope.row.id === 1 ? true : false"
              >
                编辑
              </el-button>
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
                @click="removeRoleById(scope.row.id)"
                :disabled="scope.row.id === 1 ? true : false"
              >
                删除
              </el-button>
            </el-tooltip>

            <!-- 分配权限按钮 -->
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            > -->
            <!-- <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
                :disabled="scope.row.id === 1 ? true : false"
              > -->
            <!-- 分配权限
              </el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="addForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="editForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">
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
      //所有角色列表数据
      roleList: [],
      // 所有权限的数据
      rightsList: [],
      //控制添加对话框的显示与隐藏
      addDialogVisible: false, //控制添加角色的对话框
      editDialogVisible: false, //控制修改角色的对话框
      setRightDialogVisible: false, //控制分配权限的对话框
      // 树形控件的属性绑定对象
      treeProps: {
        label: "name",
        children: "children",
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色
      roleId: "",
      //   添加角色的表单数据
      addForm: {
        name: "",
        desc: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "角色名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
      },
      // 查询到的用户信息对象
      editForm: {
        id: 0,
        name: "",
        desc: "",
      },
      //修改表单的验证规则对象
      editFormRules: {
        name: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "角色名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取所有角色的列表
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
      console.log(this.roleList);
    },

    //监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    //点击按钮,添加新角色
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加角色的网络请求
        const { data: res } = await this.$http.post("roles", this.addForm);

        if (res.meta.status !== 200) return this.$message.error("添加角色失败");
        //隐藏添加角色的对话框
        this.addDialogVisible = false;
        //重新获取角色列表
        this.getRoleList();
        //提示添加角色信息成功
        this.$message.success("添加角色成功");
      });
    },

    // 展示编辑角色的对话框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) return this.$message.error("角色查询失败");

      this.editForm = res.data;
      this.editDialogVisible = true;
      // console.log(this.editForm);
    },
    //监听修改角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 修改角色信息并提交
    editRolesInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        //可以发起修改角色的网络请求
        const { data: res } = await this.$http.put(
          `roles/update/${this.editForm.id}`,
          this.editForm
        );

        if (res.meta.status !== 200)
          return this.$message.error("修改角色信息失败");
        //隐藏修改角色的对话框
        this.editDialogVisible = false;
        //重新获取角色列表
        this.getRoleList();
        //提示修改角色信息成功
        this.$message.success("修改角色信息成功");
      });
    },

    // 根据Id删除对应的角色信息
    async removeRoleById(id) {
      //弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: res } = await this.$http.delete(`roles/delete/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除角色失败");
      this.$message.success("删除角色成功");
      //重新获取用户列表
      this.getRoleList();
    },

    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") return this.$message.info("取消了删除");

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );

      // console.log(res.data);

      if (res.meta.status !== 200) return this.$message.error("删除权限失败");
      role.children = res.data.children;
    },

    //展示分配权限的对话框
    async showSetRightDialog(role) {
      console.log(role);
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");

      // 把获取到的权限数据保存到data中
      this.rightsList = res.data;
      // console.log(res.data);

      //递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys);
      // console.log(this.defKeys);
      this.setRightDialogVisible = true;
    },

    // 通过递归的形式，获取角色所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },

    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },

    // 点击为角色分配权限
    async allowRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        null,
        { params: { rids: idStr } }
      );
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");

      this.$message.success("分配权限成功");
      this.getRoleList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scope>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
