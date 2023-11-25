<template>
  <el-drawer
    size="900px"
    :title="$t('common.login.resetPassword')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <changePwdCont ref="changePwdCont" />
  </el-drawer>
</template>

<script>
import changePwdCont from "./changePwdCont.vue";
export default {
  components: {
    changePwdCont,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  methods: {
    handleCloseCreate() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style>
</style>