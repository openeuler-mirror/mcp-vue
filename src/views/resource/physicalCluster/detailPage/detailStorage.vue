<template>
  <!-- pageStorage -->
  <div class="pageStorage-detail">
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
        <el-table-column
          v-if="item.prop == 'userate'"
          :key="item.prop + index"
          :label="item.label"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(row.usedSize, row.totalSize),
              }"
            ></mcAllocationratio>
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
        <el-table-column
          v-else-if="item.prop == 'type'"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ getStorageType(row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop == 'usage'"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ getStorageUsage(row.usage) }}</span>
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
import { pageStorage } from "@/api/clusterapi";
import transformat from "@/utils/transformat";
import statuscell from "../../components/statuscell/index.vue";
import dictionary from "@/assets/common/dataDictionary/dictionary";
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
      this.getpageStorage();
    },
  },
  data() {
    return {
      rowkey: "serverId",
      pageInfo: {},
      tableColumns: [
        // "存储名称"
        { label: this.$t("resourceMgr.storageName"), prop: "name" },
        // 存储类型
        { label: this.$t("resourceMgr.storageType"), prop: "type" },
        // 存储状态
        { label: this.$t("resourceMgr.storageStatus"), prop: "status" },
        // 存储用途
        {
          label: this.$t("resourceMgr.storageUsage"),
          prop: "usage",
        },
        // 总容量
        {
          label: this.$t("resourceMgr.storagetotalSize") + "(GB)",
          prop: "totalSize",
        },
        // 可用容量
        {
          label: this.$t("resourceMgr.storageUsedSize") + "(GB)",
          prop: "availableSize",
        },
        // 利用率
        { label: this.$t("resourceMgr.storageUserate"), prop: "userate" },
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
    this.getpageStorage();
  },
  methods: {
    getStorageType(type) {
      return dictionary.storage.type[type];
    },
    getStorageUsage(usage) {
      return dictionary.storage.usage[usage];
    },
    getpageStorage() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        clusterId: this.pageInfo.clusterId,
      };
      pageStorage(pramas)
        .then((res) => {
          this.tableData = this.totableData(res.list);
          this.total = res.pageInfo.total;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
          this.$hideFullScreenLoading();
        });
    },
    totableData(list) {
      list.forEach((element, index) => {
        let { totalSize, usedSize } = element;

        list[index].availableSize = (totalSize - usedSize).toFixed(2);
      });
      return list;
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.getpageStorage();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.getpageStorage();
    },
    // 计算百分比
    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
    },
  },
};
</script>
<style lang="scss" scoped>
.pageStorage-detail {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>