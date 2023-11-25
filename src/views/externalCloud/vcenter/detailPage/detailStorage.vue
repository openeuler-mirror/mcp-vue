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
        <!-- 状态 -->
        <el-table-column
          v-if="item.prop == 'storageStatus'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span v-if="row.storageStatus === 1" class="success">
              <!-- 正常 -->
              {{ $t("externalCloud.statuscell.NORMAL") }}
            </span>
            <span v-else class="error">
              <!-- 异常 -->
              {{ $t("externalCloud.statuscell.HALT") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="item.prop == 'storageCapacityUsedRate'"
          :key="item.prop + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: row.storageCapacityUsedRate,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :key="item.label + index"
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
import { getVcenterStorageList } from "@/api/vcenter";
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
      vcenterId: this.$route.params.id,
      tableColumns: [
        // "存储名称"
        { label: this.$t("resourceMgr.storageName"), prop: "storageName" },
        // 存储类型
        { label: this.$t("resourceMgr.storageType"), prop: "storageType" },
        // 存储状态
        {
          label: this.$t("resourceMgr.storageStatus"),
          prop: "storageStatus",
        },
        // 总容量
        {
          label: this.$t("resourceMgr.storagetotalSize") + "(GB)",
          prop: "storageTotalCapacity",
        },
        // 可用容量
        {
          label: this.$t("resourceMgr.storageUsedSize") + "(GB)",
          prop: "storageFreeCapacity",
        },
        // 利用率
        {
          label: this.$t("resourceMgr.storageUserate"),
          prop: "storageCapacityUsedRate",
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
        vcenterId: this.vcenterId,
      };
      getVcenterStorageList(pramas)
        .then((res) => {
          this.tableData = res;
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
.success {
  color: $msgSuccess;
}
.error {
  color: $msgDanger;
}
.pageStorage-detail {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>