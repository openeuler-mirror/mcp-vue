<template>
  <el-drawer
    size="750px"
    :title="$t('resourceMgr.network.setUp')"
    direction="rtl"
    :append-to-body="true"
    :modal="false"
    custom-class="setVdcNetWorkModal"
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <div class="vdccreate-network">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <!-- 新建网络 -->
        <el-tab-pane
          :label="
            formOptions.editflag
              ? $t('common.networkSet')
              : $t('common.newnetwork')
          "
          name="newNetwork"
        >
        </el-tab-pane>
        <!-- 选择上级网络 -->
        <el-tab-pane
          v-if="!firstVdcBox"
          :label="$t('common.upperNetwork')"
          name="upperNetwork"
        >
        </el-tab-pane>
      </el-tabs>
      <setVdcNetWorkBox
        v-if="activeName == 'newNetwork'"
        ref="setVdcNetWorkBox"
        :vdczoneId="vdczoneId"
        :formOptions="formOptions"
        @confirm="confirm"
      />
      <selectVdcNetWork
        v-if="activeName == 'upperNetwork'"
        :vdcparentId="vdcparentId"
        :formOptions="formOptions"
        @confirm="confirm"
      />
    </div>
  </el-drawer>
</template>

<script>
import setVdcNetWorkBox from "./setVdcNetWorkBox.vue";
import selectVdcNetWork from "./selectVdcNetWorkBox.vue";
export default {
  components: {
    setVdcNetWorkBox,
    selectVdcNetWork,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vdczoneId: {
      type: String,
      default: "",
    },
    vdcparentId: {
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
      activeName: "newNetwork",
      drawerVisible: this.visible,
      formOptions: {},
      firstVdcBox: true,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
    options(val) {
      this.setformOptions(val);
    },
  },
  created() {
    this.setformOptions(this.options);
  },
  methods: {
    setformOptions(options) {
      let { formData } = options;
      this.activeName = "newNetwork";
      this.firstVdcBox = formData.firstVdc;
      this.formOptions = this.options;
    },
    handleCloseCreate() {
      this.$emit("update:visible", false);
    },
    confirm(rows) {
      this.$emit("confirm", rows);
    },
    tabClick(val) {},
  },
};
</script>

<style lang="scss" scoped>
.setVdcNetWorkModal {
  .el-drawer__body {
    display: flex;
  }
  .vdccreate-network {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>
