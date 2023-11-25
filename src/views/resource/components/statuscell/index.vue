<template>
  <div class="statuscell">
    <div class="status-row">
      <span v-if="status === 'OVERDUE'" class="error">
        <i class="el-icon-warning-outline error" />
        <!-- 已过期 -->
        {{ $t("resourceMgr.statuscell.OVERDUE") }}
      </span>
      <span v-else-if="status === 'AVAILABLE'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 在线 -->
        {{ $t("resourceMgr.statuscell.AVAILABLE") }}
      </span>

      <span v-else-if="status === 'CONNECTED'" class="success">
        <!-- 已连接 -->
        <i class="el-icon-circle-check success" />
        {{ $t("resourceMgr.statuscell.CONNECTED") }}
      </span>
      <span v-else-if="status === 'INSTALLING'" class="success">
        <i class="el-icon-refresh-left success" />
        <!-- 安装 -->
        {{ $t("resourceMgr.statuscell.INSTALLING") }}
      </span>
      <span v-else-if="status === 'SUSPEND'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 暂停 -->
        {{ $t("resourceMgr.statuscell.SUSPEND") }}
      </span>
      <span v-else-if="status === 'UNKNOWN'" class="error">
        <i class="el-icon-warning error" />
        <!-- 其他 -->
        {{ $t("resourceMgr.statuscell.UNKNOWN") }}
      </span>

      <!-- ONLINE(在线),OFFLINE(离线),HALT(异常) -->
      <!-- ONLINE(在线) OFFLINE(离线) EXCEPTION(异常) -->
      <span v-else-if="status === 'ONLINE'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 在线 -->
        {{ $t("resourceMgr.statuscell.ONLINE") }}
      </span>
      <span v-else-if="status === 'OFFLINE'" class="offline">
        <i class="el-icon-video-pause offline" />
        <!-- 离线 -->
        {{ $t("resourceMgr.statuscell.OFFLINE") }}
      </span>
      <span v-else-if="status === 'HALT'" class="warn">
        <i class="el-icon-warning warn" />
        <!-- 异常 -->
        {{ $t("resourceMgr.statuscell.HALT") }}
      </span>
      <span v-else-if="status === 'EXCEPTION'" class="warn">
        <i class="el-icon-warning warn" />
        <!-- 异常 -->
        {{ $t("resourceMgr.statuscell.EXCEPTION") }}
      </span>
      <!-- NORMAL(正常) WARNING(警告) ERROR(错误) -->
      <span v-else-if="status === 'NORMAL'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 正常 -->
        {{ $t("resourceMgr.statuscell.NORMAL") }}
      </span>
      <span v-else-if="status === 'WARNING'" class="warn">
        <i class="el-icon-warning warn" />
        <!-- 警告 -->
        {{ $t("resourceMgr.statuscell.WARNING") }}
      </span>
      <span v-else-if="status === 'ERROR'" class="error">
        <i class="el-icon-warning error" />
        <!-- 错误 -->
        {{ $t("resourceMgr.statuscell.ERROR") }}
      </span>
      <span v-else>-</span>
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
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" >
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
