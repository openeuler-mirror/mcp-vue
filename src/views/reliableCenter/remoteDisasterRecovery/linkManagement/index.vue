<template>
  <div class="app-container">
    <headerBox @refresh="freshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <!-- 添加站点 -->
        <el-button @click="handelShowAddSite">{{
          $t("reliableCenter.addLink")
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
            @click="showSearch = false"
            class="el-input__icon el-icon-close"
          ></i>
        </el-input>
      </template>
    </headerBox>
    <mc-table :data="tableData" :tableLoading="tableLoading" :rowkey="rowkey">
      <template v-for="(item, index) in tableColumns">
        <el-table-column
          v-if="item.prop === 'broadbandLimitFlag'"
          :key="item.label + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span v-if="row['broadbandLimitFlag']">{{
              row["broadbandLimit"] + "Mbps" || "-"
            }}</span>
            <span v-else>{{ $t("reliableCenter.unlimited") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.prop === 'linkStatus'"
          :key="item.label + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <div>
              <div v-if="row.linkStatus !== 'ERROR'">
                <i :class="getStatus(row.linkStatus, 1)"></i>
                <span>{{ getStatus(row.linkStatus, 2) }}</span>
              </div>
              <el-popover
                v-else
                placement="bottom"
                width="auto"
                trigger="hover"
              >
                <div>
                  <div v-for="(el, num) in row.errorList" :key="num">
                    <i class="el-icon-warning yellow-icon"></i>
                    <span>{{ el }}</span>
                  </div>
                </div>
                <div slot="reference">
                  <i :class="getStatus(row.linkStatus, 1)"></i>
                  <span>{{ getStatus(row.linkStatus, 2) }}</span>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <!-- name -->
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
            @click.stop="editLink(row)"
          >
            {{ $t("reliableCenter.edit") }}
          </el-link>
          <el-link type="primary" @click.stop="testLink(row)">
            {{ $t("reliableCenter.conTest") }}
          </el-link>
          <el-link
            type="primary"
            style="width: 42px"
            @click.stop="delLink(row)"
          >
            {{ $t("reliableCenter.delete") }}
          </el-link>
        </template>
      </el-table-column>
    </mc-table>
    <addLinkBox :visible.sync="showAddSite" @freshTable="freshTable" />
    <editLinkBox
      :visible.sync="showEditLink"
      :targetLink="targetLink"
      @freshTable="freshTable"
    />
    <testLinkBox :visible.sync="showTestLink" :targetLink="targetLink" />
  </div>
</template>
<script>
import headerBox from "@/components/headerBox";
import mcTable from "@/components/MctablePro";
import addLinkBox from "./addLinkBox.vue";
import editLinkBox from "./editLinkBox.vue";
import testLinkBox from "./testLinkBox.vue";
import { linkSiteList, delLinkConnect } from "@/api/remoteDisasterRecovery";
export default {
  name: "linkManagement",
  components: { headerBox, mcTable, addLinkBox, testLinkBox, editLinkBox },
  data() {
    return {
      tableLoading: false,
      showSearch: false,
      showTestLink: false,
      showAddSite: false,
      showEditLink: false,
      searchText: "",
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 100,
      rowkey: "clusterId",
      targetLink: {
        masterSiteName: "",
        slaveSiteName: "",
      },
      tableColumns: [
        // 站点1
        {
          label: this.$t("reliableCenter.site1"),
          prop: "masterSiteName",
          width: 300,
        },
        // 站点2
        {
          label: this.$t("reliableCenter.site2"),
          prop: "slaveSiteName",
        },
        // 描述
        {
          label: this.$t("reliableCenter.linkStatusSite"),
          prop: "linkStatus",
        },
        // 类型
        {
          label: this.$t("reliableCenter.transRateLim"),
          prop: "broadbandLimitFlag",
        },
      ],
    };
  },
  mounted() {
    this.getDrSiteList();
  },
  methods: {
    handelShowAddSite() {
      this.showAddSite = true;
    },
    freshTable() {
      this.getDrSiteList();
    },
    getDrSiteList() {
      this.tableLoading = true;
      linkSiteList({ searchKey: this.searchText })
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
    editLink(row) {
      this.targetLink = row;
      this.showEditLink = true;
    },
    testLink(row) {
      this.targetLink = row;
      this.showTestLink = true;
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
          const params = { siteLinkId: row.siteLinkId };
          delLinkConnect(params).then((res) => {
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
    getStatus(row, type) {
      switch (row) {
        case "CHECKING":
          return type === 1
            ? "el-icon-info blue-icon"
            : this.$t("reliableCenter.underDete");
        case "NORMAL":
          return type === 1
            ? "el-icon-success green-icon"
            : this.$t("reliableCenter.normal");
        case "ERROR":
          return type === 1
            ? "el-icon-warning yellow-icon"
            : this.$t("reliableCenter.anomaly");
      }
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
.blue-icon {
  color: #409eff;
}
.green-icon {
  color: #67c23a;
}
.yellow-icon {
  color: #e6a23c !important;
}
</style>
