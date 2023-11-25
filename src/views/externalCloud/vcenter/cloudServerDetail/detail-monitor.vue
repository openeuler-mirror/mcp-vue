<template>
  <div class="detailMonitor">
    <highChart
      :key="cpu"
      :chartsName="cpu"
      :showDateBtn="true"
      :options="calcChartsData(cpuData, 'cpu')"
      :chartsBtnData="chartsBtnData"
      :otherBtnDisabled="dateData[cpu]['otherBtnDisabled']"
      @changeDateType="handelChangeDate"
      v-loading="dateData[cpu]['otherBtnDisabled']"
    />
    <highChart
      :key="mem"
      :chartsName="mem"
      :showDateBtn="true"
      :options="calcChartsData(memData, 'mem')"
      :chartsBtnData="chartsBtnData"
      :otherBtnDisabled="dateData[mem]['otherBtnDisabled']"
      @changeDateType="handelChangeDate"
      v-loading="dateData[mem]['otherBtnDisabled']"
    />
    <highChart
      :key="disk"
      :chartsName="disk"
      :showDateBtn="true"
      :options="calcChartsData(diskData, 'disk')"
      :chartsBtnData="chartsBtnData"
      @changeDateType="handelChangeDate"
    />
    <highChart
      :key="network"
      :chartsName="network"
      :showDateBtn="true"
      :chartsBtnData="chartsBtnData"
      :options="calcChartsData(netData, 'net')"
      @changeDateType="handelChangeDate"
    />
  </div>
</template>

