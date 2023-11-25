<template>
  <div class="app-container">
    <headerBox @refresh="freshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <el-button @click="showAddSite = true">{{
          $t("reliableCenter.addSite")
        }}</el-button>
        <el-button @click="jumpTochild">{{
          $t("reliableCenter.linkManage")
        }}</el-button>
        <el-button
          v-show="!showSearch"
          class="btn-margin"
          @click="showSearch = true"
          icon="el-icon-search"
        >
        </el-button>
        <el-input
          class="btn-margin"
          v-model="searchText"
          prefix-icon="el-icon-search"
          v-show="showSearch"
          @keyup.enter.native="handleSearch"
        >
          <i
            slot="suffix"
            @click="
              showSearch = false;
              searchText = '';
            "
            class="el-input__icon el-icon-close"
          ></i>
        </el-input>
      </template>
    </headerBox>
    <mc-table
      :tableLoading="tableLoading"
      ref="siteManageTable"
      :data="tableData"
      :rowkey="rowkey"
    >
      <template v-for="(item, index) in tableColumns">
        <!-- name -->
        <el-table-column
          v-if="item.prop === 'status'"
          :key="item.label + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <statuscell :status="row.status" />
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
      <el-table-column
        width="300"
        :label="$t('common.operation')"
        className="tableoperation"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-link
            type="primary"
            style="width: 42px"
            @click.stop="delLink(row)"
          >
            {{ $t("common.delete") }}
          </el-link>
        </template>
      </el-table-column>
    </mc-table>

    <addSiteBox :visible.sync="showAddSite" @freshTable="freshTable" />
  </div>
</template>
<script>
import headerBox from "@/components/headerBox";
import statuscell from "@/components/statuscell";
import mcTable from "@/components/MctablePro";
import addSiteBox from "./addSiteBox.vue";
import { drSiteList, delSiteConnect } from "@/api/remoteDisasterRecovery";
export default {
  name: "siteManagement",
  components: { headerBox, mcTable, addSiteBox, statuscell },
  data() {
    return {
      showSearch: false,
      searchText: "",
      tableLoading: false,
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 100,
      rowkey: "siteId",
      showAddSite: false,
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
        // 描述
        {
          label: this.$t("reliableCenter.remark"),
          prop: "remark",
        },
        // 类型
        {
          label: this.$t("monitoring.serverEvtMap.type"),
          prop: "type",
          width: 90,
        },
      ],
    };
  },
  mounted() {
    this.getDrSiteList();
  },
  methods: {
    freshTable() {
      this.getDrSiteList();
    },
    getDrSiteList() {
      this.tableLoading = true;
      drSiteList({ searchKey: this.searchText })
        .then((res) => {
          this.tableData = res;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handleSearch() {
      this.getDrSiteList();
    },
    delLink(row) {
      this.$confirm(
        this.$t("reliableCenter.delSiteTips"),
        this.$t("reliableCenter.delSiteTite"),
        {
          confirmButtonText: this.$t("common.delete"),
          cancelButtonText: this.$t("externalCloud.vmList.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          const params = { siteId: row.siteId };
          delSiteConnect(params).then((res) => {
            this.$message.success(this.$t("common.deleteSuccess"));
            this.freshTable();
          });
        })
        .catch((err) => {
          if (err !== "cancel") {
            this.$message({
              type: "info",
              message: this.$t("externalCloud.vmList.cancel") + handelText,
            });
          }
        });
    },
    jumpTochild() {
      this.$router.push({
        name: "linkManagement",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.ownNotify {
  width: auto;
}
</style>
