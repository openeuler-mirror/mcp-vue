<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <!-- 容灾状态 -->
      <el-tab-pane
        :label="$t('reliableCenter.mainSlaveSite')"
        name="drStatus"
      ></el-tab-pane>
      <!-- 容灾策略 -->
      <el-tab-pane
        :label="$t('reliableCenter.disasterPolicy')"
        name="drStrategy"
      ></el-tab-pane>
      <!-- 站点管理 -->
      <el-tab-pane
        :label="$t('reliableCenter.siteManage')"
        name="siteManagement"
      ></el-tab-pane>
    </el-tabs>
    <drStatus
      class="tabs-container"
      @handelJump="showChildRouter"
      v-if="activeName === 'drStatus'"
    />
    <secSiteDisaterRecoverData
      class="tabs-container"
      v-if="activeName === 'secSiteDisaterRecoverData'"
    />
    <drStrategy class="tabs-container" v-if="activeName === 'drStrategy'" />
    <siteManagement
      class="tabs-container"
      v-if="activeName === 'siteManagement'"
    />
  </div>
</template>
<script>
import drStatus from "./drStatus/drStatus.vue";
import secSiteDisaterRecoverData from "./secSiteDisaterRecoverData/secSiteDisaterRecoverData.vue";
import drStrategy from "./drStrategy/drStrategy.vue";
import siteManagement from "./siteManagement/siteManagement.vue";
export default {
  name: "remoteDisasterRecovery",
  data() {
    return {
      activeName: "drStatus",
      showChild: false,
    };
  },
  components: {
    drStatus,
    secSiteDisaterRecoverData,
    drStrategy,
    siteManagement,
  },
  methods: {
    showChildRouter(e) {
      this.showChild = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.tabs-container {
  height: 100%;
}
::v-deep {
  .el-tabs .el-tabs__header {
    margin: 0;
  }
}
</style>
