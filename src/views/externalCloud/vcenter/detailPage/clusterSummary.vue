<template>
  <!-- physicalClusterDetail -->
  <div class="summary-detail">
    <headerBox @refresh="refreshData">
      <template slot="headerLeft">
        <el-button @click="toCluster">
          {{ $t("resourceMgr.loginVcenter") }}
        </el-button>
      </template>
    </headerBox>
    <div class="basicInfo basicInfo-border">
      <!-- 基本信息 -->
      <div class="basicInfo-title">
        {{ $t("resourceMgr.clusterBaseInfo") }}
      </div>
      <div class="basicInfo-content">
        <!--名称 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.vcenterName }}</div>
        </div>
        <!-- 状态 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterStatus") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ getstatusLabel(pageInfo.vcenterStatus) }}
          </div>
        </div>
        <!-- 描述 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterRemark") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ pageInfo.clusterDescription }}
          </div>
        </div>
        <!-- 集群版本 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterVersion") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ pageInfo.vcenterVersion }}
          </div>
        </div>
        <!-- IP -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">IP：</div>
          <div class="basicInfo-item-value">
            {{ pageInfo.clusterURL }}
          </div>
        </div>
        <!-- 协议 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterUrlprotocol") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ pageInfo.clusterHttpProtocol === 1 ? "https" : "http" }}
          </div>
        </div>
        <!-- 端口 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("externalCloud.vMwareMgr.vcenterPort") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ pageInfo.clusterPort }}
          </div>
        </div>

        <!-- 集群URL -->
        <!-- <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterUrl") }}：
          </div>
          <div class="basicInfo-item-value">
            {{
              (pageInfo.clusterHttpProtocol === 1 ? "https://" : "http://") +
              pageInfo.clusterURL +
              ":" +
              pageInfo.clusterPort
            }}
          </div>
        </div> -->
        <!-- 用户名 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterAdminName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.vcenterUserName }}</div>
        </div>
        <!-- 添加时间 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.clusterCeateTime") }}：
          </div>
          <div class="basicInfo-item-value">
            {{ pageInfo.vcenterCreateTime }}
          </div>
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
                {{ resourceUsedInfo.cpuTotalCapacity }}
                GHZ
              </div>
              <div>
                {{ $t("common.details.used") }}：
                {{ resourceUsedInfo.cpuUsedCapacity }}
                GHZ
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ resourceUsedInfo.cpuFreeCapacity }}
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
                {{ resourceUsedInfo.memoryTotalCapacity }}GB
              </div>
              <div>
                {{ $t("common.details.used") }}：
                {{ resourceUsedInfo.memoryUsedCapacity }}GB
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ resourceUsedInfo.memoryFreeCapacity }}GB
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
                {{ resourceUsedInfo.storageTotalCapacity }}GB
              </div>
              <div>
                {{ $t("common.details.used") }}：
                {{ resourceUsedInfo.storageUsedCapacity }}GB
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ resourceUsedInfo.storageFreeCapacity }}GB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerBox from "@/components/headerBox";
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
  components: { headerBox, commonChart },
  data() {
    return {
      pageInfo: {},
      tableLoading: false,
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
    refreshData() {
      this.$parent.getclusterInfo();
    },
    getstatusLabel(status) {
      let statusObj = {
        1: this.$t("resourceMgr.clusterStatusObj.ONLINE"), // "在线",
        0: this.$t("resourceMgr.clusterStatusObj.OFFLINE"), // "离线",
      };
      return statusObj[status] || "-";
    },
    toCluster() {
      const url =
        (this.pageInfo.clusterHttpProtocol === 1 ? "https://" : "http://") +
        this.pageInfo.clusterURL +
        ":" +
        this.pageInfo.clusterPort;
      window.open(url, "_blank");
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
      this.resourceUsedInfo = this.dataInfo.resourceStatistics;

      // cpu百分比图
      let cpufpb = {
        nama: this.$t("common.details.CPUUtilization"), // "CPU利用率",
        value: this.resourceUsedInfo.cpuUsedRate,
      };
      this.cpufpbChart.option = this.getpersentoption(cpufpb);
      // 内存分配比
      let memfpb = {
        nama: this.$t("common.details.memoryUtilization"), // "内存利用率",
        value: this.resourceUsedInfo.memoryUsedRate,
      };
      this.memfpbChart.option = this.getpersentoption(memfpb);
      // 存储分配比
      let storagefpb = {
        nama: this.$t("common.details.storageUtilization"), // "存储利用率",
        value: this.resourceUsedInfo.storageUsedRate,
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

<style lang="scss" scoped>
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
