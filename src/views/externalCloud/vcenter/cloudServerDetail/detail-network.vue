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
        <template slot-scope="{ row, $index }">
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
import { getServerNetListData } from "@/api/vcenter";
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
          label: this.$t("externalCloud.network.networkName"), // "网络名称",
          prop: "networkDeviceName",
        },
        {
          label: this.$t("externalCloud.network.modelType"), // "网卡型号",
          prop: "networkCardModel",
        },
        {
          label: this.$t("externalCloud.network.macAddress"), // "MAC地址",
          prop: "macAddress",
        },
        {
          label: this.$t("externalCloud.network.ipAddress"), // "IP地址",
          prop: "ipAddress",
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
    this.renderTable();
  },
  methods: {
    renderTable() {
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.vmName,
      };
      getServerNetListData(params).then((res) => {
        this.tableData = res;
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
