<template>
  <el-drawer
    size="800px"
    title="选择角色"
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
    <bindRoleBox
      ref="bindRoleBox"
      :roleOrgId="roleOrgId"
      :defaultSelectedKeys="defaultSelectedKeys"
      @confirm="confirm"
    />
  </el-drawer>
</template>

<script>
import bindRoleBox from "./bindRoleBox.vue";
export default {
  components: {
    bindRoleBox,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    roleOrgId: {
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