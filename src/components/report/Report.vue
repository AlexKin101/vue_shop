<!-- @format -->

<template>
  <div>
    <!-- 面包屑导航区域  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-select
        v-model="selectYear"
        placeholder="请选择"
        @change="yearChange()"
      >
        <el-option
          v-for="item in years"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div style="align:center">
        <el-table :data="monthData" border show-summary>
          <el-table-column label="时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.year + "年 " + scope.row.month + "月" }}
            </template>
          </el-table-column>
          <el-table-column
            label="月营销额（元）"
            prop="price"
            align="center"
            sortable
          ></el-table-column>
          <el-table-column
            label="月利润（元）"
            prop="profit"
            align="center"
            sortable
          ></el-table-column>
          <el-table-column
            label="月销量"
            prop="number"
            align="center"
            sortable
          ></el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 折线图 -->
    <el-card style="margin-top:20px">
      <el-row :gutter="24">
        <el-col :span="8" style="margin-right:5px">
          <el-card>
            <div id="pie" style="height:450px;"></div>
            <span style="color:#F56C6C;margin-left:20px">
              订单总数：{{ this.totalOrders }}
            </span>
          </el-card>
        </el-col>

        <el-col :span="15">
          <div id="main" style="height:450px;"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// 1、导入echarts
// import echarts from "echarts";
let echarts = require("echarts");
require("../../assets/lib/theme/macarons"); // echarts theme
import GithubCorner from "../../components/GithubCorner";
import _ from "lodash";
export default {
  name: "Report",
  components: {
    GithubCorner,
  },
  data() {
    return {
      // 折线图实例
      chartInstance: null,

      // 折线图数据

      // 需要合并的表单数据

      monthData: [],

      monthPrice: [],

      typeInfo: [],

      totalOrders: 0,

      month: [
        "第1月",
        "第2月",
        "第3月",
        "第4月",
        "第5月",
        "第6月",
        "第7月",
        "第8月",
        "第9月",
        "第10月",
        "第11月",
        "第12月",
      ],

      selectYear: "2021",

      years: [
        {
          value: "2017",
          label: "2017",
        },
        {
          value: "2018",
          label: "2018",
        },
        {
          value: "2019",
          label: "2019",
        },
        {
          value: "2020",
          label: "2020",
        },
        {
          value: "2021",
          label: "2021",
        },
      ],
    };
  },
  created() {
    this.getMonthData(2021);
  },

  methods: {
    initChart() {
      this.chartInstance_lie = echarts.init(
        document.getElementById("main"),
        "macarons"
      );

      this.chartInstance_pie = echarts.init(
        document.getElementById("pie"),
        "macarons"
      );

      // 4、准备数据和配置项
      var options = {
        title: {
          text: this.selectYear + "年的月销售数据一览",
          textStyle: {
            fontSize: "28",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        legend: {
          left: "center",
          top: "5%",
          data: ["销售额（元）", "利润（元）"],
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
        xAxis: [
          {
            type: "category",
            data: this.month,
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            animationDuration: 2800,
            data: this.monthPrice,
            type: "line",
            name: "销售额（元）",
            animationEasing: "quadraticOut",
            markPoint: {
              // 最大最小值的相关配置
              label: {
                show: true,
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
            animationDuration: 2800,
            data: this.monthProfit,
            type: "line",
            name: "利润（元）",
            animationEasing: "quadraticOut",
            markPoint: {
              // 最大最小值的相关配置
              label: {
                show: true,
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
                color: "#3000fa",
                lineStyle: {
                  color: "#3000fa",
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

      var option_2 = {
        title: {
          text: this.selectYear + "年订单统计",
          textStyle: {
            fontSize: "28",
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "87%",
          left: "center",
        },
        series: [
          {
            name: "订单个数",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "32",
                fontWeight: "bold",
                fontColor: "#3000fa",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.typeInfo,
          },
        ],
      };
      // console.log(options);

      // 5、显示数据
      this.chartInstance_lie.setOption(options);
      this.chartInstance_pie.setOption(option_2);
      // myChart.setOption(option_2);
    },

    async getMonthData(selectYear) {
      const { data: res } = await this.$http.get("show", {
        params: { year: selectYear },
      });
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.monthData = res.data.monthData;
      this.monthPrice = res.data.monthPrice;
      this.month = res.data.month;
      this.monthProfit = res.data.monthProfit;
      this.typeInfo = res.data.typeInfo;
      this.totalOrders = res.data.totalOrders;
      console.log(res.data);
      // this.getMonthPrice(2021);
      this.initChart();
    },

    yearChange() {
      // console.log(this.selectYear);
      this.getMonthData(this.selectYear);
      // this.getMonthPrice(this.selectYear);
    },
  },
};
</script>

<style lang="less" scoped></style>
