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
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="describe">
              <el-input v-model="editForm.describe"></el-input>
            </el-form-item>
            <el-form-item label="商品进货价格（元）" prop="inPrice">
              <el-input v-model="editForm.inPrice" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品售出价格（元）" prop="outPrice">
              <el-input v-model="editForm.outPrice" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量（kg）" prop="weight">
              <el-input
                v-model="editForm.weight"
                type="number"
                oninput="value=value.replace(/[^\d.]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品最低库存数量" prop="lowStock">
              <el-input v-model="editForm.lowStock"></el-input>
            </el-form-item>
            <el-form-item label="商品库存数量" prop="stock">
              <el-input v-model="editForm.stock"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品规格" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item label="商品规格">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  :label="item.id"
                  v-for="item in tableData"
                  :key="item.id"
                  border
                >
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <el-alert
              title="只能上传一张商品图片"
              type="warning"
              show-icon
              style="margin-bottom:10px"
              closable
            ></el-alert>
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
              :limit="1"
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
            <el-button
              type="primary"
              class="btnedit"
              @click="edit"
              style="margin-top:10px"
            >
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
      uploeditisabled: false,
      baseURL: "http://localhost:1106/upload",
      // 已上传文件列表
      fileList: [],
      activeIndex: "0",
      // 添加商品的表单数据对象
      editForm: {
        name: "",
        inPrice: 0,
        outPrice: 0,
        weight: 0.0,
        stock: 0,
        lowStock: 10,
        isStockout: 0,
        // 图片
        pics: "",
        // 商品详情描述
        intro: "",
        attrs: [],
        describe: "",
        goods_cat: "",
      },
      editFormRules: {
        name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        inPrice: [
          {
            required: true,
            message: "请输入商品进货价格",
            trigger: "blur",
          },
        ],
        outPrice: [
          {
            required: true,
            message: "请输入商品售出价格",
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
        stock: [
          {
            required: true,
            message: "请输入商品库存数量",
            trigger: "blur",
          },
        ],
        lowStock: [
          {
            required: true,
            message: "请输入商品最低库存数量",
            trigger: "blur",
          },
        ],
        describe: [
          {
            required: true,
            message: "请输入商品描述",
            trigger: "change",
          },
        ],
      },
      //   商品分类列表
      cateList: [],

      //   商品品牌列表
      brandsList: [],

      checkList: [],

      //  规格列表数据
      tableData: [],
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
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get(
        `goods/${this.$route.query.id}`
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取商品信息失败");

      this.editForm = res.data;
      this.editForm.pics = res.data.picture;
      this.editForm.goods_cat = res.data.type.name;
      this.editForm.goods_cat = this.editForm.type.name;
      this.editForm.goods_brands = this.editForm.brands.name;
      // console.log(res.data);
      // console.log(this.editForm);

      this.editForm.attrs = [];
      this.showFileList();
    },

    // async getGoodsListPic() {
    //   const { data: res } = await this.$http.get(
    //     `goods/${this.$route.query.id}`
    //   );
    //   if (res.meta.status !== 200)
    //     return this.$message.error("获取商品信息失败");

    //   this.editForm.pics = res.data;
    //   console.log(res.data);
    // },

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
      // console.log(this.fileList);

      let obj = new Object();
      obj.url = this.editForm.picture;
      obj.name = "pic";
      this.fileList.push(obj);

      // this.editForm.pics = this.editForm.pics.split(",");
      // let urlStr = ;
      // var i = 1;
    },

    async getParamsList() {
      // console.log(this.addForm);
      const { data: res } = await this.$http.get(
        `categories/${this.editForm.type.name}/attributes`
      );
      this.tableData = res.data;
      // console.log(res.data);
    },

    async getParamsListById() {
      const { data: res } = await this.$http.get(`goods/attributes`, {
        params: { id: this.$route.query.id },
      });
      // console.log(res.data);
      if (res.meta.status != 200) {
        return this.$message.error("获取规格列表失败");
      }
      this.checkList = res.data;
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
          this.checkList = [];
          this.tableData = [];
          this.getParamsList();
          // this.getParamsListById();
          // const { data: rep } = await this.getParamsListById()
          break;
        }
      }
    },

    // unique(arr) {
    //   // 根据唯一标识orderId来对数组进行过滤
    //   const res = new Map(); //定义常量 res,值为一个Map对象实例 //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
    //   return arr.filter(
    //     (arr) => !res.has(arr.pics_id) && res.set(arr.pics_id, 1)
    //   );
    // },

    // 处理图片预览效果
    handlePreview() {
      // console.log(file);
      this.previewPath = this.editForm.pics;
      // console.log(this.previewPath);
      this.previewVisible = true;
    },

    // 处理图片移除操作
    handleRemove(file) {
      // console.log(file);
      //   1.获取将要删除的图片的临时路径
      // const fileUid = file.uid;
      //   2.从pics数组中，找到这个图片的索引值
      // const i = this.editForm.pics.findIndex((x) => x.pic ==-= fileUid);
      //   3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.editForm.pics = "";
    },

    // 监听图片上传成功的事件
    handleSuccess(response) {
      //   1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中
      // console.log(response);
      // this.editForm.pics.splice(0, 1);
      // const picInfo = { pic: response.data.tmp_path };
      // if (response.meta.status !== 200) return;
      this.editForm.pics = response.data;
      //console.log(this.editForm.pics);
    },

    // 编辑商品
    edit() {
      // console.log(this.editForm);
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 执行添加的业务逻辑
        // lodash cloneDeep(obj)深拷贝
        const form = _.cloneDeep(this.editForm);

        form.isStockout = form.stock > form.lowStock ? 0 : 1;
        // form.goods_cat = form.goods_cat.join(",");
        // form.goods_brands = form.goods_brands.join(",");

        // 处理规格
        this.checkList.forEach((item) => {
          const newInfo = {
            id: item,
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
        // console.log(form);
        if (res.meta.status != 200) {
          return this.$message.error("编辑商品失败");
        }
        this.$message.success("编辑商品成功");
        this.$router.push("/goods");
      });
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
