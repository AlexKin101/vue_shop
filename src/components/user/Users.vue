<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column
          label="手机号"
          prop="tel"
          width="200px"
        ></el-table-column>
        <el-table-column label="角色" prop="role.name"></el-table-column>
        <el-table-column label="状态" align="center" width="100px">
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
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
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="setRole(scope.row, scope.row.role.name)"
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

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="addForm.tel"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="editForm.tel"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisibile"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div align="left">
        <p>当前的用户： {{ userInfo.username }}</p>
        <p>当前的角色： {{ this.roleName }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisibile = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }

      callback(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        // 合法的手机号
        return callback();
      }

      callback(new Error("请输入合法的手机号"));
    };

    return {
      //获取用户列表的参数
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 5,
      },
      userList: [],
      total: 0,
      //控制添加对话框的显示与隐藏
      addDialogVisible: false, //控制添加用户的对话框
      editDialogVisible: false, //控制修改用户的对话框
      setRoleDialogVisibile: false, //控制分配角色的对话框
      // 需要被分配角色的用户信息
      userInfo: "",
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id
      selectedRoleId: "",
      //  选中用户的角色名
      roleName: "",
      //   添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        tel: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6~15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        tel: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      // 查询到的用户信息对象
      editForm: {},
      //修改表单的验证规则对象
      editForm: {},
      editFormRules: {
        email: [
          { required: false, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        tel: [
          {
            required: false,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.queryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.queryInfo.pagesize = res.data.size;
      this.total = res.data.totalElements;
      this.userList = res.data.content;

      // console.log(res);
      // console.log(this.queryInfo);
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    //监听switch开关状态的改变
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },

    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    //点击按钮,添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);

        if (res.meta.status !== 200) return this.$message.error("添加用户失败");
        //隐藏添加用户的对话框
        this.addDialogVisible = false;
        //重新获取用户列表
        this.getUserList();
        //提示添加用户信息成功
        this.$message.success("添加用户成功");
      });
    },

    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) return this.$message.error("用户查询失败");

      this.editForm = res.data;
      this.editDialogVisible = true;
      // console.log(this.editForm);
    },

    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        //可以发起修改用户的网络请求
        // console.log(this.editForm);
        const { data: res } = await this.$http.put(
          `users/update/${this.editForm.id}`,
          this.editForm
        );

        if (res.meta.status !== 200)
          return this.$message.error("修改用户信息失败");
        //隐藏修改用户的对话框
        this.editDialogVisible = false;
        //重新获取用户列表
        this.getUserList();
        //提示修改用户信息成功
        this.$message.success("修改用户信息成功");
      });
    },

    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      //弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      const { data: res } = await this.$http.delete(`users/delete/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
      //重新获取用户列表
      this.getUserList();
    },

    // 展示分配角色的对话框
    async setRole(userInfo, roleName) {
      this.userInfo = userInfo;
      this.roleName = roleName;

      // 在展示对话框之前，获取所有角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      // console.log(res.data);
      this.rolesList = res.data;
      this.setRoleDialogVisibile = true;
    },

    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId)
        return this.$message.error("请选择要分配的角色");
      // console.log(this.selectedRoleId);
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role/${this.selectedRoleId}`
      );

      if (res.meta.status !== 200) return this.$message.error("更新角色失败");
      this.$message.success("更新角色成功");

      this.getUserList();
      this.setRoleDialogVisibile = false;
    },

    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
    },
  },
};
</script>

<style lang="less" scoped></style>
