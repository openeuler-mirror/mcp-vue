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
  //position: absolute;bottom: 0;right: 0;left: 0;
  padding: 25px 70px;

  border-top: 1px $borderColor solid;
  .el-button {
    margin-right: 15px;
  }
}
</style>
