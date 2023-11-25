<template>
  <div class="header-box">
    <div class="header-left">
      <el-button
        :disabled="vncBtnDisabled"
        type="primary"
        class="header-btn"
        @click="openVncUrl()"
      >
        控制台
      </el-button>
      <el-button
        class="header-btn"
        :disabled="startBtnDisabled"
        @click="startServerVm()"
      >
        开机
      </el-button>
      <el-button
        class="header-btn"
        @click="shutdownVm"
        :disabled="shutdownBtnDisabled"
      >
        关机
      </el-button>
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
import { getVncUrl, startServerVm, shutdownServerVm } from "@/api/vcenter";
import ReMessage from "@/utils/message";
export default {
  props: {
    basicInfo: { type: Object, default: {} },
  },

  data() {
    return {
      vcenterId: this.$route.params.vcenterId,
      startBtnDisabled: true,
      shutdownBtnDisabled: true,
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
      let { serverStatus } = this.basicInfo;
      this.startBtnDisabled = true; // 开机按钮start Disabled
      this.shutdownBtnDisabled = true; // 开机按钮 shutdown Disabled
      this.vncBtnDisabled = true; // 控制台按钮vnc Disabled

      // 离线状态
      if (serverStatus === 0) {
        this.startBtnDisabled = false;
        this.shutdownBtnDisabled = true; // 开机按钮 shutdown Disabled
        this.vncBtnDisabled = true; // 控制台按钮vnc Disabled
      }
      // 在线状态
      if (serverStatus === 1) {
        this.startBtnDisabled = true;
        this.shutdownBtnDisabled = false; // 开机按钮 shutdown Disabled
        this.vncBtnDisabled = false; // 控制台按钮vnc Disabled
      }
    },
    openVncUrl() {
      const { serverName } = this.basicInfo;
      const params = {
        vcenterId: this.vcenterId,
        serverName,
      };
      getVncUrl(params)
        .then((res) => {
          const { hostIp, ticket } = res;
          window.open(
            `vcenterCtr?v=${serverName}&i=${hostIp}&t=${ticket}`,
            "_blank"
          );
        })
        .catch((err) => {
          this.vncBtnDisabled = false;
        });
    },
    shutdownVm() {
      const { serverIdentifier, serverName } = this.basicInfo;
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [
          {
            serverIdentifier,
            serverName,
          },
        ],
      };
      this.shutdownBtnDisabled = true;
      shutdownServerVm(params)
        .then((res) => {
          ReMessage.success("关机成功");
          this.refresh();
        })
        .catch((err) => {
          this.shutdownBtnDisabled = false;
        });
    },
    startServerVm(row) {
      const { serverIdentifier, serverName } = this.basicInfo;
      const params = {
        vcenterId: this.vcenterId,
        serverBatchReqParams: [
          {
            serverIdentifier,
            serverName,
          },
        ],
      };
      this.startBtnDisabled = true;
      startServerVm(params)
        .then((res) => {
          ReMessage.success("开机成功");
          this.refresh();
        })
        .catch((err) => {
          this.startBtnDisabled = false;
        });
    },
    // 刷新
    refresh() {
      this.$emit("refresh");
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
  margin-bottom: 20px;
}
.header-btn {
  margin-right: 15px;
}
</style>
