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
    <createEditBox
      :formOptions="formOptions"
      ref="createEditBox"
      :transforType="transforType"
      @confirm="confirm"
    />
  </el-drawer>
</template>

<script>
import createEditBox from "./createEditBox.vue";
export default {
  components: {
    createEditBox,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    //ZONE,ORG,USER,MCDEFAULT:默认分组
    transforType: {
      type: String,
      default: "",
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
    confirm(rows) {
      this.$emit("update:visible", false);
      this.$emit("refreshTable");
    },
  },
};
</script>

<style></style>
