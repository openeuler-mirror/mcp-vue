<template>
  <!-- organizationDetail -->
  <div class="summary-detail">
    <div class="basicInfo basicInfo-border">
      <!-- 基本信息 -->
      <div class="basicInfo-title">{{ $t("resourceMgr.zoneBaseInfo") }}</div>
      <div class="basicInfo-content">
        <!-- 组织名称： -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("authorityMgr.organizationName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.orgName }}</div>
        </div>
        <!-- 用户数-->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("authorityMgr.userNum") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.totalUser }}</div>
        </div>
        <!-- 云服务器 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("authorityMgr.serverVmNum") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.machineTotal }}</div>
        </div>
        <!--VDC -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">VDC：</div>
          <div class="basicInfo-item-value">{{ pageInfo.vdcName }}</div>
        </div>

        <!-- 上级组织  -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("authorityMgr.parentName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.parentOrgName }}</div>
        </div>
        <!-- 描述  -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("authorityMgr.remark") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.remark }}</div>
        </div>
        <!-- 创建时间 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("authorityMgr.createTime") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.createTime }}</div>
        </div>
      </div>
    </div>
    <div class="basicInfo">
      <div class="basicInfo-title">
        <!-- 资源分配情况 -->
        {{ $t("common.details.resourceAllocation") }}
      </div>
      <div class="basicInfo-content justify-between">
        <div class="basicInfo-content-chart">
          <div class="chart-content-title">
            <!-- cpu分配比 -->
            {{ $t("common.details.CPUallocationRatio") }}
          </div>
          <div class="chart-content">
            <div class="chart-box">
              <commonChart :chartData="cpufpbChart"></commonChart>
            </div>
            <div class="chart-info">
              <div>
                {{ $t("common.details.totalcapacity") }}：
                {{ pageInfo.totalCpu }}
                {{ $t("common.cpu") }}
              </div>
              <div>
                {{ $t("common.details.used") }}：
                {{ pageInfo.allocationCpu }}
                {{ $t("common.cpu") }}
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ pageInfo.surplusCpu }}
                {{ $t("common.cpu") }}
              </div>
            </div>
          </div>
        </div>
        <div class="basicInfo-content-chart">
          <div class="chart-content-title">
            <!-- 内存分配比 -->
            {{ $t("common.details.memoryAllocationRatio") }}
          </div>
          <div class="chart-content">
            <div class="chart-box">
              <commonChart :chartData="memfpbChart"></commonChart>
            </div>
            <div class="chart-info">
              <div>
                {{ $t("common.details.totalcapacity") }}：
                {{ pageInfo.totalMem + pageInfo.memUnit }}
              </div>
              <div>
                {{ $t("common.details.used") }}：
                {{ pageInfo.allocationMem + pageInfo.memUnit }}
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ pageInfo.surplusMem + pageInfo.memUnit }}
              </div>
            </div>
          </div>
        </div>
        <div class="basicInfo-content-chart">
          <div class="chart-content-title">
            <!-- 存储分配比 -->
            {{ $t("common.details.storageAllocationRatio") }}
          </div>
          <div class="chart-content">
            <div class="chart-box">
              <commonChart :chartData="storagefpbChart"></commonChart>
            </div>
            <div class="chart-info">
              <div>
                {{ $t("common.details.totalcapacity") }}：
                {{ pageInfo.totalStorage + pageInfo.storageUnit }}
              </div>
              <div>
                {{ $t("common.details.used") }}：
                {{ pageInfo.allocationStorage + pageInfo.storageUnit }}
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ pageInfo.surplusStorage + pageInfo.storageUnit }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="basicInfo">
      <div class="basicInfo-title">
        <!-- 资源统计 -->
        {{ $t("common.details.resourceStatistics") }}
      </div>
      <div class="basicInfo-content justify-between">
        <div class="basicInfo-content-chart">
          <div class="chart-content-title">
            <!-- 用户数 -->
            {{ $t("authorityMgr.userNum") }}
          </div>
          <div class="chart-content">
            <div class="chart-box">
              <commonChart :chartData="wlzjChart"></commonChart>
            </div>
            <div class="chart-info">
              <div>
                {{ $t("common.details.total") }}：
                {{ pageInfo.totalUser }}
                {{ $t("common.people") }}
              </div>
              <div>
                {{ $t("common.details.activated") }}：
                {{ pageInfo.activeUser }}
                {{ $t("common.people") }}
              </div>
              <div>
                {{ $t("common.details.inactivated") }}：
                {{ pageInfo.noActiveUser }}
                {{ $t("common.people") }}
              </div>
            </div>
          </div>
        </div>
        <div class="basicInfo-content-chart">
          <div class="chart-content-title">
            <!-- 云服务器 -->
            {{ $t("authorityMgr.serverVmNum") }}
          </div>
          <div class="chart-content">
            <div class="chart-box">
              <commonChart :chartData="yfwqChart"></commonChart>
            </div>
            <div class="chart-info">
              <div>
                {{ $t("common.details.total") }}：
                {{ pageInfo.machineTotal }}
              </div>
              <div>
                {{ $t("common.details.online") }}：
                {{ pageInfo.machineOnline }}
              </div>
              <div>
                {{ $t("common.details.offline") }}：
                {{ pageInfo.machineOffline }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonChart from "@/components/commonChart/index";
import transformat from "@/utils/transformat";
import { orgSummary } from "@/api/organization";
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
  components: { commonChart },
  data() {
    return {
      orgId: this.$route.params.id,
      pageInfo: {},

      cpufpbChart: {
        id: "orgcpufpbChart",
        option: "",
      },
      memfpbChart: {
        id: "orgmemfpbChart",
        option: "",
      },
      storagefpbChart: {
        id: "orgstoragefpbChart",
        option: "",
      },
      // 物理主机
      wlzjChart: {
        id: "orgwlzjChart",
        option: "",
      },
      // 云服务器
      yfwqChart: {
        id: "orgyfwqChart",
        option: "",
      },
    };
  },
  created() {
    this.getorgSummary();
  },
  methods: {
    getorgSummary() {
      orgSummary({ orgId: this.orgId }).then((data) => {
        this.pageInfo = data;
        this.drowChart();
      });
    },
    // 计算百分比
    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
    },
    drowChart() {
      // cpu分配比
      let cpufpb = {
        name: this.$t("common.details.CPUallocationRatio"), // "cpu分配比",
        value: this.calculatePercentage(
          this.pageInfo.allocationCpu,
          this.pageInfo.totalCpu
        ),
      };
      this.cpufpbChart.option = this.getpersentoption(cpufpb);
      // 内存分配比
      let memfpb = {
        name: this.$t("common.details.memoryAllocationRatio"), // "内存分配比",
        value: this.calculatePercentage(
          this.pageInfo.allocationMem,
          this.pageInfo.totalMem
        ),
      };
      this.memfpbChart.option = this.getpersentoption(memfpb);
      // 存储分配比
      let storagefpb = {
        name: this.$t("common.details.storageAllocationRatio"), // "存储分配比",
        value: this.calculatePercentage(
          this.pageInfo.allocationStorage,
          this.pageInfo.totalStorage
        ),
      };
      this.storagefpbChart.option = this.getpersentoption(storagefpb);

      // 饼图
      let wlzjinfo = {
        name: this.$t("authorityMgr.userNum"), // "用户数",
        data: [
          {
            value: this.pageInfo.activeUser,
            name: this.$t("common.details.activated"), // "已激活"
            itemStyle: {
              color: "#1DDBB1",
            },
          },
          {
            value: this.pageInfo.noActiveUser,
            name: this.$t("common.details.inactivated"), // "未激活"
            itemStyle: {
              color: "#409EFF",
            },
          },
        ],
      };
      this.wlzjChart.option = this.geibingoption(wlzjinfo);

      let yfwqinfo = {
        name: this.$t("authorityMgr.serverVmNum"), // "云服务器",
        data: [
          {
            value: this.pageInfo.machineOnline,
            name: this.$t("common.details.online"), // "在线"
            itemStyle: {
              color: "#1DDBB1",
            },
          },
          {
            value: this.pageInfo.machineOffline,
            name: this.$t("common.details.offline"), // "离线"
            itemStyle: {
              color: "#409EFF",
            },
          },
        ],
      };
      this.yfwqChart.option = this.geibingoption(yfwqinfo);
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
    geibingoption(info) {
      let { name, data } = info;
      let option = {
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: name,
            type: "pie",
            radius: "60%",
            data: data,
            label: {
              show: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                // color: "red",
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
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