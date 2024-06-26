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
        <!-- name -->
        <el-table-column
          v-if="item.prop == 'name'"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <router-link
              :to="{
                name: 'physicalDetail',
                params: { id: row.clusterId, type: 'physicalDetail' },
              }"
            >
              <el-link type="primary">{{ row.name }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          v-else-if="item.prop == 'status'"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <statuscell :status="row.status"></statuscell>
          </template>
        </el-table-column>
        <!-- CPU分配比  -->
        <el-table-column
          v-else-if="item.prop == 'cpurate'"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: row.cpuUtil,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 内存分配比 -->
        <el-table-column
          v-else-if="item.prop == 'memoryrate'"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: row.memUtil,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :key="index"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] || "-" }}</span>
          </template>
        </el-table-column>
      </template>
    </mc-table>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import mcAllocationratio from "@/components/Mcallocationratio";
import { pagePhysicalHost } from "@/api/clusterapi";
import transformat from "@/utils/transformat";
import statuscell from "../../components/statuscell/index.vue";
export default {
  name: "clusterpagePhysicalHost",
  components: { mcTable, mcAllocationratio, statuscell },
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
      rowkey: "serverId",
      pageInfo: {},
      tableColumns: [
        // 名称
        {
          label: this.$t("resourceMgr.cpuModelName"),
          prop: "serverAddr",
        },
        // 状态
        { label: this.$t("resourceMgr.cpuModelstatus"), prop: "status" },
        // 服务器架构
        {
          label: this.$t("resourceMgr.cpuModelserverArch"),
          prop: "serverArch",
        },
        // CPU类型
        {
          label: this.$t("resourceMgr.cpuModelType"),
          prop: "cpuModelName",
        },
        // 服务器类型
        {
          label: this.$t("resourceMgr.cpuModelserverType"),
          prop: "serverType",
        },
        // CPU利用率
        {
          label: this.$t("resourceMgr.cpuModelcpurate"),
          prop: "cpurate",
          width: 230,
        },
        // 内存利用率
        {
          label: this.$t("resourceMgr.cpuModelmemoryrate"),
          prop: "memoryrate",
          width: 230,
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
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        clusterId: this.pageInfo.clusterId,
      };

      pagePhysicalHost(pramas)
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
          this.$hideFullScreenLoading();
        });
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
    // 计算百分比
    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
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