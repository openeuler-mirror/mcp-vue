<template>
  <div class="rowpercentBox">
    <div class="rowpercent">
      <el-progress
        :show-text="false"
        :percentage="percentValue"
        :stroke-width="10"
        color="#67c23a"
      ></el-progress>
    </div>
    <div class="rowlabel">{{ percentValue }}%</div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      percentValue: 0,
    };
  },
  created() {
    this.percentValue = parseInt(this.percent);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.rowpercentBox {
  width: 100%;
  display: flex;
  align-items: center;

  .rowpercent {
    flex: 1;
  }
  .rowlabel {
    width: 40px;
    text-align: right;
  }
}
</style>
