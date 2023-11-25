<template>
  <el-dropdown trigger="click" @visible-change="visibleChange">
    <el-link type="primary" @click.stop="stoplinkclick">
      <!-- 更多 -->
      {{ $t("resourceMgr.servervmmore") }}
      <i class="el-icon-arrow-down el-icon--right" />
    </el-link>
    <el-dropdown-menu slot="dropdown">
      <template v-for="(item, index) in toggleList">
        <el-dropdown-item :key="item.key + index" :command="item">
          <el-link
            v-if="item.show"
            @click="downToggleCommand(item.key)"
            :disabled="item.disabled"
            :underline="false"
          >
            {{ item.label }}
          </el-link>
        </el-dropdown-item>
      </template>
      <el-dropdown-item v-if="toggleList.length == 0">
        <el-link :underline="false">
          {{ $t("common.noMoreOperations") }}
        </el-link>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import {
  startServerVm,
  shutdownServerVm,
  abortServerVm,
  restartServerVm,
  forcedRestartServerVm,
  deleteServerVm,
} from "@/api/serverVm";
import ReMessage from "@/utils/message";
import { MessageBox } from "element-ui";
export default {
  props: {
    // 选中的数组
    selectData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      toggleList: [],
      toggleAllList: {},
      toggleListArr: [
        {
          key: "start",
          label: this.$t("resourceMgr.start_servervm"), //"开机",
          disabled: true,
          show: true,
        },
        {
          key: "shutdown",
          label: this.$t("resourceMgr.shutdown_servervm"), //"关机",
          disabled: true,
          show: true,
        },
        {
          key: "abort",
          label: this.$t("resourceMgr.batchAbort"), //"强制关机",
          disabled: true,
          show: true,
        },
        {
          key: "reboot",
          label: this.$t("resourceMgr.restart_servervm"), //"重启",
          disabled: true,
          show: true,
        },
        {
          key: "forcereboot",
          label: this.$t("resourceMgr.batchForceReboot"), //"强制重启",
          disabled: true,
          show: true,
        },
        // { key: "snapshot", label: "快照", disabled: true, show: true },
        // { key: "edit", label: "变更规格", disabled: true, show: true },
        // { key: "applyDeferred", label: "申请延期", disabled: true, show: true },
        {
          key: "makeImage",
          label: this.$t("imageMgr.makeImage"), //"制作镜像",
          disabled: true,
          show: true,
        },
        {
          key: "transfer",
          label: this.$t("transferMgr.transfer"), // "转移",
          disabled: true,
          show: true,
        },
        {
          key: "delete",
          label: this.$t("resourceMgr.batchDelete"), //"删除",
          disabled: true,
          show: true,
        },
      ],
      toggleListData: {},
    };
  },
  created() {
    // this.defaultList();
    // this.defaultListNew();
  },
  watch: {},
  methods: {
    stoplinkclick() {},
    visibleChange(val) {
      if (val) {
        this.toggleListData = JSON.parse(JSON.stringify(this.selectData[0]));
        this.defaultListNew(this.toggleListData);
      }
    },
    //  下拉列表
    defaultListNew(toggleListData, k) {
      let {
        startBtnShow,
        startBtnDisabled,
        shutdownBtnShow,
        shutdownBtnDisabled,
        abortBtnShow,
        abortBtnDisabled,
        rebootBtnShow,
        rebootBtnDisabled,
        forcerebootBtnShow,
        forcerebootBtnDisabled,
        snapshotBtnShow,
        snapshotBtnDisabled,
        editBtnShow,
        editBtnDisabled,
        applyDeferredBtnShow,
        applyDeferredBtnDisabled,
        deleteBtnShow,
        deleteBtnDisabled,
        makeImageBtnShow,
        makeImageBtnDisabled,
        transferBtnShow,
        transferBtnDisabled,
      } = toggleListData;
      let list = [];
      this.toggleListArr.forEach((element) => {
        let { key } = element;
        element.show = false;
        switch (key) {
          // 开机
          case "start":
            element.show = this.currentBtnShow("start_servervm");
            if (startBtnShow) {
              element.disabled = startBtnDisabled;
              list.push(element);
            }
            break;
          // 关机
          case "shutdown":
            element.show = this.currentBtnShow("shutdown_servervm");
            if (shutdownBtnShow) {
              element.disabled = shutdownBtnDisabled;
              list.push(element);
            }
            break;
          // 强制关机
          case "abort":
            element.show = this.currentBtnShow("force_shutdown_servervm");
            if (abortBtnShow) {
              element.disabled = abortBtnDisabled;
              list.push(element);
            }
            break;
          // 重启
          case "reboot":
            element.show = this.currentBtnShow("restart_servervm");
            if (rebootBtnShow) {
              element.disabled = rebootBtnDisabled;
              list.push(element);
            }
            break;
          // 强制重启
          case "forcereboot":
            element.show = this.currentBtnShow("force_restart_servervm");
            if (forcerebootBtnShow) {
              element.disabled = forcerebootBtnDisabled;
              list.push(element);
            }
            break;
          // 快照
          case "snapshot":
            if (snapshotBtnShow) {
              element.disabled = snapshotBtnDisabled;
              list.push(element);
            }
            break;
          // 变更规格
          case "edit":
            if (editBtnShow) {
              element.disabled = editBtnDisabled;
              list.push(element);
            }
            break;
          // 申请延期
          case "applyDeferred":
            if (applyDeferredBtnShow) {
              element.disabled = applyDeferredBtnDisabled;
              list.push(element);
            }
            break;
          //  删除
          case "delete":
            element.show = this.currentBtnShow("delete_servervm");
            if (deleteBtnShow) {
              element.disabled = deleteBtnDisabled;
              list.push(element);
            }

            break;
          //  制作镜像
          case "makeImage":
            element.show = this.otherBtnShow("image", "make_image");
            if (makeImageBtnShow) {
              element.disabled = makeImageBtnDisabled;
              list.push(element);
            }
            break;

          // 转移
          case "transfer":
            element.show = true;
            if (transferBtnShow) {
              element.disabled = transferBtnDisabled;
              list.push(element);
            }
            break;

          default:
            list = [];
            break;
        }
      });
      this.toggleList = JSON.parse(JSON.stringify(list));
      this.$emit("downToggleCommand", toggleListData);
    },
    downToggleCommand(type) {
      if (type === "start") {
        this.toggleListData.startBtnDisabled = true;
        this.startVm();
      }
      if (type === "shutdown") {
        this.toggleListData.shutdownBtnDisabled = true;
        this.shutdownVm();
      }
      if (type === "snapshot") {
        this.toggleListData.snapshotBtnDisabled = true;
        let serverVmUuid = this.selectData.length
          ? this.selectData[0].serverVmUuid
          : 1;

        this.$router.push({
          name: "escPageDetail",
          params: {
            id: serverVmUuid,
            type: "escPageDetail",
            serverVmUuid: serverVmUuid,
            tab: "snapshot",
          },
        });
      }
      if (type === "abort") {
        this.toggleListData.abortBtnDisabled = true;
        this.abortVm();
      }
      if (type === "reboot") {
        this.toggleListData.rebootBtnDisabled = true;
        this.restartVm();
      }
      if (type === "forcereboot") {
        this.toggleListData.forcerebootBtnDisabled = true;
        this.forcerebootVm();
      }

      if (type === "edit") {
        this.toggleListData.editBtnDisabled = false;
        this.$emit("handleShowChangeServices");
      }
      if (type === "applyDeferred") {
        this.toggleListData.applyDeferredBtnDisabled = false;
        this.$emit("handleShowDely");
      }
      if (type === "delete") {
        this.toggleListData.deleteBtnDisabled = true;
        this.deleteServerVm();
      }
      if (type === "makeImage") {
        this.toggleListData.makeImageBtnDisabled = true; // 制作镜像按钮
        this.makeImageServerVm();
      }
      // 转移
      if (type === "transfer") {
        this.toggleListData.transferBtnDisabled = true; // 转移按钮
        this.transferServerVm();
      }
      this.defaultListNew(this.toggleListData);
    },
    //删除
    deleteServerVm() {
      let confirmMsg = this.$t("resourceMgr.deleteconfirmMsg"); // "确定要删除这台云服务器？";
      let confirmTit = this.$t("resourceMgr.batchDelete"); // "删除";
      let successMsg = this.$t("resourceMgr.deleteSucc"); // "删除成功!";
      let errorMsg = this.$t("resourceMgr.deleteErr"); // "删除失败!";
      MessageBox.confirm(confirmMsg, confirmTit, {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          const { serverVmUuid, clusterId } = this.selectData[0];
          deleteServerVm({ serverVmUuid, clusterId })
            .then((res) => {
              ReMessage.success(successMsg);
              this.refreshParentTable();
            })
            .catch((err) => {
              ReMessage.error(errorMsg);
              this.refreshParentTable();
            });
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
          // this.refreshParentTable();
          let toggleListData = JSON.parse(JSON.stringify(this.toggleListData));
          toggleListData.deleteBtnDisabled = false;
          this.defaultListNew(toggleListData);
        });
    },
    startVm() {
      let successMsg = this.$t("common.successfulOperation"); // "操作成功";
      let errorMsg = this.$t("common.operationFailed"); // "操作失败";
      const { serverVmUuid, clusterId } = this.selectData[0];
      startServerVm({ serverVmUuid, clusterId })
        .then((res) => {
          ReMessage.success(successMsg);
          this.refreshParentTable();
        })
        .catch((err) => {
          ReMessage.error(errorMsg);
          this.refreshParentTable();
        });
    },
    shutdownVm() {
      let successMsg = this.$t("common.successfulOperation"); // "操作成功";
      let errorMsg = this.$t("common.operationFailed"); // "操作失败";
      const { serverVmUuid, clusterId } = this.selectData[0];
      this.$emit("shutdownVm");
      shutdownServerVm({ serverVmUuid, clusterId })
        .then((res) => {
          ReMessage.success(successMsg);
          this.refreshParentTable();
        })
        .catch((err) => {
          ReMessage.error(errorMsg);
          this.refreshParentTable();
        });
    },
    abortVm() {
      let confirmMsg = this.$t("resourceMgr.abortconfirmMsg"); // "此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制关机？"
      let confirmTit = this.$t("resourceMgr.abortconfirmTit"); // "强制关机",
      let successMsg = this.$t("resourceMgr.abortSucc"); // "强制关机成功!";
      let errorMsg = this.$t("resourceMgr.abortErr"); // "强制关机失败!";
      MessageBox.confirm(confirmMsg, confirmTit, {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          const { serverVmUuid, clusterId } = this.selectData[0];
          abortServerVm({ serverVmUuid, clusterId })
            .then((res) => {
              ReMessage.success(successMsg);
              this.refreshParentTable();
            })
            .catch((err) => {
              ReMessage.error(errorMsg);
              this.refreshParentTable();
            });
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
          this.toggleListData.abortBtnDisabled = false;
          this.defaultListNew(this.toggleListData);
        });
    },
    restartVm() {
      let successMsg = this.$t("resourceMgr.restartSucc"); // "重启成功!";
      let errorMsg = this.$t("resourceMgr.restartErr"); // "重启失败!";
      const { serverVmUuid, clusterId } = this.selectData[0];
      restartServerVm({ serverVmUuid, clusterId })
        .then((res) => {
          ReMessage.success(successMsg);
          this.refreshParentTable();
        })
        .catch((err) => {
          ReMessage.error(errorMsg);
          this.refreshParentTable();
        });
    },
    forcerebootVm() {
      let confirmMsg = this.$t("resourceMgr.forcedRestartconfirmMsg"); // "此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制重启？",
      let confirmTit = this.$t("resourceMgr.forcedRestartconfirmTit"); // "强制重启",
      let successMsg = this.$t("resourceMgr.forcedRestartSucc"); // "强制重启成功!";
      let errorMsg = this.$t("resourceMgr.forcedRestartErr"); // "强制重启失败!";
      MessageBox.confirm(confirmMsg, confirmTit, {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          const { serverVmUuid, clusterId } = this.selectData[0];
          forcedRestartServerVm({ serverVmUuid, clusterId })
            .then((res) => {
              ReMessage.success(successMsg);
              this.refreshParentTable();
            })
            .catch((err) => {
              ReMessage.error(errorMsg);
              this.refreshParentTable();
            });
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
          this.toggleListData.forcerebootBtnDisabled = false;
          this.defaultListNew(this.toggleListData);
        });
    },
    refreshParentTable() {
      this.$emit("refreshTable");
    },
    makeImageServerVm() {
      this.$emit("downToggle", { key: "makeImage", row: this.selectData[0] });
    },
    transferServerVm() {
      this.$emit("downToggle", { key: "transfer", row: this.selectData[0] });
    },
  },
};
</script>
