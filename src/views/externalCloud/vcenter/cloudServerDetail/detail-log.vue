<template>
  <div class="detailLog">
    <mc-table
      ref="detailLog"
      :data="tableData"
      :total="total"
      :short-height="60"
      @current-change="handlePageChange"
      :rowkey="rowkey"
    >
      <template v-for="(item, index) in columnArr">
        <el-table-column
          v-if="item.prop == 'detail'"
          :key="item.prop + index"
          :width="item.width"
          :label="item.label"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              effect="light"
              :content="getdetailInfo(row)"
              placement="top"
              :visible-arrow="true"
            >
              <span>{{ getdetailInfo(row) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.prop + index"
          :width="item.width"
          :label="item.label"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </mc-table>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import { getServerTaskListData } from "@/api/vcenter";
import { KSVD } from "./taskDetailInfo";
export default {
  components: {
    mcTable,
  },
  data() {
    return {
      rowkey: "",
      vcenterId: this.$route.params.vcenterId,
      vmName: this.$route.params.name,
      columnArr: [
        {
          label: this.$t("externalCloud.task.type"), // "类型",
          prop: "taskType",
          width: "200px",
        },
        {
          label: this.$t("externalCloud.task.operation"), // "操作",
          prop: "taskOperation",
          width: "200px",
        },
        {
          label: this.$t("externalCloud.task.objectName"), // "对象名称",
          prop: "objectName",
          width: "200px",
        },
        {
          label: this.$t("externalCloud.task.operationUser"), // "操作用户",
          prop: "operationUser",
          width: "200px",
        },
        {
          label: this.$t("externalCloud.task.startTime"), // "开始时间",
          prop: "taskStartTime",
          width: "200px",
        },
        {
          label: this.$t("externalCloud.task.finishTime"), // "结束时间",
          prop: "taskFinishTime",
          width: "200px",
        },
        {
          label: this.$t("externalCloud.task.status"), // "状态",
          prop: "taskStatus",
          width: "200px",
        },
        {
          label: this.$t("resourceMgr.task.detail"), // "详情",
          prop: "taskDetail",
          width: "200px",
        },
        {
          label: this.$t("resourceMgr.task.reason"), // "原因",
          prop: "taskReason",
        },
      ],
      tableData: [],
      serverVmUuid: this.$route.params.id,
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
    getdetailInfo(row) {
      let details = "";
      var name = row.detail;
      if (name == "null" || typeof name == "undefined") {
        name = "";
      } else {
        name = KSVD.taskDetailInfo.init(row.objName, name);
      }
      details = name;
      return details;
      // return row.detail;
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.renderTable();
    },
    renderTable() {
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.vmName,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      getServerTaskListData(params).then((res) => {
        this.tableData = res.list;
        this.total = res.pageInfo.total;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detailLog {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
