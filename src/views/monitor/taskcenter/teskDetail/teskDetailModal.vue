<template>
  <el-drawer
    size="900px"
    :title="options.title"
    direction="rtl"
    :append-to-body="false"
    :modal="false"
    custom-class="teskDetailBox"
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <teskDetailBox
      ref="teskDetailBox"
      :formOptions="formOptions"
      @confirm="confirm"
    />
  </el-drawer>
</template>

<script>
import teskDetailBox from "./teskDetailBox.vue";
export default {
  components: {
    teskDetailBox,
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
      this.formOptions = this.options;
    },
  },
  methods: {
    handleCloseCreate() {
      this.$emit("update:visible", false);
      // this.$parent.renderTable();
    },
    confirm(rows) {
      this.$emit("confirm", rows);
    },
  },
};
</script>

<style>
</style>