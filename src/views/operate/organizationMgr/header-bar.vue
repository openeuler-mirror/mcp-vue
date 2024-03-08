<template>
  <div class="header-box">
    <div class="header-left">
      <el-button @click="newlyBuild" v-if="currentBtnShow('create_org')">
        {{ $t("authorityMgr.createOrg") }}
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
    newlyBuild() {
      this.$emit("newlyBuild");
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
