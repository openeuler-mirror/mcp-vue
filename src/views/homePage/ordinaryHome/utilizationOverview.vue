<template>
  <!-- 分配比 -->
  <div class="utilizationOverview">
    <!-- CPU分配比 -->
    <div class="utilizationOverview-rel">
      <div class="utilizationOverview-abs">
        <commonBox :title="cpuUtilization.title">
          <div class="chart-box">
            <div class="chart-box-left">
              <div class="chart-box-main">
                <commonChart :chartData="cpuUtilization.cpuFpbChart">
                </commonChart>
              </div>
            </div>
            <div class="chart-box-right">
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  {{ $t("common.details.totalcapacity") }}：
                  {{ cpuUtilization.total }}
                  {{ cpuUtilization.unit }}
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  <!-- 已分配下级 -->
                  {{ $t("resourceMgr.vdcSubAssigned") }}：
                  {{ cpuUtilization.allocateChild }}
                  {{ cpuUtilization.unit }}
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  <!-- 本级已使用： -->
                  {{ $t("resourceMgr.vdcThislevelUsed") }}：
                  {{ cpuUtilization.sameUsed }}
                  {{ cpuUtilization.unit }}
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  <!-- 可用： -->
                  {{ $t("common.details.available") }}：
                  {{ cpuUtilization.usable }}
                  {{ cpuUtilization.unit }}
                </div>
              </div>
            </div>
          </div>
        </commonBox>
      </div>
    </div>

    <!-- 内存分配比 -->
    <div class="utilizationOverview-rel">
      <div class="utilizationOverview-abs">
        <commonBox :title="memoryUtilization.title">
          <div class="chart-box">
            <div class="chart-box-left">
              <div class="chart-box-main">
                <commonChart :chartData="memoryUtilization.memoryFpbChart">
                </commonChart>
              </div>
            </div>
            <div class="chart-box-right">
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  {{ $t("common.details.totalcapacity") }}：
                  {{ memoryUtilization.total }}
                  {{ memoryUtilization.unit }}
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  <!-- 已分配下级 -->
                  {{ $t("resourceMgr.vdcSubAssigned") }}：
                  {{ memoryUtilization.allocateChild }}
                  {{ memoryUtilization.unit }}
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  <!-- 本级已使用： -->
                  {{ $t("resourceMgr.vdcThislevelUsed") }}：
                  {{ memoryUtilization.sameUsed }}
                  {{ memoryUtilization.unit }}
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  <!-- 可用： -->
                  {{ $t("common.details.available") }}：
                  {{ memoryUtilization.usable }}
                  {{ memoryUtilization.unit }}
                </div>
              </div>
            </div>
          </div>
        </commonBox>
      </div>
    </div>

    <!-- 存储分配比 -->
    <div class="utilizationOverview-rel">
      <div class="utilizationOverview-abs">
        <commonBox :title="storageUtilization.title">
          <div class="chart-box">
            <div class="chart-box-left">
              <div class="chart-box-main">
                <commonChart :chartData="storageUtilization.storageFpbChart">
                </commonChart>
              </div>
            </div>

            <div class="chart-box-right">
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  {{ $t("common.details.totalcapacity") }}：
                  {{ storageUtilization.total }}
                  {{ storageUtilization.unit }}
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  <!-- 已分配下级 -->
                  {{ $t("resourceMgr.vdcSubAssigned") }}：
                  {{ storageUtilization.allocateChild }}
                  {{ storageUtilization.unit }}
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  <!-- 本级已使用： -->
                  {{ $t("resourceMgr.vdcThislevelUsed") }}：
                  {{ storageUtilization.sameUsed }}
                  {{ storageUtilization.unit }}
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-text">
                  <!-- 可用： -->
                  {{ $t("common.details.available") }}：
                  {{ storageUtilization.usable }}
                  {{ storageUtilization.unit }}
                </div>
              </div>
            </div>
          </div>
        </commonBox>
      </div>
    </div>
  </div>
</template>

