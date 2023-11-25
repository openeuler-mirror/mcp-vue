<template>
  <el-tooltip
    class="item"
    effect="light"
    :content="tipsText"
    :placement="placement"
  >
    <div class="icon-qustion"></div>
  </el-tooltip>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {
    tipsText: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      default: 32,
    },
    placement: {
      type: String,
      default: "right",
    },
  },
  data() {
    return {};
  },
  watch: {},

  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.icon-qustion {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  background: url("~@/assets/icon/wh.png") no-repeat center;
  background-size: 100%;
  cursor: pointer;
  margin-left: 10px;
}
.icon-qustion:hover {
  background: url("~@/assets/icon/whb.png") no-repeat center;
  background-size: 100%;
  cursor: pointer;
}
</style>
