<template>
  <el-drawer
    size="43%"
    title="新建网络设置"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <createDrawer ref="createNewDrawer" />
  </el-drawer>
</template>

<script>
import createDrawer from "./createNetworkConfigDrawer.vue";
export default {
  components: {
    createDrawer,
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
      this.$parent.renderTable();
    },
  },
};
</script>

<style>
</style>