<script>
import commonBox from "./commonBox.vue";
import percentageBox from "./percentageBox.vue";
import commonChart from "@/components/commonChart/index";
import transformat from "@/utils/transformat";
export default {
  name: "utilizationOverview",
  props: ["pageData"],
  components: { commonBox, percentageBox, commonChart },
  computed: {},
  data() {
    return {
      // CPU分配比
      cpuUtilization: {
        title: this.$t("common.details.CPUallocationRatio"), // "CPU分配比",
        total: "",
        allocateChild: "",
        usable: "",
        sameUsed: "",
        unit: this.$t("common.cpu"),
        cpuFpbChart: {
          id: "cpuFpbChart",
          option: "",
        },
      },
      // 内存分配比
      memoryUtilization: {
        title: this.$t("common.details.memoryAllocationRatio"), // "内存分配比",
        total: "",
        allocateChild: "",
        usable: "",
        sameUsed: "",
        unit: "",
        memoryFpbChart: {
          id: "memoryFpbChart",
          option: "",
        },
      },
      // 存储分配比
      storageUtilization: {
        title: this.$t("common.details.storageAllocationRatio"), // "存储分配比",
        totalStorage: "",
        usedStorage: "",
        usableStorage: "",
        color: "",
        storageFpbChart: {
          id: "storageFpbChart",
          option: "",
        },
      },
    };
  },
  watch: {
    pageData(val) {
      this.setpageData(val);
    },
  },
  mounted() {},
  methods: {
    setpageData(pageData) {
      this.drowChart(pageData);
    },

    drowChart(pageData) {
      let { vdcCpuUsedData, vdcMemUsedData, vdcStorageUsedData } = pageData;
      // CPU分配比
      let cpuFpbChart = {
        nama: this.cpuUtilization.title, // CPU分配比
        data: [
          {
            value: vdcCpuUsedData.allocateChild,
            name: this.$t("resourceMgr.vdcSubAssigned"), // 已分配下级
          },
          {
            value: vdcCpuUsedData.usable,
            name: this.$t("common.details.available"), // "可用"
          },
          {
            value: vdcCpuUsedData.sameUsed,
            name: this.$t("resourceMgr.vdcThislevelUsed"), //  "本级已使用"
          },
        ],
      };
      this.cpuUtilization.total = vdcCpuUsedData.total;
      this.cpuUtilization.allocateChild = vdcCpuUsedData.allocateChild;
      this.cpuUtilization.usable = vdcCpuUsedData.usable;
      this.cpuUtilization.sameUsed = vdcCpuUsedData.sameUsed;
      this.cpuUtilization.cpuFpbChart.option = this.getbingoption(cpuFpbChart);

      // 内存分配比
      let memoryFpbChart = {
        nama: this.memoryUtilization.title, // CPU分配比
        data: [
          {
            value: vdcMemUsedData.allocateChild,
            name: this.$t("resourceMgr.vdcSubAssigned"), // 已分配下级
          },
          {
            value: vdcMemUsedData.usable,
            name: this.$t("common.details.available"), // "可用"
          },
          {
            value: vdcMemUsedData.sameUsed,
            name: this.$t("resourceMgr.vdcThislevelUsed"), //  "本级已使用"
          },
        ],
      };
      this.memoryUtilization.total = vdcMemUsedData.total;
      this.memoryUtilization.allocateChild = vdcMemUsedData.allocateChild;
      this.memoryUtilization.usable = vdcMemUsedData.usable;
      this.memoryUtilization.sameUsed = vdcMemUsedData.sameUsed;
      this.memoryUtilization.unit = vdcMemUsedData.unit;
      this.memoryUtilization.memoryFpbChart.option =
        this.getbingoption(memoryFpbChart);

      // 存储分配比
      let storageFpbChart = {
        nama: this.storageUtilization.title, // CPU分配比
        data: [
          {
            value: vdcMemUsedData.allocateChild,
            name: this.$t("resourceMgr.vdcSubAssigned"), // 已分配下级
          },
          {
            value: vdcMemUsedData.usable,
            name: this.$t("common.details.available"), // "可用"
          },
          {
            value: vdcMemUsedData.sameUsed,
            name: this.$t("resourceMgr.vdcThislevelUsed"), //  "本级已使用"
          },
        ],
      };
      this.storageUtilization.total = vdcStorageUsedData.total;
      this.storageUtilization.allocateChild = vdcStorageUsedData.allocateChild;
      this.storageUtilization.usable = vdcStorageUsedData.usable;
      this.storageUtilization.sameUsed = vdcStorageUsedData.sameUsed;
      this.storageUtilization.unit = vdcStorageUsedData.unit;
      this.storageUtilization.storageFpbChart.option =
        this.getbingoption(storageFpbChart);
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
    // 计算百分比
    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
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
            radius: ["85%", "100%"],
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

    getbingoption(info) {
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
.utilizationOverview {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: 100%;
  grid-gap: 10px;

  //   width: 100%;
  //   height: 240px;
  .utilizationOverview-rel {
    display: flex;
    flex: 1;
    position: relative;
  }
  .utilizationOverview-abs {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  .chart-box {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    .chart-box-left {
      display: flex;
      flex-direction: column;
      width: 50%;
      align-items: flex-end;
      margin: 0 15px;
      .chart-box-main {
        width: 165px;
        height: 165px;
      }
      .chart-box-title {
        width: 100%;
        margin: 15px 0;
        text-align: center;
      }
    }
    .chart-box-right {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 50%;
      align-items: flex-start;
      margin: 0 15px;
      .chart-box-msg {
        margin: 5px 0px;
        display: flex;
        align-items: center;
        .chart-box-icon {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #dfeaff;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
