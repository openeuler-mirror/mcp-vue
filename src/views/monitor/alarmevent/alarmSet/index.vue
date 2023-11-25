<template>
  <div class="app-container alarmSet">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <!-- 集群告警设置 -->
      <el-tab-pane
        :label="$t('alarmSetting.clusterAlarmSettings')"
        name="clusterAlarmSettings"
      >
      </el-tab-pane>
      <!-- 平台告警设置 -->
      <el-tab-pane
        :label="$t('alarmSetting.platformAlarmSettings')"
        name="platformAlarmSettings"
      >
      </el-tab-pane>
    </el-tabs>
    <clusterAlarmSettings
      v-if="activeName == 'clusterAlarmSettings'"
      ref="clusterAlarmSettings"
    >
    </clusterAlarmSettings>
    <platformAlarmSettings
      v-if="activeName == 'platformAlarmSettings'"
      ref="platformAlarmSettings"
    >
    </platformAlarmSettings>
  </div>
</template>

<script>
import clusterAlarmSettings from "./clusterAlarmSettings";
import platformAlarmSettings from "./platformAlarmSettings";
export default {
  name: "alarmSetHome",
  components: { clusterAlarmSettings, platformAlarmSettings },
  data() {
    return {
      activeName: "clusterAlarmSettings",
    };
  },
  created() {},
  methods: {
    tabClick(val) {},
  },
};
</script>
<style lang="scss" scoped>
.alarmSet {
}
</style>
