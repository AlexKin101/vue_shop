<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>

      <!-- 步骤条区域 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="基本属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="addForm.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="weight">
              <el-input v-model="addForm.weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="number">
              <el-input v-model="addForm.number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                @change="handleChange"
                :props="{
                  expandTrigger: 'hover',
                  value: 'id',
                  label: 'catName',
                  children: 'children',
                  //checkStrictly: 'false',
                }"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              :label="item.name"
              v-for="item in manyTableData"
              :key="item.id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.values">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.values"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="基本属性" name="2">
            <el-form-item
              :label="item.name"
              v-for="item in onlyTableData"
              :key="item.id"
            >
              <el-input v-model="item.values"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传的API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="只能上传jpg/png文件，且不超过500kb"
                placement="right"
                :enterable="false"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-tooltip>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.intro"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览 " :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      activeIndex: "0",
      // 添加商品的表单数据对象
      addForm: {
        name: "",
        price: 0,
        weight: 0,
        number: 0,
        goods_cat: [], //  商品所属的分类数组
        // 图片数组
        pics: [],
        // 商品详情描述
        intro: "",
        attrs: [],
      },
      addFormRules: {
        name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "change",
          },
        ],
      },
      //   商品分类列表
      cateList: [],

      //  动态参数列表数据
      manyTableData: [],

      //  静态属性列表数据
      onlyTableData: [],
      //  上传图片的URL
      uploadURL: "http://localhost:1106/upload",

      // 图片上传组件的headers请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },

      // 预览图片URL
      previewPath: "",

      // 控制图片预览对话框
      previewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { pagenum: 0, pagesize: 0, type: 3 },
      });

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      //   把数据列表赋值给cateList
      this.cateList = res.data;
      //   console.log(res.data);
    },

    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (!this.cateId && this.addForm.goods_cat.length !== 0) {
        this.addForm.goods_cat = [];
        this.$message.warning("注意：只允许选择第三级分类");
      }
    },

    beforeTabLeave(activeName, oldActiveName) {
      //   console.log("即将离开的标签页名字是" + oldActiveName);
      //   console.log("即将进入的标签页名字是" + activeName);
      //   return false;

      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },

    async getParamsList(parmas) {
      console.log(this.addForm);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: parmas },
        }
      );
      console.log(res.data);
      if (res.meta.status != 200) {
        if (params === "mnay")
          return this.$message.error("获取动态参数列表失败");
        else {
          return this.$message.error("获取静态属性列表失败");
        }
      }
      return { data: res };
    },

    async tabClicked() {
      switch (this.activeIndex) {
        // 访问动态参数面板
        case "1": {
          const { data: res } = await this.getParamsList("many");
          res.data.forEach((item) => {
            item.values =
              item.values.length === 0 ? [] : item.values.split(" ");
          });
          this.manyTableData = res.data;
          console.log(res.data);
          break;
        }

        case "2": {
          const { data: res } = await this.getParamsList("only");
          console.log(res.data);
          this.onlyTableData = res.data;
          break;
        }
      }
    },

    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = "http://localhost:1106" + file.response.data.tmp_path;
      console.log(this.previewPath);
      this.previewVisible = true;
    },

    // 处理图片移除操作
    handleRemove(file) {
      //   1.获取将要删除的图片的临时路径
      const filePath = { pic: file.response.data };
      //   2.从pics数组中，找到这个图片的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      //   3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1);
    },

    // 监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response);
      const picInfo = { pic: response.data };
      //   1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm.pics);
    },

    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 执行添加的业务逻辑
        // lodash cloneDeep(obj)深拷贝
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");

        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            id: item.id,
            values: item.values === [] ? "" : item.values.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            id: item.id,
            values: item.values === [] ? "" : item.values,
          };
          this.addForm.attrs.push(newInfo);
        });

        form.attrs = this.addForm.attrs;

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        console.log(form);
        console.log(this.addForm);
        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status != 200) {
          return this.$message.error("添加商品失败");
        }
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    },
  },

  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 18px 0;
}
/deep/ .el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
