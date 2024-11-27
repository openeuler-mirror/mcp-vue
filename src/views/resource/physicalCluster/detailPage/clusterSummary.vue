<template>
  <!-- physicalClusterDetail -->
  <div class="summary-detail">
    <header-bar
      v-if="pageInfo.status == 'ONLINE'"
      @toCluster="toCluster"
      ref="headerBar"
      class="headerBar"
    />
    <div class="basicInfo basicInfo-border">
      <!-- 基本信息 -->
      <div class="basicInfo-title">
        {{ $t("resourceMgr.clusterBaseInfo") }}
      </div>
      <div class="basicInfo-content">
        <!--集群名称 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.name }}</div>
        </div>
        <!-- 集群类型 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clustertype") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.type }}</div>
        </div>
        <!-- 可用区 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zoneName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.zoneName }}</div>
        </div>
        <!-- 状态 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterStatus") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ getstatusLabel(pageInfo.status) }}
          </div>
        </div>
        <!-- 集群版本 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterVersion") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ pageInfo.clusterVersion }}
          </div>
        </div>
        <!-- 集群版本 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterAdminName") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ pageInfo.clusterAdminUser }}
          </div>
        </div>
        <!-- 描述 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterRemark") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.remark }}</div>
        </div>
        <!-- 集群URL -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterUrl") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.clusterUrl }}</div>
        </div>
        <!-- 添加时间 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterCeateTime") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.createTime }}</div>
        </div>
      </div>
    </div>
    <div class="basicInfo">
      <div class="basicInfo-title">
        <!-- 资源使用情况 -->
        {{ $t("common.details.resourceUsage") }}
      </div>
      <div class="basicInfo-content justify-between">
        <div class="basicInfo-content-chart">
          <div class="chart-content-title">
            <!-- CPU利用率 -->
            {{ $t("common.details.CPUUtilization") }}
          </div>
          <div class="chart-content">
            <div class="chart-box">
              <commonChart :chartData="cpufpbChart"></commonChart>
            </div>
            <div class="chart-info">
              <div>
                {{ $t("common.details.totalcapacity") }}：
                {{ resourceUsedInfo.cpuTotal }}
                GHZ
              </div>
              <div>
                {{ $t("common.details.used") }}：
                {{ resourceUsedInfo.cpuUsed }}
                GHZ
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ resourceUsedInfo.cpuSurplus }}
                GHZ
              </div>
            </div>
          </div>
        </div>
        <div class="basicInfo-content-chart">
          <div class="chart-content-title">
            <!-- 内存利用率 -->
            {{ $t("common.details.memoryUtilization") }}
          </div>
          <div class="chart-content">
            <div class="chart-box">
              <commonChart :chartData="memfpbChart"></commonChart>
            </div>
            <div class="chart-info">
              <div>
                {{ $t("common.details.totalcapacity") }}：
                {{ resourceUsedInfo.memTotal }}GB
              </div>
              <div>
                {{ $t("common.details.used") }}：
                {{ resourceUsedInfo.memUsed }}GB
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ resourceUsedInfo.memSurplus }}GB
              </div>
            </div>
          </div>
        </div>
        <div class="basicInfo-content-chart">
          <div class="chart-content-title">
            <!-- 存储利用率 -->
            {{ $t("common.details.storageUtilization") }}
          </div>
          <div class="chart-content">
            <div class="chart-box">
              <commonChart :chartData="storagefpbChart"></commonChart>
            </div>
            <div class="chart-info">
              <div>
                {{ $t("common.details.totalcapacity") }}：
                {{ resourceUsedInfo.storageTotal }}GB
              </div>
              <div>
                {{ $t("common.details.used") }}：
                {{ resourceUsedInfo.storageUsed }}GB
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ resourceUsedInfo.storageSurplus }}GB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerBar from "./header-bar";
import commonChart from "@/components/commonChart/index";
import transformat from "@/utils/transformat";
export default {
  name: "clusterSummary",
  props: {
    dataInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    dataInfo: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.drowChart();
        }
      },
      // 代表在wacth里声明了 立即先去执行handler方法
      immediate: true,
      deep: true,
    },
  },
  components: { headerBar, commonChart },
  data() {
    return {
      pageInfo: {},
      resourceUsedInfo: {
        cpuUsed: "", //CPU已使用
        cpuTotal: "", //cpu总大小
        cpuSurplus: "",
        memUsed: "", //内存已使用
        memTotal: "", //内存总大小
        memSurplus: "",
        storageUsed: "", //存储已使用
        storageTotal: "", //存储总大小
        storageSurplus: "",
      },

      cpufpbChart: {
        id: "cpufpbChart",
        option: "",
      },
      memfpbChart: {
        id: "memfpbChart",
        option: "",
      },
      storagefpbChart: {
        id: "storagefpbChart",
        option: "",
      },
    };
  },
  created() {},
  methods: {
    getstatusLabel(status) {
      let statusObj = {
        ONLINE: this.$t("resourceMgr.clusterStatusObj.ONLINE"), // "在线",
        OFFLINE: this.$t("resourceMgr.clusterStatusObj.OFFLINE"), // "离线",
        EXCEPTION: this.$t("resourceMgr.clusterStatusObj.EXCEPTION"), // "异常",
      };
      return statusObj[status] || "-";
    },
    toCluster() {
      window.open(this.pageInfo.quickLoginUrl, "_blank");
    },
    // 计算百分比
    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
    },
    drowChart() {
      if (JSON.stringify(this.dataInfo) == "{}") {
        return;
      }
      this.pageInfo = this.dataInfo;
      this.resourceUsedInfo = this.dataInfo.resourceUsedInfo;

      // cpu百分比图
      let cpufpb = {
        name: this.$t("common.details.CPUUtilization"), // "CPU利用率",
        value: this.calculatePercentage(
          this.resourceUsedInfo.cpuUsed,
          this.resourceUsedInfo.cpuTotal
        ),
      };
      this.cpufpbChart.option = this.getpersentoption(cpufpb);
      // 内存分配比
      let memfpb = {
        name: this.$t("common.details.memoryUtilization"), // "内存利用率",
        value: this.calculatePercentage(
          this.resourceUsedInfo.memUsed,
          this.resourceUsedInfo.memTotal
        ),
      };
      this.memfpbChart.option = this.getpersentoption(memfpb);
      // 存储分配比
      let storagefpb = {
        name: this.$t("common.details.storageUtilization"), // "存储利用率",
        value: this.calculatePercentage(
          this.resourceUsedInfo.storageUsed,
          this.resourceUsedInfo.storageTotal
        ),
      };
      this.storagefpbChart.option = this.getpersentoption(storagefpb);
    },
    // 自定义进度条颜色
    customColorMethod(percentage) {
      if (percentage <= 80) {
        return "#1DDBB1";
      } else if (80 < percentage && percentage < 90) {
        return "#E6A23C";
      } else {
        return "#F56C6C";
      }
    },
    getpersentoption(info) {
      let { name, value } = info;

      let colors = [this.customColorMethod(value), "#dfeaff"];
      let option = {
        series: [
          {
            name: name,
            type: "pie",
            clockWise: false,
            radius: ["50%", "60%"],
            itemStyle: {
              normal: {
                color: colors[0],
                shadowColor: colors[0],
                shadowBlur: 0,
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            center: ["50%", "50%"],
            data: [
              {
                value: value,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + "%";
                    },
                    position: "center",
                    show: true,
                    textStyle: {
                      fontSize: "20",
                      fontWeight: "bold",
                      color: "#999",
                    },
                  },
                },
              },
              {
                value: 100 - value,
                name: "invisible",
                itemStyle: {
                  normal: {
                    color: colors[1],
                  },
                  emphasis: {
                    color: colors[1],
                  },
                },
              },
            ],
          },
        ],
      };
      return option;
    },
  },
};
</script>

<style lang="scss" scoped >
.summary-detail {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  .headerBar {
    margin-bottom: 20px;
  }

  .basicInfo {
    margin: 0px 15px;
    margin-bottom: 20px;
    padding: 0px 20px;
    display: flex;
    flex-direction: column;
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
        }
      }
      .basicInfo-content-chart {
        border-radius: 15px;
      }
      .basicInfo-content-info,
      .basicInfo-content-chart {
        border: 1px solid $borderColor;
        display: flex;
        flex-direction: column;

        .chart-content-title {
          line-height: 30px;
          padding: 0 15px;
          font-size: 16px;
        }
        .chart-content {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          .chart-info {
            line-height: 26px;
            font-size: 14px;
          }
          .chart-box {
            width: 200px;
            height: 200px;
          }
        }
      }

      .info-content {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        .info-left,
        .info-right {
          flex-grow: 1;
          margin: 10px 0;
          line-height: 30px;
        }
      }
    }
  }
  .basicInfo-border {
    border-bottom: 1px solid $borderColor;
    padding-bottom: 10px;
  }
}
</style>