<template>
  <el-drawer
    size="800px"
    :title="$t('authorityMgr.selectSarentName')"
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
      :defaultSelectedKeys="defaultSelectedKeys"
      :organizationId="organizationId"
      @confirm="confirm"
      ref="bindOrgBox"
    />
  </el-drawer>
</template>

<script>
import bindOrgBox from "./bindOrgBox.vue";
export default {
  name: "BindOrgModal",
  components: {
    bindOrgBox,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    organizationId: {
      type: Number,
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
      //   this.$parent.renderTable();
    },
    confirm(rows) {
      this.$emit("confirm", rows);
    },
  },
};
</script>

<style>
</style>