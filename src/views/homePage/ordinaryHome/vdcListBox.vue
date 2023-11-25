<template>
  <!-- vdcListBox -->
  <div class="vdcListBox">
    <!-- VDC vdcDataPageData -->
    <div class="vdcListBox-item">
      <commonBox :title="vdcDataPageData.label">
        <div class="vdcListBox-item-bottom">
          <div class="vdcListBox-item-bottom-lf">
            <div class="bottom-icon">
              <div class="bottom-icon-box vdcList-icon-VDC"></div>
            </div>
            <div>{{ vdcDataPageData.subTitle }}</div>
          </div>
          <div class="vdcListBox-item-bottom-rt">
            <div class="bottom-item online">
              <div class="bottom-item-iconLabel">
                <div class="bottom-item-icon"></div>
                <div class="bottom-item-label">
                  <!-- 已分配 -->
                  {{ $t("common.alreadyAllocate") }}
                </div>
              </div>
              <div class="bottom-item-number">
                {{ vdcDataPageData.online }}
              </div>
            </div>
            <div class="bottom-item offline">
              <div class="bottom-item-iconLabel">
                <div class="bottom-item-icon"></div>
                <div class="bottom-item-label">
                  <!-- 未分配 -->
                  {{ $t("common.noAllocate") }}
                </div>
              </div>
              <div class="bottom-item-number">
                {{ vdcDataPageData.offline }}
              </div>
            </div>
          </div>
        </div>
      </commonBox>
    </div>

    <!-- 云服务器 serverVmDataPageData -->
    <div class="vdcListBox-item">
      <commonBox :title="serverVmDataPageData.label">
        <div class="vdcListBox-item-bottom">
          <div class="vdcListBox-item-bottom-lf">
            <div class="bottom-icon">
              <div class="bottom-icon-box vdcList-icon-serverVm"></div>
            </div>
            <div>{{ serverVmDataPageData.subTitle }}</div>
          </div>
          <div class="vdcListBox-item-bottom-rt">
            <div class="bottom-item online">
              <div class="bottom-item-iconLabel">
                <div class="bottom-item-icon"></div>
                <div class="bottom-item-label">
                  <!-- 在线 -->
                  {{ $t("common.details.online") }}
                </div>
              </div>
              <div class="bottom-item-number">
                {{ serverVmDataPageData.online }}
              </div>
            </div>
            <div class="bottom-item offline">
              <div class="bottom-item-iconLabel">
                <div class="bottom-item-icon"></div>
                <div class="bottom-item-label">
                  <!-- 离线 -->
                  {{ $t("common.details.offline") }}
                </div>
              </div>
              <div class="bottom-item-number">
                {{ serverVmDataPageData.offline }}
              </div>
            </div>
          </div>
        </div>
      </commonBox>
    </div>
  </div>
</template>

<script>
import commonBox from "./commonBox.vue";
export default {
  name: "vdcListBox",
  props: ["pageData"],
  components: { commonBox },
  computed: {},
  data() {
    return {
      vdclist: [
        {
          label: this.$t("common.home.VDC"), // "VDC",
          subTitle: this.$t("common.home.total"), // "VDC总数",
          total: "0",
          online: "0",
          offline: "0",
          key: "VDC",
        },
        {
          label: this.$t("common.home.serverVm"), // "云服务器",
          subTitle: this.$t("common.home.total"), // "云服务器总数",
          total: "0",
          online: "0",
          offline: "0",
          key: "serverVm",
        },
      ],
      vdcDataPageData: {
        label: this.$t("common.home.VDC"), // "VDC",
        subTitle: this.$t("common.home.total"), // "VDC总数",
        total: "0",
        online: "0",
        offline: "0",
        key: "VDC",
      },
      serverVmDataPageData: {
        label: this.$t("common.home.serverVm"), // "云服务器",
        subTitle: this.$t("common.home.total"), // "云服务器总数",
        total: "0",
        online: "0",
        offline: "0",
        key: "serverVm",
      },
      serverVmData: {},
    };
  },
  watch: {
    pageData(val) {
      this.setpageData(val);
    },
  },
  methods: {
    setpageData(pageData) {
      let { vdcData, serverVmData } = pageData;
      let list = [];
      this.vdclist.forEach((element) => {
        let { key } = element;
        let listi = element;
        switch (key) {
          case "VDC":
            listi.subTitle = element.subTitle + "：" + vdcData.totalVdc;
            listi.online = vdcData.alreadyAllocateVdc;
            listi.offline = vdcData.noAllocateVdc;
            this.vdcDataPageData = listi;
            break;
          case "serverVm":
            listi.subTitle =
              element.subTitle + "：" + serverVmData.totalServerVm;
            listi.online = serverVmData.onlineServerVm;
            listi.offline = serverVmData.offlineServerVm;
            this.serverVmDataPageData = listi;
            break;

          default:
            break;
        }
        list.push(listi);
      });
      this.pageShowlist = list;
    },
  },
};
</script>

<style lang="scss" scoped>
.vdcListBox {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin: -5px 0;
  .vdcListBox-item {
    width: 100%;
    height: 100px;
    margin: 5px 0;
  }
  .vdcListBox-item-bottom {
    display: flex;
    flex: 1;
    justify-content: space-around;
    align-items: center;
    .vdcListBox-item-bottom-lf {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 120px;
      .bottom-icon {
        width: 75px;
        height: 45px;
        font-size: 34px;
        font-weight: bold;
        color: $msgInfo;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .bottom-icon-box {
          width: 42px;
          height: 42px;
        }
      }

      .bottom-label {
        // border: 1px solid red;
        // width: 75px;
        // height: 45px;
      }
    }
    .vdcListBox-item-bottom-rt {
      display: flex;
      flex-direction: column;
      width: 50%;
      height: 100%;
      // align-items: center;
      justify-content: center;
      .bottom-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 50%;
        line-height: 1;
        .bottom-item-iconLabel {
          display: flex;
          flex-direction: row;
          align-items: center;
          .bottom-item-icon {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 5px;
          }
          .bottom-item-label {
            margin-right: 5px;
            height: 100%;
          }
        }

        .bottom-item-number {
          // font-size: 38px;
          // line-height: 38px;
          // height: 100%;
          // font-weight: bold;
        }
      }
      .online {
        .bottom-item-icon {
          background-color: $msgInfo;
        }
      }
      .offline {
        .bottom-item-icon {
          background-color: $msgDanger;
        }
      }
    }
  }
}
</style>
