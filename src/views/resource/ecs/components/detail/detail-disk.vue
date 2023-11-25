<template>
  <div class="detailDisk">
    <mc-table
      ref="detailDisk"
      :data="tableData"
      :total="total"
      :short-height="60"
      @current-change="handlePageChange"
      :rowkey="rowkey"
    >
      <el-table-column
        v-for="(item, index) in columnArr"
        :key="index"
        :width="item.width"
        :label="item.label"
      >
        <template slot-scope="{ row, column, $index }">
          <!-- 存储 -->
          <span v-if="item.prop == 'diskName'">
            {{ $t("resourceMgr.clusterStorage") }}{{ $index + 1 }}
          </span>
          <span v-if="item.prop == 'device'">{{ device[row[item.prop]] }}</span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>
    </mc-table>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import { serverVmDisk } from "@/api/serverVm";
export default {
  components: {
    mcTable,
  },
  data() {
    return {
      rowkey: "",
      columnArr: [
        {
          label: this.$t("resourceMgr.storage.diskName"), // "名称",
          prop: "diskName",
          width: "250px",
        },
        {
          label: this.$t("resourceMgr.storage.device"), // "存储类型",
          prop: "device",
          width: "250px",
        },
        {
          label: this.$t("resourceMgr.storage.targetBus"), // "存储控制器",
          prop: "targetBus",
          width: "250px",
        },
        {
          label: this.$t("resourceMgr.storage.diskCapacity"), // "容量(G)",
          prop: "diskCapacity",
          width: "250px",
        },
        {
          label: this.$t("resourceMgr.storage.sourceFile"), // "存储路径",
          prop: "sourceFile",
        },
      ],
      tableData: [],
      serverVmUuid: this.$route.params.id,
      clusterId: this.$route.params.cid,
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      device: {
        raw: this.$t("resourceMgr.storage.raw"), // "块设备",
        existed: this.$t("resourceMgr.storage.existed"), // " 本地磁盘",
        qcow2: this.$t("resourceMgr.storage.qcow2"), // "本地磁盘",
      },
      // 枚举: raw,existed,qcow2

      // 枚举备注: raw 块设备 existed 本地磁盘 qcow2本地磁盘
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
    handlePageChange(page) {
      this.pageNo = +page;
      this.renderTable();
    },
    renderTable() {
      let pageNo = this.pageNo;
      let pageSize = this.pageSize;
      let serverVmUuid = this.serverVmUuid;
      let clusterId = this.clusterId;
      serverVmDisk({ pageNo, pageSize, serverVmUuid, clusterId }).then(
        (res) => {
          this.tableData = res;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.detailDisk {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
