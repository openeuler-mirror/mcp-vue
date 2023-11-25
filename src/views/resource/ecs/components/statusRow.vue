<template>
  <div class="status-row">
    <div v-for="(item, index) in statusList" :key="item.key + index">
      <div v-if="status == item.key" class="">
        <span :class="[item.class]">
          <i v-if="item.icon" :class="[item.icon]" />
          {{ item.label }}
        </span>
      </div>
      <div v-else></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "status-row",
  props: {
    // 状态
    status: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      statusList: [
        {
          key: "OVERDUE",
          class: "error",
          icon: "el-icon-warning-outline",
          label: this.$t("resourceMgr.zoneOVERDUE"), // "已过期",
        },
        {
          key: "AVAILABLE",
          class: "success",
          icon: "el-icon-video-play",
          label: this.$t("resourceMgr.zoneAVAILABLE"), // "在线",
        },
        {
          key: "CONNECTED",
          class: "success",
          icon: "el-icon-circle-check",
          label: this.$t("resourceMgr.zoneCONNECTED"), // "已连接",
        },
        {
          key: "INSTALLING",
          class: "success",
          icon: "el-icon-refresh-left",
          label: this.$t("resourceMgr.zoneINSTALLING"), // "安装",
        },
        {
          key: "SUSPEND",
          class: "success",
          icon: "el-icon-video-play",
          label: this.$t("resourceMgr.zoneSUSPEND"), // "暂停",
        },
        {
          key: "OFFLINE",
          class: "offline",
          icon: "el-icon-video-pause",
          label: this.$t("resourceMgr.zoneOFFLINE"), // "离线",
        },
        {
          key: "UNKNOWN",
          class: "error",
          icon: "el-icon-warning",
          label: this.$t("resourceMgr.zoneUNKNOWN"), // "其他",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
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
</style>