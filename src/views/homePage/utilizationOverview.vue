<template>
  <!-- 利用率、总览 utilizationOverview -->
  <div class="utilizationOverview">
    <!-- CPU利用率 -->
    <div class="utilizationOverview-rel">
      <div class="utilizationOverview-abs">
        <commonBox :title="cpuUtilization.title">
          <div class="chart-box">
            <div class="chart-box-left">
              <div class="chart-box-main">
                <commonChart :chartData="cpuUtilization.cpuLylChart">
                </commonChart>
              </div>
              <div class="chart-box-title">
                <!-- CPU总容量 -->
                {{ $t("common.home.totalCpu") }}：
                {{ cpuUtilization.totalCpu }}GHZ
              </div>
            </div>
            <div class="chart-box-right">
              <div class="chart-box-msg">
                <div
                  class="chart-box-icon"
                  :style="{ 'background-color': cpuUtilization.color }"
                ></div>
                <div class="chart-box-text">
                  <!-- 已用： -->
                  {{ $t("common.home.used") }}： {{ cpuUtilization.usedCpu }}GHZ
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-icon"></div>
                <div class="chart-box-text">
                  <!-- 可用： -->
                  {{ $t("common.home.usable") }}：
                  {{ cpuUtilization.usableCpu }}GHZ
                </div>
              </div>
            </div>
          </div>
        </commonBox>
      </div>
    </div>

    <!-- 内存利用率 -->
    <div class="utilizationOverview-rel">
      <div class="utilizationOverview-abs">
        <commonBox :title="memoryUtilization.title">
          <div class="chart-box">
            <div class="chart-box-left">
              <div class="chart-box-main">
                <commonChart :chartData="memoryUtilization.memoryLylChart">
                </commonChart>
              </div>
              <div class="chart-box-title">
                <!-- 内存总容量 -->
                {{ $t("common.home.totalMem") }}：
                {{ memoryUtilization.totalMem }}GB
              </div>
            </div>
            <div class="chart-box-right">
              <div class="chart-box-msg">
                <div
                  class="chart-box-icon"
                  :style="{ 'background-color': memoryUtilization.color }"
                ></div>
                <div class="chart-box-text">
                  <!-- 已用： -->
                  {{ $t("common.home.used") }}：
                  {{ memoryUtilization.usedMem }}GB
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-icon"></div>
                <div class="chart-box-text">
                  <!-- 可用： -->
                  {{ $t("common.home.usable") }}：
                  {{ memoryUtilization.usableMem }}GB
                </div>
              </div>
            </div>
          </div>
        </commonBox>
      </div>
    </div>

    <!-- 存储利用率 -->
    <div class="utilizationOverview-rel">
      <div class="utilizationOverview-abs">
        <commonBox :title="storageUtilization.title">
          <div class="chart-box">
            <div class="chart-box-left">
              <div class="chart-box-main">
                <commonChart :chartData="storageUtilization.storageLylChart">
                </commonChart>
              </div>
              <div class="chart-box-title">
                <!-- 存储总容量： -->
                {{ $t("common.home.totalStorage") }}：
                {{ storageUtilization.totalStorage }}GB
              </div>
            </div>

            <div class="chart-box-right">
              <div class="chart-box-msg">
                <div
                  class="chart-box-icon"
                  :style="{ 'background-color': storageUtilization.color }"
                ></div>
                <div class="chart-box-text">
                  <!-- 已用： -->
                  {{ $t("common.home.used") }}：
                  {{ storageUtilization.usedStorage }}GB
                </div>
              </div>
              <div class="chart-box-msg">
                <div class="chart-box-icon"></div>
                <div class="chart-box-text">
                  <!-- 可用： -->
                  {{ $t("common.home.usable") }}：
                  {{ storageUtilization.usableStorage }}GB
                </div>
              </div>
            </div>
          </div>
        </commonBox>
      </div>
    </div>
    <!-- 账户总览 -->
    <div class="utilizationOverview-rel">
      <div class="utilizationOverview-abs">
        <commonBox :title="accountOverview.title">
          <div class="accountOverview-content">
            <percentageBox
              v-for="(item, index) in accountOverview.list"
              :key="'accountOverview' + index"
              :option="item"
              :unit="''"
            >
            </percentageBox>
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
      // CPU利用率
      cpuUtilization: {
        title: this.$t("common.home.cpuUtilization"), // "CPU利用率",
        totalCpu: "",
        usedCpu: "",
        usableCpu: "",
        color: "",
        cpuLylChart: {
          id: "cpuLylChart",
          option: "",
        },
      },
      // 内存利用率
      memoryUtilization: {
        title: this.$t("common.home.memoryUtilization"), // "内存利用率",
        totalmemory: "",
        usedmemory: "",
        usablememory: "",
        color: "",
        memoryLylChart: {
          id: "memoryLylChart",
          option: "",
        },
      },
      // 存储利用率
      storageUtilization: {
        title: this.$t("common.home.storageUtilization"), // "存储利用率",
        totalStorage: "",
        usedStorage: "",
        usableStorage: "",
        color: "",
        storageLylChart: {
          id: "storageLylChart",
          option: "",
        },
      },
      // 账户总览
      accountOverview: {
        title: this.$t("common.home.accountOverview"), // "账户总览",
        list: [
          {
            label: this.$t("common.home.platformManage"), // "平台管理用户",
            key: "platformManage",
            percentage: "0",
            percentageNum: "0",
          },
          {
            label: this.$t("common.home.orgManage"), // "组织管理用户",
            key: "orgManage",
            percentage: "0",
            percentageNum: "0",
          },
          {
            label: this.$t("common.home.selfService"), // "自服务用户",
            key: "selfService",
            percentage: "0",
            percentageNum: "0",
          },
        ],
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
      let { userData } = pageData;
      let total =
        userData.platformManageUserCount +
        userData.orgManageUserCount +
        userData.selfServiceUserCount;
      this.accountOverview.list.forEach((element) => {
        let { key } = element;
        switch (key) {
          case "platformManage":
            element.percentage =
              (userData.platformManageUserCount / total) * 100;
            element.percentageNum = userData.platformManageUserCount;
            break;
          case "orgManage":
            element.percentage = (userData.orgManageUserCount / total) * 100;
            element.percentageNum = userData.orgManageUserCount;
            break;
          case "selfService":
            element.percentage = (userData.selfServiceUserCount / total) * 100;
            element.percentageNum = userData.selfServiceUserCount;
            break;

          default:
            break;
        }
      });
    },

    drowChart(pageData) {
      let { cpuData, memData, storageData } = pageData;
      // CPU利用率
      let cpuLylChart = {
        name: this.cpuUtilization.title, // CPU利用率
        value: this.calculatePercentage(cpuData.usedCpu, cpuData.totalCpu),
      };
      this.cpuUtilization.usedCpu = cpuData.usedCpu;
      this.cpuUtilization.totalCpu = cpuData.totalCpu;
      this.cpuUtilization.usableCpu = cpuData.usableCpu;
      this.cpuUtilization.color = this.customColorMethod(
        this.calculatePercentage(cpuData.usedCpu, cpuData.totalCpu)
      );
      this.cpuUtilization.cpuLylChart.option =
        this.getpersentoption(cpuLylChart);

      // 内存利用率
      let memoryLylChart = {
        name: this.memoryUtilization.title, // CPU利用率
        value: this.calculatePercentage(memData.usedMem, memData.totalMem),
      };
      this.memoryUtilization.usedMem = memData.usedMem;
      this.memoryUtilization.totalMem = memData.totalMem;
      this.memoryUtilization.usableMem = memData.usableMem;
      this.memoryUtilization.color = this.customColorMethod(
        this.calculatePercentage(memData.usedMem, memData.totalMem)
      );
      this.memoryUtilization.memoryLylChart.option =
        this.getpersentoption(memoryLylChart);

      // 存储利用率
      let storageLylChart = {
        name: this.storageUtilization.title, // CPU利用率
        value: this.calculatePercentage(
          storageData.usedStorage,
          storageData.totalStorage
        ),
      };
      this.storageUtilization.usedStorage = storageData.usedStorage;
      this.storageUtilization.totalStorage = storageData.totalStorage;
      this.storageUtilization.usableStorage = storageData.usableStorage;
      this.storageUtilization.color = this.customColorMethod(
        this.calculatePercentage(
          storageData.usedStorage,
          storageData.totalStorage
        )
      );
      this.storageUtilization.storageLylChart.option =
        this.getpersentoption(storageLylChart);
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
  },
};
</script>

<style lang="scss" scoped>
.utilizationOverview {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  .accountOverview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    flex: 1;
    padding: 0 40px;
  }
  .chart-box {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    .chart-box-left {
      display: flex;
      flex-direction: column;
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
      margin: 0 15px;
      width: 35%;
      .chart-box-msg {
        margin: 20px 0px;
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
