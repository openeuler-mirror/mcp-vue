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
          v-if="item.prop == 'status'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <statuscell :status="row.status"></statuscell>
          </template>
        </el-table-column>
        <!-- CPU分配比  -->
        <el-table-column
          v-else-if="item.prop == 'cpurate'"
          :key="'cpurate' + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(row.cpuUsed, row.cpuTotal),
                unit: 'GHZ',
                num: row.cpuUsed,
                total: row.cpuTotal,
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
                percentage: calculatePercentage(row.memUsed, row.memTotal),
                unit: 'GB',
                num: row.memUsed,
                total: row.memTotal,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 存储分配比 -->
        <el-table-column
          v-else-if="item.prop == 'storagerate'"
          :key="'storagerate' + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(
                  row.storageUsed,
                  row.storageTotal
                ),
                unit: 'GB',
                num: row.storageUsed,
                total: row.storageTotal,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.prop"
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
</template>

<script>
import mcTable from "@/components/MctablePro";
import mcAllocationratio from "@/components/Mcallocationratio";
import { clusterListByZone } from "@/api/zoneapi";
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
        // 集群名称
        {
          label: this.$t("resourceMgr.clusterName"),
          prop: "name",
        },
        // 集群状态
        { label: this.$t("resourceMgr.clusterStatus"), prop: "status" },
        // 描述
        { label: this.$t("resourceMgr.clusterRemark"), prop: "remark" },
        // 可用区
        { label: this.$t("resourceMgr.zoneName"), prop: "zoneName" },
        // 集群URL
        {
          label: this.$t("resourceMgr.clusterUrl"),
          prop: "clusterUrl",
          width: 230,
        },
        // 集群类型
        { label: this.$t("resourceMgr.clustertype"), prop: "type" },
        // CPU利用率
        {
          label: this.$t("resourceMgr.clustercpurate"),
          prop: "cpurate",
          width: 230,
        },
        // 内存利用率
        {
          label: this.$t("resourceMgr.clustermemoryrate"),
          prop: "memoryrate",
          width: 230,
        },
        // 存储利用率
        {
          label: this.$t("resourceMgr.clusterstoragerate"),
          prop: "storagerate",
          width: 230,
        },
      ],
      tableData: [],

      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      zoneId: this.$route.params.id,
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
        zoneId: this.zoneId,
      };

      clusterListByZone(pramas)
        .then((res) => {
          // this.tableData = res.list;
          // this.total = res.pageInfo.total;
          this.tableData = res;
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