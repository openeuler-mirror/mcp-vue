<template>
  <div :id="id" ref="canvasMap" :class="[className]" style="{height: 100%,width: 100%}" />
</template>
<script>
import * as echarts from 'echarts522'

// @group 组件组合的封装 mc-components
//  echart 控件
export default {
  props: {
    // className
    className: {
      type: String,
      default: ''
    },
    // 图表唯一id
    id: {
      type: String,
      required: true,
      default: 'chart'
    },
    // 图表的相关参数
    chartData: {
      type: Object,
      default: function () {
        return null
      }
    },
    // 是否启动每个分类区域鼠标click事件
    isRunClick: {
      type: Boolean,
      default: false
    },
    // 鼠标click事件，isRunClick为true时候才执行
    clickEvent: {
      type: Function,
      default: () => {
        return function () {}
      }
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.setOption(newVal)
          } else {
            this.setOption(oldVal)
          }
        }
      }
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      let ele = document.getElementById(this.id)
      if (!ele) {
        ele = this.$refs.canvasMap
      }
      this.chart = echarts.init(ele)
      if (this.isRunClick) {
        this.clickEvent()
      }
      this.setOption(this.chartData)
      window.addEventListener('resize', () => {
        if (this.chart) {
          this.chart.resize()
        }
      })
    },
    setOption (option) {
      this.chart.clear()
      option && this.chart.setOption(option)
    }
  }
}
</script>
