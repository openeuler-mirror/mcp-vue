<template>
  <!-- pagePhysicalHost -->
  <div class="pagePhysicalHost-detail">
    <headerBox @refresh="refreshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <!-- 创建 -->
        <el-button class="btn-margin" @click="createdVm">
          {{ $t("externalCloud.vmList.create") }}</el-button
        >
        <!-- 开机 -->
        <el-button
          class="btn-margin"
          @click="openVm"
          :disabled="selectTable.length === 0"
        >
          {{ $t("externalCloud.vmList.turnOn") }}
        </el-button>
        <!-- 关机 -->
        <el-button
          class="btn-margin"
          @click="closeVm"
          :disabled="selectTable.length === 0"
        >
          {{ $t("externalCloud.vmList.shutDown") }}
        </el-button>
        <!-- 更多btn -->
        <el-dropdown
          style="margin-left: 15px"
          trigger="click"
          @command="handelMoreOperate"
        >
          <el-button :disabled="selectTable.length === 0" class="btn-margin">
            <!-- 更多 -->
            {{ $t("resourceMgr.servervmmore") }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <template v-for="(item, index) in batchToggleList">
              <el-dropdown-item v-if="item.show" :key="index" :command="item">
                <span>{{ item.name }}</span>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 搜索 -->
        <el-button
          v-show="!showSearch"
          class="btn-margin"
          @click="showSearch = true"
          icon="el-icon-search"
        >
        </el-button>
        <el-input
          class="btn-margin"
          v-model="searchText"
          prefix-icon="el-icon-search"
          v-show="showSearch"
          @keyup.enter.native="handleSearch"
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
      ref="physicalClusterTable"
      :tableLoading="tableLoading"
      :data="tableData"
      selectionType="multipleTable"
      :currentPage="pageNo"
      @selection-change="handlerSelectionChange"
      @filter-change="filterChange"
      :rowkey="rowkey"
    >
      <template v-for="(item, index) in tableColumns">
        <!-- name -->
        <el-table-column
          v-if="item.prop == 'serverName'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <router-link
              :to="{
                name: 'cloudServerDetail',
                params: {
                  vcenterId: pageInfo.vcenterId,
                  name: row.serverName,
                  pageName: row.serverName,
                },
              }"
            >
              <el-link type="primary">{{ row.serverName }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          v-else-if="item.prop == 'serverStatus'"
          :key="'serverStatus' + index"
          :label="item.label + statusLable"
          :width="item.width"
          column-key="ecsStatus"
          :filters="statusFilter"
          :filter-multiple="false"
        >
          <template slot-scope="{ row }">
            <statuscell
              :status="row.serverStatus.toString()"
              type="number"
            ></statuscell>
          </template>
        </el-table-column>
        <!-- CPU分配比  -->
        <el-table-column
          v-else-if="item.prop == 'cpuCapacityUnit'"
          :key="index + 'cpurate'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: row.cpuUsedRate,
                unit: row.cpuCapacityUnit,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 内存分配比 -->
        <el-table-column
          v-else-if="item.prop == 'memoryCapacityUnit'"
          :key="index + 'memoryrate'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: row.memoryUsedRate,
                unit: row.memoryCapacityUnit,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 存储分配比 -->
        <el-table-column
          v-else-if="item.prop == 'storageCapacityUnit'"
          :key="index + 'storageUsedRate'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: row.serverStatus === 0 ? 0 : row.storageUsedRate,
                unit: row.storageCapacityUnit,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :key="item.label + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] || "-" }}</span>
          </template>
        </el-table-column>
      </template>
      <!-- 操作 -->
      <el-table-column width="200" className="tableoperation" fixed="right">
        <template slot-scope="{ row }">
          <el-link
            type="primary"
            style="width: 42px"
            v-if="row.serverStatus === 0"
            @click.stop="startServerVm(row)"
          >
            <!-- 开机 -->
            {{ $t("resourceMgr.start_servervm") }}
          </el-link>
          <el-link
            type="primary"
            style="width: 42px"
            v-if="row.serverStatus === 1"
            @click.stop="openVnc(row)"
          >
            <!-- 控制台 -->
            {{ $t("resourceMgr.openVnc") }}
          </el-link>
          <btn-more
            ref="btnMore"
            :key="row.serverVmId"
            :select-data="row"
            :btn-type="'link'"
            class="el-link"
            @downToggleCommand="downToggleCommand"
          />
        </template>
      </el-table-column>
    </mc-table>
    <!-- 创建虚拟机 -->
    <createVmDetailBox
      :visible.sync="vmDetailShowBol"
      :choosenData="choosenData"
      :vmInfo="pageInfo"
      @freshTable="refreshTable"
    />
    <!-- 克隆虚拟机 -->
    <cloneVmDetailBox
      :visible.sync="cloneShowBol"
      :choosenData="choosenData"
      :rowData="choosenData"
      :vcenterId="vcenterId"
    />
    <!-- 编辑虚拟机 -->
    <editVmBox
      :visible.sync="editShowBol"
      :choosenData="choosenData"
      :rowData="choosenData"
      :vcenterId="vcenterId"
      @freshTable="refreshTable"
    />
    <!-- 迁移 -->
    <transferVmBox
      :visible.sync="transferBol"
      :choosenData="choosenData"
      :rowData="choosenData"
      :vcenterId="vcenterId"
      @freshTable="refreshTable"
    />
  </div>
</template>

<script>
import headerBox from "@/components/headerBox";
import mcTable from "@/components/MctablePro";
import _ from "lodash";
import mcAllocationratio from "@/components/Mcallocationratio";
import {
  getVcenterCloudList,
  getVncUrl,
  startServerVm,
  shutdownServerVm,
  resumeVm,
  suspendVm,
  restartVm,
  offForceVm,
  hadelDelVm,
} from "@/api/vcenter";
import { btnMore } from "../../components/main/index";
import createVmDetailBox from "./cloudServerCommpoents/createVmDetailBox";
import cloneVmDetailBox from "./cloudServerCommpoents/cloneVmDetailBox";
import transferVmBox from "./cloudServerCommpoents/transferVmBox";
import statuscell from "../../components/statuscell/index.vue";
import ReMessage from "@/utils/message";
import editVmBox from "./cloudServerCommpoents/editVmBox";
export default {
  name: "cloudServer",
  components: {
    mcTable,
    statuscell,
    headerBox,
    btnMore,
    editVmBox,
    mcAllocationratio,
    createVmDetailBox,
    cloneVmDetailBox,
    transferVmBox,
  },
  props: {
    dataInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    dataInfo(val) {
      this.pageInfo = val;
      this.getVcenterCloudList();
    },
  },
  data() {
    return {
      rowkey: "serverId",
      pageInfo: {},
      tableLoading: false,
      batchToggleList: [
        {
          key: "batchForceReboot",
          name: this.$t("externalCloud.vmList.reboot"), //"强制重启",
          disabled: true,
          show: true,
        },
        {
          key: "batchDelete",
          name: this.$t("externalCloud.vmList.delete"), //"删除",
          disabled: true,
          show: true,
        },
      ],
      searchStatus: "",
      selectRowData: "",
      editShowBol: false,
      tableColumns: [
        // 名称
        {
          label: this.$t("resourceMgr.cpuModelName"),
          prop: "serverName",
          width: 300,
        },
        // 状态
        {
          label: this.$t("resourceMgr.cpuModelstatus"),
          prop: "serverStatus",
          width: 118,
        },
        // ip地址
        {
          label: this.$t("externalCloud.vmList.ipAddress"),
          prop: "ipAddress",
          width: 150,
        },
        // cpu核
        {
          label: this.$t("externalCloud.vmList.cpuCore"),
          prop: "cpuCoreNum",
          width: 90,
        },
        //内存（GB）
        {
          label: this.$t("externalCloud.vmList.memorySize"),
          prop: "memoryTotalCapacity",
          width: 110,
        },
        //存储（GB）
        {
          label: this.$t("externalCloud.vmList.storageSize"),
          prop: "storageTotalCapacity",
          width: 110,
        },
        // CPU利用率
        {
          label: this.$t("resourceMgr.cpuModelcpurate"),
          prop: "cpuCapacityUnit",
        },
        // 内存利用率
        {
          label: this.$t("resourceMgr.cpuModelmemoryrate"),
          prop: "memoryCapacityUnit",
        },
        // 存储利用率
        {
          label: this.$t("externalCloud.vcenter.storageModelmemoryrate"),
          prop: "storageCapacityUnit",
        },
      ],
      statusFilter: [
        {
          text: this.$t("externalCloud.statuscell.SUSPEND"), // "执行中",
          value: 3,
        },
        {
          text: this.$t("externalCloud.statuscell.TASK_EXECUTION"), // "执行中",
          value: 2,
        },
        {
          text: this.$t("resourceMgr.zoneAVAILABLE"), // "在线",
          value: 1,
        },
        {
          text: this.$t("resourceMgr.zoneOFFLINE"), // "离线",
          value: 0,
        },
      ],
      tableData: [],
      statusLable: "",
      vcenterId: this.$route.params.id.toString(),
      cloneShowBol: false,
      showSearch: false,
      choosenData: {},
      selectTable: [],
      transferBol: false,
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 100,
      searchText: "",
      vmDetailShowBol: false,
    };
  },
  created() {
    this.pageInfo = this.dataInfo;
    this.getVcenterCloudList();
  },
  methods: {
    refreshTable() {
      this.searchText = "";
      this.showSearch = false;
      this.getVcenterCloudList();
    },
    // 表格勾选
    handlerSelectionChange(selection) {
      this.selectTable = selection;
    },
    // 申请延期
    handleShowDely(row) {
      this.selectRowData = row;
    },

    getVcenterCloudList() {
      this.tableLoading = true;
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        vcenterId: this.vcenterId,
        serverStatus: this.searchStatus,
      };

      getVcenterCloudList(pramas)
        .then((res) => {
          this.tableData = res;
          this.total = res.length;
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.getVcenterCloudList();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.getVcenterCloudList();
    },
    filterChange(filters) {
      //状态过滤
      this.searchStatus = filters.ecsStatus[0];
      this.getVcenterCloudList();
      let lable = this.statusFilter.find(
        (item) => item.value === this.searchStatus
      );
      if (lable) {
        this.statusLable = "(" + lable.text + ")";
      } else {
        this.statusLable = "";
      }
    },
    //创建云服务器
    createdVm() {
      this.vmDetailShowBol = true;
    },
    //开机
    openVm() {
      let openVmNum = 0;
      this.selectTable.forEach((e) => {
        e.serverStatus != 0 ? openVmNum++ : 0;
      });
      if (openVmNum) {
        this.$message.error(this.$t("externalCloud.vmList.hasOpenVmTips"));
        return;
      }
      this.$showFullScreenLoading();
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [],
      };
      this.selectTable.forEach((e) => {
        const { vcenterServerIdentifier, serverName } = e;
        params.serverBatchReqParams.push({
          serverIdentifier: vcenterServerIdentifier,
          serverName,
        });
      });
      this.handelOpenVm(params);
    },
    //批量关机
    closeVm() {
      let closeVmNum = 0;
      this.selectTable.forEach((e) => {
        e.serverStatus != 1 ? closeVmNum++ : 0;
      });
      if (closeVmNum) {
        this.$message.error(this.$t("externalCloud.vmList.hasCloseVmTips"));
        return;
      }
      this.$showFullScreenLoading();
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [],
      };
      this.selectTable.forEach((e) => {
        const { vcenterServerIdentifier, serverName } = e;
        params.serverBatchReqParams.push({
          serverIdentifier: vcenterServerIdentifier,
          serverName,
        });
      });
      this.handelCloseVm(params);
    },
    handelShutDown(row) {
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [
          {
            serverIdentifier: row.vcenterServerIdentifier,
            serverName: row.serverName,
          },
        ],
      };
      this.handelCloseVm(params);
    },
    startServerVm(row) {
      const { vcenterServerIdentifier, serverName } = row;
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [
          {
            serverIdentifier: vcenterServerIdentifier,
            serverName,
          },
        ],
      };
      this.handelOpenVm(params);
    },
    openVnc(row) {
      const { serverName } = row;
      const params = {
        vcenterId: this.vcenterId,
        serverName,
      };
      getVncUrl(params)
        .then((res) => {
          const { hostIp, ticket } = res;
          window.open(
            `vcenterCtr?v=${serverName}&i=${hostIp}&t=${ticket}`,
            "_blank"
          );
        })
        .catch((err) => {
          this.vncBtnDisabled = false;
        });
    },
    handleSearch() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".pagePhysicalHost-detail");
      });
      this.pageNo = 1;

      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        vcenterId: this.vcenterId,
        serverStatus: this.searchStatus,
        serverName: this.searchText,
      };

      getVcenterCloudList(pramas)
        .then((res) => {
          this.tableData = res;
          this.total = res.length;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
          this.$hideFullScreenLoading();
        });
    },
    handelOpenVm(params) {
      startServerVm(params)
        .then((res) => {
          this.$hideFullScreenLoading();
          ReMessage.success(this.$t("externalCloud.vmList.opensuccess"));
          this.refreshTable();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
          this.startBtnDisabled = false;
          this.refreshTable();
        });
    },
    handelCloseVm(params) {
      shutdownServerVm(params)
        .then((res) => {
          this.$hideFullScreenLoading();
          ReMessage.success(this.$t("externalCloud.vmList.closesuccess"));
          this.refreshTable();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
          this.shutdownBtnDisabled = false;
          this.refreshTable();
        });
    },

    downToggleCommand(e, row) {
      let title = "";
      let confirmText = "";
      let handelText = "";
      this.choosenData = row;
      switch (e) {
        case "shutdown":
          title = this.$t("externalCloud.vmList.sureclose");
          confirmText = this.$t("externalCloud.vmList.sureShutUpTips");
          handelText = this.$t("externalCloud.vmList.shutDown");
          this.showConfirm(
            "shutDown",
            this.handelShutDown,
            title,
            confirmText,
            handelText,
            row
          );
          break;
        case "wakeUp":
          title = this.$t("externalCloud.vmList.sureWeakeUp");
          confirmText = this.$t("externalCloud.vmList.sureWeakUpTips");
          handelText = this.$t("externalCloud.vmList.wakeUp");
          this.showConfirm(
            "wakeUp",
            this.handelResumeVm,
            title,
            confirmText,
            handelText,
            row
          );
          break;
        case "pause":
          title = this.$t("externalCloud.vmList.surePause");
          confirmText = this.$t("externalCloud.vmList.surePauseTips");
          handelText = this.$t("externalCloud.vmList.pause");
          this.showConfirm(
            "suspendVm",
            this.handelSuspendVm,
            title,
            confirmText,
            handelText,
            row
          );
          break;
        case "restart":
          title = this.$t("externalCloud.vmList.sureReboot");
          confirmText = this.$t("externalCloud.vmList.sureRebootTips");
          handelText = this.$t("externalCloud.vmList.reboot");
          this.showConfirm(
            "restart",
            this.handelrestart,
            title,
            confirmText,
            handelText,
            row
          );
          break;
        case "powerOff":
          title = this.$t("externalCloud.vmList.surePowerOff");
          confirmText = this.$t("externalCloud.vmList.sureCloseTips");
          handelText = this.$t("externalCloud.vmList.powerOff");
          this.showConfirm(
            "suspend",
            this.handeloffForceVm,
            title,
            confirmText,
            handelText,
            row
          );
          break;
        case "clone":
          this.cloneShowBol = true;
          break;
        case "edit":
          this.editShowBol = true;
          break;
        case "migration":
          this.transferBol = true;
          break;
        case "delete":
          title = this.$t("externalCloud.vmList.sureDel");
          confirmText = this.$t("externalCloud.vmList.sureDelTips");
          handelText = this.$t("externalCloud.vmList.delete");
          this.showConfirm(
            "delete",
            this.handelDel,
            title,
            confirmText,
            handelText,
            row
          );
          break;
        default:
          break;
      }
    },
    showConfirm(type, fnc, title, confirmText, handelText, row) {
      this.$confirm(confirmText, title, {
        confirmButtonText: handelText,
        cancelButtonText: this.$t("externalCloud.vmList.cancel"),
        type: "warning",
      })
        .then(() => {
          fnc(row);
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
      let params = {};
      if (row.serverBatchReqParams) {
        params = row;
      } else {
        params = {
          vcenterId: this.vcenterId,
          serverBatchReqParams: [
            {
              serverIdentifier: row.vcenterServerIdentifier,
              serverName: row.serverName,
            },
          ],
        };
      }
      hadelDelVm(params).then((res) => {
        this.$message.success({
          type: "success",
          message: this.$t("externalCloud.vmList.delsuccess"),
        });
        this.refreshTable();
      });
    },
    //云服务器唤醒
    handelResumeVm(row) {
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [
          {
            serverIdentifier: row.vcenterServerIdentifier,
            serverName: row.serverName,
          },
        ],
      };
      resumeVm(params).then((res) => {
        this.$message.success({
          type: "success",
          message: this.$t("externalCloud.vmList.wakeupsuccess"),
        });
        this.refreshTable();
      });
    },
    handelSuspendVm(row) {
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [
          {
            serverIdentifier: row.vcenterServerIdentifier,
            serverName: row.serverName,
          },
        ],
      };
      suspendVm(params).then((res) => {
        this.$message.success({
          type: "success",
          message: this.$t("externalCloud.vmList.pausesuccess"),
        });
        this.refreshTable();
      });
    },
    handelrestart(row) {
      let params = {};
      if (row.serverBatchReqParams) {
        params = row;
      } else {
        params = {
          vcenterId: this.vcenterId,
          serverBatchReqParams: [
            {
              serverIdentifier: row.vcenterServerIdentifier,
              serverName: row.serverName,
            },
          ],
        };
      }

      restartVm(params)
        .then((res) => {
          this.$message.success({
            type: "success",
            message: this.$t("externalCloud.vmList.rebootsuccess"),
          });
          this.refreshTable();
        })
        .catch((err) => console.error(err));
    },
    handeloffForceVm(row) {
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [
          {
            serverIdentifier: row.vcenterServerIdentifier,
            serverName: row.serverName,
          },
        ],
      };
      offForceVm(params).then((res) => {
        this.$message.success({
          type: "success",
          message: this.$t("externalCloud.vmList.poweroffsuccess"),
        });
        this.refreshTable();
      });
    },

    handelMoreOperate(e) {
      const { key } = e;
      let title = "";
      let confirmText = "";
      let handelText = "";
      switch (key) {
        case "batchForceReboot":
          title = this.$t("externalCloud.vmList.sureReboot");
          confirmText = this.$t("externalCloud.vmList.sureBatchRebootTips");
          handelText = this.$t("externalCloud.vmList.batchReboot");
          let closeVmNum = 0;
          this.selectTable.forEach((e) => {
            e.serverStatus !== 1 ? closeVmNum++ : 0;
          });
          if (closeVmNum) {
            this.$message.error(this.$t("externalCloud.vmList.hasCloseVmTips"));
            return;
          }
          break;
        case "batchDelete":
          title = this.$t("externalCloud.vmList.sureDel");
          confirmText = this.$t("externalCloud.vmList.sureBatchDelTips");
          handelText = this.$t("externalCloud.vmList.batchDel");
          let openVmNum = 0;
          this.selectTable.forEach((e) => {
            e.serverStatus !== 0 ? openVmNum++ : 0;
          });
          if (openVmNum) {
            this.$message.error(this.$t("externalCloud.vmList.hasOpenVmTips"));
            return;
          }
          break;
      }
      this.$showFullScreenLoading();
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [],
      };
      this.selectTable.forEach((e) => {
        const { vcenterServerIdentifier, serverName } = e;
        params.serverBatchReqParams.push({
          serverIdentifier: vcenterServerIdentifier,
          serverName,
        });
      });
      key === "batchForceReboot"
        ? this.showConfirm(
            "restart",
            this.handelrestart,
            title,
            confirmText,
            handelText,
            params
          )
        : this.showConfirm(
            "delete",
            this.handelDel,
            title,
            confirmText,
            handelText,
            params
          );
    },
  },
};
</script>
<style lang="scss" scoped>
.pagePhysicalHost-detail {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
