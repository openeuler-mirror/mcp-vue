<template>
  <div class="high-chart-box">
    <highcharts :options="options" />
    <div v-if="showDateBtn">
      <el-radio-group v-model="dateType" @change="handelChangeDate">
        <el-radio-button
          v-for="(item, index) in chartsBtnData"
          :disabled="item.value !== dateType && otherBtnDisabled"
          :key="index"
          :label="item.value"
          >{{ item.key }}
        </el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import { Chart } from "highcharts-vue";
export default {
  components: {
    highcharts: Chart,
  },
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    name: {
      type: String,
      default: "",
    },
    showDateBtn: {
      type: Boolean,
      default: false,
    },
    chartsName: {
      type: String,
      default: "",
    },
    chartsBtnData: {
      type: Array,
      default: [],
    },
    otherBtnDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dateType: "",
    };
  },
  created() {
    this.dateType = this.chartsBtnData[0]["value"];
  },
  methods: {
    handelChangeDate() {
      this.$emit("changeDateType", this.dateType, this.chartsName);
    },
  },
};
</script>

<style lang="scss">
.high-chart-box {
  position: relative;
  .el-radio-group {
    position: absolute;
    right: 20px;
    top: 15px;
  }
}
</style>
