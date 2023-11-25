<template>
  <div class="header-box">
    <div class="header-left"></div>
    <div class="header-right">
      <i
        class="el-icon-refresh setting-icon"
        :title="$t('common.refresh')"
        @click="refresh"
      />
      <!-- <el-button type="primary" @click="createNetworkConfig">
        新建网络设置
      </el-button> -->
    </div>
  </div>
</template>

<script>
import ReMessage from "@/utils/message";
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    // 刷新
    refresh() {
      this.$emit("refreshTable");
    },
    createNetworkConfig() {
      this.$emit("handleToCreateNewNetwork");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
