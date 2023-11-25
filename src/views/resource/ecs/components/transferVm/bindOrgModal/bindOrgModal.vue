<template>
  <el-drawer
    size="880px"
    :title="options.title"
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
    <bindOrgBox
      :formOptions="formOptions"
      ref="bindOrgBox"
      @confirm="confirm"
    />
  </el-drawer>
</template>

<script>
import bindOrgBox from "./bindOrgBox.vue";
export default {
  components: {
    bindOrgBox,
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
      //   this.$parent.renderTable();
    },
    confirm(rows) {
      this.$emit("confirm", rows);
    },
  },
};
</script>

<style></style>
