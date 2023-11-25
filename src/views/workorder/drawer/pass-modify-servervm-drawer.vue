<template>
  <!-- 变更云服务器审核 -->
  <el-drawer
    size="900px"
    :title="$t('workOrder.passmodifyservervm')"
    direction="rtl"
    custom-class="workorder-pass-modify-servervm-drawer"
    v-if="drawerVisible"
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :before-close="handleClosePass"
    :destroy-on-close="true"
  >
    <PassServervmModifyDrawer
      ref="PassServervmModify"
      :passModifyData="passModifyData"
    />
  </el-drawer>
</template>

<script>
import PassServervmModifyDrawer from "./PassServervmModify.vue";
export default {
  components: {
    PassServervmModifyDrawer,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectRowData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      passModifyData: null,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
    selectRowData(selectRow) {
      this.passModifyData = selectRow;
    },
  },
  created() {},
  methods: {
    handleClosePass(done) {
      //this.$refs.PassServervmApply.handlerCancel()
      this.$emit("update:visible", false);
      done();
    },
  },
};
</script>
<style>
</style>
