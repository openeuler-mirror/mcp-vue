<template>
  <el-drawer
    size="900px"
    :title="$t('externalCloud.vmOperate.createVm')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <div class="drawer-content"></div>
  </el-drawer>
</template>
<script>
export default {
  name: "createVmDetailBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    modelType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      formOptions: this.options,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  created() {},
  methods: {
    handleCloseCreate() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped></style>
