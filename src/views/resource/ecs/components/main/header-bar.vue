<template>
  <div class="header-box">
    <div class="header-left">
      <el-button
        v-if="currentBtnShow('start_servervm')"
        :disabled="batchStartDisabled"
        @click="startService"
      >
        <!-- 开机 -->
        {{ $t("resourceMgr.start_servervm") }}
      </el-button>
      <el-button
        v-if="currentBtnShow('shutdown_servervm')"
        style="margin-left: 15px"
        :disabled="batchShutdownDisabled"
        @click="closeService"
      >
        <!-- 关机 -->
        {{ $t("resourceMgr.shutdown_servervm") }}
      </el-button>
      <el-button
        v-if="currentBtnShow('restart_servervm')"
        style="margin-left: 15px"
        :disabled="batchRestartDisabled"
        @click="rebootService"
      >
        <!-- 重启 -->
        {{ $t("resourceMgr.restart_servervm") }}
      </el-button>
      <!-- 更多btn -->
      <el-dropdown trigger="click" @command="downBatchToggleCommand">
        <el-button :disabled="toggleDisabled" style="margin-left: 15px">
          <!-- 更多 -->
          {{ $t("resourceMgr.servervmmore") }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <template v-for="(item, index) in batchToggleList">
            <el-dropdown-item
              v-if="item.show"
              :key="index"
              :command="item"
              :disabled="item.disabled"
            >
              <span>{{ item.name }}</span>
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 物理集群 -->
      <el-select
        style="margin-left: 15px"
        v-model="clusterValue"
        :placeholder="$t('resourceMgr.plccluster')"
        @change="clusterChange"
      >
        <el-option
          v-for="item in clusterList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="header-right">
      <searchInput
        v-if="currentBtnShow('search_servervm')"
        @change="searchInputChange"
      />
      <utilsButton type="fresh" :spinBol="spinBol" @refresh="refresh" />
    </div>
  </div>
</template>

<script>
import searchInput from "@/components/SearchInput";
import utilsButton from "@/components/utilsButton";
import ReMessage from "@/utils/message";
import { MessageBox } from "element-ui";
import { getLoginUserCluster } from "@/api/clusterapi";
import {
  batchStartServerVm,
  batchShutdownServerVm,
  batchRebootServerVm,
  batchDeleteServerVm,
  abortServerVm,
  forcedRestartServerVm,
} from "@/api/serverVm";
export default {
  components: {
    searchInput,
    utilsButton,
  },
  props: {
    // 选中的数组
    selectData: {
      type: Array,
      default: () => [],
    },
    canSelectClurster: {
      type: Array,
      default: () => [],
    },
    spinBol: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      toggleDisabled: true,
      batchStartDisabled: true,
      batchShutdownDisabled: true,
      batchRestartDisabled: true,
      batchDeleteDisabled: true,
      batchToggleList: [
        {
          key: "batchAbort",
          name: this.$t("resourceMgr.batchAbort"), // "强制关机",
          disabled: true,
          show: true,
        },
        {
          key: "batchForceReboot",
          name: this.$t("resourceMgr.batchForceReboot"), //"强制重启",
          disabled: true,
          show: true,
        },
        {
          key: "batchDelete",
          name: this.$t("resourceMgr.batchDelete"), //"删除",
          disabled: true,
          show: true,
        },
      ],
      // 集群
      clusterValue: "",
      clusterList: [],
      clusterOwnList: [],
    };
  },
  watch: {
    selectData: {
      handler: function (newV, oldV) {
        this.initDisabled(true);
        if (newV.length > 0) {
          this.setBtnsDis(newV);
        }
      },
      deep: true,
    },
    canSelectClurster: {
      handler: function (newV, oldV) {
        const clusterList = this.clusterOwnList.filter(
          (res) => res.value === 0 || newV.indexOf(res.value) >= 0
        );
        this.clusterList = clusterList;
      },
      deep: true,
    },
  },
  created() {
    this.clusterValue = "";
    this.clusterList = [];
    this.getUserCluster();
  },
  methods: {
    getUserCluster() {
      getLoginUserCluster()
        .then((res) => {
          let list = res;
          this.clusterList = [
            {
              label: this.$t("resourceMgr.allcluster"), // "全部集群",
              value: 0,
            },
          ];
          list.forEach((element) => {
            let { clusterId, clusterName } = element;
            this.clusterList.push({
              label: clusterName,
              value: clusterId,
            });
          });
          this.clusterOwnList = this.clusterList;
          this.clusterValue = this.clusterList[0].value;
          this.clusterChange(this.clusterValue);
        })
        .catch((err) => {});
    },
    clusterChange(value) {
      this.clusterValue = value;
      this.$emit("clusterKeyChange", value);
    },
    setBtnsDis(newV) {
      // 开机按钮  start
      let startDis = newV.some((item) => item.startBtnDisabled == true);
      if (!startDis) {
        this.batchStartDisabled = false;
      }
      // 关机按钮  shutdown
      let shutdownDis = newV.some((item) => item.shutdownBtnDisabled == true);
      if (!shutdownDis) {
        this.batchShutdownDisabled = false;
      }
      // 重启按钮  reboot
      let rebootDis = newV.some((item) => item.rebootBtnDisabled == true);
      if (!rebootDis) {
        this.batchRestartDisabled = false;
      }
      // 强制关机按钮  abort
      let abortDis = newV.some((item) => item.abortBtnDisabled == true);

      // 强制重启  forcereboot
      let forcerebootDis = newV.some(
        (item) => item.forcerebootBtnDisabled == true
      );

      // 删除 delete
      let deleteDis = newV.some((item) => item.deleteBtnDisabled == true);

      this.toggleDisabled = abortDis && forcerebootDis && deleteDis;
      let selectDataLength = this.selectData.length;
      this.batchToggleList.forEach((element) => {
        element.disabled = true;
        element.show = false;

        // 强制关机按钮
        if (element.key == "batchAbort" && !abortDis) {
          element.disabled = false;
        }
        if (element.key == "batchAbort" && selectDataLength > 1) {
          element.disabled = true;
        }
        if (element.key == "batchAbort") {
          element.show = this.currentBtnShow("force_shutdown_servervm");
        }

        // 强制重启
        if (element.key == "batchForceReboot" && !forcerebootDis) {
          element.disabled = false;
        }
        if (element.key == "batchForceReboot" && selectDataLength > 1) {
          element.disabled = true;
        }
        if (element.key == "batchForceReboot") {
          element.show = this.currentBtnShow("force_restart_servervm");
        }
        // 删除
        if (element.key == "batchDelete" && !deleteDis) {
          element.disabled = false;
        }
        if (element.key == "batchDelete") {
          element.show = this.currentBtnShow("delete_servervm");
        }
      });
    },

    initDisabled(booleanFlag) {
      this.toggleDisabled = booleanFlag;
      this.batchStartDisabled = booleanFlag;
      this.batchShutdownDisabled = booleanFlag;
      this.batchRestartDisabled = booleanFlag;
      this.batchDeleteDisabled = booleanFlag;
    },

    // 开机
    startService() {
      let successMsg = this.$t("common.successfulOperation"); // "操作成功";
      let errorMsg = this.$t("common.operationFailed"); // "操作失败";
      const batchServerVmParams = this.getBatchOperateParam();
      this.selectData.forEach((element) => {
        element.startBtnDisabled = true;
      });
      this.$emit("headerBarEmit", this.selectData);

      batchStartServerVm({ batchServerVmParams })
        .then((res) => {
          ReMessage.success(successMsg);
          this.initDisabled(true);
          this.$emit("refreshTable");
        })
        .catch((err) => {
          ReMessage.error(errorMsg);
          this.initDisabled(true);
          this.$emit("refreshTable");
        });
    },
    // 关机
    closeService() {
      let successMsg = this.$t("common.successfulOperation"); // "操作成功";
      let errorMsg = this.$t("common.operationFailed"); // "操作失败";
      const batchServerVmParams = this.getBatchOperateParam();
      this.selectData.forEach((element) => {
        element.shutdownBtnDisabled = true;
      });
      this.$emit("headerBarEmit", this.selectData);
      batchShutdownServerVm({ batchServerVmParams })
        .then((res) => {
          ReMessage.success(successMsg);
          this.initDisabled(true);
          this.$emit("refreshTable");
        })
        .catch((err) => {
          ReMessage.error(errorMsg);
          this.initDisabled(true);
          this.$emit("refreshTable");
        });
    },
    // 重启
    rebootService() {
      let successMsg = this.$t("common.successfulOperation"); // "操作成功";
      let errorMsg = this.$t("common.operationFailed"); // "操作失败";
      const batchServerVmParams = this.getBatchOperateParam();
      this.selectData.forEach((element) => {
        element.rebootBtnDisabled = true;
      });
      this.$emit("headerBarEmit", this.selectData);
      batchRebootServerVm({ batchServerVmParams })
        .then((res) => {
          ReMessage.success(successMsg);
          this.initDisabled(true);
          this.$emit("refreshTable");
        })
        .catch((err) => {
          ReMessage.error(errorMsg);
          this.initDisabled(true);
          this.$emit("refreshTable");
        });
    },
    //删除
    batchDeleteService() {
      let confirmMsg = this.$t("resourceMgr.deleteconfirmMsg"); // "确定要删除所选云服务器？";
      let confirmTit = this.$t("resourceMgr.deleteconfirmTit"); // "删除";
      let successMsg = this.$t("resourceMgr.batchDeleteSucc"); // "删除成功!";
      let errorMsg = this.$t("resourceMgr.batchDeleteErr"); // "删除失败!";
      MessageBox.confirm(confirmMsg, confirmTit, {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        const batchServerVmParams = this.getBatchOperateParam();
        batchDeleteServerVm({ batchServerVmParams })
          .then((res) => {
            ReMessage.success(successMsg);
            this.initDisabled(true);
            this.$emit("refreshTable");
          })
          .catch((err) => {
            ReMessage.error(errorMsg);
            this.initDisabled(true);
            this.$emit("refreshTable");
          });
      });
    },
    //强制关机
    batchAbortVm() {
      let confirmMsg = this.$t("resourceMgr.abortconfirmMsg"); // "此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制关机？"
      let confirmTit = this.$t("resourceMgr.abortconfirmTit"); // "强制关机",

      let successMsg = this.$t("resourceMgr.abortSucc"); // "强制关机成功!";
      let errorMsg = this.$t("resourceMgr.abortErr"); // "强制关机失败!";
      MessageBox.confirm(confirmMsg, confirmTit, {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        const { serverVmUuid, clusterId } = this.selectData[0];
        abortServerVm({ serverVmUuid, clusterId })
          .then((res) => {
            ReMessage.success(successMsg);
            this.initDisabled(true);
            this.$emit("refreshTable");
          })
          .catch((err) => {
            ReMessage.error(errorMsg);
            this.initDisabled(true);
            this.$emit("refreshTable");
          });
      });
    },
    //强制重启
    batchForcerebootVm() {
      let confirmMsg = this.$t("resourceMgr.forcedRestartconfirmMsg"); // "此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制重启？",
      let confirmTit = this.$t("resourceMgr.forcedRestartconfirmTit"); // "强制重启",

      let successMsg = this.$t("resourceMgr.forcedRestartSucc"); // "强制重启成功!";
      let errorMsg = this.$t("resourceMgr.forcedRestartErr"); // "强制重启失败!";
      MessageBox.confirm(confirmMsg, confirmTit, {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        const { serverVmUuid, clusterId } = this.selectData[0];
        forcedRestartServerVm({ serverVmUuid, clusterId })
          .then((res) => {
            ReMessage.success(successMsg);
            this.initDisabled(true);
            this.$emit("refreshTable");
          })
          .catch((err) => {
            ReMessage.error(errorMsg);
            this.initDisabled(true);
            this.$emit("refreshTable");
          });
      });
    },

    // 刷新
    refresh() {
      this.$emit("refreshTable");
    },
    // 搜索
    searchInputChange(val) {
      this.$parent.changeSearchKey(val);
      this.$emit("refreshTable");
    },
    downBatchToggleCommand(type) {
      let commandType = type.key;
      if (commandType === "batchDelete") {
        this.batchDeleteService();
      }
      if (commandType === "batchAbort") {
        this.batchAbortVm();
      }
      if (commandType === "batchForceReboot") {
        this.batchForcerebootVm();
      }
    },
    getBatchOperateParam() {
      const batchServerVmParams = [];
      for (let i = 0; i < this.selectData.length; i++) {
        const { serverVmUuid, clusterId } = this.selectData[i];
        batchServerVmParams.push({ serverVmUuid, clusterId });
      }
      return batchServerVmParams;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
