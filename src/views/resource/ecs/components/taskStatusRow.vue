<template>
  <div class="taskStatus-row">
    <div v-for="(item, index) in taskStatusList" :key="item.key + index">
      <div v-if="taskStatus == item.key" class="">
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
  name: "taskStatus-row",
  props: {
    // 任务状态
    taskStatus: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      taskStatusList: [
        {
          key: "LEISURE",
          class: "leisure",
          label: this.$t("resourceMgr.zoneLEISURE"), // "空闲"
        },
        {
          key: "NEW",
          class: "leisure",
          label: this.$t("resourceMgr.zoneNEW"), // "新建"
        },
        {
          key: "INSTALLING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zonetaskINSTALLING"), // "安装中",
        },
        {
          key: "NEWFAILED",
          class: "error",
          label: this.$t("resourceMgr.zoneNEWFAILED"), // "新建失败"
        },
        {
          key: "INSTALLFAILED",
          class: "error",
          label: this.$t("resourceMgr.zoneINSTALLFAILED"), // "安装失败"
        },
        {
          key: "CREATING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneCREATING"), // "正在创建",
        },
        {
          key: "STARTING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneSTARTING"), // "正在开机 ",
        },
        {
          key: "SHUTDOWNING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneSHUTDOWNING"), // "正在关机",
        },
        {
          key: "REBOOTING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneREBOOTING"), // "正在重启",
        },
        {
          key: "SUSPENDING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneSUSPENDING"), // "正在暂停",
        },
        {
          key: "RESUMING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneRESUMING"), // "正在唤醒",
        },
        {
          key: "VOLUME_MIGRATING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneVOLUME_MIGRATING"), // "正在存储迁移",
        },
        {
          key: "HOST_MIGRATING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneHOST_MIGRATING"), // "正在主机迁移",
        },
        {
          key: "BACKUP_RUNNING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneBACKUP_RUNNING"), // "正在备份",
        },
        {
          key: "BACKUP_RECOVERING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneBACKUP_RECOVERING"), // "正在备份恢复",
        },
        {
          key: "SNAPSHOT_RUNNING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneSNAPSHOT_RUNNING"), // "正在快照",
        },
        {
          key: "SNAPSHOT_RECOVERING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneSNAPSHOT_RECOVERING"), // "正在快照恢复",
        },
        {
          key: "IMPORTING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneIMPORTING"), // "正在导入",
        },
        {
          key: "EXPORTING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneEXPORTING"), // "正在导出",
        },
        {
          key: "CLONING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneCLONING"), // "正在克隆",
        },
        {
          key: "DISK_COPYING",
          class: "running",
          icon: "el-icon-loading",
          label: this.$t("resourceMgr.zoneDISK_COPYING"), // "正在磁盘复制",
        },
        {
          key: "",
          class: "error",
          icon: "",
          label: this.$t("resourceMgr.zoneOther"), // "其他",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.taskStatus-row {
  .leisure {
    color: $msgSuccess;
  }
  .error {
    color: $msgDanger;
  }
  .running {
    color: $msgSuccess;
  }
  [class*="el-icon-"] {
    margin-left: 0px;
  }
}
</style>