<template>
  <div class="statuscell">
    <div class="status-row">
      <!-- POWERED_OFF 关闭 POWERED_ON 在线 SUSPENDED 暂停 -->
      <span v-if="status === 'SUSPEND'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 暂停 -->
        {{ $t("resourceMgr.statuscell.SUSPEND") }}
      </span>
      <span v-else-if="status === 'POWERED_ON'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 在线 -->
        {{ $t("resourceMgr.statuscell.POWERED_ON") }}
      </span>
      <span v-else-if="status === 'POWERED_OFF'" class="offline">
        <i class="el-icon-video-pause offline" />
        <!-- 关闭 -->
        {{ $t("resourceMgr.statuscell.POWERED_OFF") }}
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
  