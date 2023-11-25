<template>
  <div class="app-container">
    <div class="dr-content-left">
      <div class="content-box dr-el-tree kcp-el-tree">
        <!-- <div class="top-title">{{ $t("reliableCenter.allServers") }}</div> -->
        <el-tree
          ref="ecstree"
          :data="treeData"
          :props="treeProps"
          :node-key="nodeKey"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          :default-expanded-keys="defaultExpandedkeys"
          :default-checked-keys="defaultCheckedkeys"
          @node-click="handleNodeClick"
          empty-text=""
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <img src="@/assets/icon/u524.png" alt="" />
            <span>{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </div>
    <div class="dr-content-right">
      <div class="content-box">
        <headerBox @refresh="freshTable" :spinBol="tableLoading">
          <template slot="headerLeft">
            <el-button :disabled="rzBol" @click="showRz">{{
              $t("reliableCenter.DRTest")
            }}</el-button>
            <el-button :disabled="masterBol" @click="showRecover('master')">{{
              $t("reliableCenter.mainSiteDRRecovery")
            }}</el-button>
            <el-button :disabled="slaveBol" @click="showRecover('slave')">{{
              $t("reliableCenter.backupSiteDRRecovery")
            }}</el-button>
            <el-button
              :disabled="backmigrationBol"
              @click="backmigration('master')"
              >{{ $t("reliableCenter.revertToMainSite") }}</el-button
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
          @selection-change="handleSelection"
          selectionType="multipleTable"
          :rowkey="rowkey"
          style="margin-top: 20px"
        >
          <template v-for="(item, index) in columnArr">
            <!-- 操作 -->
            <el-table-column
              v-if="item.prop == 'operation'"
              fixed="right"
              :key="index"
              :label="item.label"
              :width="item.width"
              className="tableoperation"
            >
              <template slot-scope="{ row }">
                <el-link type="primary" @click.stop="checkDifferent(row)">
                  {{ $t("reliableCenter.differencesCheck") }}
                </el-link>
              </template>
            </el-table-column>
            <!--云服务器名称  -->
            <el-table-column
              v-else-if="item.prop == 'machineName'"
              :key="'roleType' + index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <router-link
                  :to="{
                    name: 'escPageDetail',
                    params: {
                      id: row.machineUuid,
                      cid: row.materClusterId,
                      type: 'escPageDetail',
                      serverVmUuid: row.machineUuid,
                      tab: 'summary',
                      pagekey: 'resource',
                    },
                  }"
                >
                  <el-link type="primary">{{ row[item.prop] }}</el-link>
                </router-link>
              </template>
            </el-table-column>
            <!--备份数量  -->
            <el-table-column
              v-else-if="
                item.prop == 'masterBackupNum' || item.prop == 'slaveBackupNum'
              "
              :key="'roleType' + index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <el-link
                  type="primary"
                  @click.stop="handelShowRecover(row, item.prop)"
                >
                  {{ row[item.prop] }}
                </el-link>
              </template>
            </el-table-column>
            <!--状态 -->
            <el-table-column
              v-else-if="item.prop == 'status'"
              :key="'status' + index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <span>
                  <img
                    class="status-icon"
                    v-if="row.status === 'NORMAL'"
                    src="../../../../assets/icon/u582.png"
                  />
                  <svg-icon
                    v-else-if="getLoadingVal(row.status)"
                    @click="recoverDiskItem(index)"
                    v-show="item.operation === 'remove'"
                    icon-class="drLoading"
                    className="status-icon"
                  />
                  <svg-icon
                    v-else
                    @click="recoverDiskItem(index)"
                    v-show="item.operation === 'remove'"
                    icon-class="warning"
                    className="status-icon"
                  />
                </span>
                <span :class="getstatusClass(row.status)">
                  {{ getstatusLabel(row.status, "status") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop == 'checkStatus'"
              :key="'status' + index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <span :class="getstatusClass(row.checkStatus)">
                  {{ getstatusLabel(row.checkStatus, "checkStatus") }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'difference'"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <span v-if="row.checkStatus !== 'CHECKING'">
                  {{ convertSize(row[item.prop]) }}</span
                >
                <span v-else>
                  <i class="el-icon-refresh loading-icon"></i>
                  {{ $t("reliableCenter.underDete") }} ...
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'backupStatus'"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <span> {{ getBackupText(row[item.prop]) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="
                item.prop === 'masterBackupSize' ||
                item.prop === 'slaveBackupSize' ||
                item.prop === 'difference'
              "
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                {{ convertSize(row[item.prop]) }}
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="item.prop + index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <el-tooltip
                  effect="light"
                  :content="row[item.prop] + ''"
                  placement="top"
                  :visible-arrow="true"
                >
                  <span>{{ row[item.prop] }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
        </mc-table>
      </div>
    </div>
    <recoverModel
      :type="selectRecoverType"
      :clusterId="selectClusterId"
      :planMachineId="selectPlanMachineId"
      :visible.sync="showRecoverModel"
      @freshTable="freshTable"
    ></recoverModel>
    <!-- 主站点容灾恢复 -->
    <mainSiteRecover
      :rowData="reDrillData"
      :visible.sync="showMainRecoverModel"
      @freshTable="freshTable"
      :vmName="vmName"
    ></mainSiteRecover>
    <sleaverSiteRecovery
      :type="selectRecoverType"
      :clusterId="selectClusterId"
      :planMachineId="selectPlanMachineId"
      :visible.sync="sleaverShowBol"
      :rowData="reDrillData"
      :vmName="vmName"
      @freshTable="freshTable"
    >
    </sleaverSiteRecovery>
    <disasterRecoveryDrill
      :type="selectRecoverType"
      :clusterId="selectClusterId"
      :planMachineId="selectPlanMachineId"
      :visible.sync="rzShowBol"
      :rowData="reDrillData"
      @freshTable="freshTable"
    ></disasterRecoveryDrill>
    <moveBackToThePrimary
      :rowData="moveBackData"
      @freshTable="freshTable"
      :visible.sync="moveBack"
    >
    </moveBackToThePrimary>
  </div>
</template>
<script>
import recoverModel from "./recoverModel";
import mainSiteRecover from "./mainSiteRecover";
import sleaverSiteRecovery from "./sleaverSiteRecovery";
import disasterRecoveryDrill from "./disasterRecoveryDrill";
import moveBackToThePrimary from "./moveBackToThePrimary";
import headerBox from "@/components/headerBox";
import {
  drSiteList,
  siteBackupData,
  handelEditPlan,
  handelCheckDifference,
  handelMasterSiteRecover,
} from "@/api/remoteDisasterRecovery";
import mcTable from "@/components/MctablePro";
export default {
  name: "drStatus",
  components: {
    mcTable,
    recoverModel,
    sleaverSiteRecovery,
    disasterRecoveryDrill,
    mainSiteRecover,
    moveBackToThePrimary,
    headerBox,
  },
  data() {
    return {
      tableLoading: false,
      treeData: [],
      selectTable: [],
      defaultExpandedkeys: [],
      defaultCheckedkeys: [],
      zoneOrgTreeSearchObj: [],
      vmName: "",
      showRecoverModel: false,
      showSearch: false,
      showMainRecoverModel: false,
      sleaverShowBol: false,
      moveBack: false,
      searchKey: "",
      treeProps: {
        children: "child",
        label: "name",
      },
      nodeKey: "clusterId",
      selectClusterId: null,
      selectPlanMachineId: null,
      rzShowBol: false, //容灾状态
      reDrillData: {}, //容灾备份选择数据
      moveBackData: [],
      selectRecoverType: "",
      columnArr: [
        // 云服务器名称
        {
          label: this.$t("reliableCenter.cloudServerName"),
          prop: "machineName",
          width: "150",
        },
        // 容灾状态
        {
          label: this.$t("reliableCenter.bdStatus"),
          prop: "status",
          width: "120",
        },
        // 备份状态
        {
          label: this.$t("reliableCenter.backStatus"),
          prop: "backupStatus",
          width: "120",
        },
        //主站点名称
        {
          label: this.$t("reliableCenter.mainSiteName"),
          prop: "masterSiteName",
          width: "164",
        },
        //主站点备份数量
        {
          label: this.$t("reliableCenter.mainSiteBackupCount"),
          prop: "masterBackupNum",
          width: "150px",
        },
        // 主站点备份数据总大小
        {
          label: this.$t("reliableCenter.mainSiteBackupSize"),
          prop: "masterBackupSize",
          width: "164px",
        },
        // 主站点最近恢复点时间
        {
          label: this.$t("reliableCenter.mainSiteLastRecoveryTime"),
          prop: "masterLastRecoverTime",
          width: "164px",
        },
        // 主备站点数据差异量
        {
          label: this.$t("reliableCenter.mainBackupDifferences"),
          prop: "difference",
          width: "150px",
        }, // 用户名
        {
          label: this.$t("reliableCenter.backupSiteName"),
          prop: "slaveSiteName",
          width: "150px",
        },
        {
          label: this.$t("reliableCenter.backupSiteBackupSize"),
          prop: "slaveBackupSize",
          width: "164px",
        },
        {
          label: this.$t("reliableCenter.backupSiteBackupCount"),
          prop: "slaveBackupNum",
          width: "150px",
        },
        {
          label: this.$t("reliableCenter.backupSiteLastRecoveryTime"),
          prop: "slaveLastRecoverTime",
          width: "150px",
        },
        {
          label: this.$t("externalCloud.vmOperate.runningPosition"),
          prop: "runningSiteName",
          width: "150px",
        },
        // { label: "运行位置", prop: "userName" },
        // { label: "检测状态", prop: "checkStatus", width: "120px" },
        { label: this.$t("common.operation"), prop: "operation" },
      ],
      tableData: [],
      rowkey: "planMachineId",
      total: 100,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
    };
  },
  computed: {
    rzBol() {
      /*
       * 判断容灾演练可点击bol，
       * 1.不可批量
       * 2.保护中 NORMAL 容灾演练 只有开始没有结束
       * 3.容灾演练中 DRILL 容灾演练 只有结束
       * */
      const canClick = ["NORMAL", "DRILL"];
      const selectNumBol = this.selectTable.length === 1;
      if (!selectNumBol) return !selectNumBol;
      const statusBol = canClick.indexOf(this.selectTable[0]["status"]) >= 0;
      return !statusBol;
    },
    masterBol() {
      /*
       * 判断主站点容灾恢复
       * 1.不可批量
       * 2.保护中 NORMAL 主站点容灾恢复
       * 3.容灾演练中 DRILL 主站点容灾恢复
       * */
      const canClick = ["NORMAL", "DRILL"];
      const selectNumBol = this.selectTable.length === 1;
      if (!selectNumBol) return !selectNumBol;
      const statusBol = canClick.indexOf(this.selectTable[0]["status"]) >= 0;
      return !statusBol;
    },
    slaveBol() {
      /*
       * 判断备站点容灾恢复
       1.单选
       保护中 NORMAL
       * */
      const selectNumBol = this.selectTable.length === 1;
      if (!selectNumBol) return !selectNumBol;
      const statusBol = this.selectTable[0]["status"] === "NORMAL";
      return !statusBol;
    },
    backmigrationBol() {
      /*
       * 判断回迁到主站点
       可以多选
       计划内恢复 PLAN_RECOVER
       故障恢复 FAIL_RECOVER
       * */
      const canClick = ["PLAN_RECOVER", "FAIL_RECOVER"];
      const selectNumBol = this.selectTable.length === 0;
      if (selectNumBol) return selectNumBol;
      const statusBol = canClick.indexOf(this.selectTable[0]["status"]) >= 0;
      return !statusBol;
    },
  },
  mounted() {
    //初始化树的数据，右侧列表数据在初始化的时候请求
    this.getTreeData();
  },
  methods: {
    getLoadingVal(val) {
      const dontNeedLoadingArr = ["NORMAL", "PLAN_RECOVER", "FAIL_RECOVER"];
      return dontNeedLoadingArr.indexOf(val) < 0;
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.renderTable();
    },
    getTreeData() {
      this.defaultCheckedkeys = [];
      this.$nextTick(() => {
        this.$showFullScreenLoading(".ecs-el-tree");
      });
      let params = { clusterId: this.clusterKey };
      drSiteList(params).then((res) => {
        this.$hideFullScreenLoading();
        if (res && res.length > 0) {
          this.treeData = [
            {
              clusterId: 0,
              name: this.$t("reliableCenter.allServers"),
              remark: "",
              siteId: 0,
              status: "ONLINE",
              type: "KSVD",
              child: res,
            },
          ];
          this.$nextTick(() => {
            //没有选中数据的时候默认选中第一个
            this.$refs.ecstree.setCurrentKey(0);
          });
          this.zoneOrgTreeSearchObj = res[0];
          this.pageNo = 1;
          this.pageSize = 20;
          this.renderTable();
        }
      });
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.renderTable();
    },
    handleNodeClick(data) {
      this.zoneOrgTreeSearchObj = data;
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
    },
    freshTable() {
      this.pageNo = 1;
      this.pageSize = 20;
      this.selectClusterId = null;
      this.selectPlanMachineId = null;
      this.selectRecoverType = null;
      this.renderTable();
    },
    handleSelection(list) {
      this.$set(this, "selectTable", list);
      this.userIds = [];
      let oriIds = JSON.parse(JSON.stringify(this.userIds));
      let ids = [];
      list.forEach((element) => {
        ids.push(element.userId);
      });
      this.userIds = oriIds.concat(ids);
    },
    renderTable() {
      this.tableLoading = true;
      let pageNo = this.pageNo;
      let pageSize = this.pageSize;
      let searchKey = this.searchKey;
      let clusterId = this.zoneOrgTreeSearchObj.clusterId; // 非必须 树形节点值

      this.selectTable = [];
      let headers = {};
      siteBackupData({ pageNo, pageSize, searchKey, clusterId }, headers)
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    jumpLink(row) {},
    getstatusClass(row) {},
    getstatusLabel(val, type) {
      // 容灾演练 主站点备份恢复 备站点容灾恢复 回迁到主站点
      //
      const status = {
        NORMAL: this.$t("reliableCenter.NORMAL"), //运行在主站点 操作：容灾演练 只有开始没有结束； 主站点备份恢复 备站点容灾恢复
        PLAN_RECOVER: this.$t("reliableCenter.PLAN_RECOVER"), //运行在备站点 回迁到主站点
        PLAN_RECOVERING: this.$t("reliableCenter.PLAN_RECOVERING"), // 无操作权限 loading
        FAIL_RECOVER: this.$t("reliableCenter.FAIL_RECOVER"), // 回迁到主站点
        FAIL_RECOVERING: this.$t("reliableCenter.FAIL_RECOVERING"), // 所有操作不可点 loading
        BACKUPING: this.$t("reliableCenter.BACKUPING"), //所有操作不可点 loading
        DELETEING: this.$t("reliableCenter.DELETEING"), //所有操作不可点 loading
        PRONG: this.$t("reliableCenter.PRONG"), //所有操作不可点 loading
        START_DRILL: this.$t("reliableCenter.START_DRILL"), // 所有操作不可点  loading
        DRILL: this.$t("reliableCenter.DRILL"), // 容灾演练(结束) loading
        END_DRILL: this.$t("reliableCenter.END_DRILL"), // 所有操作不可点 loading
        MOVE_BACK: this.$t("reliableCenter.MOVE_BACK"), //所有操作不可点 loading
        MASTER_RECOVERING: this.$t("reliableCenter.MASTER_RECOVERING"), //所有操作不可点 loading
      };
      const checkStatus = {
        NORMAL: this.$t("reliableCenter.normal"),
        CHECKING: this.$t("reliableCenter.underDete"),
      };
      return type === "status" ? status[val] : checkStatus[val];
    },
    handelShowRecover(row, type) {
      //通过传type区分主站点还是备站点
      switch (type) {
        case "masterBackupNum":
          this.selectRecoverType = "master";
          this.selectClusterId = row.masterClusterId;
          this.selectPlanMachineId = row.planMachineId;
          break;

        default:
          this.selectRecoverType = "slave";
          this.selectClusterId = row.slaveClusterId;
          this.selectPlanMachineId = row.planMachineId;
          break;
      }
      this.showRecoverModel = true;
    },
    checkDifferent(row) {
      this.$confirm(
        this.$t("reliableCenter.performBackupCheck"),
        this.$t("reliableCenter.prompt"),
        {
          confirmButtonText: this.$t("reliableCenter.confirm"),
          cancelButtonText: this.$t("reliableCenter.cancel"),
          type: "warning",
        }
      ).then(() => {
        const params = { planMachineId: row.planMachineId };
        handelCheckDifference(params).then((res) => {
          this.$message({
            type: "success",
            message: this.$t("reliableCenter.backupCheckSubmitted"),
          });
          this.freshTable();
        });
      });
    },
    showRz() {
      this.reDrillData = this.selectTable[0];
      this.rzShowBol = true;
    },
    convertSize(sizeInKB) {
      const units = ["KB", "MB", "GB"];
      let unitIndex = 0;

      while (sizeInKB >= 1024 && unitIndex < units.length - 1) {
        sizeInKB /= 1024;
        unitIndex++;
      }

      return sizeInKB.toFixed(2) + units[unitIndex];
    },
    getBackupText(status) {
      const obj = {
        NORMAL: this.$t("reliableCenter.normal"),
        BACKUPING: this.$t("reliableCenter.BACKUPING"),
        DELETEING: this.$t("reliableCenter.deleting"),
        PRONG: this.$t("reliableCenter.PRONG"),
      };
      return obj[status];
    },
    //主站点容灾恢复、备站点容灾恢复
    showRecover(type) {
      this.reDrillData = this.selectTable[0];
      this.vmName = this.reDrillData.machineName;
      switch (type) {
        case "master":
          this.showMainRecoverModel = true;
          break;
        default:
          this.sleaverShowBol = true;
          break;
      }
    },
    backmigration() {
      this.moveBackData = this.selectTable;
      this.moveBack = true;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .button-border {
    display: flex;
    align-items: center;
  }
  .btn-margin {
    margin-left: 10px;
  }
}

.app-container {
  display: flex;
  flex-direction: row;
  padding: 5px;
  .custom-tree-node {
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
  .dr-content-left,
  .dr-content-right {
    display: flex;
    flex-direction: column;
    padding: 20px 25px;
    .title-box {
      width: 100%;
      font-size: 18px;
      padding: 10px 20px;
    }
    .content-box {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }
  .dr-content-left {
    border-right: 1px solid #ccc;
    width: 200px;
    padding: 20px 15px;
    ::v-deep .el-tree-node.is-current > .el-tree-node__content {
      border-left: 4px solid rgba(64, 158, 255, 1) !important;
    }
  }
  .dr-content-right {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .top-title {
    width: 100%;
    height: 40px;
    background-color: rgba(242, 249, 255, 1);
    border-left: 4px solid rgba(64, 158, 255, 1);
    line-height: 40px;
    padding-left: 10px;
  }
  .loading-icon {
    color: #67c23a;
    animation: spin 2s linear infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
.status-icon {
  width: 17px;
  height: 17px;
}
</style>
