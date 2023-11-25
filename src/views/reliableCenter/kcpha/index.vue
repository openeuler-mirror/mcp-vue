<template>
  <div class="app-container">
    <headerBox @refresh="renderTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <el-button v-if="kcpRole === 'master'" @click="showAddSite = true">{{
          $t("reliableCenter.addStandyAdd")
        }}</el-button>
      </template>
    </headerBox>
    <mc-table
      :tableLoading="tableLoading"
      :data="tableData"
      rowkey="ipAddress"
      style="margin-top: 20px"
    >
      <el-table-column prop="ipAddress" label="KCP_URL"> </el-table-column>
      <el-table-column
        prop="nodeType"
        :label="$t('reliableCenter.standySlaveShip')"
      >
        <template slot-scope="{ row }">
          <span>{{ getTypeText(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('resourceMgr.vMwareMgr.powerStatus')"
      >
        <template slot-scope="{ row }">
          <statuscell :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        :label="$t('resourceMgr.task.action')"
        className="tableoperation"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-link
            v-if="
              kcpRole === 'master' &&
              row.nodeType === 'slave' &&
              row.status !== 'INIT'
            "
            type="primary"
            style="width: 42px; text-align: left"
            @click.stop="delLink(row)"
          >
            {{ $t("resourceMgr.deleteconfirmTit") }}
          </el-link>
          <el-link
            type="primary"
            style="text-align: left"
            v-if="
              kcpRole === 'slave' && row.nodeType === 'slave' && mainOffLine
            "
            @click.stop="changeLink2Main(row)"
          >
            {{ $t("reliableCenter.Switch") }}
          </el-link>
        </template>
      </el-table-column>
    </mc-table>
    <addKcp :visible.sync="showAddSite" @freshTable="renderTable" />
  </div>
</template>

<script>
import headerBox from "@/components/headerBox";
import statuscell from "@/components/statuscell";
import mcTable from "@/components/MctablePro";
import addKcp from "./addKcp.vue";
import {
  handelGetKcpHa,
  handelDelKcpHa,
  handelChangeToMaster,
} from "@/api/remoteDisasterRecovery";
export default {
  name: "kcpha",
  components: { headerBox, statuscell, mcTable, addKcp },
  props: {},
  data() {
    return {
      showAddSite: false,
      mainOffLine: false, //主站点是否离线
      tableLoading: false,
      kcpRole: null,
      tableData: [],
    };
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.kcpRole = userInfo.kcpRole || "master";
  },
  mounted() {
    this.renderTable();
  },
  methods: {
    renderTable() {
      this.tableLoading = true;
      handelGetKcpHa()
        .then((res) => {
          res.forEach((e) => {
            //哦按段主站点是否离线
            if (e.nodeType === "master") {
              this.mainOffLine = e.status === "OFFLINE";
            }
          });
          this.tableData = res;
        })
        .finally((res) => {
          this.tableLoading = false;
        });
    },
    changeLink2Main() {
      this.$confirm(
        this.$t("reliableCenter.promotedTips"),
        this.$t("common.tips"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          handelChangeToMaster().then((res) => {
            this.$message({
              type: "success",
              message: this.$t("reliableCenter.promotedSuccess"),
            });
            location.reload();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("reliableCenter.cancelPromoted"),
          });
        });
    },
    delLink() {
      this.$confirm(this.$t("reliableCenter.delNode"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        handelDelKcpHa().then((res) => {
          this.$message({
            type: "success",
            message: this.$t("common.deleteSuccess"),
          });
          this.renderTable();
        });
      });
    },
    getTypeText(row) {
      const textArr = {
        master: [
          this.$t("reliableCenter.masterNoe"),
          this.$t("reliableCenter.slave"),
        ],
        slave: [
          this.$t("reliableCenter.main"),
          this.$t("reliableCenter.slaveNow"),
        ],
      };
      const finalText = textArr[this.kcpRole];
      const typeText = row.nodeType === "master" ? finalText[0] : finalText[1];
      return typeText;
    },
  },
};
</script>
<style lang="scss" scoped></style>
