<template>
  <div class="app-container alarmLog">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <!-- 集群告警日志 -->
      <el-tab-pane
        :label="$t('alarmSetting.clusterAlarmlog')"
        name="clusterAlarmlog"
      >
      </el-tab-pane>
      <!-- 平台告警日志 -->
      <el-tab-pane
        :label="$t('alarmSetting.platformAlarmlog')"
        name="platformAlarmlog"
      >
      </el-tab-pane>
    </el-tabs>
    <clusterAlarmlog
      v-if="activeName == 'clusterAlarmlog'"
      ref="clusterAlarmlog"
    >
    </clusterAlarmlog>
    <platformAlarmlog
      v-if="activeName == 'platformAlarmlog'"
      ref="platformAlarmlog"
    >
    </platformAlarmlog>
  </div>
</template>

<script>
import clusterAlarmlog from "./clusterAlarmlog.vue";
import platformAlarmlog from "./platformAlarmlog";
export default {
  name: "alarmSetHome",
  components: { clusterAlarmlog, platformAlarmlog },
  data() {
    return {
      activeName: "clusterAlarmlog",
    };
  },
  created() {},
  methods: {
    tabClick(val) {},
  },
};
</script>
