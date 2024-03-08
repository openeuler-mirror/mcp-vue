<template>
  <!-- 选择计算资源 -->
  <el-drawer
    size="800px"
    :title="$t('workOrder.chooseComputingRes')"
    direction="rtl"
    custom-class="workorder-pass-drawer"
    :wrapper-closable="true"
    :visible.sync="drawerVisible"
    :before-close="handleCloseSelectCluster"
    :destroy-on-close="true"
    append-to-body
    @opened="setTableSelectedCluster"
  >
    <template>
      <div class="drawer-content">
        <div class="service-modify">
          <mc-table
            :data="canClusterList"
            @selection-change="handlerSelectionClusterChange"
            ref="multiTable"
            :rowkey="rowkey"
            :selectionType="selectionType"
          >
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <template v-for="(item, index) in columnArr">
              <el-table-column
                :key="index"
                :resizable="index != 0 && index != columnArr.length - 1"
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
    </template>
  </el-drawer>
</template>

<script>
import mcTable from "@/components/MctablePro";
import footBtn from "@/components/Footbtn";
import ReMessage from "@/utils/message";
export default {
  components: {
    mcTable,
    footBtn,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectedClusterIds: {
      type: String,
      default: "",
    },
    canClusterList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      selectTable: [],
      rowkey: "serverAddr",
      selectionType: "multipleTable",
      columnArr: [
        {
          label: this.$t("workOrder.serverAddr"), // IP地址",
          prop: "serverAddr",
        },
        {
          label: this.$t("workOrder.serverArch"), // 架构",
          prop: "serverArch",
        },
        {
          label: this.$t("workOrder.serverType"), // 类型",
          prop: "serverType",
        },
        {
          label: this.$t("workOrder.cpuModelName"), // CPU类型",
          prop: "cpuModelName",
          tooltipsFlag: true,
        },
        {
          label: this.$t("workOrder.cpuUtil"), // CPU",
          prop: "cpuUtil",
          width: 60,
        },
        {
          label: this.$t("workOrder.memUtil"), // 内存",
          prop: "memUtil",
          width: 60,
        },
        {
          label: this.$t("workOrder.currentSessions"), // 运行云服务器",
          prop: "currentSessions",
        },
        {
          label: this.$t("workOrder.loadaverage"), // 平均负载",
          prop: "loadaverage",
        },
      ],
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  methods: {
    setTableSelectedCluster() {
      let selected = this.selectedClusterIds.split(",");
      for (let i = 0; i < selected.length; i++) {
        let row = this.canClusterList.find(
          (item) => item.serverId === selected[i]
        );
        if (row) {
          this.$refs.multiTable.$refs.elTable.toggleRowSelection(row);
        }
      }
    },
    // 表格勾选
    handlerSelectionClusterChange(selection) {
      this.selectTable = selection;
    },
    // 提交
    handlerConfirm() {
      let length = this.selectTable.length;
      let errMsg = this.$t("workOrder.pchooseComputingRes"); //"请至少勾选一个计算资源节点";
      if (length < 1) {
        ReMessage.error(errMsg);
        return;
      }
      let selectClusterValue = "";
      let selectClusterUuid = "";
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          selectClusterValue += this.selectTable[i].serverAddr;
          selectClusterUuid += this.selectTable[i].serverId;
        } else {
          selectClusterValue += this.selectTable[i].serverAddr + ",";
          selectClusterUuid += this.selectTable[i].serverId + ",";
        }
      }

      this.$emit("handlerConfirm", {
        selectCluster: selectClusterValue,
        selectClusterUuid: selectClusterUuid,
      });
      this.handlerCancel();
    },
    handlerCancel() {
      if (this.selectTable.length > 0) {
        this.$refs.multiTable.$refs.elTable.clearSelection();
      }
      this.selectTable = [];
      this.$emit("update:visible", false);
    },
    handleCloseSelectCluster() {
      this.handlerCancel();
    },
  },
};
</script>



<style lang="scss" scope >
@import "~@/styles/mixin.scss";
@include DrawerRtl;
.service-modify {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  max-height: 82vh;
  padding: 0 50px;
}
</style>
