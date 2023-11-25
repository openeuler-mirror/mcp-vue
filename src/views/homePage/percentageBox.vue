<template>
  <div class="percentageBox">
    <!--  -->
    <div class="progress-label">
      <div>{{ option.label }}</div>
      <div class="progress-text">
        {{ option.percentageNum + unit }}
      </div>
    </div>
    <div class="percentageBox-progress">
      <div class="progress-box">
        <el-progress
          :show-text="false"
          :percentage="getpercentage(option.percentage)"
          :color="customColorMethod"
        >
        </el-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default() {
        return { percentage: 0, percentageNum: "", label: "" };
      },
    },
    unit: {
      type: String,
      default: "%",
    },
  },
  data() {
    return {};
  },
  methods: {
    // Two decimal places
    twoDecplaces(num) {
      num = parseFloat(num);
      if (isNaN(num)) {
        return 0;
      }
      return Math.round(num * 100) / 100.0;
    },
    getpercentage(percentage) {
      if (percentage >= 100) {
        percentage = 100;
      }

      return parseFloat(percentage);
    },
    // 自定义进度条颜色
    customColorMethod(percentage) {
      return "#1DDBB1";
      // if (percentage <= 80) {
      //   return "#1DDBB1";
      // } else if (80 < percentage && percentage < 90) {
      //   return "#E6A23C";
      // } else {
      //   return "#F56C6C";
      // }
    },
  },
};
</script>

<style lang="scss" >
.percentageBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 40px;

  .percentageBox-progress {
    height: 18px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    .progress-box {
      flex: 1;
      .el-progress {
        width: 100%;
      }
    }
    .progress-text {
      max-width: max-content;
      min-width: 30px;
      margin-left: 10px;
      line-height: 1;
      text-align: right;
    }
  }

  .progress-label {
    width: 100%;
    line-height: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
