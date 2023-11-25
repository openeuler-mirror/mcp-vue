<template>
  <div class="statuscell">
    <div class="status-row" v-if="type === 'string'">
      <span v-if="status === 'OVERDUE'" class="error">
        <i class="el-icon-warning-outline error" />
        <!-- 已过期 -->
        {{ $t("externalCloud.statuscell.OVERDUE") }}
      </span>
      <span v-else-if="status === 'AVAILABLE'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 在线 -->
        {{ $t("externalCloud.statuscell.AVAILABLE") }}
      </span>

      <span v-else-if="status === 'CONNECTED'" class="success">
        <!-- 已连接 -->
        <i class="el-icon-circle-check success" />
        {{ $t("externalCloud.statuscell.CONNECTED") }}
      </span>
      <span v-else-if="status === 'INSTALLING'" class="success">
        <i class="el-icon-refresh-left success" />
        <!-- 安装 -->
        {{ $t("externalCloud.statuscell.INSTALLING") }}
      </span>
      <span v-else-if="status === 'SUSPEND'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 暂停 -->
        {{ $t("externalCloud.statuscell.SUSPEND") }}
      </span>
      <span v-else-if="status === 'UNKNOWN'" class="error">
        <i class="el-icon-warning error" />
        <!-- 其他 -->
        {{ $t("externalCloud.statuscell.UNKNOWN") }}
      </span>

      <!-- ONLINE(在线),OFFLINE(离线),HALT(异常) -->
      <!-- ONLINE(在线) OFFLINE(离线) EXCEPTION(异常) -->
      <span v-else-if="status === 'ONLINE'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 在线 -->
        {{ $t("externalCloud.statuscell.ONLINE") }}
      </span>
      <span v-else-if="status === 'OFFLINE'" class="offline">
        <i class="el-icon-video-pause offline" />
        <!-- 离线 -->
        {{ $t("externalCloud.statuscell.OFFLINE") }}
      </span>
      <span v-else-if="status === 'INIT'" class="offline">
        <i class="el-icon-video-pause warn" />
        <!-- 离线 -->
        {{ $t("externalCloud.statuscell.INIT") }}
      </span>
      <span v-else-if="status === 'HALT'" class="warn">
        <i class="el-icon-warning warn" />
        <!-- 异常 -->
        {{ $t("externalCloud.statuscell.HALT") }}
      </span>
      <span v-else-if="status === 'EXCEPTION'" class="warn">
        <i class="el-icon-warning warn" />
        <!-- 异常 -->
        {{ $t("externalCloud.statuscell.EXCEPTION") }}
      </span>
      <!-- NORMAL(正常) WARNING(警告) ERROR(错误) -->
      <span v-else-if="status === 'NORMAL'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 正常 -->
        {{ $t("externalCloud.statuscell.NORMAL") }}
      </span>
      <span v-else-if="status === 'WARNING'" class="warn">
        <i class="el-icon-warning warn" />
        <!-- 警告 -->
        {{ $t("externalCloud.statuscell.WARNING") }}
      </span>
      <span v-else-if="status === 'ERROR'" class="error">
        <i class="el-icon-warning error" />
        <!-- 错误 -->
        {{ $t("externalCloud.statuscell.ERROR") }}
      </span>
      <span v-else>-</span>
    </div>
    <div class="status-row" v-else-if="type === 'bdr'">
      <span v-if="status === 'NORMAL'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 已过期 -->
        {{ $t("reliableCenter.drStragtegyInfor.enable") }}
      </span>
      <span v-else-if="status === 'DEAD'" class="offline">
        <i class="el-icon-video-pause offline" />
        <!-- 暂停 -->
        {{ $t("reliableCenter.drStragtegyInfor.deactivate") }}
      </span>
      <span v-else>-</span>
    </div>
    <div v-else class="status-row">
      <span v-if="status === '1'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 在线 -->
        {{ $t("externalCloud.statuscell.AVAILABLE") }}
      </span>
      <span v-else-if="status === '0'" class="offline">
        <i class="el-icon-video-pause offline" />
        <!-- 离线 -->
        {{ $t("externalCloud.statuscell.OFFLINE") }}
      </span>
      <span v-else-if="status === '2'" class="warn">
        <i class="el-icon-warning warn" />
        <!-- 任务执行中 -->
        {{ $t("externalCloud.statuscell.TASK_EXECUTION") }}
      </span>
      <span v-else-if="status === '3'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 任务执行中 -->
        {{ $t("externalCloud.statuscell.SUSPEND") }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "string",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
.statuscell {
  .status-row {
    .success {
      color: $msgSuccess;
    }
    .error {
      color: $msgDanger;
    }
    .offline {
      // color: #fff;
    }
    .warn {
      color: $msgWarning;
    }
    .notice {
      color: $msgNotice;
    }
    [class*="el-icon-"] {
      margin-left: 0px;
    }
  }
}
</style>
