<template>
  <el-drawer
    size="800px"
    :title="title"
    direction="rtl"
    :append-to-body="true"
    :modal="false"
    custom-class="setVirtualFirewall"
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <bindVirtualFirewallBox
      ref="bindVirtualFirewallBox"
      :defaultTableData="defaultTableData"
      :defaultSelectedKeys="defaultSelectedKeys"
      @confirm="confirm"
    />
  </el-drawer>
</template>

<script>
import bindVirtualFirewallBox from "./bindVirtualFirewallBox.vue";
export default {
  components: {
    bindVirtualFirewallBox,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    defaultTableData: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: this.$t("resourceMgr.bindTheVirtualFirewall"), // "绑定虚拟防火墙",
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


<style lang="scss" scope>
.setVirtualFirewall {
  .el-drawer__body {
    display: flex;
    padding-top: 20px;
  }
}
</style>