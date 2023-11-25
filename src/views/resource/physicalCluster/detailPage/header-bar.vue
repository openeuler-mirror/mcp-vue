<template>
  <div class="header-box">
    <div class="header-left">
      <el-button @click="toCluster">
        {{ $t("resourceMgr.loginCluster") }}
      </el-button>
    </div>
    <div class="header-right"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    toCluster() {
      this.$emit("toCluster");
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
