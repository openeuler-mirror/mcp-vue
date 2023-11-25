<template>
  <div class="drawer-content">
    <div class="drawer-body-content">
      <el-form ref="form" label-width="auto">
        <!-- 对象类型 -->
        <el-form-item :label="$t('taskcenter.taskObjectType')">
          <span>{{ teskDetail.type }}</span>
        </el-form-item>
        <!-- 任务名称 -->
        <el-form-item :label="$t('taskcenter.taskName')">
          <span>{{ teskDetail.action }}</span>
        </el-form-item>
        <!-- 对象名称 -->
        <el-form-item :label="$t('taskcenter.taskObject')">
          <span>{{ teskDetail.objName }}</span>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item :label="$t('taskcenter.taskStatus')">
          <span>{{ teskDetail.statusDesc }}</span>
        </el-form-item>
        <!-- 开始时间 -->
        <el-form-item :label="$t('taskcenter.startingTime')">
          <span>{{ teskDetail.startTime }}</span>
        </el-form-item>
        <!-- 结束时间 -->
        <el-form-item :label="$t('taskcenter.endTime')">
          <span>{{ teskDetail.endTime }}</span>
        </el-form-item>
        <!-- 操作者 -->
        <el-form-item :label="$t('taskcenter.operator')">
          <span>{{ teskDetail.operateUser }}</span>
        </el-form-item>
        <!-- 操作用户IP -->
        <el-form-item :label="$t('taskcenter.operatorIp')">
          <span>{{ teskDetail.clientIp }}</span>
        </el-form-item>
        <!-- 所属组织 -->
        <el-form-item :label="$t('taskcenter.organization')">
          <span>{{ teskDetail.orgName }}</span>
        </el-form-item>
        <!-- 可用区 -->
        <el-form-item :label="$t('taskcenter.availabilityZone')">
          <span>{{ teskDetail.zoneName }}</span>
        </el-form-item>
        <!-- 任务描述 -->
        <el-form-item :label="$t('taskcenter.taskDescription')">
          <span>{{ teskDetail.detail }}</span>
        </el-form-item>
        <!-- 失败原因 -->
        <el-form-item :label="$t('taskcenter.failureReason')">
          <span>{{ teskDetail.result }}</span>
        </el-form-item>
      </el-form>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>
<script>
import footBtn from "@/components/Footbtn";
import { operateLogDetail } from "@/api/taskcenter";
import testCenterstatus from "../testCenterstatus.vue";
import dictionary from "@/assets/common/dataDictionary/dictionary";

export default {
  components: { footBtn, testCenterstatus },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      teskDetail: {
        action: "",
        clientIp: "",
        detail: "",
        endTime: "",
        enumStatus: "",
        hasChildOperateLog: "",
        objName: "",
        operateLogId: "",
        operateUser: "",
        orgName: "",
        percent: "",
        result: null,
        startTime: "",
        status: "",
        type: "",
        zoneName: "",
      },
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.getPageData();
  },
  computed: {},
  methods: {
    // 提交
    handlerConfirm() {
      this.$parent.closeDrawer();
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
    getPageData() {
      let { formData } = this.formOptions;
      let params = {
        operateLog: formData.operateLogId,
      };
      operateLogDetail(params)
        .then((res) => {
          this.teskDetail = res;
          this.teskDetail.statusDesc = dictionary.getDesc(
            res.enumStatus,
            dictionary.teskstatusList
          );
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.drawer-body-content ::v-deep .el-form .el-form-item {
  margin-bottom: 0px !important;
}
</style>
