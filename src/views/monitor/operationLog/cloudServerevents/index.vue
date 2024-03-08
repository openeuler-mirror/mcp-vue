<template>
  <div class="workorder app-container">
    <!-- 头部菜单栏 -->
    <header-bar ref="headerBar" @refreshTable="refreshTable" />
    <!-- <headerBarNew ref="headerBar" @refreshTable="refreshTable" /> -->

    <mc-table
      ref="workOrderTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      @sort-change="handleSortChange"
      :rowkey="rowkey"
      style="margin-top: 20px"
    >
      <template v-for="(item, index) in columnArr">
        <el-table-column
          :prop="item.prop"
          :key="item.prop + index"
          :label="item.label"
          :width="item.width"
          :resizable="index != 0 && index != columnArr.length - 1"
          :sortable="item.sortable"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="item.tooltipsFlag"
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
    </mc-table>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import headerBar from "./header-bar";
import headerBarNew from "./header-barNew.vue";
import { pageServerVirtualizationEvent } from "@/api/monitoringApi";

export default {
  name: "Workorder",
  components: {
    headerBar,
    mcTable,
    headerBarNew,
  },
  data() {
    return {
      rowkey: "",
      columnArr: [
        {
          label: this.$t("monitoring.serverEvtMap.severity"), // "严重性",
          prop: "severity",
          sortable: "custom",
          width: "200px",
        },
        {
          label: this.$t("monitoring.serverEvtMap.desktopName"), // "云服务器名称",
          prop: "desktopName",
          sortable: "custom",
          tooltipsFlag: true,
          width: "200px",
        },
        {
          label: this.$t("monitoring.serverEvtMap.type"), // "类型",
          prop: "type",
          sortable: "custom",
          width: "200px",
        },
        {
          label: this.$t("monitoring.serverEvtMap.username"), // "用户",
          prop: "username",
          sortable: false,
          width: "200px",
        },
        {
          label: this.$t("monitoring.serverEvtMap.hostname"), // "运行主机",
          prop: "hostname",
          sortable: "custom",
          width: "200px",
        },
        {
          label: this.$t("monitoring.serverEvtMap.timestamp"), // "日期",
          prop: "timestamp",
          sortable: "custom",
          tooltipsFlag: true,
          width: "200px",
        },
        {
          label: this.$t("monitoring.serverEvtMap.info"), // "信息",
          prop: "info",
          sortable: "custom",
          tooltipsFlag: true,
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      searchKey: "",
      startTime: "",
      endTime: "",
      clusterId: "",
      severity: "",
      eventType: "",
      serverType: "",
      sidx: "",
      sord: "",
    };
  },
  created() {
    // this.renderTable();
  },
  methods: {
    // 刷新表格
    refreshTable() {
      this.sidx = "";
      this.sord = "";
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
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
    handleSortChange(sortObj) {
      let { prop, order } = sortObj;
      this.sidx = prop;
      switch (order) {
        case "ascending":
          this.sord = "asc";
          break;
        case "descending":
          this.sord = "desc";
          break;
        default:
          this.sord = "asc";
          break;
      }
      this.renderTable();
    },
    // 集群
    changeClusterValue(val) {
      this.pageNo = 1;
      this.pageSize = 20;
      this.clusterId = val;
    },
    // 级别
    changeLevelValue(val) {
      this.pageNo = 1;
      this.pageSize = 20;
      this.severity = val;
    },
    // 类型
    changeTypeValue(val) {
      this.pageNo = 1;
      this.pageSize = 20;
      this.eventType = val;
    },
    // 对象类型
    changeserversValue(val) {
      this.pageNo = 1;
      this.pageSize = 20;
      this.serverType = val;
    },
    // 搜索内容
    changeSearchKey(val) {
      this.pageNo = 1;
      this.pageSize = 20;
      this.searchKey = val;
    },
    // 时间
    changetimeData(date) {
      this.pageNo = 1;
      this.pageSize = 20;
      this.startTime = date.startTime;
      this.endTime = date.endTime;
    },
    renderTable() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let params = {
        pageSize: this.pageSize, //	string	非必须 分页数量
        pageNo: this.pageNo, // 非必须 页面
        clusterId: this.clusterId, // 集群ID
        startDate: this.startTime, // 开始时间
        endDate: this.endTime, // 结束时间
        severity: this.severity, // 等级
        eventType: this.eventType, // 类型
        serverType: this.serverType, // 服务器类型
        search: this.searchKey, // 搜索内容
        sidx: this.sidx,
        sord: this.sord,
      };
      pageServerVirtualizationEvent(params)
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
        });
    },
  },
};
</script>
