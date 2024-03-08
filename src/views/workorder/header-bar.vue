<template>
  <div class="header-outbox">
    <div class="header-box">
      <div class="header-left">
        <el-button :disabled="batchPass" @click="batchPassCommit">
          {{ $t("common.pass") }}
        </el-button>
        <el-button
          style="margin-left: 15px"
          :disabled="batchRefuse"
          @click="batchRefuseCommit"
        >
          {{ $t("common.refuse") }}
        </el-button>
        <span style="margin-left: 10px">{{ $t("workOrder.status") }}：</span>
        <el-select
          v-model="statusValue"
          :placeholder="$t('workOrder.statusplaceholder')"
          @change="statusChange"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <span style="margin-left: 10px">{{ $t("workOrder.typeDesc") }}：</span>
        <el-select
          v-model="orderTypeValue"
          :placeholder="$t('workOrder.typeDescplaceholder')"
          @change="orderTypeChange"
        >
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span style="margin-left: 10px">{{ $t("common.time") }}：</span>
        <el-date-picker
          v-model="timeData"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('common.to')"
          :start-placeholder="$t('common.startdate')"
          :end-placeholder="$t('common.enddate')"
          @change="timeDatachange"
        >
        </el-date-picker>
        <!-- <span style="margin-left: 10px">组织：</span>  
      <el-cascader
        v-model="organizationDefault"
        :options="organizationList"
        placeholder
        @change="handleOrganizationChange"
      /> -->
      </div>
      <div class="header-right">
        <searchInput @change="searchInputChange" />
        <i
          class="el-icon-refresh setting-icon"
          style="margin-left: 15px"
          :title="$t('common.refresh')"
          @click="refresh"
        />
      </div>
    </div>

    <el-dialog
      :title="
        batchDialogType === 0
          ? $t('common.batchPass')
          : $t('common.batchRefuse')
      "
      :visible.sync="batchDialogVisible"
      class="sm-dialog editDialog"
    >
      <el-form
        ref="batchForm"
        :model="batchForm"
        :rules="rulesBatchForm"
        label-width="80px"
      >
        <!-- 审核意见 -->
        <el-form-item
          :label="$t('workOrder.reviewComments')"
          prop="auditOpinion"
        >
          <el-input v-model="batchForm.auditOpinion" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchHandleConfirm">
          {{ $t("common.confirm") }}
        </el-button>
        <el-button style="margin-left: 20px" @click="bacthHandleCancel">
          {{ $t("common.cancel") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryOrgTree } from "@/api/organization";
import { batchCheck } from "@/api/workOrder";
import searchInput from "@/components/SearchInput";
import ReMessage from "@/utils/message";
import validate from "@/utils/validate";
export default {
  components: {
    searchInput,
  },
  props: {
    // 选中的数组
    selectData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      timeData: "",
      batchPass: true,
      batchPassType: "general",
      batchRefuse: true,
      statusOptions: [
        {
          value: "ALL",
          label: this.$t("workOrder.statusOptions.ALL"), // 全部",
        },
        {
          value: "WAIT_CHECK",
          label: this.$t("workOrder.statusOptions.WAIT_CHECK"), // 待审核",
        },
        {
          value: "CHECK_PASS",
          label: this.$t("workOrder.statusOptions.CHECK_PASS"), // 审核已通过",
        },
        {
          value: "CHECK_NO_PASS",
          label: this.$t("workOrder.statusOptions.CHECK_NO_PASS"), // 已拒绝",
        },
      ],
      statusValue: "ALL",
      orderTypeOptions: [
        {
          value: "ALL",
          label: this.$t("workOrder.orderTypeOptions.ALL"), // 全部",
        },
        {
          value: "REGISTER_USER",
          label: this.$t("workOrder.orderTypeOptions.REGISTER_USER"), // 账号注册",
        },
        {
          value: "MODIFY_USER",
          label: this.$t("workOrder.orderTypeOptions.MODIFY_USER"), // 修改账号",
        },
        {
          value: "APPLY_SERVERVM",
          label: this.$t("workOrder.orderTypeOptions.APPLY_SERVERVM"), // 申请云服务器",
        },
        {
          value: "MODIFY_SERVERVM",
          label: this.$t("workOrder.orderTypeOptions.MODIFY_SERVERVM"), // 变更云服务器",
        },
        {
          value: "DEFERRED_SERVERVM",
          label: this.$t("workOrder.orderTypeOptions.DEFERRED_SERVERVM"), // 延期云服务器",
        },
        {
          value: "MODIFY_VDC",
          label: this.$t("workOrder.orderTypeOptions.MODIFY_VDC"), // 变更VDC资源",
        },
      ],
      orderTypeValue: "ALL",
      organizationId: 0,
      // organizationDefault: [],
      // organizationList: [], // 组织列表
      batchDialogVisible: false,
      batchDialogType: 0,
      batchForm: {
        auditOpinion: "general",
      },
      rulesBatchForm: {
        auditOpinion: [
          {
            required: true,
            message: this.$t("workOrder.commentsNotempty"), // "审核意见不能为空",
            trigger: "blur",
          },
          {
            required: true,
            trigger: "blur",
            message: this.$t("workOrder.commentsspecialChar"), // "审核意见不能出现特殊字符",
            validator: validate.special_char,
          },
        ],
      },
    };
  },
  watch: {
    "selectData.length": {
      handler(len) {
        //默认批量通过，批量拒绝，都隐藏
        this.initDisabled(true);
        if (len > 0) {
          let pass = this.selectData.find(
            (item) => item.status === "CHECK_PASS"
          );
          let refuse = this.selectData.find(
            (item) => item.status === "CHECK_NO_PASS"
          );
          if (!(pass || refuse)) {
            //不存在已审核通过的，和审核拒绝的，

            //批量拒绝，显示
            this.batchRefuse = false;

            let applyServerVm = this.selectData.find(
              (item) => item.type === "APPLY_SERVERVM"
            );
            let modifyServerVm = this.selectData.find(
              (item) => item.type === "MODIFY_SERVERVM"
            );
            let modifyVDC = this.selectData.find(
              (item) => item.type === "MODIFY_VDC"
            );
            if (!(applyServerVm || modifyServerVm || modifyVDC)) {
              //不存在，申请云服务器申请，和变更审核审核，则批量通过显示且批量操作为普通型、
              this.batchPass = false;
              this.batchPassType = "general";
            } else {
              if (len == 1) {
                let { type } = this.selectData[0];

                switch (type) {
                  case "APPLY_SERVERVM":
                    this.batchPass = false;
                    this.batchPassType = "passApplyServerVm";
                    break;

                  case "MODIFY_SERVERVM":
                    this.batchPass = false;
                    this.batchPassType = "passModifyServerVm";
                    break;

                  case "MODIFY_VDC":
                    this.batchPass = !this.showVdcModifyPass(
                      this.selectData[0]
                    );
                    this.batchRefuse = !this.showRefuseBtn(this.selectData[0]);
                    this.batchPassType = "passModifyVdc";
                    break;
                  default:
                    this.batchPass = false;
                    this.batchPassType = "general";
                    break;
                }
              }
            }
          }
        }
      },
      deep: true,
    },
  },

  created() {
    //this.getOrganizationList()
  },
  methods: {
    showRefuseBtn(row) {
      let flag = false;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (row.status === "WAIT_CHECK") {
        if (row.type == "MODIFY_VDC") {
          if (row.applyUserId == userInfo.userId) {
            flag = false;
          } else {
            flag = true;
          }
        } else {
          flag = true;
        }
      }
      return flag;
    },
    showVdcModifyPass(row) {
      let flag = false;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (row.status === "WAIT_CHECK" && row.type == "MODIFY_VDC") {
        if (row.applyUserId == userInfo.userId) {
          flag = false;
        } else {
          flag = true;
        }
      }
      return flag;
    },
    initDisabled(booleanFlag) {
      this.batchPass = booleanFlag;
      this.batchRefuse = booleanFlag;
    },
    // 获取组织列表
    getOrganizationList() {
      queryOrgTree().then((res) => {
        var allOrg = new Object();
        allOrg["label"] = this.$t("common.all");
        allOrg["value"] = 0;
        this.organizationList.push(allOrg);
        this.foreachOrganizationList(res).forEach((item) =>
          this.organizationList.push(item)
        );
        //默认显示全部
        this.organizationDefault.push(0);
        this.foreachOrganizationIds(res);
      });
    },
    // 循环，赋值value 和 label
    foreachOrganizationIds(arr) {
      if (arr.length) {
        const item = arr[0];
        this.organizationDefault.push(item.organizationId);
        if (item.childOrgs && item.childOrgs.length) {
          this.foreachOrganizationIds(item.childOrgs);
        }
      }
    },
    // 循环，赋值value 和 label
    foreachOrganizationList(arr) {
      if (arr.length) {
        arr.forEach((item, index) => {
          item["label"] = item.organizationName;
          item["value"] = item.organizationId;
          if (item.childOrgs && item.childOrgs.length) {
            item["children"] = this.foreachOrganizationList(item.childOrgs);
          }
        });
      }
      return arr;
    },
    statusChange(value) {
      this.$parent.changeOrderStatus(value);
      this.$emit("refreshTable");
    },
    orderTypeChange(value) {
      this.$parent.changeOrderType(value);
      this.$emit("refreshTable");
    },
    // 搜索
    searchInputChange(val) {
      this.$parent.changeSearchKey(val);
      this.$emit("refreshTable");
    },
    // 刷新
    refresh() {
      this.$emit("refreshTable");
    },
    // 选择时间
    timeDatachange(date) {
      let startTime = "";
      let endTime = "";
      if (date) {
        startTime = date[0];
        endTime = date[1];
      }
      this.$parent.changetimeData({ startTime, endTime });
      this.$emit("refreshTable");
    },
    // 选择组织
    handleOrganizationChange(ids) {
      this.organizationId = ids[ids.length - 1];
      this.$parent.changeOrganizationId(this.organizationId);
      this.$emit("refreshTable");
    },
    batchPassCommit() {
      // if (this.batchPassType === "general") {
      //   this.batchDialogType = 0;
      //   this.batchDialogVisible = true;
      //   this.batchForm.auditOpinion = "";
      // } else if (this.batchPassType === "passApplyServerVm") {
      //   this.$parent.changeShowPassApplyServervmDrawer(true);
      //   this.$parent.setSelectRowData(this.selectData[0]);
      // } else if (this.batchPassType === "passModifyServerVm") {
      //   this.$parent.changeShowPassModifyServervmDrawer(true);
      //   this.$parent.setSelectRowData(this.selectData[0]);
      // }
      let key = this.batchPassType;
      switch (key) {
        case "general":
          this.batchDialogType = 0;
          this.batchDialogVisible = true;
          this.batchForm.auditOpinion = "";
          break;
        case "passApplyServerVm":
          this.$parent.changeShowPassApplyServervmDrawer(true);
          this.$parent.setSelectRowData(this.selectData[0]);
          break;
        case "passModifyServerVm":
          this.$parent.changeShowPassModifyServervmDrawer(true);
          this.$parent.setSelectRowData(this.selectData[0]);
          break;
        case "passModifyVdc":
          this.$parent.handleShowVdcPass(this.selectData[0]);
          this.$parent.setSelectRowData(this.selectData[0]);
          break;
        default:
          this.batchDialogType = 0;
          this.batchDialogVisible = true;
          this.batchForm.auditOpinion = "";
          break;
      }
    },
    batchRefuseCommit() {
      this.batchDialogType = 1;
      this.batchDialogVisible = true;
      this.batchForm.auditOpinion = "";
    },
    batchHandleConfirm() {
      this.$refs.batchForm.validate((valid) => {
        if (valid) {
          let auditOpinion = this.batchForm.auditOpinion;
          let workOrderIds = this.getBatchSelectedWorkOrderId();
          let checkStatus = "CHECK_PASS";
          if (this.batchDialogType == 1) {
            checkStatus = "CHECK_NO_PASS";
          }
          this.batchDialogVisible = false;
          batchCheck({ workOrderIds, auditOpinion, checkStatus }).then(
            (res) => {
              ReMessage.success(this.$t("common.batchReviewsucc"));
              this.refresh();
              this.initDisabled(true);
            }
          );
        } else {
          return false;
        }
      });
    },
    bacthHandleCancel() {
      this.$refs.batchForm.resetFields();
      this.batchDialogVisible = false;
    },
    getBatchSelectedWorkOrderId() {
      let workOrderIds = [];
      for (let i = 0; i < this.selectData.length; i++) {
        workOrderIds.push(this.selectData[i].workOrderId);
      }
      return workOrderIds;
    },
  },
};
</script>

<style lang="scss" scope>
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>