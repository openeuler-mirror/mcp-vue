<template>
  <el-drawer
    size="880px"
    :title="$t('reliableCenter.backupServerLoc')"
    direction="rtl"
    custom-class=""
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content">
        <!-- 主站点、备站点 -->
        <div class="top-title">
          <span>{{
            type === "masterSiteId"
              ? $t("reliableCenter.primarySite") + "："
              : $t("reliableCenter.secondarySite") + "："
          }}</span>
          <span>{{ siteName }}</span>
        </div>
        <mc-table
          :data="tableData"
          rowkey="machineUuid"
          selectionType="singleTable"
          @selection-change="handleSelectione"
        >
          <template v-for="(item, index) in columnArr">
            <el-table-column
              :key="item.prop + index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <div>
                  <!-- <statuscell
                    v-if="item.prop === 'machineStatus'"
                    :status="row.machineStatus"
                  /> -->
                  <span v-if="item.prop === 'mountStatus'">{{
                    row["mountStatus"] ? "挂载" : "未挂载"
                  }}</span>
                  <span v-else>{{ row[item.prop] }}</span>
                </div>
              </template>
            </el-table-column>
          </template>
        </mc-table>
      </div>

      <div class="drawer-foot">
        <el-button type="primary" @click="handelSubmit">{{
          $t("externalCloud.vmOperate.sure")
        }}</el-button>
        <el-button @click="handelClose">{{
          $t("externalCloud.vmOperate.cancel")
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import mcTable from "@/components/MctablePro";
import statuscell from "@/components/statuscell";
import { getbackupServerList } from "@/api/commonApi";
export default {
  name: "chooseLocation",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    clusterId: {
      type: Number,
      default: 1,
    },
    siteName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      tableData: [],
      selectData: [],
      drawerLoading: false,
      columnArr: [
        // "备份服务器"
        {
          label: this.$t("reliableCenter.backupServer"),
          prop: "sharePath",
        },
        // 状态
        {
          label: this.$t("reliableCenter.state"),
          prop: "mountStatus",
        },
        // 总容量
        {
          label: this.$t("reliableCenter.totalCapacity"),
          prop: "total",
        },
        // 可用空间
        {
          label: this.$t("reliableCenter.availableSpace"),
          prop: "canUse",
        },
      ],
    };
  },
  components: { mcTable, statuscell },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.getbackupServerList();
      }
    },
  },
  methods: {
    getbackupServerList() {
      this.drawerLoading = true;
      getbackupServerList({ clusterId: this.clusterId })
        .then((res) => {
          this.tableData = res;
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
    handelClose() {
      this.$emit("update:visible", false);
    },
    handelSubmit() {
      this.$emit("selectChange", this.selectData);
      this.handelClose();
    },
    handleSelectione(e) {
      this.selectData = e;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-title {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 15px;
}
.top-vm-content {
  width: 100%;
  padding: 10px;
  border: 1px solid #eee;
  border-bottom: none;
  .top-vm-operate {
    display: flex;
    justify-content: space-between;
    p {
      margin: 0;
    }
    .del-btn {
      color: $btnBg;
      cursor: pointer;
    }
  }
  .top-vm-seleced-infor {
    display: flex;
    flex-wrap: wrap;
  }
  .select-data-infor {
    padding: 5px;
    border: 1px solid #d9d6d6;
    border-radius: 3px;
    cursor: pointer;
    margin-left: 5px;
    margin-top: 10px;
  }
  .none-text {
    text-align: center;
    width: 100%;
    line-height: 20px;
  }
}
.vm-tree-select-content {
  display: flex;
  flex: 1;
  border: 1px solid #eee;
  .left-tree {
    border-right: 1px solid #eee;
  }
  .right-table {
    flex: 1;
    height: 100%;
  }
}
.left-tree {
  width: 200px;
}
.left-server-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .node-count {
    margin-left: 20px;

    i {
      padding: 2px;
      border: 1px solid #333;
      margin-left: 3px;
      color: #333;
      font-size: 10px;
      transform: scale(0.8);
    }

    i:hover {
      color: #409eff;
      border-color: #409eff;
    }
  }
}
// .node-label {
//   flex: 1;
//   position: relative;
//   margin: 0 5px;
//   height: 30px;
//   .node-label-abs {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     overflow: hidden;
//     white-space: nowrap;
//     text-overflow: ellipsis;
//     line-height: 36px;

//     .el-tooltip {
//       display: inline-block;
//       max-width: 100%;
//       width: max-content;
//       height: 100%;
//       line-height: 36px;
//       overflow: hidden;
//       white-space: nowrap;
//       text-overflow: ellipsis;
//     }
//   }
// }
</style>
