<template>
  <el-dropdown trigger="click" @visible-change="visibleChange">
    <el-link type="primary" @click.stop="stoplinkclick">
      <!-- 更多 -->
      {{ $t("resourceMgr.servervmmore") }}
      <i class="el-icon-arrow-down el-icon--right" />
    </el-link>
    <el-dropdown-menu slot="dropdown">
      <div v-for="(item, index) in toggleList" :key="item.key + index">
        <el-dropdown-item :divided="item.divided" :command="item">
          <el-link
            v-if="item.show"
            @click="downToggleCommand(item.key)"
            :disabled="getDisableBol(item.cantClickStatus)"
            :underline="false"
          >
            {{ item.label }}
          </el-link>
        </el-dropdown-item>
      </div>
      <el-dropdown-item v-if="toggleList.length == 0">
        <el-link :underline="false">
          {{ $t("common.noMoreOperations") }}
        </el-link>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import ReMessage from "@/utils/message";
import { MessageBox } from "element-ui";
export default {
  props: {
    // 选中的数组
    selectData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      toggleList: [],
      toggleAllList: {},
      //0离线、1在线、2执行中、3暂停
      toggleListArr: [
        {
          key: "shutdown",
          label: this.$t("externalCloud.vmList.shutdown"), //"关机",
          disabled: false,
          cantClickStatus: [0, 2],
          show: true,
        },
        {
          key: "wakeUp",
          label: this.$t("externalCloud.vmList.wakeUp"), //"唤醒",
          disabled: false,
          cantClickStatus: [1, 2],
          show: true,
        },
        {
          key: "pause",
          label: this.$t("externalCloud.vmList.pause"), //"暂停",
          disabled: false,
          cantClickStatus: [3],
          show: true,
        },
        {
          key: "restart",
          label: this.$t("externalCloud.vmList.restart"), //"重启电源",
          disabled: false,
          cantClickStatus: [0, 2],
          show: true,
        },
        {
          key: "powerOff",
          label: this.$t("externalCloud.vmList.powerOff"), //"关闭电源",
          disabled: false,
          cantClickStatus: [0, 2],
          show: true,
        },
        {
          key: "clone",
          label: this.$t("externalCloud.vmList.clone"), //"克隆",
          disabled: false,
          cantClickStatus: [2],
          show: true,
          divided: true,
        },
        {
          key: "edit",
          label: this.$t("externalCloud.vmList.edit"), //"编辑",
          disabled: false,
          cantClickStatus: [2],
          show: true,
        },
        {
          key: "migration",
          label: this.$t("externalCloud.vmList.migrationMc"), //"迁移",
          disabled: false,
          show: true,
          cantClickStatus: [2],
        },
        {
          key: "delete",
          label: this.$t("externalCloud.vmList.delete"), //"删除",
          disabled: false,
          cantClickStatus: [1, 2, 3],
          show: true,
          divided: true,
        },
      ],
      toggleListData: {},
    };
  },
  created() {
    // this.defaultList();
    // this.defaultListNew();
  },
  watch: {},
  methods: {
    stoplinkclick() {},
    visibleChange(val) {
      this.toggleList = this.toggleListArr;
    },
    getDisableBol(cantClickStatus) {
      let disabled = false;
      const { serverStatus } = this.selectData;
      if (cantClickStatus) {
        disabled = cantClickStatus.indexOf(serverStatus) >= 0;
      }
      return disabled;
    },
    downToggleCommand(e) {
      this.$emit("downToggleCommand", e, this.selectData);
    },
  },
};
</script>
