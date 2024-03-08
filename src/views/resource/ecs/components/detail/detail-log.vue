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
          :resizable="index != 0 && index != columnArr.length - 1"
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
          :resizable="index != 0 && index != columnArr.length - 1"
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
import { getServerVmOperateLog } from "@/api/serverVm";
import { KSVD } from "./taskDetailInfo";
export default {
  components: {
    mcTable,
  },
  data() {
    return {
      rowkey: "",
      columnArr: [
        {
          label: this.$t("resourceMgr.task.action"), // "操作",
          prop: "action",
          width: "200px",
        },
        {
          label: this.$t("resourceMgr.task.objName"), // "对象名称",
          prop: "objName",
          width: "200px",
        },
        {
          label: this.$t("resourceMgr.task.operUser"), // "操作用户",
          prop: "operUser",
          width: "200px",
        },
        {
          label: this.$t("resourceMgr.task.startTime"), // "开始时间",
          prop: "startTime",
          width: "200px",
        },
        {
          label: this.$t("resourceMgr.task.finishTime"), // "结束时间",
          prop: "finishTime",
          width: "200px",
        },
        {
          label: this.$t("resourceMgr.task.status"), // "状态",
          prop: "status",
          width: "200px",
        },
        {
          label: this.$t("resourceMgr.task.detail"), // "详情",
          prop: "detail",
          width: "200px",
        },
        {
          label: this.$t("resourceMgr.task.reason"), // "原因",
          prop: "reason",
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
      let pageNo = this.pageNo;
      let pageSize = this.pageSize;
      let serverVmUuid = this.serverVmUuid;
      getServerVmOperateLog({ pageNo, pageSize, serverVmUuid }).then((res) => {
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
