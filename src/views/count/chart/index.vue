<template>
  <div class="chart">
    <div v-for="(item, index) in domData" :key="index" class="item">
      <div class="left">
        <div class="title">{{ item.left.title }}</div>
        <div>
          <div class="info">
            <!-- 统计数 -->
            <span v-if="item.left.count">
              {{ item.left.countText }}<strong>{{ item.left.count }}</strong
              >个</span
            >
            <div class="info-right">
              <!-- 年 -->
              <select
                v-if="item.left.hasOwnProperty('year')"
                v-model="item.left.year"
                @change="
                  init(
                    item.left.field,
                    index,
                    'left',
                    item.left.fun,
                    item.left.type,
                    item.left.year,
                    item.left.month
                  )
                "
              >
                <option value="">全部</option>
                <option
                  v-for="(item, index) in years"
                  :key="index"
                  :value="item"
                  >{{ item }}</option
                >
              </select>
              <!-- 月 -->
              <select
                v-if="item.left.hasOwnProperty('month')"
                v-model="item.left.month"
                @change="
                  init(
                    item.left.field,
                    index,
                    'left',
                    item.left.fun,
                    item.left.type,
                    item.left.year,
                    item.left.month
                  )
                "
              >
                <option
                  v-for="(item, index) in months"
                  :key="index"
                  :value="item.value"
                  >{{ item.label }}</option
                >
              </select>
              <!-- 周 -->
              <select
                v-if="item.left.hasOwnProperty('week')"
                v-model="item.left.week"
                @change="
                  init(
                    item.left.field,
                    index,
                    'left',
                    item.left.fun,
                    item.left.type,
                    item.left.year,
                    item.left.month,
                    item.left.week
                  )
                "
              >
                <option :value="0">近一周</option>
              </select>
            </div>
          </div>
          <div
            :id="item.left.field + 'Chart'"
            style="width:100%;height:400px;"
          />
        </div>
      </div>
      <div class="right">
        <div class="title">{{ item.right.title }}</div>
        <div>
          <div class="info">
            <span
              >{{ item.right.countText }}<strong>{{ item.right.count }}</strong
              >个</span
            >
            <div class="info-right">
              <!-- 年 -->
              <select
                v-if="item.right.hasOwnProperty('year')"
                v-model="item.right.year"
                @change="
                  init(
                    item.right.field,
                    index,
                    'right',
                    item.right.fun,
                    item.right.type,
                    item.right.year,
                    item.right.month
                  )
                "
              >
                <option value="">全部</option>
                <option
                  v-for="(item, index) in years"
                  :key="index"
                  :value="item"
                  >{{ item }}</option
                >
              </select>
            </div>
          </div>
          <div
            :id="item.right.field + 'Chart'"
            style="width:96%;height:400px;margin:0 auto;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getYearStatistics, getStatisticsByType } from '@/api/statistics'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
// require('echarts/lib/chart/scatter')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/legendScroll')

