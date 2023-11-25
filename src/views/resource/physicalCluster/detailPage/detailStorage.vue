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
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ getStorageUsage(row.usage) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop == 'available'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span v-if="row.available"
              ><i class="el-icon-circle-check" style="color: #67c23a"></i>
              {{ $t("resourceMgr.storage.enable") }}</span
            >
            <span v-else
              ><i class="el-icon-circle-close" style="color: #f56c6c"></i
              >{{ $t("resourceMgr.storage.disable") }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="item.prop == 'opr'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <el-button @click="changeStatus(row)" type="text" class="">{{
              row.available
                ? $t("resourceMgr.storage.disable")
                : $t("resourceMgr.storage.enable")
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
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
import { pageStorage, changeClusterUse } from "@/api/clusterapi";
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
        // 启用状态
        {
          label: this.$t("resourceMgr.storage.enableState"),
          prop: "available",
        },
        {
          label: this.$t("resourceMgr.task.action"),
          prop: "opr",
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
    changeStatus(row) {
      const wayText = row.available
        ? this.$t("resourceMgr.storage.disable")
        : this.$t("resourceMgr.storage.enable");
      const tipsText =
        this.$t("resourceMgr.storage.sure") + wayText + row.name + "?";
      const confirmText = row.available
        ? this.$t("resourceMgr.storage.disTips")
        : this.$t("resourceMgr.storage.enableTips");
      this.$confirm(confirmText, tipsText, {
        confirmButtonText: this.$t("resourceMgr.storage.sure"),
        cancelButtonText: this.$t("resourceMgr.storage.cancel"),
        type: "warning",
      }).then(() => {
        const { id, name, available } = row;
        changeClusterUse({
          clusterId: this.pageInfo.clusterId,
          storageId: id,
          storageName: name,
          status: !available,
        }).then((res) => {
          this.getpageStorage();
          this.$message({
            type: "success",
            message: `${wayText}${this.$t("resourceMgr.storage.success")}!`,
          });
        });
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
