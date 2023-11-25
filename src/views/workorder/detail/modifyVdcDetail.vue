<template>
  <div class="modifyVdcDetail">
    <el-form ref="createDataForm" label-width="auto" :model="modifyVdcVMDetail">
      <!-- 名称 -->
      <el-form-item :label="$t('resourceMgr.vdcName')">
        <span>{{ modifyVdcVMDetail.vdcName }}</span>
      </el-form-item>
      <!-- 所属组织 -->
      <el-form-item :label="$t('workOrder.organizationName')">
        <span>{{ modifyVdcVMDetail.orgName }}</span>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="$t('workOrder.vdcstatus')">
        <span>{{ modifyVdcVMDetail.statusDesc }}</span>
      </el-form-item>
      <!-- 架构 -->
      <el-form-item label="架构">
        <div
          class="modifyVdcDetail-flexBox"
          v-for="(
            item, resousei
          ) in modifyVdcVMDetail.applyArchitectureResourceList"
          :key="'cpu' + item.architectureType + resousei"
        >
          <div class="modifyVdcDetail-flexBox-left">
            <span>{{ item.architectureType }}</span>
          </div>

          <div class="modifyVdcDetail-flexBox-right">
            <div class="">
              <span class="vCPUmr-title">vCPU</span>

              <span class="vCPUmr">
                {{ $t("workOrder.oldResouse") + "：" + item.oldCpu }}
                {{ $t("common.cpu") }} ->
                {{ $t("workOrder.applyResouse") + "：" + item.applyCpu }}
                {{ $t("common.cpu") }}
              </span>
              <span v-if="modifyVdcVMDetail.status == 'CHECK_PASS'">
                ->
                {{ $t("workOrder.realResouse") + "：" + item.realCpu }}
                {{ $t("common.cpu") }}
              </span>
            </div>
            <div class="">
              <span class="vCPUmr-title">{{ $t("common.mem") }}</span>
              <span class="vCPUmr">
                {{ $t("workOrder.oldResouse") + "：" + item.oldMem }}
                {{ item.memUnit }} ->
                {{ $t("workOrder.applyResouse") + "：" + item.applyMem }}
                {{ item.memUnit }}
              </span>
              <span v-if="modifyVdcVMDetail.status == 'CHECK_PASS'">
                -> {{ $t("workOrder.realResouse") + "：" + item.realMem }}
                {{ item.memUnit }}
              </span>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('common.disk')">
        <span>
          {{
            $t("workOrder.oldResouse") +
            "：" +
            modifyVdcVMDetail.oldStorage +
            modifyVdcVMDetail.storageUnit
          }}
          ->
          {{
            $t("workOrder.applyResouse") +
            "：" +
            modifyVdcVMDetail.applyStorage +
            modifyVdcVMDetail.storageUnit
          }}
        </span>
        <span v-if="modifyVdcVMDetail.status == 'CHECK_PASS'">
          ->
          {{
            $t("workOrder.realResouse") +
            "：" +
            modifyVdcVMDetail.realStorage +
            modifyVdcVMDetail.storageUnit
          }}
        </span>
      </el-form-item>
      <!-- 申请原因 -->
      <el-form-item :label="$t('workOrder.applyReason')">
        <span>{{ modifyVdcVMDetail.applyReason }}</span>
      </el-form-item>
      <!-- 申请时间 -->
      <el-form-item :label="$t('workOrder.applyTime')">
        <span>{{ modifyVdcVMDetail.applyTime }}</span>
      </el-form-item>
      <!-- 审核者 -->
      <el-form-item :label="$t('workOrder.auditionUser')">
        <span>{{ modifyVdcVMDetail.auditionUser }}</span>
      </el-form-item>
      <!-- 审核时间 -->
      <el-form-item :label="$t('workOrder.auditionTime')">
        <span>{{ modifyVdcVMDetail.auditionTime }}</span>
      </el-form-item>
      <!-- 审核意见 -->
      <el-form-item :label="$t('workOrder.reviewComments')">
        <span>{{ modifyVdcVMDetail.auditOpinion }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "WorkDetail",
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {},
  data() {
    return {
      modifyVdcVMDetail: {},
    };
  },

  watch: {
    formOptions: {
      handler: function (newValue, oldValue) {
        this.setPageData(newValue);
      },
      // 代表在wacth里声明了 立即先去执行handler方法
      immediate: false,
      deep: true,
    },
  },
  created() {},
  methods: {
    setPageData() {
      let { formData } = this.formOptions;
      this.modifyVdcVMDetail = formData;
    },
  },
  mounted() {},
  computed: {},
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.modifyVdcDetail-flexBox {
  display: flex;
  flex-direction: row;
  line-height: 26px;
  .modifyVdcDetail-flexBox-left {
    width: 60px;
    height: 40px;
  }
  .modifyVdcDetail-flexBox-right {
    .vCPUmr-title {
      width: 50px;
      display: inline-block;
    }
  }
  .el-form-item__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
