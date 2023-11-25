<template>
  <div class="app-container taskcenter">
    <!-- 头部菜单栏 -->
    <header-bar
      ref="headerBar"
      @refreshTable="refreshTable"
      :spinBol="tableLoading"
    />

    <mc-table
      ref="taskcenterTable"
      :tableLoading="tableLoading"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
      style="margin-top: 20px"
      :lazy="true"
      :load="taskcentertableload"
      :treeProps="taskcentertreeProps"
    >
      <template v-for="(item, index) in columnArr">
        <!-- 操作 -->
        <el-table-column
          v-if="item.prop == 'operation'"
          fixed="right"
          :key="'operation' + index"
          :label="item.label"
          :width="item.width"
          className="tableoperation"
        >
          <template slot-scope="{ row }">
            <el-link type="primary" @click="viewInfo(row)">
              {{ $t("common.view") }}
            </el-link>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          v-else-if="item.prop == 'status'"
          :key="'status' + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <testCenterstatus :pageData="row"></testCenterstatus>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="item.prop"
          :key="item.prop + index"
          :label="item.label"
          :width="item.width"
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
    <teskDetail
      :options="teskDetailModalOption"
      :visible.sync="showteskDetailModal"
      @confirm="teskDetailConfirm"
    ></teskDetail>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import headerBar from "./taskcenterHeader.vue";
import testCenterstatus from "./testCenterstatus.vue";
import teskDetail from "./teskDetail/teskDetailModal.vue";
import { pageOperateLog, childOperateLogList } from "@/api/taskcenter";
import dictionary from "@/assets/common/dataDictionary/dictionary";

export default {
  name: "taskcenter",
  components: {
    headerBar,
    mcTable,
    testCenterstatus,
    teskDetail,
  },
  data() {
    return {
      rowkey: "rowkey",
      tableLoading: false,
      columnArr: [
        {
          label: this.$t("taskcenter.taskObjectType"), //  对象类型
          prop: "type",
          width: "200px",
        },
        {
          label: this.$t("taskcenter.taskName"), // 任务名称
          prop: "action",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.taskObject"), //  对象
          prop: "objName",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.taskStatus"), // 状态
          prop: "status",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.startingTime"), // 开始时间
          prop: "startTime",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.endTime"), // 结束时间
          prop: "endTime",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.operator"), // 操作者
          prop: "operateUser",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.operatorIp"), // 操作用户IP
          prop: "clientIp",
          width: "200px",
        },
        {
          label: this.$t("taskcenter.organization"), // 所属组织
          prop: "orgName",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.availabilityZone"), //  可用区
          prop: "zoneName",
          width: "200px",
        },
        {
          label: this.$t("common.operation"), // 操作
          prop: "operation",
          width: "100px",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      taskcentertreeProps: {
        children: "children",
        hasChildren: "hasChildOperateLog",
      },
      startDate: "", // 开始时间(YYYY-MM-DD)
      endDate: "", // 结束时间(YYYY-MM-DD)
      querytype: "", // 类型
      queryaction: "", // 操作
      querystatus: "", // 状态
      searchValue: "",
      showteskDetailModal: false,
      teskDetailModalOption: {
        title: "",
        formData: "", // 表单数据
      },
    };
  },
  created() {
    // this.renderTable();
  },
  methods: {
    // 刷新表格
    refreshTable(params) {
      this.pageNo = 1;
      this.pageSize = 20;
      this.startDate = params.startTime; // 开始时间(YYYY-MM-DD)
      this.endDate = params.endTime; // 结束时间(YYYY-MM-DD)
      this.querytype = params.typeValue; // 类型
      this.queryaction = params.teskValue; // 操作
      this.querystatus = params.statusValue; // 状态
      this.searchValue = params.searchValue;
      this.renderTable(params);
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
    renderTable() {
      this.tableLoading = true;
      let params = {
        pageSize: this.pageSize, //	string	非必须 分页数量
        pageNo: this.pageNo, // 非必须 页面
        type: this.querytype === "all" ? "" : this.querytype, // 类型
        action: this.queryaction === "all" ? "" : this.queryaction, // 操作
        status: this.querystatus === "all" ? "" : this.querystatus, // 状态
        startDate: this.startDate, // 开始时间
        endDate: this.endDate, // 结束时间
      };
      pageOperateLog(params)
        .then((res) => {
          const list = this.totableData(res.list);
          this.$set(this, "tableData", list);
          this.total = res.pageInfo.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    totableData(list) {
      list.forEach((element, index) => {
        element.statusValue = element.enumStatus;
        element.rowkey = "rowkey" + new Date() + index;
      });
      return list;
    },
    taskcentertableload(tree, treeNode, resolve) {
      let params = {
        parentLogId: tree.operateLogId,
      };
      childOperateLogList(params)
        .then((res) => {
          let trdTableData = this.totableData(res);
          resolve(trdTableData);
        })
        .catch((err) => {
          resolve([]);
          this.alertTips(err);
        });
    },
    viewInfo(row) {
      this.teskDetailModalOption = {
        title: this.$t("taskcenter.checkTheDetails"), // "查看详情",
        formData: row, // 表单数据
      };
      this.showteskDetailModal = true;
    },
    cancelInfo() {},
    teskDetailConfirm() {
      this.showteskDetailModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.taskcenter {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
