<template>
  <div class="footBtn">
    <el-button type="primary" @click="handleConfirm">
      {{ $t("common.confirm") }}
    </el-button>
    <el-button @click="handleCancel"> {{ $t("common.cancel") }}</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    handleConfirm() {
      this.$emit("confirm");
    },
    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
.footBtn {
  border-top: 1px $borderColor dashed;
  .el-button {
    margin-right: 15px;
  }
}
</style>
