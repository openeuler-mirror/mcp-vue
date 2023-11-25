<template>
  <el-drawer
    size="900px"
    :title="
      type === 'master'
        ? $t('reliableCenter.primarySite')
        : $t('reliableCenter.secSiteList')
    "
    direction="rtl"
    custom-class=""
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-body-content" v-loading="drawerLoading">
      <mc-table :data="tableData" rowkey="recoverPointId">
        <template v-for="(item, index) in columnArr">
          <!-- 备份大小 -->
          <el-table-column
            v-if="item.prop === 'backupSize'"
            :key="item.prop + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <div>{{ convertSize(row[item.prop]) }}</div>
            </template>
          </el-table-column>
          <!-- 备份方式 -->
          <el-table-column
            v-else-if="item.prop === 'backupFileType'"
            :key="item.prop + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <div>
                {{
                  row[item.prop] === "FULL_BACKUP"
                    ? $t("reliableCenter.fullBackup")
                    : $t("reliableCenter.incBackup")
                }}
              </div>
            </template>
          </el-table-column>
          <!-- 备份方式 -->
          <el-table-column
            v-else-if="item.prop === 'backupFileStatus'"
            :key="item.prop + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <div>
                {{
                  row[item.prop] === "NORMAL"
                    ? $t("reliableCenter.normal")
                    : $t("reliableCenter.deleting")
                }}
              </div>
            </template>
          </el-table-column>
          <!-- 其他站点状态 -->
          <el-table-column
            v-else-if="item.prop === 'otherClusterStatus'"
            :key="item.prop + index"
            :label="
              type === 'master'
                ? $t('reliableCenter.backupSiteStatus')
                : $t('reliableCenter.mainSiteStatus')
            "
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <div>
                {{ getOtherText(row[item.prop]) }}
              </div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            v-else-if="item.prop === 'opreation'"
            :key="item.prop + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <el-link
                v-if="
                  row.otherClusterStatus === 'NONEXIST' &&
                  row.backupFileStatus === 'NORMAL'
                "
                type="primary"
                @click.stop="synchronization(row)"
              >
                {{ $t("reliableCenter.synTo")
                }}{{
                  type === "master"
                    ? $t("reliableCenter.secSiteList")
                    : $t("reliableCenter.primarySite")
                }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="item.prop + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <div>
                <statuscell
                  v-if="item.prop === 'machineStatus'"
                  :status="row.machineStatus"
                />
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
  </el-drawer>
</template>
<script>
import mcTable from "@/components/MctablePro";
import statuscell from "@/components/statuscell";
import {
  backupDataList,
  handelRpoBackupFile,
} from "@/api/remoteDisasterRecovery";
export default {
  name: "recoverModel",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    planMachineId: {
      type: String,
      default: "",
    },
    clusterId: {
      type: Number,
      default: 1,
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
        // "备份文件名称"
        {
          label: this.$t("reliableCenter.backName"),
          prop: "backupName",
        },
        // 备份路径
        {
          label: this.$t("reliableCenter.backPath"),
          prop: "backupPath",
        },
        // 备份方式
        {
          label: this.$t("reliableCenter.backMode"),
          prop: "backupFileType",
        },
        // 备份大小
        {
          label: this.$t("reliableCenter.backSize"),
          prop: "backupSize",
        },
        // 备份文件状态
        {
          label: this.$t("reliableCenter.backupFileStatus"),
          prop: "backupFileStatus",
        },
        // 其他站点状态
        {
          label:
            this.type === "master"
              ? this.$t("reliableCenter.backupSiteStatus")
              : this.$t("reliableCenter.mainSiteStatus"),
          prop: "otherClusterStatus",
        },
        // 备份完成时间
        {
          label: this.$t("reliableCenter.backComTime"),
          prop: "endTime",
        },
        // 操作
        {
          label: this.$t("common.operation"),
          prop: "opreation",
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
      backupDataList({
        clusterId: this.clusterId,
        planMachineId: this.planMachineId,
      })
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
    getOtherText(status) {
      const rowStatus = {
        NONEXIST: this.$t("reliableCenter.notExist"),
        NORMAL: this.$t("reliableCenter.normal"),
        RPOING: this.$t("reliableCenter.RPOSyncing"),
        DELETING: this.$t("reliableCenter.deleting"),
      };
      return rowStatus[status];
    },
    convertSize(sizeInKB) {
      const units = ["KB", "MB", "GB"];
      let unitIndex = 0;

      while (sizeInKB >= 1024 && unitIndex < units.length - 1) {
        sizeInKB /= 1024;
        unitIndex++;
      }

      return sizeInKB.toFixed(2) + units[unitIndex];
    },
    synchronization(e) {
      const { backupName, coverName, recoverPointId, otherClusterName } = e;
      const siteName =
        this.type === "master"
          ? this.$t("reliableCenter.secondarySite")
          : this.$t("reliableCenter.primarySite");
      this.$confirm(
        `${this.$t("reliableCenter.will")}“${backupName}”${this.$t(
          "reliableCenter.syncTo"
        )}${siteName}“${otherClusterName}”`,
        `${this.$t("reliableCenter.confirmSyncTo")} ${siteName} ${this.$t(
          "reliableCenter.data"
        )}？`,
        {
          confirmButtonText: this.$t("reliableCenter.confirm"),
          cancelButtonText: this.$t("reliableCenter.cancel"),
          type: "warning",
        }
      ).then(() => {
        const params = { recoverPointId };
        handelRpoBackupFile(params).then((res) => {
          this.$message({
            type: "success",
            message: this.$t("reliableCenter.syncSubmitted"),
          });
          this.getbackupServerList();
        });
      });
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
.drawer-content {
  padding: 10px 20px;
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
</style>
