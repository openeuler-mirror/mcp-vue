<template>
  <el-drawer
    size="800px"
    :title="$t('resourceMgr.vdc.bindVDC')"
    direction="rtl"
    :append-to-body="true"
    :modal="false"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <bindVdcBox
      ref="bindVdcBox"
      :vdcparentId="vdcparentId"
      :defaultSelectedKeys="defaultSelectedKeys"
      @confirm="confirm"
    />
  </el-drawer>
</template>

<script>
import bindVdcBox from "./bindVdcBox.vue";
export default {
  components: {
    bindVdcBox,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vdcparentId: {
      type: String,
      default: "",
    },
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
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
    confirm(rows) {
      this.$emit("confirm", rows);
    },
  },
};
</script>

<style>
</style>