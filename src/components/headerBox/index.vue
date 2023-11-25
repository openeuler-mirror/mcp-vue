<template>
  <div class="header-box">
    <div class="header-left">
      <slot name="headerLeft" />
    </div>
    <div class="header-right">
      <slot name="headerRight" />
      <utilsButton type="fresh" :spinBol="spinBol" @refresh="refreshTable" />
    </div>
  </div>
</template>
<script>
import utilsButton from "@/components/utilsButton";
export default {
  name: "headerBox",
  components: {
    utilsButton,
  },
  props: {
    spinBol: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    refreshTable() {
      this.$emit("refresh");
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
.header-left {
  display: flex;
  align-items: center;
  flex: 1;
  ::v-deep {
    .el-input {
      width: 200px;
    }
  }
  .btn-margin {
    margin-left: 15px;
  }
}
.header-box {
  margin-bottom: 20px;
}
</style>
