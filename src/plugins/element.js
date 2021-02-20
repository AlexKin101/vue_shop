import Vue from "vue";
import { Button, Form, FormItem, Input, Message } from "element-ui";
// 导入弹框提示组建

//use可以使用链式
Vue.use(Button).use(Form).use(FormItem).use(Input);

Vue.prototype.$message = Message;
