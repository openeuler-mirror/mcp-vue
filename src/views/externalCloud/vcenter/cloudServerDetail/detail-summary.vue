<template>
  <div>
    <div class="detailSummary">
      <div class="basicInfo">
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
                  {{ resourceUsedInfo.memoryTotalCapacity }}
                  GB
                </div>
                <div>
                  {{ $t("common.details.used") }}：
                  {{ resourceUsedInfo.memoryUsedCapacity }}
                  GB
                </div>
                <div>
                  {{ $t("common.details.available") }}：
                  {{ resourceUsedInfo.memoryFreeCapacity }}
                  GB
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
                  {{ resourceUsedInfo.storageTotalCapacity }}
                  GB
                </div>
                <div>
                  {{ $t("common.details.used") }}：
                  {{ resourceUsedInfo.storageUsedCapacity }}
                  GB
                </div>
                <div>
                  {{ $t("common.details.available") }}：
                  {{ resourceUsedInfo.storageFreeCapacity }}
                  GB
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <mc-table
      ref="detailSummary"
      :data="tableData"
      :short-height="60"
      :rowkey="rowkey"
    >
      <el-table-column
        v-for="(item, index) in columnArr"
        :key="index"
        :label="item.label"
      >
        <template slot-scope="{ row }">
          <span>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>
    </mc-table>
  </div>
</template>

<script>
import { getServerSummaryData, getServerSummaryAlarmData } from "@/api/vcenter";
import commonChart from "@/components/commonChart/index";
import mcTable from "@/components/MctablePro";

export default {
  name: "serverVmSummary",
  components: { commonChart, mcTable },
  data() {
    return {
      vcenterId: this.$route.params.vcenterId,
      vmName: this.$route.params.name,
      // 变更云服务器
      serverSummaryInfo: { cpuCount: "", cpuPercent: 0 },

      resourceUsedInfo: {
        cpuCount: "", // CPU

        memoryUsed: "", //内存已使用
        memoryTotal: "", //内存总大小
        memorySurplus: "",
        diskTotalUsed: "", //存储已使用
        diskTotal: "", //存储总大小
        diskSurplus: "",
      },

      cpufpbChart: {
        id: "serverVmcpufpbChart",
        option: "",
      },
      memfpbChart: {
        id: "serverVmmemfpbChart",
        option: "",
      },
      storagefpbChart: {
        id: "serverVmstoragefpbChart",
        option: "",
      },

      rowkey: "",
      columnArr: [
        {
          label: this.$t("resourceMgr.summary.type"), // "告警类型",
          prop: "alarmType",
        },
        {
          label: this.$t("resourceMgr.summary.date"), // "告警时间",
          prop: "alarmTime",
        },
        {
          label: this.$t("resourceMgr.summary.severity"), // "告警等级",
          prop: "alarmLevel",
        },
        {
          label: this.$t("resourceMgr.summary.info"), // "告警详情",
          prop: "alarmDetail",
        },
      ],
      tableData: [],
    };
  },
  created() {
    this.getServerVmSummary();
    this.renderTable();
  },
  methods: {
    getServerVmSummary() {
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.vmName,
      };
      getServerSummaryData(params).then((data) => {
        this.serverSummaryInfo = data;
        this.drowChart();
      });
    },
    renderTable() {
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.vmName,
      };
      getServerSummaryAlarmData(params).then((res) => {
        this.tableData = res;
      });
    },
    drowChart() {
      if (JSON.stringify(this.serverSummaryInfo) == "{}") {
        return;
      }
      this.resourceUsedInfo = this.serverSummaryInfo;

      // CPU利用率
      let cpufpb = {
        nama: this.$t("common.details.CPUUtilization"), // "CPU利用率",
        value: this.resourceUsedInfo.cpuUsedRate,
      };
      this.cpufpbChart.option = this.getpersentoption(cpufpb);
      // 内存利用率
      let memfpb = {
        nama: this.$t("common.details.memoryUtilization"), // "内存利用率",
        value: this.resourceUsedInfo.memoryUsedRate,
      };
      this.memfpbChart.option = this.getpersentoption(memfpb);
      // 存储利用率
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
.detailSummary {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  .basicInfo {
    padding: 10px 20px;
    padding-top: 0px;
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
}
</style>
