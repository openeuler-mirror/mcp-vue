<template>
  <el-drawer
    size="900px"
    :title="$t('reliableCenter.addSite')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <div class="drawer-body-content" v-loading="drawLoading">
      <div class="flex align-center top-tips">
        <span> {{ $t("resourceMgr.zoneNoClusterTo") }}</span>
        <el-link type="primary" @click="toCreateCluser">
          {{ $t("resourceMgr.clusterAdd") }}
        </el-link>
      </div>
      <mc-table
        ref="siteManageTable"
        :data="tableData"
        :rowkey="rowkey"
        selectionType="multipleTable"
        @selection-change="handlerSelectionChange"
      >
        <template v-for="(item, index) in tableColumns">
          <!-- name -->
          <el-table-column
            v-if="item.prop != 'status'"
            :key="item.label + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <span>{{ row[item.prop] || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="item.label + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <statuscell :status="row.status" />
            </template>
          </el-table-column>
        </template>
      </mc-table>
    </div>
    <div class="drawer-foot">
      <el-button type="primary" @click="handelSubmit">{{
        $t("externalCloud.vmOperate.sure")
      }}</el-button>
      <el-button @click="handleCloseCreate">{{
        $t("externalCloud.vmOperate.cancel")
      }}</el-button>
    </div>
  </el-drawer>
</template>

<script>
import mcTable from "@/components/MctablePro";
import statuscell from "@/components/statuscell";
import { getClusterList, addCluster } from "@/api/remoteDisasterRecovery";
export default {
  name: "addSiteBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: { mcTable, statuscell },
  data() {
    return {
      drawerVisible: this.visible,
      selectTable: [],
      tableData: [],
      rowkey: "clusterId",
      drawLoading: false,
      tableColumns: [
        // 站点名称
        {
          label: this.$t("reliableCenter.siteName"),
          prop: "name",
          width: 300,
        },
        // 状态
        {
          label: this.$t("imageMgr.status"),
          prop: "status",
        },

        // 类型
        {
          label: this.$t("monitoring.serverEvtMap.type"),
          prop: "type",
          width: 90,
        },
        // 备注
        {
          label: this.$t("reliableCenter.remark"),
          prop: "remark",
        },
      ],
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.getClusterList();
      }
    },
  },
  mounted() {
    this.getClusterList();
  },
  methods: {
    toCreateCluser() {
      this.$router.replace({
        name: "physicalCluster",
      });
    },
    getClusterList() {
      this.drawLoading = true;
      getClusterList()
        .then((res) => {
          this.tableData = res;
        })
        .finally(() => {
          this.drawLoading = false;
        });
    },
    handleCloseCreate() {
      this.$emit("update:visible", false);
    },
    handlerSelectionChange(selection) {
      this.selectTable = selection;
    },
    handelSubmit() {
      this.drawLoading = true;
      const arr = this.selectTable.map((item) => item.clusterId);
      const params = {
        clusterIds: arr.join(","),
      };
      addCluster(params)
        .then((res) => {
          this.$message.success(this.$t("reliableCenter.addSiteSuccess"));
          this.handleCloseCreate();
          this.$emit("freshTable");
        })
        .finally(() => {
          this.drawLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.top-tips {
  margin-bottom: 10px;
}
</style>
