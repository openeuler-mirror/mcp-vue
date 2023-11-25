<template>
  <!-- pagePhysicalHost -->
  <div class="pagePhysicalHost-detail">
    <mc-table
      ref="physicalClusterTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      :rowkey="rowkey"
    >
      <template v-for="(item, index) in tableColumns">
        <!-- 状态 -->
        <el-table-column
          v-if="item.prop == 'hostStatus'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <statuscell
              :status="row.hostStatus.toString()"
              type="number"
            ></statuscell>
          </template>
        </el-table-column>
        <!-- CPU分配比  -->
        <el-table-column
          v-else-if="item.prop == 'cpurate'"
          :key="item.label + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: row.resourceStatistics.cpuUsedRate,
                unit: row.resourceStatistics.cpuCapacityUnit,
                num: row.resourceStatistics.cpuUsedCapacity,
                total: row.resourceStatistics.cpuTotalCapacity,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 内存分配比 -->
        <el-table-column
          v-else-if="item.prop == 'memoryrate'"
          :key="'memoryrate' + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: row.resourceStatistics.memoryUsedRate,
                unit: row.resourceStatistics.memoryCapacityUnit,
                num: row.resourceStatistics.memoryUsedCapacity,
                total: row.resourceStatistics.memoryTotalCapacity,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :key="item.prop + index"
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
import { getVcenterhostList } from "@/api/vcenter";
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
      vcenterId: this.$route.params.id,
      tableColumns: [
        // 名称
        {
          label: this.$t("resourceMgr.cpuModelName"),
          prop: "hostName",
        },
        // 状态
        { label: this.$t("resourceMgr.cpuModelstatus"), prop: "hostStatus" },
        // CPU利用率
        {
          label: this.$t("resourceMgr.cpuModelcpurate"),
          prop: "cpurate",
          width: 300,
        },
        // 内存利用率
        {
          label: this.$t("resourceMgr.cpuModelmemoryrate"),
          prop: "memoryrate",
          width: 300,
        },
        // 服务器数量
        {
          label: this.$t("externalCloud.vcenter.vmNumber"),
          prop: "serverCount",
        },
      ],
      tableData: [],

      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 1000,
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
        vcenterId: this.vcenterId,
      };

      getVcenterhostList(pramas)
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