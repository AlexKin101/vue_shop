<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/returns' }">
        退换货原因管理
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getReasonList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getReasonList"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加新理由
          </el-button>
        </el-col>
      </el-row>

      <el-alert
        title="初始理由不可关闭和删除"
        type="warning"
        show-icon
        :closable="false"
        style="margin-top:10px"
      ></el-alert>
      <!-- 订单列表区域 -->
      <el-table :data="returnReasonsList" border script>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="理由名称"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" align="center" width="100px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :disabled="judgeReason(scope.row.id)"
              @change="reasonStatusChanged(scope.row.id, scope.row.status)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="130px" align="center">
          <template slot-scope="scope">
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
                :disabled="judgeReason(scope.row.id)"
                @click="removeReasonsById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加新理由的对话框 -->
      <el-dialog
        title="添加新理由"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="reasonForm"
          :rules="reasonFormRules"
          ref="reasonFormRef"
          label-width="80px"
        >
          <el-form-item label="理由名称" prop="name">
            <el-input v-model="reasonForm.name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addReason">
            确 定
          </el-button>
        </span>
      </el-dialog>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 30, this.total]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //验证名称
    var checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("理由为必填项"));
      } else if (this.nameRules(value)) {
        this.nameRules(value).then(function(data) {
          console.log(data);
          if (data == true) {
            callback(new Error("该理由已存在"));
          } else {
            return callback();
          }
        });
      } else {
        return callback();
      }
    };

    return {
      // 查询条件
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   总数据条数
      total: 0,
      // 退换货理由的数据列表，默认为空
      returnReasonsList: [],

      //控制添加理由的对话框
      addDialogVisible: false,

      //   添加理由的表单数据
      reasonForm: {
        name: "",
      },

      // 添加表单的验证规则对象
      reasonFormRules: {
        name: [{ required: true, validator: checkName, trigger: "blur" }],
      },

      // 当前名称
      currentName: "",
    };
  },
  created() {
    this.getReasonList();
  },
  methods: {
    async getReasonList() {
      const { data: res } = await this.$http.get("reason", {
        params: this.queryInfo,
      });

      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取退换货理由列表失败");
      //   为总数据条数赋值
      //  this.$message.success("获取订单列表成功");
      this.queryInfo.pagenum = res.data.pageable.pageNumber + 1;
      this.queryInfo.pagesize = res.data.size;
      this.total = res.data.totalElements;
      this.returnReasonsList = res.data.content;
    },

    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getReasonList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getReasonList();
    },

    //监听switch开关状态的改变
    async reasonStatusChanged(id, status) {
      const { data: res } = await this.$http.put(
        `reason/${id}/status/${status}`
      );
      if (res.meta.status !== 200) {
        status = !status;
        return this.$message.error("更新该原因状态失败！");
      }
      this.$message.success("更新该原因状态成功！");
    },

    // 根据Id删除商品
    async removeReasonsById(id) {
      if (id >= 0 && id <= 8) {
        return;
      }
      //弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该原因, 是否继续?",
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
      const { data: res } = await this.$http.delete(`reason/${id}/delete`);
      if (res.meta.status !== 200) return this.$message.error("删除该原因失败");
      this.$message.success("删除该原因成功");
      //重新获取用户列表
      this.getReasonList();
    },

    //点击按钮,添加新理由
    addReason() {
      this.$refs.reasonFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加理由的网络请求
        const { data: res } = await this.$http.post("reason", this.reasonForm);

        if (res.meta.status !== 200) return this.$message.error("添加理由失败");
        //隐藏添加理由的对话框
        this.addDialogVisible = false;
        //重新获取理由列表
        this.getReasonList();
        //提示添加理由信息成功
        this.$message.success("添加新理由成功");
      });
    },

    //监听添加理由对话框的关闭事件
    addDialogClosed() {
      this.$refs.reasonFormRef.resetFields();
    },

    //判断理由id，1--8号的理由不可删除
    judgeReason(id) {
      if (id >= 0 && id <= 8) {
        return true;
      } else {
        return false;
      }
    },

    //验证名称是否重复
    async nameRules(value) {
      if (value) {
        const { data: res } = await this.$http.post("reason/checkName", null, {
          params: { name: value, currentName: this.currentName },
        });

        if (res.data == true) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
  },
};
</script>

<style lang="less" scoped></style>
