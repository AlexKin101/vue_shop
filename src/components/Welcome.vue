<!-- @format -->

<template>
  <div class="welcome">
    <div id="github">
      <github-corner></github-corner>
    </div>
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
      // 折线图数据
      lineData: [
        {
          title: "2021年访问量一览",
          legendData: ["真实访问量", "预估访问量"],
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
          // 推测数据
          guessData: [
            1200,
            1400,
            1800,
            2500,
            800,
            700,
            900,
            1000,
            800,
            600,
            2000,
            2400,
          ],
          icon: "",
        },
        {
          title: "昨日访问量一览",
          legendData: ["真实访问量", "预估访问量"],
          xData: [
            "0:00",
            "02:00",
            "04:00",
            "06:00",
            "08:00",
            "10:00",
            "12:00",
            "14:00",
            "16:00",
            "18:00",
            "20:00",
            "22:00",
            "24:00",
          ],
          // 真实数据
          realData: [
            150,
            280,
            90,
            100,
            80,
            70,
            140,
            130,
            90,
            100,
            420,
            60,
            120,
          ],
          // 推测数据
          guessData: [
            120,
            140,
            180,
            250,
            80,
            70,
            90,
            100,
            80,
            60,
            200,
            240,
            140,
          ],
          icon: "",
        },
        {
          title: "2021年总成交量",
          legendData: ["真实成交量", "预估成交量"],
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
          // 推测数据
          guessData: [
            75418,
            85123,
            68203,
            68415,
            38502,
            64312,
            41561,
            11432,
            85210,
            71062,
            114813,
            89510,
          ],
          // icon
          icon: "￥",
        },
        {
          title: "昨日成交量",
          legendData: ["真实成交量", "预估成交量"],
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
            2418,
            3023,
            4823,
            5815,
            6502,
            7312,
            4525,
            8432,
            5010,
            3106,
            8510,
            6500,
          ],
          // 推测数据
          guessData: [
            1418,
            2023,
            3823,
            6815,
            7502,
            6312,
            4500,
            5532,
            6610,
            4106,
            8910,
            7483,
          ],
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
          data: null,
          color: "#40C9C6",
        },
        {
          icon: "icon-user",
          title: "昨日访问量",
          data: null,
          color: "#36A3F7",
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
    this.getCityInfo().then(
      (res) => {
        this.getData(res);
      },
      (err) => {
        this.getData(err);
      }
    );

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
          {
            name: currentData.legendData[1],
            smooth: true,
            type: "line",
            animationDuration: 2800,
            data: currentData.guessData,
            animationEasing: "cubicInOut",
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
                color: "#FF005A",
                lineStyle: {
                  color: "#FF005A",
                  width: 2,
                },
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      // this.updateChart()
    },
    // 获取用户所在城市信息
    async getCityInfo() {
      //实例化城市查询类
      var citysearch = new AMap.CitySearch();
      //自动获取用户IP，返回当前城市
      return new Promise((resolve, reject) => {
        citysearch.getLocalCity(async function(status, result) {
          if (status === "complete" && result.info === "OK") {
            if (result && result.city) {
              resolve(result.city);
            }
          }
          reject("未知");
        });
      });
    },
    // 把用户城市信息发送给服务器并 获取总访问量和今日访问量
    async getData(city) {
      const { data: res } = await this.axiosInstance.get(
        "/?methods=userInfo&city=" + city
      );
      this.lineInfo = res;
      // this.cardData[0].data = this.lineInfo.totalPv + '次'
      // this.cardData[1].data = this.lineInfo.todayPv + '次'
      this.cardData[0].data = 4018153 + "次";
      this.cardData[1].data = 21523 + "次";
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
#github {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
}
.welcome {
  margin-top: 10px;
  padding: 0 10px;

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
}
</style>
