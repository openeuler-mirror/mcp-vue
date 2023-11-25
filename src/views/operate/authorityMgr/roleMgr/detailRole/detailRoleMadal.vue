<template>
  <el-drawer
    size="900px"
    :title="this.options.title"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <detailRoleBox :formOptions="formOptions" ref="detailRoleBox" />
  </el-drawer>
</template>

<script>
import detailRoleBox from "./detailRoleBox.vue";
export default {
  components: {
    detailRoleBox,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
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
  methods: {
    handleCloseCreate() {
      this.$emit("update:visible", false);
      this.$parent.renderTable();
    },
  },
};
</script>

<style>
</style>