<script>
import highChart from "@/components/Hightchart";
import {
  getServerMonitorListData,
  getServerStorageMonitorListData,
  getServerNetworkMonitorListData,
} from "@/api/vcenter";
export default {
  components: {
    highChart,
  },
  data() {
    return {
      cpu: "CPU_USAGE",
      mem: "MEMORY_USAGE",
      disk: "DISK_DATA",
      network: "NET_DATA",
      vcenterId: this.$route.params.vcenterId,
      vmName: this.$route.params.name,
      chartOptions: {
        title: {
          align: "left",
          text: "",
          style: {
            fontSize: "14px",
          },
          margin: 50,
        },
        xAxis: {
          type: "datetime",
          dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L",
            second: "%H:%M:%S",
            minute: "%H:%M",
            hour: "%H:%M",
            day: "%m-%d",
            week: "%m-%d",
            month: "%Y-%m",
            year: "%Y",
          },
        },
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L",
            second: "%H:%M:%S",
            minute: "%H:%M",
            hour: "%H:%M",
            day: "%Y-%m-%d",
            week: "%m-%d",
            month: "%Y-%m",
            year: "%Y",
          },
        },
        yAxis: {
          title: {
            align: "high",
            offset: 0,
            rotation: 0,
            y: -30,
            text: "",
            style: {
              fontSize: "12px",
            },
          },
        },
        legend: {
          layout: "vertical",
          align: "center",
          verticalAlign: "top",
        },
        credits: {
          enabled: false,
        },
        series: [],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
            },
          ],
        },
      },
      titleData: {
        cpu: this.$t("common.details.CPUUtilization") + "(%)", // "CPU利用率(%)";
        mem: this.$t("common.details.memoryUtilization") + "(%)", // "内存利用率(%)";
        disk: this.$t("common.details.disk") + "I/O(KB/s)", // "磁盘I/O(KB/s)";
        net: this.$t("common.details.network") + "(KB/s)", // "网络(KB/s)"
      },
      chartsBtnData: [
        {
          key: "最近1小时",
          value: "1H",
        },
        {
          key: "最近24小时",
          value: "24H",
        },
      ],
      dateData: {
        CPU_USAGE: {
          type: "1H",
          otherBtnDisabled: false,
        },
        MEMORY_USAGE: {
          type: "1H",
          otherBtnDisabled: false,
        },
        DISK_DATA: {
          type: "1H",
          otherBtnDisabled: false,
        },
        NET_DATA: {
          type: "1H",
          otherBtnDisabled: false,
        },
      },
      cpuData: [],
      memData: [],
      diskData: {},
      netData: {},
      type: ["CPU_USAGE", "MEMORY_USAGE", "DISK_DATA", "NET_DATA"],
    };
  },
  created() {
    this.cpuChartsOption = this.chartOptions;
    this.memChartsOption = this.chartOptions;
    this.netChartsOption = this.chartOptions;
    this.diskChartsOption = this.chartOptions;
    Promise.allSettled([
      this.getMonitorInfo("CPU_USAGE"),
      this.getMonitorInfo("MEMORY_USAGE"),
      this.getServerStorageMonitorListData("DISK_DATA"),
      this.getServerNetworkMonitorListData("NET_DATA"),
    ])
      .then((res) => {})
      .catch(() => {});
  },
  methods: {
    getMonitorInfo(key) {
      const monitorKey = key;
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.vmName,
        monitorKey,
        timeUnit: this.dateData[monitorKey]["type"],
      };
      this.$set(this.dateData[monitorKey], "otherBtnDisabled", true);
      getServerMonitorListData(params)
        .then((res) => {
          this.setChartsData(key, res);
          this.$set(this.dateData[monitorKey], "otherBtnDisabled", false);
        })
        .catch(() => {
          this.$set(this.dateData[monitorKey], "otherBtnDisabled", false);
        });
    },
    setChartsData(type, res) {
      let dataList = [];
      let dataObj = {
        data1: [],
        data2: [],
      };
      switch (type) {
        case "CPU_USAGE":
          dataList = res.map((data) => [data.samplingTime, data.samplingValue]);
          this.$set(this, "cpuData", dataList);
          break;
        case "MEMORY_USAGE":
          dataList = res.map((data) => [data.samplingTime, data.samplingValue]);
          this.$set(this, "memData", dataList);
          break;
        case "DISK_DATA":
          res.forEach((data) => {
            dataObj.data1.push([data.samplingTime, data.samplingReadValue]);
            dataObj.data2.push([data.samplingTime, data.samplingWriteValue]);
          });
          this.$set(this, "diskData", dataObj);
          break;
        case "NET_DATA":
          res.forEach((data) => {
            dataObj.data1.push([data.samplingTime, data.samplingInValue]);
            dataObj.data2.push([data.samplingTime, data.samplingOutValue]);
          });
          this.$set(this, "netData", dataObj);
          break;
        default:
          break;
      }
    },
    calcChartsData(data, type) {
      const chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      const titleData = this.titleData[type];
      chartOptions.chart = {
        type: "spline",
      };
      chartOptions.title.text = titleData;
      switch (type) {
        case "cpu":
          chartOptions.yAxis.labels = {
            formatter: function () {
              return this.value.toFixed(1) + "%";
            },
          };
          chartOptions.series = [
            {
              name: titleData,
              data,
            },
          ];
          break;
        case "mem":
          chartOptions.yAxis.labels = {
            formatter: function () {
              return this.value.toFixed(1) + "%";
            },
          };
          chartOptions.series = [
            {
              name: titleData,
              data,
            },
          ];
          break;
        case "disk":
          chartOptions.series = [
            {
              name: this.$t("common.details.diskIOwrites"), // "磁盘I/O写入",
              data: this.diskData.data1,
            },
            {
              name: this.$t("common.details.diskIOread"), // "磁盘I/O读取",
              data: this.diskData.data2,
            },
          ];
          break;
        case "net":
          chartOptions.series = [
            {
              name: this.$t("common.details.netWorkInSpeedData"), // "网络流入速度",
              data: this.netData.data1,
            },
            {
              name: this.$t("common.details.netWorkOutSpeedData"), // "网络流出速度",
              data: this.netData.data2,
            },
          ];
          break;
        default:
          break;
      }

      return chartOptions;
    },
    handelChangeDate(data, key) {
      this.dateData[key]["type"] = data;
      if (key === "CPU_USAGE" || key === "MEMORY_USAGE") {
        this.getMonitorInfo(key);
      }
      if (key === "DISK_DATA") {
        this.getServerStorageMonitorListData(key);
      }
      if (key === "NET_DATA") {
        this.getServerNetworkMonitorListData(key);
      }
    },
    getServerStorageMonitorListData(monitorKey) {
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.vmName,
        monitorKeys: ["DISK_READ_IO", "DISK_WRITE_IO"],
        timeUnit: this.dateData[monitorKey]["type"],
      };
      this.$set(this.dateData[monitorKey], "otherBtnDisabled", true);
      getServerStorageMonitorListData(params)
        .then((res) => {
          this.setChartsData(monitorKey, res);
          this.$set(this.dateData[monitorKey], "otherBtnDisabled", false);
        })
        .catch(() => {
          this.$set(this.dateData[monitorKey], "otherBtnDisabled", false);
        });
    },
    getServerNetworkMonitorListData(monitorKey) {
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.vmName,
        monitorKeys: ["NET_TRANSFER_SPEED", "NET_RECEIVE_SPEED"],
        timeUnit: this.dateData[monitorKey]["type"],
      };
      this.$set(this.dateData[monitorKey], "otherBtnDisabled", true);
      getServerNetworkMonitorListData(params)
        .then((res) => {
          this.setChartsData(monitorKey, res);
          this.$set(this.dateData[monitorKey], "otherBtnDisabled", false);
        })
        .catch(() => {
          this.$set(this.dateData[monitorKey], "otherBtnDisabled", false);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.detailMonitor {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 5px;
  @include nineStyle(2);
  > div {
    padding: 10px;
  }
}
</style>
