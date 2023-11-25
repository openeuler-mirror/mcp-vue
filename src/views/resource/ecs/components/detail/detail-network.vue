<template>
  <div class="detailLog">
    <mc-table
      ref="detailLog"
      :data="tableData"
      :total="total"
      :short-height="60"
      :rowkey="rowkey"
    >
      <el-table-column
        v-for="(item, index) in columnArr"
        :key="index"
        :width="item.width"
        :label="item.label"
      >
        <template slot-scope="{ row, column, $index }">
          <!-- 网卡 -->
          <span v-if="item.prop == 'networkName'">
            {{ $t("resourceMgr.network.networkCard") }}{{ $index + 1 }}
          </span>
          <span v-else>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>
    </mc-table>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import { serverVmNetwork } from "@/api/serverVm";
export default {
  components: {
    mcTable,
  },
  data() {
    return {
      rowkey: "",
      columnArr: [
        {
          label: this.$t("resourceMgr.network.networkName"), // "网络名称",
          prop: "networkName",
        },
        {
          label: this.$t("resourceMgr.network.virtualSwitch"), // "虚拟交换机",
          prop: "virtualSwitch",
        },
        {
          label: this.$t("resourceMgr.network.portGroup"), // "所属端口组",
          prop: "portGroup",
        },
        {
          label: this.$t("resourceMgr.network.macAddress"), // "MAC地址",
          prop: "macAddress",
        },
        {
          label: this.$t("resourceMgr.network.ipAddress"), // "IP地址",
          prop: "ipAddress",
        },
        {
          label: this.$t("resourceMgr.network.pool"), // "地址池",
          prop: "pool",
        },
        {
          label: this.$t("resourceMgr.network.uploadSpend"), // "下行带宽(KB/S)",
          prop: "uploadSpend",
        },
        {
          label: this.$t("resourceMgr.network.downloadSpend"), // "上行带宽(KB/S)",
          prop: "downloadSpend",
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
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
    renderTable() {
      let serverVmUuid = this.serverVmUuid;
      serverVmNetwork({ serverVmUuid, clusterId: this.clusterId }).then(
        (res) => {
          this.tableData = res;
        }
      );
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
