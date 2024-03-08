<template>
  <!-- pagePhysicalHost -->
  <div class="pagePhysicalHost-detail">
    <mc-table
      ref="physicalClusterTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
    >
      <template v-for="(item, index) in tableColumns">
        <!-- 状态 -->
        <el-table-column
          v-if="item.prop == 'powerStatus'"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <statuscell :status="row.powerStatus"></statuscell>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.prop == 'operation'"
          fixed="right"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :width="item.width"
          className="tableoperation"
        >
          <template slot-scope="{ row }">
            <!-- 开机 -->
            <el-link
              v-if="row.showstart"
              type="primary"
              @click="startSession(row)"
            >
              {{ $t("common.startSession") }}
            </el-link>
            <!-- 开机 -->
            <el-link
              v-if="row.showclose"
              type="primary"
              @click="closeSession(row)"
            >
              {{ $t("common.closeSession") }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :label="item.label"
          :width="item.width"
          :resizable="index != 0 && index != tableColumns.length - 1"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="item.tooltipsFlag"
              effect="light"
              :content="row[item.prop] || '-'"
              placement="top"
              :visible-arrow="true"
            >
              <span>{{ row[item.prop] }}</span>
            </el-tooltip>
            <span v-else>{{ row[item.prop] || "-" }}</span>
          </template>
        </el-table-column>
      </template>
    </mc-table>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import { vmList, powerOn, powerOff } from "@/api/vMwareMgr";
import statuscell from "./statuscell.vue";
export default {
  name: "clusterpagePhysicalHost",
  components: { mcTable, statuscell },
  props: {
    dataInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    dataInfo(val) {
      this.pageInfo = val;
      this.getpagePhysicalHost();
    },
  },
  data() {
    return {
      rowkey: "vmId",
      pageInfo: {},
      tableColumns: [
        // 名称
        {
          label: this.$t("resourceMgr.vMwareMgr.name"), // "名称",
          prop: "vmName",
          tooltipsFlag: true,
        },
        // 状态
        {
          label: this.$t("resourceMgr.vMwareMgr.powerStatus"), // "状态",
          prop: "powerStatus",
        },
        // 内存
        {
          label: this.$t("resourceMgr.vMwareMgr.memory") + "(MB)", // 内存
          prop: "memory",
        },
        // cpu
        { label: "cpu", prop: "cpuCount" },
        {
          label: this.$t("common.operation"),
          prop: "operation",
          width: "200px",
        },
      ],
      tableData: [],

      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
    };
  },
  created() {
    this.pageInfo = this.dataInfo;
    this.getpagePhysicalHost();
  },
  methods: {
    getpagePhysicalHost() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let pramas = {
        // pageNo: this.pageNo,
        // pageSize: this.pageSize,
        vcenterId: this.pageInfo.vcenterId,
      };

      vmList(pramas)
        .then((res) => {
          this.tableData = this.getTableData(res);
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
          this.$hideFullScreenLoading();
        });
    },
    getTableData(list) {
      // POWERED_OFF 关闭 POWERED_ON 在线 SUSPENDED 暂停
      let newList = [];
      let showstartList = ["POWERED_OFF"];
      let showcloseList = ["POWERED_ON", "SUSPENDED"];
      list.forEach((element) => {
        let showstart = false;
        let showclose = false;
        let { powerStatus } = element;

        if (showstartList.indexOf(powerStatus) > -1) {
          showstart = true;
        }
        if (showcloseList.indexOf(powerStatus) > -1) {
          showclose = true;
        }
        newList.push({
          showstart: showstart,
          showclose: showclose,
          ...element,
        });
      });
      return newList;
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.getpagePhysicalHost();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.getpagePhysicalHost();
    },
    // 开机
    startSession(row) {
      let successMsg = this.$t("common.successfulOperation"); // "操作成功";
      let errorMsg = this.$t("common.operationFailed"); // "操作失败";
      this.$showFullScreenLoading(".mc-table");
      let params = {
        vcenterId: this.pageInfo.vcenterId,
        vmId: row.vmId,
      };
      powerOn(params)
        .then((res) => {
          this.alertTips(successMsg, "success");
          this.$hideFullScreenLoading();
          this.getpagePhysicalHost();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
          this.alertTips(err);
        });
    },
    // 关机
    closeSession(row) {
      this.$showFullScreenLoading(".mc-table");
      let successMsg = this.$t("common.successfulOperation"); // "操作成功";
      let errorMsg = this.$t("common.operationFailed"); // "操作失败";
      let params = {
        vcenterId: this.pageInfo.vcenterId,
        vmId: row.vmId,
      };
      powerOff(params)
        .then((res) => {
          this.alertTips(successMsg, "success");
          this.$hideFullScreenLoading();
          this.getpagePhysicalHost();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
          this.alertTips(err);
        });
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