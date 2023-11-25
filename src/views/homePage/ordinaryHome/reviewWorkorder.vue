<template>
  <!-- reviewWorkorderAlerts -->
  <div class="reviewWorkorderAlerts">
    <div class="reviewWorkorderAlerts-home lf">
      <commonBox :title="workerOrder.title">
        <div class="reviewWorkorderAlerts-content">
          <div class="baseline-box">
            <div class="workorder-icon" @click="toWorkorder"></div>
            <div class="reviewWorkorderAlerts-num">
              {{ workerOrder.number }}
            </div>
            <div class="reviewWorkorderAlerts-unit">{{ workerOrder.unit }}</div>
          </div>
        </div>
      </commonBox>
    </div>
    <div class="reviewWorkorderAlerts-home rt">
      <commonBox :title="alarm.title">
        <div class="reviewWorkorderAlerts-content">
          <div class="baseline-box">
            <div class="alerts-icon el-icon-bell" @click="toAlarmLog"></div>
            <div class="reviewWorkorderAlerts-num">
              {{ alarm.number }}
            </div>
            <div class="reviewWorkorderAlerts-unit">{{ alarm.unit }}</div>
          </div>
        </div>
      </commonBox>
    </div>
  </div>
</template>

<script>
import commonBox from "./commonBox.vue";
import bus from "@/utils/eventBus";
export default {
  name: "vdcListBox",
  props: ["pageData"],
  components: { commonBox },
  computed: {},
  data() {
    return {
      // 工单审核
      workerOrder: {
        title: this.$t("common.home.workerOrder"), // "工单审核",
        number: "0",
        unit: this.$t("common.strip"), // "条",
      },
      // 告警
      alarm: {
        title: this.$t("common.home.alarm"), // "告警",
        number: "0",
        unit: this.$t("common.strip"), // "条",
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
      let { noticeData } = pageData;
      this.workerOrder.number = noticeData.waitCheckCount;
      this.alarm.number = noticeData.alarmCount;
    },
    // 工单审核页面
    toWorkorder() {
      bus.$emit("changeMenuNav", "operator");
      this.$nextTick(() => {
        this.$router.push({ name: "workorder", params: {} });
      });
    },
    // 告警页面
    toAlarmLog() {
      bus.$emit("changeMenuNav", "operator");
      this.$nextTick(() => {
        this.$router.push({ name: "alarmLog", params: {} });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.reviewWorkorderAlerts {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 150px;
  font-size: 14px;
  .reviewWorkorderAlerts-home {
    height: 100%;
    width: 175px;
  }
  .reviewWorkorderAlerts-content {
    border-top: 1px solid #c0c4cc;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 1;
    .baseline-box {
      display: flex;
      flex-direction: row;
      align-items: baseline;
    }
    .alerts-icon,
    .workorder-icon,
    .reviewWorkorderAlerts-num {
      font-size: 36px;
    }
    .alerts-icon {
      color: $msgDanger;
      margin-right: 10px;
      cursor: pointer;
    }
    .workorder-icon {
      color: $msgInfo;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
</style>
