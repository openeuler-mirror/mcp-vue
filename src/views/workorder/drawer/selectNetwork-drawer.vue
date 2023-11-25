<template>
  <!-- 选择网络信息 -->
  <el-drawer
    size="880px"
    :title="$t('workOrder.chooseNetworkInfo')"
    direction="rtl"
    :wrapper-closable="true"
    :visible.sync="drawerVisible"
    :before-close="handleCloseSelectNetwork"
    :destroy-on-close="true"
    append-to-body
    @opened="setTableSelectedNetwork"
  >
    <div class="drawer-content">
      <div class="bind-table">
        <mc-table
          :data="tabaleData"
          @selection-change="handlerSelectionNetworkChange"
          :rowkey="rowkey"
          :selectionType="selectionType"
          ref="multiTable"
          style="margin-top: 20px"
        >
          <template v-for="(item, index) in columnArr">
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
              :key="index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <el-tooltip
                  v-if="item.tooltipsFlag"
                  effect="light"
                  :content="row[item.prop] + ''"
                  placement="top"
                  :visible-arrow="true"
                >
                  <span>{{ row[item.prop] }}</span>
                </el-tooltip>
                <span v-else>{{ row[item.prop] }}</span>
              </template>
            </el-table-column>
          </template>
        </mc-table>
      </div>
      <foot-btn
        class="drawer-foot"
        @confirm="handlerConfirm"
        @cancel="handlerCancel"
      />
    </div>
    <networkSpecDetail
      :visible.sync="showSpecDEtail"
      :networkSpecId="networkSpecId"
    ></networkSpecDetail>
  </el-drawer>
</template>

<script>
import mcTable from "@/components/MctablePro";
import footBtn from "@/components/Footbtn";
import ReMessage from "@/utils/message";
import dictionary from "@/assets/common/dataDictionary/dictionary";
import networkSpecDetail from "@/components/networkSpecDetail";
export default {
  components: {
    mcTable,
    footBtn,
    networkSpecDetail,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    networkList: {
      type: Array,
      default: () => [],
    },
    selectedNetworkInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      rowkey: "networkId",
      selectionType: "singleTable",
      drawerVisible: this.visible,
      tabaleData: [],
      selectTable: [],
      selectNetworkName: "",
      showSpecDEtail: false,
      showSpecDEtail: false,
      networkSpecId: null,
      selectNetworkId: 0,
      columnArr: [
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
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      this.$nextTick(() => {
        this.$refs.multiTable && this.$refs.multiTable.calcTableHeight();
      });
    },
    networkList(val) {
      this.tabaleData = JSON.parse(JSON.stringify(val));
    },
  },
  created() {},
  methods: {
    getsecurityPolicyDesc(securityPolicy) {
      return dictionary.getDesc(securityPolicy, dictionary.securityPolicyArr);
    },
    setTableSelectedNetwork() {
      let selected = this.selectedNetworkInfo.networkId;
      this.$refs.multiTable.$refs.elTable.clearSelection();

      let row = this.networkList.find((item) => item.networkId === selected);
      if (row) {
        this.$refs.multiTable.$refs.elTable.toggleRowSelection(row);
      }
    },
    // 表格勾选
    handlerSelectionNetworkChange(selection) {
      this.selectTable = selection;
    },

    // 提交
    handlerConfirm() {
      let length = this.selectTable.length;
      let errMsg = this.$t("workOrder.pchooseNetworkInfo"); //"请至少勾选一个网络配置";
      if (length < 1) {
        ReMessage.error(errMsg);
        return;
      }
      let obj = JSON.parse(JSON.stringify(this.selectedNetworkInfo));
      obj.networkId = this.selectTable[0].networkSpecId;
      obj.networkName = this.selectTable[0].networkName;
      obj.networkType =
        this.selectTable[0].networkLevelType === "LAYER_3_NETWORK"
          ? "l3Network"
          : "l2Network";
      this.$emit("handlerConfirm", obj);
      this.handlerCancel();
    },
    handlerCancel() {
      if (this.selectTable.length > 0) {
        this.$refs.multiTable.$refs.elTable.clearSelection();
      }
      this.selectTable = [];
      this.handleCloseSelectNetwork();
    },
    toDetail(row) {
      this.networkSpecId = row.networkSpecId;
      this.showSpecDEtail = true;
    },
    handleCloseSelectNetwork() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.bind-table {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  // max-height: 82vh;
  padding: 20px 30px;
  .demo-table-expand {
    box-shadow: 0px 0px 4px 3px #ededed;
    padding: 10px;
  }
}
</style>