export default {
  name: 'Chart',
  data() {
    return {
      domData: [
        {
          left: {
            field: 'filing',
            title: '项目备案各部门负责数统计',
            countText: '各部门负责的项目数',
            count: '',
            fun: this.filingOptions,
            type: 1,
            year: '',
            month: 0
          },
          right: {
            field: 'budget',
            title: '项目备案等级统计',
            countText: '定级项目备案总数',
            count: '',
            fun: this.budgetOptions,
            type: 5,
            year: ''
          }
        },
        {
          left: {
            field: 'process',
            title: '流程管控统计',
            countText: '当前流程管控总数',
            count: '',
            fun: this.processOptions,
            type: 3
          },
          right: {
            field: 'check',
            title: '项目审计统计',
            countText: '项目审计总数',
            count: '',
            fun: this.checkOptions,
            type: 2,
            year: ''
          }
        },
        {
          left: {
            field: 'seniority',
            title: '项目备案预算区间统计',
            countText: '项目备案预算区间',
            count: '',
            fun: this.seniorityOptions,
            type: 6,
            year: '',
            month: 0
          },
          right: {
            field: 'audit',
            title: '供应商资质统计',
            countText: '供应商录入总数',
            count: '',
            fun: this.auditOptions,
            type: 4,
            year: ''
          }
        },
        {
          left: {
            field: 'ip',
            title: '项目备案公网IP数量统计',
            countText: '使用公网IP数量的项目数',
            count: '',
            fun: this.ipOptions,
            type: 7,
            year: '',
            month: 0
          },
          right: {
            field: 'outlay',
            title: '项目支出方式统计',
            countText: '项目支出方式总数',
            count: '',
            fun: this.outlayOptions,
            type: 8,
            year: ''
          }
        },
        {
          // left: {
          //   field: 'holeType',
          //   title: '漏洞类型数量统计',
          //   countText: '漏洞类型数量',
          //   count: '',
          //   fun: this.holeTypeOptions,
          //   type: 9,
          //   year: '',
          //   month: 0,
          //   week: 0
          // },
          left: {
            field: 'holeType',
            title: '项目最长用时统计',
            countText: '总用时',
            count: '',
            fun: this.timeCostOptions,
            type: 11
          },
          right: {
            field: 'holeHarm',
            title: '漏洞危害级别统计',
            countText: '漏洞危害级别总数',
            count: '',
            fun: this.holeHarmOptions,
            type: 10,
            year: ''
          }
        }
      ],
      years: [],
      months: [
        { value: 0, label: '全月' },
        { value: 1, label: '一月' },
        { value: 2, label: '二月' },
        { value: 3, label: '三月' },
        { value: 4, label: '四月' },
        { value: 5, label: '五月' },
        { value: 6, label: '六月' },
        { value: 7, label: '七月' },
        { value: 8, label: '八月' },
        { value: 9, label: '九月' },
        { value: 10, label: '十月' },
        { value: 11, label: '十一月' },
        { value: 12, label: '十二月' }
      ]
    }
  },
  mounted() {
    getYearStatistics().then(res => {
      this.years = res.data
      this.domData.forEach((item, index) => {
        this.init(
          item.left.field,
          index,
          'left',
          item.left.fun,
          item.left.type,
          item.left.year,
          item.left.month,
          item.left.week
        )
        this.init(
          item.right.field,
          index,
          'right',
          item.right.fun,
          item.right.type,
          item.right.year,
          item.right.month
        )
      })
    })
  },
  methods: {
    createChart(dom, options) {
      let myChart = echarts.init(document.getElementById(dom))
      myChart.setOption(options)
    },
    init(field, index, adress, opitonFun, type, year, month, week) {
      getStatisticsByType(type, year, month, week).then(res => {
        this.domData[index][adress].count = res.data.count
        let options = opitonFun(res.data.chartList)
        this.createChart(`${field}Chart`, options)
      })
    },
    // 1各部门负责数统计
    filingOptions(list) {
      const options = {
        color: '#00a8b3',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: list.map(item => item.name),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            // rotate: 40,
            textStyle: {
              color: '#000' // 刻度字的颜色
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#00a8b3' // 刻度线的颜色
            }
          }
        },
        yAxis: {
          name: '数量(个)',
          type: 'value',
          axisLine: {
            lineStyle: {
              type: 'solid', // 刻度线的颜色
              color: '#00a8b3' // 刻度字的颜色
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ebebed'
            }
          }
        },
        series: [
          {
            name: '项目备案各部门负责数',
            type: 'bar',
            data: list.map(item => item.value),
            barWidth: '60%',
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      }
      return options
    },
    // 2项目审计统计
    checkOptions(list) {
      const options = {
        color: ['#f6ba05', '#00cccc', '#018bd0'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}个({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: list.map(item => item.name)
        },
        toolbox: {
          show: true,
          feature: {
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '项目审计',
            type: 'pie',
            radius: '55%',
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: list
          }
        ]
      }
      return options
    },
    // 3流程管控统计
    processOptions(list) {
      const options = {
        color: '#19b465',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: 'category',
          data: list.map(item => item.name),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#19b465' // 刻度线的颜色
            }
          }
        },
        yAxis: {
          name: '数量(个)',
          type: 'value',
          axisLine: {
            lineStyle: {
              type: 'solid', // 刻度线的颜色
              color: '#19b465' // 刻度字的颜色
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ebebed'
            }
          }
        },
        series: [
          {
            name: '流程管控',
            type: 'bar',
            data: list.map(item => item.value),
            barWidth: '60%',
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      }
      return options
    },
    // 4供应商资质统计
    auditOptions(list) {
      const options = {
        color: ['#00c0d7', '#ff4949'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}个({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: list.map(item => item.name)
        },
        toolbox: {
          show: true,
          feature: {
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '供应商资质',
            type: 'pie',
            radius: '55%',
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: list
          }
        ]
      }
      return options
    },
    // 5 项目备案等级统计
    budgetOptions(list) {
      const options = {
        color: ['#00c0d7', '#f6ba05', '#ff4949', '#19b465', '#018bd0'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}个({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: list.map(item => item.name)
        },
        toolbox: {
          show: true,
          feature: {
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '项目备案等级',
            type: 'pie',
            radius: '55%',
            // roseType: 'area',
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: list
          }
        ]
      }
      return options
    },
    // 6 项目备案预算区间统计
    seniorityOptions(list) {
      const options = {
        color: '#00a8b3',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: list.map(item => item.name),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#00a8b3' // 刻度线的颜色
            }
          }
        },
        yAxis: {
          name: '数量(个)',
          type: 'value',
          axisLine: {
            lineStyle: {
              type: 'solid', // 刻度线的颜色
              color: '#00a8b3' // 刻度字的颜色
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ebebed'
            }
          }
        },
        series: [
          {
            name: '项目备案预算区间',
            type: 'bar',
            data: list.map(item => item.value),
            barWidth: '60%',
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      }
      return options
    },
    // 7 项目备案公网IP数量统计
    ipOptions(list) {
      const options = {
        color: '#f6ba05',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          feature: {
            // dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: list.map(item => item.name),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#f6ba05' // 刻度线的颜色
            }
          }
        },
        yAxis: {
          name: '数量(个)',
          type: 'value',
          axisLine: {
            lineStyle: {
              type: 'solid', // 刻度线的颜色
              color: '#f6ba05' // 刻度字的颜色
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ebebed'
            }
          }
        },
        series: [
          {
            name: '项目备案公网IP数量',
            type: 'bar',
            data: list.map(item => item.value),
            barWidth: '60%',
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      }
      return options
    },
    // 8 项目支出方式统计
    outlayOptions(list) {
      const options = {
        color: ['#00c0d7', '#ff4949', '#19b465'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}个({d}%)'
        },
        toolbox: {
          show: true,
          feature: {
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: list.map(item => item.name)
        },
        series: [
          {
            name: '项目支出方式',
            type: 'pie',
            radius: '55%',
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: list
          }
        ]
      }
      return options
    },
    // 9 漏洞类型统计
    holeTypeOptions(list) {
      const options = {
        color: '#00a8b3',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: list.map(item => item.name),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#00a8b3' // 刻度线的颜色
            }
          }
        },
        yAxis: {
          name: '数量(个)',
          type: 'value',
          axisLine: {
            lineStyle: {
              type: 'solid', // 刻度线的颜色
              color: '#00a8b3' // 刻度字的颜色
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ebebed'
            }
          }
        },
        series: [
          {
            name: '漏洞类型数量',
            type: 'bar',
            data: list.map(item => item.value),
            barWidth: '60%',
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      }
      return options
    },
    // 10 漏洞危害级别统计
    holeHarmOptions(list) {
      const options = {
        color: ['#00c0d7', '#f6ba05', '#ff4949', '#19b465', '#018bd0'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}个({d}%)'
        },
        toolbox: {
          show: true,
          feature: {
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: list.map(item => item.name)
        },
        series: [
          {
            name: '漏洞危害级别',
            type: 'pie',
            radius: '55%',
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: list
          }
        ]
      }
      return options
    },
    // 11 最长用时统计
    timeCostOptions(list) {
      const options = {
        color: '#f6ba05',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: list.map(item => item.name),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#f6ba05' // 刻度线的颜色
            }
          }
        },
        yAxis: {
          name: '单位(天)',
          type: 'value',
          axisLine: {
            lineStyle: {
              type: 'solid', // 刻度线的颜色
              color: '#f6ba05' // 刻度字的颜色
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#000'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ebebed'
            }
          }
        },
        series: [
          {
            name: '总用时',
            type: 'line',
            data: list.map(item => (item.value / 24).toFixed(1)),
            barWidth: '60%',
            label: {
              normal: {
                show: false
              }
            }
          }
        ]
      }
      return options
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  .item {
    display: flex;
    margin-bottom: 20px;
    > div > div {
      .info {
        padding: 10px 10px 5px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span > strong {
          padding: 0 5px;
        }
        > .info-right {
          select {
            margin-left: 10px;
            width: 100px;
          }
        }
      }
    }
    .left {
      flex: 2;
      margin-right: 20px;
      border: 1px solid #d0e8fa;
      .title {
        background: #e7f3fd;
        border-bottom: 1px solid #d0e8fa;
        color: #045fc9;
        font-weight: bold;
        padding: 8px 15px;
      }
    }
    .right {
      flex: 1;
      background: #e7f3fd;
      .title {
        background: #158ae7;
        color: #fff;
        font-weight: bold;
        padding: 8px 15px;
      }
    }
  }
}
</style>
