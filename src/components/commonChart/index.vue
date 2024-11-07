<template>
  <!-- Chart -->
  <div ref="barchart" :id="chartId" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  props: {
    chartData: {
      type: Object,
      default: {},
    },
    openClick: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chartId: "",
    };
  },
  created() {
    // this.chartId = this.chartData.id
  },
  mounted() {},
  watch: {
    chartData: {
      handler: function (newValue, oldValue) {
        if (newValue.id) {
          this.chartId = newValue.id;
          this.$nextTick(() => {
            this.drowChart(newValue);
          });
        }
      },
      // 代表在watch里声明了 立即先去执行handler方法
      immediate: true,
      deep: true,
    },
  },
  methods: {
    drowChart(val) {
      let _this = this;
      this.$nextTick(() => {
        let dcharts = echarts.getInstanceByDom(
          document.getElementById(_this.chartId)
        );
        if (dcharts === undefined) {
          dcharts = echarts.init(document.getElementById(_this.chartId));
        } else {
          dcharts.clear();
        }
        let option = val.option;
        if (option) {
          dcharts.setOption(option);
          if (_this.openClick) {
            dcharts.on("click", function (params) {
              _this.$emit("chartClick", params);
            });
          } else {
            dcharts.off("click"); //解绑点击事件
          }
        } else {
          dcharts.clear();
        }
      });
    },
    resize() {
      this.drowChart(this.chartData);
    },
  },
  beforeDestroy() {
    let Chart = echarts.getInstanceByDom(this.$refs.barchart);
    if (!Chart) {
      Chart = echarts.init(this.$refs.barchart);
      this.$once("hook:beforeDestroy", function () {
        echarts.dispose(Chart);
      });
    }
  },
};
</script>