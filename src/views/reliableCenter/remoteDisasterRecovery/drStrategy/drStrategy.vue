<template>
  <div class="app-container">
    <headerBox @refresh="freshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <el-button @click="handleCreateStrategy">{{
          $t("reliableCenter.createDrPolicy")
        }}</el-button>
        <el-button @click="handelRunNow" :disabled="selectData.length === 0">{{
          $t("reliableCenter.executeDrPolicyImmediately")
        }}</el-button>
        <el-button @click="handelRun" :disabled="selectData.length === 0">{{
          $t("reliableCenter.enable")
        }}</el-button>
        <el-button
          @click="handelForbiden"
          :disabled="selectData.length === 0"
          >{{ $t("reliableCenter.disable") }}</el-button
        >
        <el-button
          v-show="!showSearch"
          class="btn-margin"
          @click="showSearch = true"
          icon="el-icon-search"
        >
        </el-button>
        <el-input
          class="btn-margin"
          v-model="searchKey"
          prefix-icon="el-icon-search"
          v-show="showSearch"
          @keyup.enter.native="freshTable"
        >
          <i
            slot="suffix"
            @click="showSearch = false"
            class="el-input__icon el-icon-close"
          ></i>
        </el-input>
      </template>
    </headerBox>
    <mc-table
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      :tableLoading="tableLoading"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      @selection-change="handleSelectione"
      :rowkey="rowkey"
      selectionType="multipleTable"
      style="margin-top: 20px"
    >
      <template v-for="(item, index) in tableColumns">
        <el-table-column
          v-if="item.prop === 'machineCount'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span
              class="link-text"
              @click.stop="
                showVm = true;
                planId = row.planId;
              "
              >{{ row[item.prop] }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'backupCycleType'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ getBackupText(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'rpoCompress'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{
              row[item.prop]
                ? $t("reliableCenter.compressedTransmission")
                : $t("reliableCenter.uncompressedTransmission")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'bdrPro'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{
              row.backupCycleType === "HOUR"
                ? secToHour(row.hourDetail.rpoCycle) + $t("reliableCenter.hour")
                : $t("reliableCenter.immediately")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'status'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <statuscell :status="row.status" type="bdr" />
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        width="150"
        :label="$t('common.operation')"
        className="tableoperation"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-link
            type="primary"
            style="width: 42px; margin-right: 5px"
            @click.stop="editPlan(row)"
          >
            {{ $t("common.modify") }}
          </el-link>
          <el-dropdown trigger="click">
            <el-link type="primary">
              <!-- 更多 -->
              {{ $t("resourceMgr.servervmmore") }}
              <i class="el-icon-arrow-down el-icon--right" />
            </el-link>
            <el-dropdown-menu slot="dropdown">
              <div v-for="(item, index) in toggleList" :key="item.key + index">
                <el-dropdown-item :command="item">
                  <el-link
                    @click="downToggleCommand(item.key, row)"
                    :disabled="getDisableBol(row.status, item.cantClickStatus)"
                    :underline="false"
                  >
                    {{ item.label }}
                  </el-link>
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </mc-table>
    <vmBox :visible.sync="showVm" :planId="planId" />
    <drStrategyInfor
      :visible.sync="showDrStrategyInfor"
      @freshTable="freshTable"
      :type="inforBoxType"
      :detailInfo="planDetail"
    />
    <messageBox
      :dialogVisible.sync="dialogmessageVisible"
      :bodyTitle="bodyTitle"
      :bodyDes="bodyDes"
      :topTitle="$t('reliableCenter.prompt')"
      @hadnelSubmit="submitRunNow"
      @hadnelCancel="dialogmessageVisible = false"
    />
  </div>
</template>
<script>
import headerBox from "@/components/headerBox";
import mcTable from "@/components/MctablePro";
import statuscell from "@/components/statuscell";
import messageBox from "@/components/messageBox";
import vmBox from "./vmBox";
import {
  getBdrPlanList,
  handelDelPlan,
  handelGetDeatail,
  handelSwitchPlan,
  handelRunBdrNow,
  handelbatchSwitchBdr,
} from "@/api/remoteDisasterRecovery";
import drStrategyInfor from "./drStrategyInfor.vue";
export default {
  name: "drStrategy",
  components: {
    headerBox,
    mcTable,
    statuscell,
    vmBox,
    drStrategyInfor,
    messageBox,
  },
  data() {
    return {
      showAddSite: false,
      showSearch: false,
      inforBoxType: null,
      tableLoading: false,
      showVm: false,
      selectData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      searchKey: "",
      planDetail: {},
      planId: null,
      visibleChange: false,
      rowkey: "planId",
      tableColumns: [
        // 容灾策略名称
        {
          label: this.$t("reliableCenter.drPolicyName"),
          prop: "planName",
          width: "115",
        },
        // 主站点
        {
          label: this.$t("reliableCenter.primarySite"),
          prop: "masterSiteName",
        },
        // 备站点
        {
          label: this.$t("reliableCenter.secondarySite"),
          prop: "slaveSiteName",
        },
        // 云服务器 table
        {
          label: this.$t("reliableCenter.cloudServer"),
          prop: "machineCount",
        },
        // 主站点备份位置
        {
          label: this.$t("reliableCenter.primarySiteBackupLoc"),
          prop: "masterBackupServerPath",
          width: "200",
        },
        // 主站点备份周期
        {
          label: this.$t("reliableCenter.primarySiteBackupPeriod"),
          prop: "backupCycleType",
          width: "300",
        },
        // 备站点容灾位置
        {
          label: this.$t("reliableCenter.secondarySiteDrLoc"),
          prop: "slaveBackupServerPath",
          width: "300",
        },
        // 容灾传输方式
        {
          label: this.$t("reliableCenter.drTransmissionMode"),
          prop: "rpoCompress",
          width: "111",
        },
        // 容灾pro 只有小时有 其他是立即
        {
          label: this.$t("reliableCenter.drPro"),
          prop: "bdrPro",
        },
        // 启用状态
        {
          label: this.$t("reliableCenter.enabledState"),
          prop: "status",
        },
        // 下次容灾时间
        {
          label: this.$t("reliableCenter.nextDrTime"),
          prop: "nextBackupTime",
          width: "111",
        },
      ],
      showDrStrategyInfor: false,
      dialogmessageVisible: false,
      bodyTitle: "",
      bodyDes: "由于异地容灾占用资源较大，请谨慎操作",

      toggleList: [
        {
          key: "start",
          label: this.$t("reliableCenter.enable"), //"启用",
          disabled: false,
          cantClickStatus: ["NORMAL"],
          show: true,
        },
        {
          key: "disabled",
          label: this.$t("reliableCenter.disable"), //"禁用",
          disabled: false,
          cantClickStatus: ["DEAD"],
          show: true,
        },
        {
          key: "delete",
          label: this.$t("externalCloud.vmList.delete"), //"删除",
          disabled: false,
          cantClickStatus: [],
          show: true,
        },
      ],
    };
  },
  mounted() {
    this.handelGetBdrPlanList();
  },
  methods: {
    freshTable() {
      this.handelGetBdrPlanList();
    },
    editPlan(row) {
      this.$showFullScreenLoading();
      handelGetDeatail({ planId: row.planId })
        .then((res) => {
          this.planDetail = res;
          this.inforBoxType = "edit";
          this.showDrStrategyInfor = true;
        })
        .finally(() => {
          this.$hideFullScreenLoading();
        });
    },
    downToggleCommand(key, row) {
      let title = "";
      let confirmText = "";
      let handelText = "";
      switch (key) {
        case "start":
          title = this.$t("reliableCenter.enableConfirmation");
          confirmText = this.$t("reliableCenter.enableConfirmation");
          handelText = this.$t("reliableCenter.enable");
          this.showConfirm(
            this.handelSwitch,
            title,
            confirmText,
            handelText,
            row,
            true
          );
          break;
        case "disabled":
          title = this.$t("reliableCenter.disableConfirmation");
          confirmText = this.$t("reliableCenter.disableConfirmation");
          handelText = this.$t("reliableCenter.disable");
          this.showConfirm(
            this.handelSwitch,
            title,
            confirmText,
            handelText,
            row,
            false
          );
          break;
        case "delete":
          title = this.$t("reliableCenter.deletionConfirmation");
          confirmText = this.$t("reliableCenter.deletionConfirmation");
          handelText = this.$t("reliableCenter.delete");
          this.showConfirm(this.handelDel, title, confirmText, handelText, row);
          break;
        default:
          break;
      }
    },
    showConfirm(fnc, title, confirmText, handelText, row, params) {
      this.$confirm(confirmText, title, {
        confirmButtonText: handelText,
        cancelButtonText: this.$t("externalCloud.vmList.cancel"),
        type: "warning",
      })
        .then(() => {
          fnc(row, params);
        })
        .catch((err) => {
          if (err !== "cancel") {
            this.$message({
              type: "info",
              message: this.$t("externalCloud.vmList.cancel") + handelText,
            });
          }
        });
    },
    handelDel(row) {
      handelDelPlan({
        planId: row.planId,
      }).then((res) => {
        this.$message.success(this.$t("resourceMgr.deleteSucc"));
        this.freshTable();
      });
    },
    handelSwitch(row, type) {
      handelSwitchPlan({
        planId: row.planId,
        switchOn: type,
      }).then((res) => {
        const message = type
          ? this.$t("reliableCenter.enabledSuccessfully")
          : this.$t("reliableCenter.disabledSuccessfully");
        this.$message.success(message);
        this.freshTable();
      });
    },
    getDisableBol(status, cantClickStatus) {
      let disabled = false;
      if (cantClickStatus) {
        disabled = cantClickStatus.indexOf(status) >= 0;
      }
      return disabled;
    },
    handelGetBdrPlanList() {
      this.tableLoading = true;
      const params = {
        pageNo: 1,
        pageSize: 10,
        searchKey: this.searchKey,
      };
      getBdrPlanList(params)
        .then((res) => {
          this.tableData = res.list;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handlePageChange(page) {
      this.pageNo += page;
      this.handelGetBdrPlanList();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    handleSelectione(row) {
      this.selectData = row;
    },
    getBackupText(row) {
      switch (row.backupCycleType) {
        case "HOUR":
          // 小时备份
          return `${this.$t("reliableCenter.hourlyBackup")}(${this.secToHour(
            row.hourDetail.backupCycle
          )}${this.$t("reliableCenter.hour")})`;
        case "DAY":
          // 每天备份
          return `${this.$t("reliableCenter.dailyBackup")}(${this.$t(
            "reliableCenter.everyDay"
          )}<${this.$t("reliableCenter.startTime")}：${
            row.dayDetail.startTime
          }，${this.$t("reliableCenter.endTime")}：${row.dayDetail.endTime}>)`;
        case "WEEK":
          // 每周备份
          return `${this.$t("reliableCenter.weeklyBackup")}(${this.$t(
            "reliableCenter.everyWeek"
          )}<${this.getWeekVal(row.weekDetail.weeks)},${this.$t(
            "reliableCenter.startTime"
          )}：${row.weekDetail.startTime}>)`;
      }
    },
    secToHour(sec) {
      return (sec / 3600).toFixed(2);
    },
    getWeekVal(arr) {
      const transObj = {
        MONDAY: this.$t("reliableCenter.weekObj.MONDAY"),
        TUESDAY: this.$t("reliableCenter.weekObj.TUESDAY"),
        WEDNESDAY: this.$t("reliableCenter.weekObj.WEDNESDAY"),
        THURSDAY: this.$t("reliableCenter.weekObj.THURSDAY"),
        FRIDAY: this.$t("reliableCenter.weekObj.FRIDAY"),
        STAURDAY: this.$t("reliableCenter.weekObj.STAURDAY"),
        SUNDAY: this.$t("reliableCenter.weekObj.SUNDAY"),
      };
      const newWeekArr = [];
      arr.forEach((e) => {
        newWeekArr.push(transObj[e]);
      });
      return newWeekArr.join("、");
    },
    handleCreateStrategy() {
      this.showDrStrategyInfor = true;
      this.inforBoxType = "create";
    },
    handelRunNow() {
      const bol = this.checkHandelBol("runNow");
      if (!bol) {
        this.dialogmessageVisible = false;
        return;
      }
      const nameArr = this.selectData.map((e) => e.planName);
      this.bodyTitle = this.$t("reliableCenter.runnowTitleTips", {
        name: nameArr.join(","),
      });
      this.dialogmessageVisible = true;
    },
    submitRunNow() {
      const planIds = this.selectData.map((e) => {
        return e.planId;
      });
      handelRunBdrNow({
        planIds: planIds.join(","),
      })
        .then((res) => {
          this.$message.success(this.$t("reliableCenter.executedSuccessfully"));
          this.freshTable();
        })
        .finally(() => {
          this.dialogmessageVisible = false;
        });
    },
    handelRun() {
      const bol = this.checkHandelBol("run");
      if (!bol) return;
      const planIds = this.selectData.map((e) => {
        return e.planId;
      });
      handelbatchSwitchBdr({
        planIds: planIds.join(","),
        switchOn: true,
      }).then((res) => {
        this.$message.success(
          this.$t("reliableCenter.batchEnabledSuccessfully")
        );
        this.freshTable();
      });
    },
    handelForbiden() {
      const bol = this.checkHandelBol("forbiden");
      if (!bol) return;
      const planIds = this.selectData.map((e) => {
        return e.planId;
      });
      handelbatchSwitchBdr({
        planIds: planIds.join(","),
        switchOn: false,
      }).then((res) => {
        this.$message.success(
          this.$t("reliableCenter.batchDisabledSuccessfully")
        );
        this.freshTable();
      });
    },
    checkHandelBol(e) {
      const cantSubmitObj = {
        runNow: {
          cantStatus: "DEAD",
          tips: this.$t("reliableCenter.disabledStatusPolicySelected"),
        },
        run: {
          cantStatus: "NORMAL",
          tips: this.$t("reliableCenter.enabledPolicyExists"),
        },
        forbiden: {
          cantStatus: "DEAD",
          tips: this.$t("reliableCenter.disabledStatusPolicyExists"),
        },
      };
      let cantSubmit = false;
      this.selectData.forEach((i) => {
        i.status === cantSubmitObj[e]["cantStatus"] ? (cantSubmit = true) : "";
      });
      if (cantSubmit) {
        this.$message.error(cantSubmitObj[e]["tips"]);
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.link-text {
  color: #409eff;
  cursor: pointer;
}
</style>
