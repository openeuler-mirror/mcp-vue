<template>
  <!-- physicalClusterDetail -->
  <div class="summary-detail">
    <div class="basicInfo basicInfo-border">
      <!-- 基本信息 -->
      <div class="basicInfo-title">{{ $t("resourceMgr.vdcBaseInfo") }}</div>
      <div class="basicInfo-content">
        <!-- 名称 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.vdcName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.vdcName }}</div>
        </div>
        <!-- 上级VDC -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.vdcparentName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.parentName }}</div>
        </div>
        <!-- 组织机构 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.vdcorgName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.orgName }}</div>
        </div>
        <!-- 网络 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.vdcnetworkNum") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.networkNum }}</div>
        </div>
        <!-- 可用区 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.zoneName") }}：
          </div>
          <div class="basicInfo-item-value">{{ pageInfo.zoneName }}</div>
        </div>
        <!-- 添加时间 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">
            {{ $t("resourceMgr.vdccreateTime") }}：
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
      <div class="basicInfo-content">
        <div class="basicInfo-content-chart">
          <div class="chart-content-title">
            <!-- cpu分配比 -->
            总{{ $t("common.details.CPUallocationRatio") }}
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
                <!-- 已分配下级 -->
                {{ $t("resourceMgr.vdcSubAssigned") }}：
                {{ pageInfo.allocationCpu }}
                {{ $t("common.cpu") }}
              </div>
              <div>
                <!-- 本级已使用： -->
                {{ $t("resourceMgr.vdcThislevelUsed") }}：
                {{ pageInfo.sameUserUsedCpu }}
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
            总{{ $t("common.details.memoryAllocationRatio") }}
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
                <!-- 已分配下级 -->
                {{ $t("resourceMgr.vdcSubAssigned") }}：
                {{ pageInfo.allocationMem + pageInfo.memUnit }}
              </div>
              <div>
                <!-- 本级已使用： -->
                {{ $t("resourceMgr.vdcThislevelUsed") }}：
                {{ pageInfo.sameUserUsedMem + pageInfo.memUnit }}
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
                <!-- 已分配下级 -->
                {{ $t("resourceMgr.vdcSubAssigned") }}：
                {{ pageInfo.allocationStorage + pageInfo.storageUnit }}
              </div>
              <div>
                <!-- 本级已使用： -->
                {{ $t("resourceMgr.vdcThislevelUsed") }}：
                {{ pageInfo.sameUserUsedStorage + pageInfo.storageUnit }}
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ pageInfo.surplusStorage + pageInfo.storageUnit }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="basicInfo-content-chart"
          v-for="(item, architectureIndex) in architectureList"
          :key="'architecture' + architectureIndex"
        >
          <div class="chart-content-title">
            <!-- cpu分配比 -->
            {{ item.title }}
          </div>
          <div class="chart-content">
            <div class="chart-box">
              <commonChart :chartData="item.fpbChart"></commonChart>
            </div>
            <div class="chart-info">
              <div>
                {{ $t("common.details.totalcapacity") }}：
                {{ item.total }}
                {{ item.unit }}
              </div>
              <div>
                <!-- 已分配下级 -->
                {{ $t("resourceMgr.vdcSubAssigned") }}：
                {{ item.allocation }}
                {{ item.unit }}
              </div>
              <div>
                <!-- 本级已使用： -->
                {{ $t("resourceMgr.vdcThislevelUsed") }}：
                {{ item.sameUserUsed }}
                {{ item.unit }}
              </div>
              <div>
                {{ $t("common.details.available") }}：
                {{ item.surplus }}
                {{ item.unit }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="basicInfo-content-info"
          v-for="(item, index) in pageInfo.networkList"
          :key="'network' + index"
        >
          <div class="chart-content-title">
            {{ $t("resourceMgr.network.networkCard") + (index + 1) }}
          </div>
          <div class="info-content">
            <div class="info-left">
              <!-- 物理集群： -->
              <div>
                {{ $t("resourceMgr.network.cluster") }}：
                {{ item.clusterName }}
              </div>
              <!-- 地址池： -->
              <div>
                {{ $t("resourceMgr.network.addressPool") }}：
                {{ item.addressPool }}
              </div>
              <!-- 端口组： -->
              <div>
                {{ $t("resourceMgr.network.portGroup") }}：
                {{ item.portGroup }}
              </div>
            </div>
            <div class="info-right">
              <!-- 网络名称： -->
              <div>
                {{ $t("resourceMgr.network.networkName") }}：
                {{ item.networkName }}
              </div>
              <!-- 虚拟交换机： -->
              <div>
                {{ $t("resourceMgr.network.virtualSwitch") }}：
                {{ item.virtualSwitch }}
              </div>
              <!-- 安全组： -->
              <div>
                {{ $t("resourceMgr.network.permission") }}：
                {{ item.securityGroup }}
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
      // 代表在watch里声明了 立即先去执行handler方法
      immediate: true,
      deep: true,
    },
  },
  components: { headerBar, commonChart },
  data() {
    return {
      pageInfo: {},

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
      networkList: [{}, {}, {}, {}],
      architectureList: [],
    };
  },
  created() {},
  methods: {
    drowChart() {
      this.pageInfo = this.dataInfo;
      // cpu分配比
      let cpufpb = {
        name: this.$t("common.details.CPUallocationRatio"), // "cpu分配比",
        data: [
          {
            value: this.pageInfo.allocationCpu,
            name: this.$t("resourceMgr.vdcSubAssigned"), // 已分配下级
          },
          {
            value: this.pageInfo.surplusCpu,
            name: this.$t("common.details.available"), // "可用"
            itemStyle: {
              color: "#1DDBB1",
            },
          },
          {
            value: this.pageInfo.sameUserUsedCpu,
            name: this.$t("resourceMgr.vdcThislevelUsed"), //  "本级已使用"
            itemStyle: {
              color: "#409EFF",
            },
          },
        ],
      };
      this.cpufpbChart.option = this.getbingoption(cpufpb);
      // 内存分配比
      let memfpb = {
        name: this.$t("common.details.memoryAllocationRatio"), // "内存分配比",
        data: [
          {
            value: this.pageInfo.allocationMem,
            name: this.$t("resourceMgr.vdcSubAssigned"), //  已分配下级
          },
          {
            value: this.pageInfo.surplusMem,
            name: this.$t("common.details.available"), // "可用"
            itemStyle: {
              color: "#1DDBB1",
            },
          },
          {
            value: this.pageInfo.sameUserUsedMem,
            name: this.$t("resourceMgr.vdcThislevelUsed"), //  "本级已使用"
            itemStyle: {
              color: "#409EFF",
            },
          },
        ],
      };
      this.memfpbChart.option = this.getbingoption(memfpb);
      // 存储分配比
      let storagefpb = {
        name: this.$t("common.details.storageAllocationRatio"), // "存储分配比",
        data: [
          {
            value: this.pageInfo.allocationStorage,
            name: this.$t("resourceMgr.vdcSubAssigned"), //  已分配下级
          },
          {
            value: this.pageInfo.surplusStorage,
            name: this.$t("common.details.available"), // "可用"
            itemStyle: {
              color: "#1DDBB1",
            },
          },
          {
            value: this.pageInfo.sameUserUsedStorage,
            name: this.$t("resourceMgr.vdcThislevelUsed"), //  "本级已使用"
            itemStyle: {
              color: "#409EFF",
            },
          },
        ],
      };
      this.storagefpbChart.option = this.getbingoption(storagefpb);
      let { architectureUsedResourceList } = this.pageInfo;
      if (architectureUsedResourceList) {
        let architectureListArr = [];
        architectureUsedResourceList.forEach((element, index) => {
          let { resourceType, architectureType } = element;
          let unit = "";
          let resourceTypeDesc = "";
          if (resourceType == "CPU") {
            unit = this.$t("common.cpu");
            resourceTypeDesc = this.$t("common.details.CPUallocationRatio");
          } else if (resourceType == "MEM") {
            unit = "GB";
            resourceTypeDesc = this.$t("common.details.memoryAllocationRatio");
          } else {
            unit = "";
            resourceTypeDesc = "";
          }

          let fpb = {
            name: this.$t("common.details.storageAllocationRatio"), // "存储分配比",
            data: [
              {
                value: element.allocationChild,
                name: this.$t("resourceMgr.vdcSubAssigned"), //  已分配下级
              },
              {
                value: element.surplus,
                name: this.$t("common.details.available"), // "可用"
                itemStyle: {
                  color: "#1DDBB1",
                },
              },
              {
                value: element.sameUserUsed,
                name: this.$t("resourceMgr.vdcThislevelUsed"), //  "本级已使用"
                itemStyle: {
                  color: "#409EFF",
                },
              },
            ],
          };
          let fpbChart = {
            id: architectureType + resourceType + index,
            option: this.getbingoption(fpb),
          };

          let architectureObj = {
            title:
              architectureType +
              this.$t("resourceMgr.vdcArchitecture") +
              resourceTypeDesc,
            total: element.total,
            allocation: element.allocationChild,
            sameUserUsed: element.sameUserUsed,
            surplus: element.surplus,
            unit: unit,
            fpbChart: fpbChart,
          };
          architectureListArr.push(architectureObj);
        });
        this.architectureList = architectureListArr;
      }
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