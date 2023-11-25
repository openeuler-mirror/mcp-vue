<template>
  <div class="header-box">
    <div class="header-left">
      <el-button
        v-if="vncBtnShow"
        :disabled="vncBtnDisabled"
        type="primary"
        @click="openVncUrl()"
      >
        {{ $t("resourceMgr.openVnc") }}
      </el-button>
      <!-- <el-button
        v-if="startBtnShow"
        :disabled="startBtnDisabled"
        @click="startServerVm()"
      >
        开机
      </el-button> -->
      <!-- <el-button v-if="shutdownBtnShow" :disabled="shutdownBtnDisabled">
        关机
      </el-button> -->
    </div>
    <div class="header-right">
      <i
        class="el-icon-refresh setting-icon"
        :title="$t('common.refresh')"
        @click="refresh"
      />
    </div>
  </div>
</template>

<script>
import { getVncUrl, startServerVm, shutdownServerVm } from "@/api/serverVm";
import actbtnPms from "../main/actbtnPmsList";
export default {
  props: {
    basicInfo: { type: Object, default: {} },
  },

  data() {
    return {
      startBtnShow: false,
      startBtnDisabled: true,
      shutdownBtnShow: false,
      shutdownBtnDisabled: true,
      vncBtnShow: false,
      vncBtnDisabled: true,
    };
  },
  created() {},
  watch: {
    basicInfo(val) {
      this.getBtnShow();
    },
  },
  methods: {
    getBtnShow() {
      let { status } = this.basicInfo;
      this.startBtnShow = false; // 开机按钮start Show
      this.startBtnDisabled = true; // 开机按钮start Disabled
      this.shutdownBtnShow = false; // 关机按钮 shutdown Show
      this.shutdownBtnDisabled = true; // 开机按钮 shutdown Disabled
      this.vncBtnShow = false; // 控制台按钮vnc Show
      this.vncBtnDisabled = true; // 控制台按钮vnc Disabled

      // 根据电源状态控制处理 开机按钮start startBtn
      if (actbtnPms.startstatusShowList.indexOf(status) > -1) {
        this.startBtnShow = true;
        this.startBtnDisabled = false;
      }
      // 根据电源状态控制处理 关机按钮 shutdown
      if (actbtnPms.shutdownstatusShowList.indexOf(status) > -1) {
        this.shutdownBtnShow = true;
        this.shutdownBtnDisabled = false;
      }
      // 根据电源状态控制处理 控制台按钮vnc vncBtn
      if (actbtnPms.vncstatusShowList.indexOf(status) > -1) {
        this.vncBtnShow = true;
        this.vncBtnDisabled = false;
      }
    },
    openVncUrl() {
      let serverVmUuid = this.basicInfo.uuid;
      this.vncBtnDisabled = true;
      getVncUrl({ serverVmUuid })
        .then((res) => {
          let vncUrl = res.vncUrl;
          if (vncUrl) {
            window.open(vncUrl, "_blank");
          }
        })
        .catch((err) => {
          this.vncBtnDisabled = false;
        });
    },
    shutdownVm() {
      let serverVmUuid = this.basicInfo.uuid;
      this.shutdownBtnDisabled = true;
      shutdownServerVm({ serverVmUuid })
        .then((res) => {
          ReMessage.success(this.$t("resourceMgr.shutdownSucc"));
          this.refresh();
        })
        .catch((err) => {
          this.shutdownBtnDisabled = false;
          this.refresh();
        });
    },
    startServerVm(row) {
      let serverVmUuid = this.basicInfo.uuid;
      this.startBtnDisabled = true;
      startServerVm({ serverVmUuid })
        .then((res) => {
          ReMessage.success(this.$t("resourceMgr.startServerVm"));
          this.refresh();
        })
        .catch((err) => {
          this.startBtnDisabled = false;
          this.refresh();
        });
    },
    // 刷新
    refresh() {
      this.$emit("refresh");
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
