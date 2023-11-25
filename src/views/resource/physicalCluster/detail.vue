<template>
  <!-- physicalClusterDetail -->
  <div class="physicalClusterDetail-detail app-container">
    <el-tabs v-model="activeName">
      <!-- 概要 -->
      <el-tab-pane
        :label="$t('resourceMgr.clusterSummary')"
        name="first"
      ></el-tab-pane>
      <!-- 物理主机 -->
      <el-tab-pane
        :label="$t('resourceMgr.clusterPhysicalHost')"
        name="second"
      ></el-tab-pane>
      <!-- 存储 -->
      <el-tab-pane
        :label="$t('resourceMgr.clusterStorage')"
        name="third"
      ></el-tab-pane>
      <!-- 网络 -->
      <el-tab-pane label="网络" name="netWork"></el-tab-pane>
    </el-tabs>
    <clusterSummary
      v-if="activeName == 'first'"
      :dataInfo="clusterSummaryInfo"
    ></clusterSummary>
    <pagePhysicalHost
      v-if="activeName == 'second'"
      :dataInfo="clusterSummaryInfo"
    ></pagePhysicalHost>
    <detailStorage
      v-if="activeName == 'third'"
      :dataInfo="clusterSummaryInfo"
    ></detailStorage>
    <networkDetail
      v-if="activeName == 'netWork'"
      :dataInfo="clusterSummaryInfo"
    ></networkDetail>
  </div>
</template>

<script>
import clusterSummary from "./detailPage/clusterSummary.vue";
import pagePhysicalHost from "./detailPage/pagePhysicalHost.vue";
import detailStorage from "./detailPage/detailStorage";
import { clusterInfo } from "@/api/clusterapi";
import networkDetail from "./detailPage/networkDetail/networkDetail";
export default {
  name: "physicalClusterDetail",
  components: {
    clusterSummary,
    pagePhysicalHost,
    detailStorage,
    networkDetail,
  },
  data() {
    return {
      activeName: "first",
      clusterId: this.$route.params.id,
      clusterSummaryInfo: {},
    };
  },
  created() {
    this.getclusterInfo();
  },
  methods: {
    getclusterInfo() {
      clusterInfo({ clusterId: this.clusterId })
        .then((res) => {
          this.clusterSummaryInfo = res;
          this.clusterSummaryInfo.clusterId = this.clusterId;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.physicalClusterDetail-detail {
  display: flex;
  flex: 1;
  height: 0px;
  flex-direction: column;
}
</style>
