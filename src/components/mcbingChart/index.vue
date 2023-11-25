<template>
  <!-- Chart -->
  <commonChart :chartData="chartData"></commonChart>
</template>

<script>
import commonChart from "@/components/commonChart/index";
export default {
  components: { commonChart },
  props: {
    chartData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
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
      // 代表在wacth里声明了 立即先去执行handler方法
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