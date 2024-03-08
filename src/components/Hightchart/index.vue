<template>
  <div class="high-chart-box">
    <highcharts :options="options" />
 
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue'
export default {
  components: {
    highcharts: Chart
  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
 
  }
}
</script>

<style lang="scss">
.high-chart-box{
  position: relative;
  .el-radio-group{
    position: absolute;
    right: 20px;
    top: 15px;
  }
}
</style>
