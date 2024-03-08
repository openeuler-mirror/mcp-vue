<template>
  <div class="ecs app-container">
    <div class="ecs-home-left">
      <!-- <div class="title-box">{{ $t("resourceMgr.zonelist") }}</div> -->
      <div class="content-box ecs-el-tree kcp-el-tree">
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
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- ZONE(可用区) ORG(组织) USER(用户) -->
            <span
              v-if="data.type == 'ZONE'"
              class="el-icon-office-building"
            ></span>
            <span v-else-if="data.type == 'ORG'" class="el-icon-coin"></span>
            <span v-else-if="data.type == 'USER'" class="el-icon-user"></span>
            <span v-else class="el-icon-coin"></span>
            <span>{{ node.label }}</span>
            <span>{{ "(" + data.serverVmCount + ")" }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="ecs-home-right">
      <!-- 云服务器头部菜单栏 -->
      <header-bar
        ref="headerBar"
        :select-data="selectTable"
        @refreshTable="refreshTable"
        @headerBarEmit="headerBarEmit"
        @getclusterTreeData="getclusterTreeData"
      />

      <!-- 云服务器列表 -->
      <mc-table
        ref="escTable"
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        :filter-data="columnArr"
        @selection-change="handlerSelectionChange"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        @filter-change="filterChange"
        @row-click="rowSelect"
        :rowkey="rowkey"
        :selectionType="selectionType"
        style="margin-top: 20px"
      >
        <template v-for="(item, index) in columnShowArr">
          <!-- 状态 -->
          <el-table-column
            v-if="item.prop === 'status'"
            :key="'esc' + index"
            column-key="ecsStatus"
            :label="item.label + statusLable"
            :prop="item.prop"
            :width="item.width"
            :sortable="item.sortable"
            :resizable="index != 0 && index != columnShowArr.length - 1"
            :filters="statusFilter"
            :filter-multiple="false"
          >
            <template slot-scope="{ row }">
              <statusRow :status="row[item.prop]"></statusRow>
            </template>
          </el-table-column>

          <!-- 系统 -->
          <el-table-column
            v-else-if="item.prop === 'systemImg'"
            :key="'systemImg' + index"
            column-key="systemImg"
            :resizable="index != 0 && index != columnShowArr.length - 1"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <div class="systemImg-box">
                <systemImg :imgInfo="row"></systemImg>
              </div>
            </template>
          </el-table-column>
          <!-- 任务状态 -->
          <el-table-column
            v-else-if="item.prop === 'taskStatus'"
            :key="'taskStatus' + index"
            column-key="ecstaskStatus"
            :label="item.label"
            :resizable="index != 0 && index != columnShowArr.length - 1"
            :prop="item.prop"
            :width="item.width"
            :sortable="item.sortable"
          >
            <template slot-scope="{ row }">
              <taskStatusRow :taskStatus="row[item.prop]"></taskStatusRow>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.prop == 'deadlineTime'"
            :key="item.prop + index"
            :label="item.label"
            :prop="item.prop"
            :resizable="index != 0 && index != columnShowArr.length - 1"
            :width="item.width"
            :sortable="item.sortable"
          >
            <template slot-scope="{ row }">
              <div class="status-row">
                <span v-if="row[item.prop] < 0" class="error">
                  {{ row[item.prop] }}({{ $t("resourceMgr.zoneerror") }})
                </span>
                <span
                  v-else-if="row[item.prop] <= 3 && row[item.prop] >= 0"
                  class="warn"
                >
                  {{ row[item.prop] }}({{ $t("resourceMgr.zonewarn") }})
                </span>

                <span v-else>{{ row[item.prop] }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="item.prop + index"
            :label="item.label"
            :prop="item.prop"
            :resizable="index != 0 && index != columnShowArr.length - 1"
            :width="item.width"
            :sortable="item.sortable"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                v-if="item.isLink"
                effect="light"
                :content="row[item.prop] + ''"
                placement="top"
                :visible-arrow="true"
              >
                <router-link
                  v-if="currentBtnShow('servervm_info')"
                  :to="{
                    name: 'escPageDetail',
                    params: {
                      id: row.serverVmUuid,
                      type: 'escPageDetail',
                      serverVmUuid: row.serverVmUuid,
                      tab: 'summary',
                    },
                  }"
                >
                  <el-link type="primary">{{ row[item.prop] }}</el-link>
                </router-link>

                <span v-else>{{ row[item.prop] }}</span>
              </el-tooltip>
              <div v-else-if="item.isProgress" class="progress-row">
                <!-- //判断状态，如果为在线状态，显示利用率 -->
                <div
                  v-if="
                    row.status === 'AVAILABLE' ||
                    row.status === 'CONNECTED' ||
                    row.status === 'SUSPEND'
                  "
                >
                  <div class="progress-item">
                    <span>CPU：</span>
                    <el-progress
                      :percentage="setItemProgress(row[item.prop], 1)"
                      :color="customColorMethod"
                      :stroke-width="4"
                    />
                  </div>
                  <div class="progress-item">
                    <span>{{ $t("common.mem") }}：</span>
                    <el-progress
                      :percentage="setItemProgress(row[item.prop], 2)"
                      :color="customColorMethod"
                      :stroke-width="4"
                    />
                  </div>
                </div>
                <div v-else></div>
              </div>

              <el-tooltip
                v-else-if="item.tooltipsFlag"
                effect="light"
                :content="row[item.prop] + ''"
                placement="top"
                :visible-arrow="true"
              >
                <span>{{ row[item.prop] }}</span>
              </el-tooltip>
              <span v-else>{{ row[item.prop] }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column :width="100" className="tableoperation" fixed="right">
          <template slot="header">
            <div class="tableoperation-header">
              <div>{{ $t("common.operation") }}</div>
              <oper
                :filter-data="columnArr"
                :clumn-name="'ecs-table'"
                @tableColumn="getTableColumn"
              />
            </div>
          </template>
          <template slot-scope="{ row }">
            <el-link
              v-if="row.startBtnShow && currentBtnShow('start_servervm')"
              :disabled="row.startBtnDisabled"
              type="primary"
              @click.stop="startServerVm(row)"
            >
              <!-- 开机 -->
              {{ $t("resourceMgr.start_servervm") }}
            </el-link>
            <el-link
              v-if="row.vncBtnShow"
              :disabled="row.vncBtnDisabled"
              type="primary"
              @click.stop="openVnc(row)"
            >
              <!-- 控制台 -->
              {{ $t("resourceMgr.openVnc") }}
            </el-link>
            <btn-more
              ref="btnMore"
              :key="row.serverVmId"
              :disabled-list="[]"
              :select-data="[row]"
              :btn-type="'link'"
              class="el-link"
              @downToggleCommand="downToggleCommand"
              @handleShowDely="handleShowDely(row)"
              @refreshTable="refreshTable"
            />
          </template>
        </el-table-column>
      </mc-table>
    </div>
  </div>
</template>




<script>
import mcTable from "@/components/MctablePro";
import oper from "@/components/Operation";
import { headerBar, btnMore } from "./components/main/index";
import taskStatusRow from "./components/taskStatusRow.vue";
import statusRow from "./components/statusRow.vue";
import systemImg from "./components/systemImg.vue";
import ReMessage from "@/utils/message";
import { getVncUrl, startServerVm } from "@/api/serverVm";
import { zoneOrgTree, serverVmList } from "@/api/ecsapi";
import actbtnPms from "./components/main/actbtnPmsList";
export default {
  name: "Ecs",
  components: {
    mcTable,
    oper,
    headerBar,
    btnMore,
    taskStatusRow,
    statusRow,
    systemImg,
  },
  data() {
    return {
      taskStatus: "INSTALLING", // 任务状态
      defaultExpandedkeys: [],
      defaultCheckedkeys: [],
      zoneOrgTreeSearchObj: {},
      treeData: [],
      treeProps: {
        children: "child",
        label: "name",
      },
      nodeKey: "treeUniqueId",

      rowkey: "serverVmId",
      selectionType: "multipleTable",
      columnArr: [
        // 表格总的列数据
        { label: "ID", prop: "serverVmId", show: false, tooltipsFlag: false },
        {
          label: "UUID",
          prop: "serverVmUuid",
          show: false,
          width: 120,
          tooltipsFlag: true,
        },
        {
          label: this.$t("resourceMgr.systemImg"), // "系统",
          prop: "systemImg",
          width: 60,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: this.$t("resourceMgr.aliasName"), // "名称",
          prop: "aliasName",
          width: 200,
          isLink: true,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: this.$t("resourceMgr.zonestatus"), // "状态",
          prop: "status",
          show: true,
          width: 150,
          tooltipsFlag: false,
        },
        {
          label: this.$t("resourceMgr.zonetaskStatus"), // "任务状态",
          prop: "taskStatus",
          show: true,
          width: 120,
          tooltipsFlag: true,
        },
        {
          label: "VDC",
          prop: "vdcName",
          width: 120,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: this.$t("resourceMgr.zoneorgName"), // "所属组织",
          prop: "orgName",
          width: 120,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: this.$t("resourceMgr.zoneclusterName"), //  "所属集群",
          prop: "clusterName",
          width: 120,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: this.$t("resourceMgr.zoneip"), // "IP地址",
          prop: "ip",
          width: 100,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: this.$t("resourceMgr.zoneos"), // "操作系统",
          prop: "os",
          width: 120,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: this.$t("resourceMgr.architecture"), // "架构",
          prop: "architecture",
          width: 100,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: this.$t("resourceMgr.zonecpu"), // "CPU(核)",
          prop: "cpus",
          width: 100,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: this.$t("resourceMgr.zonememory"), // "内存(GB)",
          prop: "memory",
          width: 100,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: this.$t("resourceMgr.zonedisks"), // "磁盘(GB)",
          prop: "disks",
          show: true,
          tooltipsFlag: true,
        },
        {
          label: this.$t("resourceMgr.zoneusage"), // "利用率",
          prop: "usage",
          width: 200,
          isProgress: true,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: this.$t("resourceMgr.zonecreateDate"), // "创建时间",
          prop: "createDate",
          width: 120,
          sortable: true,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: this.$t("resourceMgr.zonedeadlineTime"), // "到期时间(天)",
          prop: "deadlineTime",
          width: 200,
          sortable: true,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: this.$t("resourceMgr.zonedescription"), // "描述",
          prop: "description",
          width: 100,
          show: false,
          tooltipsFlag: true,
        },
      ],
      columnShowArr: [], // 实际显示的表格列
      tableData: [], // 表格渲染数据
      selectTable: [], // 表格选中数据
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      searchStatus: "ALL",
      searchKey: "",
      selectRowData: new Object(),
      statusLable: "",
      statusFilter: [
        {
          text: this.$t("resourceMgr.zoneAVAILABLE"), // "在线",
          value: "AVAILABLE",
        },
        {
          text: this.$t("resourceMgr.zoneOFFLINE"), // "离线",
          value: "OFFLINE",
        },
        {
          text: this.$t("resourceMgr.zoneINSTALLING"), // "安装",
          value: "INSTALLING",
        },
        {
          text: this.$t("resourceMgr.zoneCONNECTED"), // "已连接",
          value: "CONNECTED",
        },
        {
          text: this.$t("resourceMgr.zoneSUSPEND"), // "暂停",
          value: "SUSPEND",
        },
        {
          text: this.$t("resourceMgr.zoneOVERDUE"), // "已过期",
          value: "OVERDUE",
        },
        {
          text: this.$t("resourceMgr.zoneUNKNOWN"), // "其他",
          value: "UNKNOWN",
        },
      ],
      clusterKey: "0",
    };
  },
  created() {
    // this.getTreeData();
    // this.renderTable();
  },
  mounted() {
    const timeCount = 20000;
    const esctimer = setInterval(() => {
      // 某些定时器操作
      this.timeRefresh();
    }, timeCount);
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once("hook:beforeDestroy", () => {
      clearInterval(esctimer);
    });
  },
  methods: {
    refreshTable() {
      this.renderTable();
    },
    getclusterTreeData() {
      this.getTreeData();
    },
    getTreeData() {
      this.defaultCheckedkeys = [];
      this.$nextTick(() => {
        this.$showFullScreenLoading(".ecs-el-tree");
      });
      let params = { clusterId: this.clusterKey };
      zoneOrgTree(params).then((res) => {
        this.$hideFullScreenLoading();
        if (res && res.length > 0) {
          this.treeData = res;

          this.$nextTick(() => {
            this.defaultCheckedkeys = [res[0].uniqueId];
            this.$refs.ecstree.setCurrentKey(this.defaultCheckedkeys[0]);
          });
          this.zoneOrgTreeSearchObj = res[0];
          this.pageNo = 1;
          this.pageSize = 20;
          this.renderTable();
        }
      });
    },
    handleNodeClick(data) {
      this.zoneOrgTreeSearchObj = data;
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
    },
    headerBarEmit(rows) {
      let tableDataOri = JSON.parse(JSON.stringify(this.tableData));
      this.tableData = [];
      tableDataOri.forEach((element, index) => {
        rows.forEach((row, k) => {
          if (row.serverVmId === element.serverVmId) {
            tableDataOri[index] = JSON.parse(JSON.stringify(row));
          }
        });
      });

      this.tableData = JSON.parse(JSON.stringify(tableDataOri));
    },
    downToggleCommand(row) {
      let tableDataOri = JSON.parse(JSON.stringify(this.tableData));
      this.tableData = [];
      let { serverVmId } = row;
      tableDataOri.forEach((element, index) => {
        if (serverVmId === element.serverVmId) {
          tableDataOri[index] = JSON.parse(JSON.stringify(row));
        }
      });
      this.tableData = JSON.parse(JSON.stringify(tableDataOri));
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.renderTable();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.renderTable();
    },
    timeRefresh() {
      let pageNo = this.pageNo;
      let pageSize = this.pageSize;
      let searchKey = this.searchKey;
      if (!this.searchStatus) {
        this.searchStatus = "ALL";
      }
      this.selectTable = [];
      let vmStatus = this.searchStatus;
      let headers = { TIME_REFRESH: "TIME_REFRESH" };
      let type = this.zoneOrgTreeSearchObj.type; // 非必须 点击树状结构类型	枚举: ZONE,ORG,USER
      let uniqueId = this.zoneOrgTreeSearchObj.uniqueId; // 非必须 树形节点值
      this.getServerVmTableList(
        { pageNo, pageSize, searchKey, vmStatus, type, uniqueId },
        headers
      );
    },
    getServerVmTableList(
      { pageNo, pageSize, searchKey, vmStatus, type, uniqueId },
      headers
    ) {
      if (!uniqueId) {
        return;
      }
      this.$hideFullScreenLoading();
      let params = {
        pageNo,
        pageSize,
        searchKey,
        vmStatus,
        type,
        uniqueId,
        clusterId: this.clusterKey,
      };
      serverVmList(params, headers).then((res) => {
        this.tableData = JSON.parse(JSON.stringify(this.dealBootUp(res.list)));
        this.total = res.pageInfo.total;
        this.$hideFullScreenLoading();
      });
    },
    renderTable() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let pageNo = this.pageNo;
      let pageSize = this.pageSize;
      let searchKey = this.searchKey;
      if (!this.searchStatus) {
        this.searchStatus = "ALL";
      }
      this.selectTable = [];
      let vmStatus = this.searchStatus;
      let type = this.zoneOrgTreeSearchObj.type; // 非必须 点击树状结构类型	枚举: ZONE,ORG,USER
      let uniqueId = this.zoneOrgTreeSearchObj.uniqueId; // 非必须 树形节点值

      this.selectTable = [];
      let headers = {};
      this.getServerVmTableList(
        { pageNo, pageSize, searchKey, vmStatus, type, uniqueId },
        headers
      );
    },
    dealBootUp(list) {
      // 电源状态 status
      // 任务状态 taskStatus
      list.forEach((element) => {
        let { status, taskStatus } = element;

        element.startBtnShow = false; // 开机按钮start Show
        element.startBtnDisabled = true; // 开机按钮start Disabled

        element.shutdownBtnShow = false; // 关机按钮 shutdown Show
        element.shutdownBtnDisabled = true; // 开机按钮 shutdown Disabled

        element.vncBtnShow = false; // 控制台按钮vnc Show
        element.vncBtnDisabled = true; // 控制台按钮vnc Disabled

        element.abortBtnShow = false; // 强制关机按钮 abort Show
        element.abortBtnDisabled = true; // 强制关机按钮 abort Disabled

        element.rebootBtnShow = false; // 重启按钮 reboot Show
        element.rebootBtnDisabled = true; // 重启按钮 reboot Disabled

        element.forcerebootBtnShow = false; // 强制重启按钮 forcereboot Show
        element.forcerebootBtnDisabled = true; // 强制重启按钮 forcereboot Disabled

        element.snapshotBtnShow = false; // 快照按钮 snapshot Show
        element.snapshotBtnDisabled = true; // 快照按钮 snapshot Disabled

        element.editBtnShow = false; // 变更规格按钮 edit Show
        element.editBtnDisabled = true; // 变更规格按钮 edit Disabled

        element.applyDeferredBtnShow = false; // 申请延期按钮 applyDeferred Show
        element.applyDeferredBtnDisabled = true; // 申请延期按钮 applyDeferred Disabled

        element.deleteBtnShow = false; // 删除按钮 delete Show
        element.deleteBtnDisabled = true; // 删除按钮 delete Disabled
        if (taskStatus == "LEISURE") {
          // 根据电源状态控制
          // 根据电源状态控制处理 开机按钮start startBtn
          if (actbtnPms.startstatusShowList.indexOf(status) > -1) {
            element.startBtnShow = true;
            element.startBtnDisabled = false;
          }
          // 根据电源状态控制处理 关机按钮 shutdown
          if (actbtnPms.shutdownstatusShowList.indexOf(status) > -1) {
            element.shutdownBtnShow = true;
            element.shutdownBtnDisabled = false;
          }
          // 根据电源状态控制处理 控制台按钮vnc vncBtn
          if (actbtnPms.vncstatusShowList.indexOf(status) > -1) {
            element.vncBtnShow = true;
            element.vncBtnDisabled = false;
          }
          // 根据电源状态控制处理 强制关机按钮abort abortBtn
          if (actbtnPms.abortstatusShowList.indexOf(status) > -1) {
            element.abortBtnShow = true;
            element.abortBtnDisabled = false;
          }
          // 根据电源状态控制处理 重启按钮 reboot
          if (actbtnPms.rebootstatusShowList.indexOf(status) > -1) {
            element.rebootBtnShow = true;
            element.rebootBtnDisabled = false;
          }
          // 根据电源状态控制处理 强制重启按钮 forcereboot
          if (actbtnPms.forcerebootstatusShowList.indexOf(status) > -1) {
            element.forcerebootBtnShow = true;
            element.forcerebootBtnDisabled = false;
          }
          // 根据电源状态控制处理 快照按钮 snapshot
          if (actbtnPms.snapshotstatusShowList.indexOf(status) > -1) {
            element.snapshotBtnShow = true;
            element.snapshotBtnDisabled = false;
          }
          // 根据电源状态控制处理 变更规格按钮 edit
          if (actbtnPms.editstatusShowList.indexOf(status) > -1) {
            element.editBtnShow = true;
            element.editBtnDisabled = false;
          }
          // 根据电源状态控制处理 申请延期按钮 applyDeferred
          if (actbtnPms.applyDeferredstatusShowList.indexOf(status) > -1) {
            element.applyDeferredBtnShow = true;
            element.applyDeferredBtnDisabled = false;
          }
          // 根据电源状态控制处理 删除按钮 delete
          if (actbtnPms.deletestatusShowList.indexOf(status) > -1) {
            element.deleteBtnShow = true;
            element.deleteBtnDisabled = false;
          }
        } else {
          // 根据任务状态控制
          // 根据任务状态控制处理 开机按钮start startBtn
          if (actbtnPms.starttaskStatusShowList.indexOf(taskStatus) > -1) {
            element.startBtnShow = true;
            element.startBtnDisabled = false;
          }
          // 根据任务状态控制处理 关机按钮 shutdown
          if (actbtnPms.shutdowntaskStatusShowList.indexOf(taskStatus) > -1) {
            element.shutdownBtnShow = true;
            element.shutdownBtnDisabled = false;
          }
          // 根据任务状态控制处理 控制台按钮vnc vncBtn
          if (actbtnPms.vnctaskStatusShowList.indexOf(taskStatus) > -1) {
            element.vncBtnShow = true;
            element.vncBtnDisabled = false;
          }
          // 根据任务状态控制处理 强制关机按钮abort abortBtn
          if (actbtnPms.aborttaskStatusShowList.indexOf(taskStatus) > -1) {
            element.abortBtnShow = true;
            element.abortBtnDisabled = false;
          }
          // 根据任务状态控制处理 重启按钮 reboot
          if (actbtnPms.reboottaskStatusShowList.indexOf(taskStatus) > -1) {
            element.rebootBtnShow = true;
            element.rebootBtnDisabled = false;
          }
          // 根据任务状态控制处理 强制重启按钮 forcereboot
          if (
            actbtnPms.forcereboottaskStatusShowList.indexOf(taskStatus) > -1
          ) {
            element.forcerebootBtnShow = true;
            element.forcerebootBtnDisabled = false;
          }
          // 根据任务状态控制处理 快照按钮 snapshot
          if (actbtnPms.snapshottaskStatusShowList.indexOf(taskStatus) > -1) {
            element.snapshotBtnShow = true;
            element.snapshotBtnDisabled = false;
          }
          // 根据任务状态控制处理 变更规格按钮 edit
          if (actbtnPms.edittaskStatusShowList.indexOf(taskStatus) > -1) {
            element.editBtnShow = true;
            element.editBtnDisabled = false;
          }

          // 根据任务状态控制处理 申请延期按钮 applyDeferred
          if (
            actbtnPms.applyDeferredtaskStatusShowList.indexOf(taskStatus) > -1
          ) {
            element.applyDeferredBtnShow = true;
            element.applyDeferredBtnDisabled = false;
          }
          // 根据任务状态控制处理 删除按钮 delete
          if (actbtnPms.deletetaskStatusShowList.indexOf(taskStatus) > -1) {
            element.deleteBtnShow = true;
            element.deleteBtnDisabled = false;
          }
        }
      });
      return list;
    },
    getTableColumn(table) {
      const newTableHeader = table || this.columnArr;
      let checkedDisabled = ["systemImg", "aliasName", "status", "taskStatus"];
      newTableHeader.forEach((element) => {
        const { prop } = element;
        element.checkedDisabled = true;
        if (checkedDisabled.indexOf(prop) == -1) {
          element.checkedDisabled = false;
        }
      });
      this.$set(this, "columnShowArr", newTableHeader);
      this.$nextTick(() => {
        this.$refs.escTable && this.$refs.escTable.doLayout();
      });
    },
    // 申请延期
    handleShowDely(row) {
      this.selectRowData = row;
    },
    // 刷新表格
    refreshTable() {
      this.renderTable();
    },
    changeSearchKey(val) {
      this.searchKey = val;
    },
    changeVmStatus(val) {
      this.searchStatus = val;
    },
    // 集群变更
    changeclusterKey(val) {
      this.clusterKey = val;
    },
    filterChange(filters) {
      //状态过滤
      this.searchStatus = filters.ecsStatus[0];
      this.renderTable();
      let lable = this.statusFilter.find(
        (item) => item.value === this.searchStatus
      );
      if (lable) {
        this.statusLable = "(" + lable.text + ")";
      } else {
        this.statusLable = "";
      }
    },
    // 表格勾选
    handlerSelectionChange(selection) {
      this.selectTable = selection;
    },
    rowSelect(row) {
      // let rowUuid = row.serverVmUuid;
      // let existUuid = this.selectTable.find(
      //   (item) => item.serverVmUuid === rowUuid
      // );
      // if (!existUuid) {
      //   this.$refs.escTable.$refs.elTable.toggleRowSelection(row);
      // } else {
      //   this.$refs.escTable.$refs.elTable.toggleRowSelection(row, false);
      // }
    },
    // 自定义进度条颜色
    customColorMethod(percentage) {
      if (percentage <= 80) {
        return "#1DDBB1";
      } else if (80 < percentage && percentage < 90) {
        return "#E6A23C";
      } else {
        return "#F56C6C";
      }
    },
    setItemProgress(value, type) {
      if (type == 1) {
        return parseInt(JSON.parse(value).cpu);
      } else if (type == 2) {
        return parseInt(JSON.parse(value).mem);
      } else {
        return parseInt(JSON.parse(value).disk);
      }
    },
    openVnc(row) {
      let serverVmUuid = row.serverVmUuid;

      getVncUrl({ serverVmUuid }).then((res) => {
        let vncUrl = res.vncUrl;
        if (vncUrl) {
          window.open(vncUrl, "_blank");
        }
      });
    },
    startServerVm(row) {
      let serverVmUuid = row.serverVmUuid;
      row.startBtnDisabled = true;
      startServerVm({ serverVmUuid })
        .then((res) => {
          ReMessage.success(this.$t("resourceMgr.startServerVm"));
          this.refreshTable();
        })
        .catch((err) => {
          this.selectTable = [];
          this.refreshTable();
        });
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.ecs {
  display: flex;
  flex-direction: row;
  .ecs-home-left,
  .ecs-home-right {
    display: flex;
    flex-direction: column;
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
  .ecs-home-left {
    width: 230px;
    height: 100%;
  }
  .ecs-home-right {
    height: 100%;
    flex: 1;
    margin-left: 15px;
    .status-row {
      .success {
        color: $msgSuccess;
      }
      .error {
        color: $msgDanger;
      }
      .offline {
        color: "#090909";
      }
      .warn {
        color: $msgWarning;
      }
      .notice {
        color: $msgNotice;
      }
      [class*="el-icon-"] {
        margin-left: 0px;
      }
    }
  }
  .progress-row {
    .progress-item {
      display: flex;
      align-items: center;
      .el-progress {
        width: 70%;
        margin: 0 5px;
      }
    }
  }
  .systemImg-box {
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
  }
}
</style>
