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
    <modifyOrgNameBox :formOptions="formOptions" ref="modifyOrgNameBox" />
  </el-drawer>
</template>

<script>
import modifyOrgNameBox from "./modifyOrgNameBox.vue";
export default {
  components: {
    modifyOrgNameBox,
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