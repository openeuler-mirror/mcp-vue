<template>
  <!-- pageStorage -->
  <div class="pageStorage-detail">
    <div class="top-tips" v-if="showfirstVdc">
      <!-- 没有合适的网络规格? 前往 -->
      {{ $t("resourceMgr.network.addNetTop1") }}
      <el-link type="primary" @click="toClurster">{{
        $t("resourceMgr.zoneClusterDesc")
      }}</el-link
      >,
      {{ $t("resourceMgr.network.addNetTop2") }}
    </div>
    <mc-table
      ref="selectNetSpecTable"
      :data="tableData"
      :rowkey="rowkey"
      selectionType="multipleTable"
      @handleSelectione="handleSelectione"
    >
      <template v-for="(item, index) in tableColumns">
        <!-- 状态 -->
        <el-table-column
          v-if="item.prop == 'opr'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <el-link type="primary" @click="toDetail(row)">
              {{ $t("resourceMgr.task.detail") }}</el-link
            >
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
    <networkSpecDetail
      :visible.sync="showSpecDEtail"
      :networkSpecId="networkSpecId"
    ></networkSpecDetail>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import networkSpecDetail from "@/components/networkSpecDetail";
import { getVcenterStorageList } from "@/api/vcenter";
export default {
  name: "selectNetSpecList",
  components: { mcTable, networkSpecDetail },
  props: {
    dataInfo: {
      type: Object,
      default: () => ({}),
    },
    netPecArr: {
      type: Array,
      default: [],
    },
    selectedNetworkIds: {
      type: Array,
      default: () => [],
    },
    showfirstVdc: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rowkey: "serverId",
      pageInfo: {},
      showSpecDEtail: false,
      networkSpecId: "",
      vcenterId: this.$route.params.id,
      tableColumns: [
        // 网络规格名称 描述 物理集群 操作
        {
          label: this.$t("resourceMgr.network.netSpecName"),
          prop: "networkName",
        },
        {
          label: this.$t("resourceMgr.vMwareMgr.remark"),
          prop: "networkDescription",
        },
        { label: this.$t("resourceMgr.zoneClusterDesc"), prop: "clusterName" },
        { label: this.$t("resourceMgr.task.action"), prop: "opr" },
      ],
      tableData: this.netPecArr,
      selectTableData: [],
    };
  },
  created() {
    if (this.selectedNetworkIds.length > 0) {
      this.netPecArr.forEach((e) => {
        if (this.selectedNetworkIds.indexOf(e.networkSpecId) >= 0) {
          this.$nextTick(() => {
            this.$refs.selectNetSpecTable.$refs.elTable.toggleRowSelection(
              e,
              true
            );
          });
        }
      });
    }
  },
  methods: {
    toDetail(row) {
      this.networkSpecId = row.networkSpecId;
      this.showSpecDEtail = true;
    },
    toClurster() {
      this.$router.push({
        name: "physicalCluster",
      });
    },
    handleSelectione(e) {
      this.$emit("change", e);
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
.top-tips {
  margin-bottom: 10px;
}
</style>
