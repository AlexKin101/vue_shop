<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="编辑商品信息"
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
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          @tab-click="tabClicked"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="editForm.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量（kg）" prop="weight">
              <el-input
                v-model="editForm.weight"
                type="number"
                oninput="value=value.replace(/[^\d.]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="number">
              <el-input v-model="editForm.number"></el-input>
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
              show-file-list
              auto-upload
              :file-list="fileList"
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
            <quill-editor v-model="editForm.intro"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnEdit" @click="edit">
              编辑商品
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
      uploadDisabled: false,
      baseURL: "http://localhost:1106",
      // 已上传文件列表
      fileList: [],
      activeIndex: "0",
      // 添加商品的表单数据对象
      editForm: {
        name: "",
        price: 0,
        weight: 0.0,
        number: 0,
        // 图片数组
        pics: [],
        // 商品详情描述
        intro: "",
        attrs: [],
      },
      editFormRules: {
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
      },
      //   商品分类列表
      cateList: [],

      //   商品品牌列表
      brandsList: [],

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

      cateNames: "",
    };
  },
  created() {
    // this.getCateList();
    this.getGoodsList();
    this.getGoodsListPic();
    // this.getBrandsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get(
        `goods/${this.$route.query.id}`
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取商品信息失败");

      this.editForm = res.data;
      // this.editForm.goods_cat = [];
      // this.editForm.goods_brands = [];
      console.log(res.data);

      this.editForm.attrs = [];
      this.showFileList();
    },

    async getGoodsListPic() {
      const { data: res } = await this.$http.get(
        `goods/${this.$route.query.id}`
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取商品信息失败");

      this.editForm.pics = res.data.pics;
      console.log(res.data);
    },

    //   获取所有商品分类数据
    // async getCateList() {
    //   const { data: res } = await this.$http.get("categories", {
    //     params: { pagenum: 0, pagesize: 0, type: 3 },
    //   });

    //   if (res.meta.status !== 200)
    //     return this.$message.error("获取商品分类数据失败");
    //   //   把数据列表赋值给cateList
    //   this.cateList = res.data;
    //   //   console.log(res.data);
    // },

    // 级联选择框选中项变化，会触发这个函数
    // handleChange() {
    //   console.log(this.editForm.goods_cat);
    //   if (!this.cateId && this.editForm.goods_cat.length !== 0) {
    //     this.editForm.goods_cat = [];
    //     this.$message.warning("注意：只允许选择第三级分类");
    //   }
    // },

    // beforeTabLeave(activeName, oldActiveName) {
    //   // console.log("即将离开的标签页名字是" + oldActiveName);
    //   // console.log("即将进入的标签页名字是" + activeName);
    //   // return false;

    //   if (oldActiveName === "0" && this.editForm.goods_cat.length !== 3) {
    //     this.$message.error("请先选择商品分类");
    //     return false;
    //   }
    // },

    // 图片添加页显示
    showFileList() {
      // console.log(this.editForm.pics);
      if (this.editForm.pics === []) return;
      let urlStr = this.editForm.pics;
      var i = 1;
      urlStr.forEach((item) => {
        let obj = new Object();
        obj = item;
        obj.url = this.baseURL + item.pics_mid;
        obj.name = "pic_" + i++;
        this.fileList.push(obj);
      });
    },

    async getParamsList(parmas) {
      const { data: res } = await this.$http.get(`goods/attributes`, {
        params: { id: this.$route.query.id, sel: parmas },
      });

      if (res.meta.status != 200) {
        if (params === "mnay")
          return this.$message.error("获取动态参数列表失败");
        else {
          return this.$message.error("获取静态属性列表失败");
        }
      }
      return { data: res };
    },

    // async getBrandsList() {
    //   const { data: res } = await this.$http.get("brands/list");
    //   if (res.meta.status !== 200)
    //     return this.$message.error("获取商品品牌列表数据失败");
    //   //   把数据列表赋值给brandsList
    //   // console.log(res.data);
    //   this.brandsList = res.data;
    // },

    async tabClicked() {
      switch (this.activeIndex) {
        // 访问动态参数面板
        case "1": {
          const { data: res } = await this.getParamsList("many");

          res.data.forEach((item) => {
            item.values =
              item.values.length === 0 ? [] : item.values.split(",");
          });

          console.log(res.data);
          this.manyTableData = res.data;
          break;
        }

        case "2": {
          const { data: res } = await this.getParamsList("only");
          // console.log(res.data);
          this.onlyTableData = res.data;
          break;
        }
      }
    },

    unique(arr) {
      // 根据唯一标识orderId来对数组进行过滤
      const res = new Map(); //定义常量 res,值为一个Map对象实例 //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter(
        (arr) => !res.has(arr.pics_id) && res.set(arr.pics_id, 1)
      );
    },

    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.url;
      // console.log(this.previewPath);
      this.previewVisible = true;
    },

    // 处理图片移除操作
    handleRemove(file) {
      //   1.获取将要删除的图片的临时路径
      const fileUid = file.uid;
      //   2.从pics数组中，找到这个图片的索引值
      const i = this.editForm.pics.findIndex((x) => x.pic === fileUid);
      //   3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.editForm.pics.splice(i, 1);
    },

    // 监听图片上传成功的事件
    handleSuccess(response) {
      //   1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中
      // console.log(file);
      const picInfo = { pic: response.data.tmp_path };
      if (response.meta.status !== 200) return;
      this.editForm.pics.push(picInfo);
      //console.log(this.editForm.pics);
    },

    handleChange() {},

    // 编辑商品
    edit() {
      console.log(this.editForm);
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 执行添加的业务逻辑
        // lodash cloneDeep(obj)深拷贝
        const form = _.cloneDeep(this.editForm);
        // form.goods_cat = form.goods_cat.join(",");
        // form.goods_brands = form.goods_brands.join(",");

        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            id: item.id,
            values: item.values === [] ? "" : item.values.join(","),
          };
          this.editForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            id: item.id,
            values: item.values === [] ? "" : item.values,
          };
          this.editForm.attrs.push(newInfo);
        });

        form.attrs = this.editForm.attrs;

        // 发起请求编辑商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.put(
          "goods/" + this.editForm.id,
          form
        );
        console.log(form);
        if (res.meta.status != 200) {
          return this.$message.error("编辑商品失败");
        }
        this.$message.success("编辑商品成功");
        this.$router.push("/goods");
      });
    },
  },

  computed: {
    cateId() {
      if (this.editForm.goods_cat.length === 3) {
        return this.editForm.goods_cat[2];
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
.btnEdit {
  margin-top: 15px;
}
</style>
