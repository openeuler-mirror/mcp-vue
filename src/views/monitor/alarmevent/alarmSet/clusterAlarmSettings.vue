<template>
  <div class="alarmSet">
    <!-- 头部菜单栏 -->
    <header-bar ref="headerBar" @refreshTable="refreshTable" />
    <div class="panel-setting">
      <span>{{ $t("alarmSetting.interval") }}</span>
      <el-input v-model="alarmInterval" />

      <el-button type="primary" @click="handleSave">
        {{ $t("common.save") }}
      </el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <!-- 云服务器告警策略 -->
      <el-tab-pane
        :label="$t('alarmSetting.cloudServerAlarmPolicy')"
        name="cloudServerAlarmPolicy"
      ></el-tab-pane>
      <!-- 物理集群 -->
      <el-tab-pane
        :label="$t('alarmSetting.physicalServerAlertPolicy')"
        name="physicalServerAlertPolicy"
      ></el-tab-pane>
    </el-tabs>

    <cloudServerAlarmPolicy
      ref="cloudServerAlarmPolicy"
      v-if="activeName == 'cloudServerAlarmPolicy'"
      :clusterId="clusterId"
    >
    </cloudServerAlarmPolicy>
    <physicalServerAlertPolicy
      ref="physicalServerAlertPolicy"
      v-if="activeName == 'physicalServerAlertPolicy'"
      :clusterId="clusterId"
    >
    </physicalServerAlertPolicy>

    <!-- <div class="alarmSetfootBtn">
      <el-button type="primary" @click="handleConfirm"> 保存修改 </el-button>
    </div> -->
  </div>
</template>

<script>
import headerBar from "./header-bar";
import cloudServerAlarmPolicy from "./cloudServerAlarmPolicy.vue";
import physicalServerAlertPolicy from "./physicalServerAlertPolicy.vue";
import { getAlarmInterval, updateAlarmInterval } from "@/api/monitoringApi";

export default {
  name: "alarmSet",
  components: {
    headerBar,
    cloudServerAlarmPolicy,
    physicalServerAlertPolicy,
  },
  data() {
    return {
      activeName: "cloudServerAlarmPolicy",
      clusterId: "",
      alarmInterval: "",
    };
  },
  created() {
    // this.renderTable();
  },
  methods: {
    handleConfirm() {},
    handleSave() {
      if (!this.alarmInterval) {
        this.$rmsg.warning(this.$t("alarmSetting.intervalEmpty"));
      } else if (
        !/(^[1-9]\d{0,4}$)/.test(this.alarmInterval) ||
        this.alarmInterval > 60
      ) {
        this.$rmsg.warning(this.$t("alarmSetting.intervalInput"));
      } else {
        let pramas = {
          clusterId: this.clusterId, // 物理集群ID
          alarmInterval: this.alarmInterval, // 持续时间
        };
        updateAlarmInterval(pramas).then((res) => {
          this.$rmsg.success(this.$t("common.saveSuccess"));
        });
      }
    },
    tabClick(val) {
      this.$nextTick(() => {
        this.refreshTable();
      });
    },
    // 刷新表格
    refreshTable() {
      if (this.activeName) {
        this.$refs[this.activeName].renderTable();
      }
    },
    // 集群
    changeClusterValue(val) {
      this.clusterId = val;
      // 获取告警持续时间
      this.getAlarmTime();
    },
    getAlarmTime() {
      let pramas = {
        clusterId: this.clusterId, // 物理集群ID
      };
      getAlarmInterval(pramas)
        .then((res) => {
          this.alarmInterval = res.alarmInterval;
        })
        .catch((err) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.alarmSet {
  display: flex;
  flex-direction: column;
  flex: 1;
  .panel-setting {
    display: flex;
    align-items: center;
    margin: 15px 0;
    padding: 0 20px;
    font-size: 14px;

    .el-input {
      width: 270px;
      margin: 0 15px;
    }
  }

  .alarmSetfootBtn {
    padding: 15px 35px;
    border-top: 1px $borderColor solid;
  }
}
</style>
