<template>
  <div class="header-box">
    <div class="header-left">
      <el-button v-if="currentBtnShow('create_zone')" @click="newlyBuild">
        {{ $t("common.create") }}
      </el-button>
    </div>
    <div class="header-right">
      <utilsButton type="fresh" :spinBol="spinBol" @refresh="refresh" />
    </div>
  </div>
</template>

<script>
import utilsButton from "@/components/utilsButton";
export default {
  data() {
    return {};
  },
  props: {
    spinBol: {
      type: Boolean,
      default: false,
    },
  },
  created() {},
  components: {
    utilsButton,
  },
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
