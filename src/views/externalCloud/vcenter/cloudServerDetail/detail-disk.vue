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
        <template slot-scope="{ row }">
          <!-- 存储 -->
          <span v-if="item.prop == 'diskName'">
            {{ $t("resourceMgr.clusterStorage") }}
          </span>
          <span v-if="item.prop == 'provisionType'">{{
            device[row[item.prop]]
          }}</span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>
    </mc-table>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import { getServerDiskListData } from "@/api/vcenter";
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
          label: this.$t("resourceMgr.storage.diskName"), // "名称",
          prop: "diskName",
          width: "250px",
        },
        {
          label: this.$t("resourceMgr.storage.diskCapacity"), // "容量(G)",
          prop: "diskCapacity",
          width: "250px",
        },
        {
          label: this.$t("externalCloud.disk.sourceFile"), // "磁盘文件",
          prop: "diskFile",
        },
        {
          label: this.$t("externalCloud.disk.provisionMode"), // "制备方式",
          prop: "provisionType",
          width: "250px",
        },
      ],
      tableData: [],
      serverVmUuid: this.$route.params.id,
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      device: {
        0: this.$t("externalCloud.disk.provisioningDeferredZeroing"),
        1: this.$t("externalCloud.disk.setForQuickZeroing"),
        2: this.$t("externalCloud.disk.leanProvisioning"),
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
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.vmName,
      };
      getServerDiskListData(params).then((res) => {
        this.tableData = res;
      });
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
