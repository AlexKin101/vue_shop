<!-- @format -->

<template>
  <div class="welcome">
    <!-- 四个卡片 -->
    <el-row :gutter="12">
      <el-col :span="6" v-for="(item, index) in cardData" :key="index">
        <el-card
          shadow="always"
          @mouseenter.native="change(item.color, index)"
          @mouseleave.native="currentIndex = null"
          @click.native="changeLine(index)"
        >
          <div class="left" :style="[currentIndex == index ? bgColor : '']">
            <span
              :class="['iconfont', , item.icon]"
              :style="{ color: currentIndex == index ? '#FFF' : item.color }"
            ></span>
          </div>
          <div class="right">
            <div class="title">{{ item.title }}</div>
            <div class="data">{{ item.data }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待处理事务 -->
    <el-card id="work">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待付款订单</span>
              <span style="float: right" class="color-danger">
                {{ this.pendingData.pendingPay }}
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right" class="color-danger">
                {{ this.pendingData.finish }}
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待评价订单</span>
              <span style="float: right" class="color-danger">
                {{ this.pendingData.pendingEvaluate }}
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待发货订单</span>
              <span style="float: right" class="color-danger">
                {{ this.pendingData.pendingDeliver }}
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退款申请</span>
              <span style="float: right" class="color-danger">
                {{ this.pendingData.pendingHandle }}
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已发货订单</span>
              <span style="float: right" class="color-danger">
                {{ this.pendingData.finishDeliver }}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <el-row :span="12">
              <div class="layout-title">商品总览</div>
            </el-row>
            <el-row>
              <div style="padding: 40px">
                <el-col>
                  <el-col :span="6" class="color-danger overview-item-value">
                    {{ this.productInfo.noSale }}
                  </el-col>
                  <el-col :span="6" class="color-danger overview-item-value">
                    {{ this.productInfo.Sale }}
                  </el-col>
                  <el-col :span="6" class="color-danger overview-item-value">
                    {{ this.productInfo.isStockout }}
                  </el-col>
                  <el-col :span="6" class="color-danger overview-item-value">
                    {{ this.productInfo.total }}
                  </el-col>
                </el-col>
                <el-col class="font-medium">
                  <el-col :span="6" class="overview-item-title">已下架</el-col>
                  <el-col :span="6" class="overview-item-title">已上架</el-col>
                  <el-col :span="6" class="overview-item-title">
                    库存紧张
                  </el-col>
                  <el-col :span="6" class="overview-item-title">
                    全部商品
                  </el-col>
                </el-col>
              </div>
            </el-row>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <el-row :span="12">
              <div class="layout-title">用户总览</div>
            </el-row>
            <el-row>
              <div style="padding: 40px">
                <el-col>
                  <el-col :span="6" class="color-danger overview-item-value">
                    {{ this.userInfo.today }}
                  </el-col>
                  <el-col :span="6" class="color-danger overview-item-value">
                    {{ this.userInfo.yesterday }}
                  </el-col>
                  <el-col :span="6" class="color-danger overview-item-value">
                    {{ this.userInfo.month }}
                  </el-col>
                  <el-col :span="6" class="color-danger overview-item-value">
                    {{ this.userInfo.total }}
                  </el-col>
                </el-col>
                <el-col class="font-medium">
                  <el-col :span="6" class="overview-item-title">
                    今日新增
                  </el-col>
                  <el-col :span="6" class="overview-item-title">
                    昨日新增
                  </el-col>
                  <el-col :span="6" class="overview-item-title">
                    本月新增
                  </el-col>
                  <el-col :span="6" class="overview-item-title">
                    会员总数
                  </el-col>
                </el-col>
              </div>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 折线图 -->
    <el-card id="line">
      <div ref="lineRef" style="height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import GithubCorner from "../components/GithubCorner";
let echarts = require("echarts");
require("../assets/lib/theme/macarons"); // echarts theme
export default {
  name: "Welcome",
  components: {
    GithubCorner,
  },
  data() {
    return {
      // 折线图实例
      chartInstance: null,

      //待处理数据
      pendingData: [],

      //商品总览
      productInfo: [],

      //用户总览
      userInfo: [],

      // 折线图数据
      lineData: [
        {
          title: "2021年访问量一览",
          legendData: ["真实访问量"],
          xData: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          // 真实数据
          realData: [
            1500,
            2800,
            900,
            1000,
            800,
            700,
            1400,
            1300,
            900,
            1000,
            800,
            600,
          ],
          icon: "",
        },
        {
          title: "2021年总成交量",
          legendData: ["真实成交量"],
          xData: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          // 真实数据
          realData: [
            85418,
            95123,
            58203,
            48415,
            48502,
            54312,
            48561,
            18432,
            105210,
            91062,
            104813,
            84510,
          ],
          // icon
          icon: "￥",
        },
        {
          title: "昨日成交量",
          legendData: ["真实成交量"],
          xData: [
            "0点",
            "2点",
            "4点",
            "6点",
            "8点",
            "10点",
            "12点",
            "14点",
            "16点",
            "18点",
            "20点",
            "22点",
            "24点",
          ],
          // 真实数据
          realData: [],
          // icon
          icon: "￥",
        },
        {
          title: "今日成交量",
          legendData: ["真实成交量", "预估成交量"],
          xData: [
            "0点",
            "2点",
            "4点",
            "6点",
            "8点",
            "10点",
            "12点",
            "14点",
            "16点",
            "18点",
            "20点",
            "22点",
            "24点",
          ],
          // 真实数据
          realData: [70, 80, 20, 10, 30, 50, 250, 300, 400, 300, 510, 680, 700],
          // icon
          icon: "￥",
        },
      ],
      activeLine: 0,
      // 四个card的数据
      cardData: [
        {
          icon: "icon-showpassword",
          title: "总访问量",
          data: "123456",
          color: "#40C9C6",
        },
        {
          icon: "icon-cart",
          title: "总成交量",
          data: "1025018￥",
          color: "#F4516C",
        },
        {
          icon: "icon-checkmark",
          title: "昨日成交量",
          data: "2253￥",
          color: "#34BFA3",
        },
        {
          icon: "icon-checkmark",
          title: "今日成交量",
          data: "1999￥",
          color: "#DEBC51",
        },
      ],
      // axios实例对象
      axiosInstance: null,
      // 折线图信息
      lineInfo: null,
      // 用于设置鼠标悬停在card上的高亮
      currentIndex: null,
      // 高亮的背景色
      bgColor: {},
      // 高亮的字体色
      fontColor: {},
    };
  },
  destroyed() {
    this.chartInstance.dispose();
  },
  async created() {
    this.getData();

    this.axiosInstance = axios.create({
      // baseURL: 'http://localhost:8997',
      // 使用服务器地址
      baseURL: "http://localhost:1106",
    });
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化图表
      this.initChart();
    });
  },
  methods: {
    // 初始化图表的方法
    initChart() {
      this.chartInstance = echarts.init(this.$refs.lineRef, "macarons");
      let currentData = this.lineData[this.activeLine];
      // 初始化图表的配置项
      const initOption = {
        title: {
          text: currentData.title,
          textStyle: {
            fontSize: "28",
          },
        },
        legend: {
          left: "center",
          top: "5%",
          // data: ['真实访问量', '预估访问量'],
          data: currentData.legendData,
        },
        grid: {
          top: "20%",
          left: "0%",
          right: "2%",
          bottom: "0%",
          // 把x轴和y轴纳入 grid
          containLabel: true,
        },
        // 工具提示
        tooltip: {
          // 当鼠标移入坐标轴的显示提示
          trigger: "axis",
          // 鼠标放上去十字交叉指示器
          axisPointer: {
            type: "cross",
          },
        },
        xAxis: {
          type: "category",
          // data: xDataArr,
          data: currentData.xData,
          // 紧挨边缘
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: currentData.legendData[0],
            smooth: true,
            type: "line",
            animationDuration: 2800,
            data: currentData.realData,
            animationEasing: "quadraticOut",
            markPoint: {
              // 最大最小值的相关配置
              label: {
                show: true,
                formatter: "{c}" + currentData.icon,
              },
              data: [
                {
                  type: "max",
                  name: "最大值",
                },
                {
                  type: "min",
                  name: "最小值",
                },
              ],

              animationDuration: 2800,
              animationEasing: "quadraticOut",
            },
            itemStyle: {
              normal: {
                color: "#3888fa",
                lineStyle: {
                  color: "#3888fa",
                  width: 2,
                },
                areaStyle: {
                  color: "#f3f8ff",
                },
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      // this.updateChart()
    },
    async getData() {
      const { data: res } = await this.$http.get("show/welcome");
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      console.log(res.data);

      //折线图数据
      this.lineData[1].xData = res.data.month.month;
      this.lineData[1].realData = res.data.month.monthPrice;
      this.lineData[2].realData = res.data.yesterday.dayPrice;
      this.lineData[3].realData = res.data.today.dayPrice;
      this.lineData[3].xData = res.data.today.hour;

      //页面数据
      this.cardData[1].data = res.data.month.total + " ¥";
      this.cardData[2].data = res.data.yesterday.total + " ¥";
      this.cardData[3].data = res.data.today.total + " ¥";

      this.pendingData = res.data.pending;

      this.productInfo = res.data.products;

      this.userInfo = res.data.customers;
      // this.dayPrice = res.data.dayPrice;
      // this.month = res.data.month;
    },

    // 鼠标经过card该变对应样式
    change(color, index) {
      this.currentIndex = index;
      this.bgColor = {
        backgroundColor: color,
      };
    },
    // 改变图表显示的数据
    changeLine(index) {
      this.activeLine = index;
      this.chartInstance.dispose();
      this.initChart();
    },
  },
};
</script>

<style lang="less" scope>
.welcome {
  margin-top: 10px;
  padding: 0 20px;

  .el-row {
    .el-card__body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      .iconfont {
        font-size: 48px;
      }
      div.left {
        padding: 10px;
        border-radius: 5px;
      }
      div.right {
        height: 68px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
      }
    }
    .el-card__body:hover {
      cursor: pointer;
    }
  }
  #line {
    margin-top: 15px;
  }
  #work {
    margin-top: 10px;
  }
}
//未处理事务
.un-handle-content {
  padding: 20px 40px;
}
.un-handle-item {
  border-bottom: 1px solid #ebeef5;
  padding: 10px;
}
//正文
.font-medium {
  font-size: 16px;
  color: #606266;
}
.color-danger {
  color: #f56c6c;
}
.overview-layout {
  margin-top: 20px;
}
.overview-item-value {
  font-size: 20px;
  text-align: center;
}
.overview-item-title {
  margin-top: 10px;
  text-align: center;
}
.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #f2f6fc;
  font-weight: bold;
}
</style>
