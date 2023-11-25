<template>
  <div class="header-box">
    <div class="header-left">
      <el-button @click="newBuild">
        {{ $t("common.add") }}
      </el-button>
    </div>
    <div class="header-right">
      <i
        class="el-icon-refresh setting-icon"
        :title="$t('common.refresh')"
        @click="refresh"
      />
    </div>
  </div>
</template>

<script>
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
    newBuild() {
      this.$emit("newBuild");
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
