<template>
  <el-drawer
    size="900px"
    :title="options.title"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <createorganizBox :formOptions="formOptions" ref="createorganizBox" />
  </el-drawer>
</template>

<script>
import createorganizBox from "./createorganizBox.vue";
export default {
  components: {
    createorganizBox,
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
  created() {},
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