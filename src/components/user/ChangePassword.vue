<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <div style="text-align: center;width: 750px;height: 430px;margin:auto">
        <!-- 步骤条 -->
        <el-steps
          :active="activeIndex - 0"
          finish-status="success"
          simple
          style="margin-top: 30px"
        >
          <el-step title="验证身份" icon="el-icon-edit"></el-step>
          <el-step title="设置密码" icon="el-icon-upload"></el-step>
          <el-step title="改密成功" icon="el-icon-check"></el-step>
        </el-steps>

        <!-- 验证表单 -->
        <el-form
          :model="checkForm"
          :rules="checkFormRules"
          ref="checkFormRef"
          label-width="100px"
          label-position="left"
          v-show="activeIndex === 0"
          class="check"
        >
          <el-row :gutter="24">
            <el-form-item label="用户名：" prop="username" style="width:400px">
              <el-input v-model="checkForm.username" disabled></el-input>
            </el-form-item>

            <el-form-item label="密码：" prop="password">
              <el-input v-model="checkForm.password" type="password"></el-input>
            </el-form-item>
            <span class="btnNext">
              <el-button @click="check" style="width:200px">下一步</el-button>
            </span>
          </el-row>
        </el-form>

        <!-- 修改表单 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="150px"
          label-position="left"
          v-show="activeIndex === 1"
          class="check"
        >
          <el-row :gutter="24">
            <el-form-item label="新密码：" prop="password" style="width:500px">
              <el-input v-model="editForm.password" type="password"></el-input>
            </el-form-item>

            <el-form-item label="重新输入新密码：" prop="rePassword">
              <el-input
                v-model="editForm.rePassword"
                type="password"
              ></el-input>
            </el-form-item>
            <span class="btnNext">
              <el-button @click="change" style="width:200px">下一步</el-button>
            </span>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      activeIndex: 0,

      dialogVisible: false,

      //验证表单
      checkForm: {
        username: "",
        password: "",
      },
      checkFormRules: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6~15个字符之间",
            trigger: "blur",
          },
        ],
      },
      //修改表单
      editForm: {
        password: "",
        rePassword: "",
      },
      editFormRules: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6~15个字符之间",
            trigger: "blur",
          },
        ],
        rePassword: [
          {
            required: true,

            trigger: "blur",
            validator: validatePass,
          },
        ],
      },
    };
  },
  created() {
    this.checkForm.username = window.sessionStorage.getItem("name");
    // this.dialogVisible = true;
  },
  methods: {
    check() {
      this.$refs.checkFormRef.validate(async (valid) => {
        if (!valid) return;

        // 可以发起验证用户的网络请求
        const { data: res } = await this.$http.post(
          "users/check",
          this.checkForm
        );

        if (res.meta.status !== 200) return this.$message.error("验证用户失败");
        console.log(res.data);
        this.editForm.id = res.data.id;
        this.activeIndex = 1;
        //提示添加用户信息成功
        this.$message.success("验证用户成功");
      });
    },

    change() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;

        // 可以发起验证用户的网络请求
        const { data: res } = await this.$http.put(
          `users/change/${this.editForm.id}`,
          this.editForm
        );

        if (res.meta.status !== 200) return this.$message.error("修改密码失败");
        this.activeIndex = 3;
        // this.dialogVisible = true;
        //提示添加用户信息成功

        this.$confirm("密码修改成功，身份已过期，请重新登录", "提示", {
          confirmButtonText: "确定",
          closeOnClickModal: false,
          showCancelButton: false,
          type: "success",
        }).then(() => {
          this.logout();
        });
      });
    },

    logout() {
      window.sessionStorage.clear(); //清空sessionStorage
      this.$router.push("/login"); //重定向
    },
  },
};
</script>

<style lang="less" scoped>
.check {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  //   width: 500px;
}
.btnNext {
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.finish {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}
</style>
