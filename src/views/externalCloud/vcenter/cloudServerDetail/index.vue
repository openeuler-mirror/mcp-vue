<template>
  <div class="serviceDetail app-container" v-loading="freshLoading">
    <!-- header bar -->
    <!-- 操作按钮 -->
    <header-bar ref="headerBar" :basicInfo="basicInfo" @refresh="refresh" />
    <div class="basicInfo flex basicInfo-border">
      <div class="serviceDetail-operate">
        <div class="img-box">
          <img v-if="imgSrc" :src="imgSrc" />
        </div>
      </div>
      <div class="basicInfo-content flex1">
        <!-- 名称 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.aliasName") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.serverName }}</div>
        </div>
        <!-- 状态 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zonestatus") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ getstatusLabel(basicInfo.serverStatus) }}
          </div>
        </div>
        <!-- 类型 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">{{ $t("resourceMgr.type") }}：</div>
          <div class="basicInfo-item-value">{{ basicInfo.serverType }}</div>
        </div>

        <!-- 描述 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zonedescription") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ basicInfo.serverDescription }}
          </div>
        </div>

        <!-- 操作系统 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zoneos") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ basicInfo.operationSystem }}
          </div>
        </div>

        <!-- 运行主机： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.runMachine") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.runningHost }}</div>
        </div>

        <!-- 存储位置 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("externalCloud.vmOperate.storageLocation") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ basicInfo.storageLocation }}
          </div>
        </div>

        <!-- 运行时间： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.powerOnDate") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ basicInfo.runningTime }}
          </div>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeTab">
      <!-- 概要 -->
      <el-tab-pane :label="$t('resourceMgr.summary.summary')" name="summary">
      </el-tab-pane>
      <!-- 网络 -->
      <el-tab-pane :label="$t('resourceMgr.network.network')" name="network">
      </el-tab-pane>
      <!-- 存储 -->
      <el-tab-pane :label="$t('resourceMgr.storage.disk')" name="disk">
      </el-tab-pane>
      <!-- 监控 -->
      <el-tab-pane :label="$t('resourceMgr.monitor')" name="monitor">
      </el-tab-pane>
      <!-- 任务 -->
      <el-tab-pane :label="$t('resourceMgr.log')" name="log"> </el-tab-pane>
    </el-tabs>
    <detail-summary v-if="activeTab == 'summary'" ref="detailSummary" />
    <detail-network v-if="activeTab == 'network'" ref="detailNetwork" />
    <detail-disk v-if="activeTab == 'disk'" ref="detailDisk" />

    <detail-monitor v-if="activeTab == 'monitor'" />
    <detail-log v-if="activeTab == 'log'" />
  </div>
</template>

<script>
import headerBar from "./header-bar";
import {
  detailSummary,
  detailNetwork,
  detailDisk,
  detailMonitor,
  detailLog,
} from "./index";
import { getVncUrl } from "@/api/serverVm";
import { getServerMainData, getSummaryImage } from "@/api/vcenter";
import actbtnPms from "../../components/main/actbtnPmsList";
import transformat from "@/utils/transformat";

export default {
  name: "ServiceDetail",
  components: {
    headerBar,
    detailSummary,
    detailNetwork,
    detailDisk,
    detailMonitor,
    detailLog,
  },

  data() {
    return {
      activeTab: "summary",
      footVisible: false,
      serverVmUuid: this.$route.params.vcenterId,
      vcenterId: this.$route.params.vcenterId,
      vmName: this.$route.params.name,
      basicInfo: {}, // 基础信息
      imgSrc: "",
      vncBtnShow: false,
      vncBtnDisabled: false,
      freshLoading: false,
    };
  },
  created() {
    this.getServerVmInfo();
    this.activeTab = this.$route.params.tab || "summary";
  },
  methods: {
    getoperationHours() {
      let operationHours = "";
      let { nowDate, powerOnDate } = this.basicInfo;
      let nowDatetimeStep = this.$moment(nowDate).format("x");
      let powerOnDatetimeStep = this.$moment(powerOnDate).format("x");
      let operationtimeStep = nowDatetimeStep - powerOnDatetimeStep;
      operationHours = transformat.formatterData(operationtimeStep);
      return operationHours;
    },

    refresh() {
      this.getServerVmInfo();
    },
    getServerVmInfo() {
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.vmName,
      };
      this.freshLoading = true;
      getServerMainData(params)
        .then((data) => {
          this.basicInfo = data;
          this.getimgSrc(data);
        })
        .finally(() => {
          this.freshLoading = false;
        });
    },
    getimgSrc(data) {
      let imgObj = {
        osLogoName: data.osLogoName,
      };
      getSummaryImage(imgObj)
        .then((res) => {
          this.imgSrc = "data:image/png;base64," + res.body;
        })
        .finally(() => {
          this.freshLoading = false;
        });
    },
    getBtnShow() {
      let { status } = this.basicInfo;

      this.vncBtnShow = false; // 控制台按钮vnc Show
      this.vncBtnDisabled = true; // 控制台按钮vnc Disabled

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
          this.vncBtnDisabled = false;
        })
        .catch((err) => {
          this.vncBtnDisabled = false;
        });
    },
    getstatusLabel(status) {
      let statusObj = {
        0: this.$t("resourceMgr.zoneOFFLINE"),
        1: this.$t("resourceMgr.zoneAVAILABLE"),
        2: this.$t("externalCloud.statuscell.TASK_EXECUTION"),
        3: this.$t("externalCloud.statuscell.SUSPEND"),
      };
      return statusObj[status] || "-";
    },
  },
};
</script>

<style lang="scss" scoped>
.serviceDetail {
  display: flex;
  flex: 1;
  height: 0px;
  flex-direction: column;
  color: $fontColor;

  .serviceDetail-operate {
    margin-right: 15px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .img-box {
      width: 150px;
      height: 150px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .basicInfo {
    margin: 0px 15px;
    padding: 10px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .basicInfo-title {
      font-size: 20px;
      margin: 5px 0;
    }
    .basicInfo-content {
      @include nineStyle();
      width: 100%;

      .basicInfo-item {
        display: flex;
        flex-direction: row;
        line-height: 20px;
        font-size: 14px;
        .basicInfo-item-label {
          text-align: right;
        }
        .basicInfo-item-value {
          flex: 1;
          width: 1px;
          white-space: nowrap;
          /*内容超宽后禁止换行显示*/

          overflow: hidden;
          /*超出部分隐藏*/

          text-overflow: ellipsis;
          /*文字超出部分以省略号显示*/
        }
      }
    }
  }
  .basicInfo-border {
    border: 1px solid $borderColor;
    margin-bottom: 20px;
  }
}
</style>
