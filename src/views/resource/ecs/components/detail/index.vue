<template>
  <div class="serviceDetail app-container">
    <!-- header bar -->
    <!-- 操作按钮 -->
    <!-- <header-bar ref="headerBar" :basicInfo="basicInfo" @refresh="refresh" /> -->
    <div class="basicInfo flex basicInfo-border">
      <div class="serviceDetail-operate">
        <div class="img-box">
          <img v-if="imgSrc" :src="imgSrc" />
        </div>
        <el-button
          v-if="vncBtnShow"
          :disabled="vncBtnDisabled"
          type="primary"
          @click="openVncUrl()"
        >
          <!-- 控制台 -->
          {{ $t("resourceMgr.openVnc") }}
        </el-button>
      </div>
      <div class="basicInfo-content flex1">
        <!-- 名称 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.aliasName") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.name }}</div>
        </div>
        <!-- 描述 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zonedescription") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.description }}</div>
        </div>
        <!-- 类型 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">{{ $t("resourceMgr.type") }}：</div>
          <div class="basicInfo-item-value">{{ basicInfo.type }}</div>
        </div>
        <!-- 状态 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zonestatus") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ getstatusLabel(basicInfo.status) }}
          </div>
        </div>

        <!-- 状态 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zoneos") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.osName }}</div>
        </div>
        <!-- 所有者 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.userName") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.userName }}</div>
        </div>
        <!-- VNC地址： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.vncAddr") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.vncAddr }}</div>
        </div>
        <!-- 所属组织： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zoneorgName") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.orgName }}</div>
        </div>

        <!-- 创建日期： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zonecreateDate") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ basicInfo.createDate }}
          </div>
        </div>
        <!-- 开机时间： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.powerOnDate") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.powerOnDate }}</div>
        </div>

        <!-- 运行时间： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.operationHours") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ getoperationHours() }}
          </div>
        </div>

        <!-- 计算资源： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.selectCluster") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.selectCluster }}</div>
        </div>
        <!-- 运行主机： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.runMachine") }}：
          </div>
          <div class="basicInfo-item-value">{{ basicInfo.runMachine }}</div>
        </div>
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">UUID：</div>
          <div class="basicInfo-item-value">{{ basicInfo.uuid }}</div>
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
import { getUrlWithParam } from "@/utils";
import {
  detailSummary,
  detailNetwork,
  detailDisk,
  detailMonitor,
  detailLog,
} from "./index";
import {
  getServerVmDetail,
  downLoadServerVmLog,
  getVncUrl,
} from "@/api/serverVm";
import actbtnPms from "../main/actbtnPmsList";
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
      serverVmUuid: this.$route.params.id,
      clusterId: this.$route.params.cid,
      basicInfo: {}, // 基础信息
      imgSrc: "",
      vncBtnShow: false,
      vncBtnDisabled: false,
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
      getServerVmDetail({
        serverVmUuid: this.serverVmUuid,
        clusterId: this.clusterId,
      }).then((data) => {
        this.basicInfo = data;
        let imgObj = {
          mcServerVmLogoPath: this.basicInfo.logo,
          mcServerVmLogoName: this.basicInfo.logoName,
          serverVmUuid: this.serverVmUuid,
          clusterId: this.clusterId,
        };
        downLoadServerVmLog(imgObj).then((res) => {
          this.imgSrc = "data:image/png;base64," + res.body;
        });

        this.getBtnShow();
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
      getVncUrl({ serverVmUuid, clusterId: this.clusterId })
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
        AVAILABLE: this.$t("resourceMgr.zoneAVAILABLE"), // "在线"
        CONNECTED: this.$t("resourceMgr.zoneCONNECTED"), // "已连接"
        SUSPEND: this.$t("resourceMgr.zoneSUSPEND"), // "暂停"
        OFFLINE: this.$t("resourceMgr.zoneOFFLINE"), // "离线"
        INSTALLING: this.$t("resourceMgr.zoneINSTALLING"), // "安装"
        OVERDUE: this.$t("resourceMgr.zoneOVERDUE"), // "已过期"
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
