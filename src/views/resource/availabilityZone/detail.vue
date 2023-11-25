<template>
  <!-- availabilityZoneDetail -->
  <div class="availabilityZoneDetail-detail app-container">
    <el-tabs v-model="activeName">
      <!-- 概要 -->
      <el-tab-pane
        :label="$t('resourceMgr.zoneSummary')"
        name="first"
      ></el-tab-pane>
      <!-- 物理集群 -->
      <el-tab-pane
        :label="$t('resourceMgr.zoneClusterDesc')"
        name="second"
      ></el-tab-pane>
    </el-tabs>
    <clusterSummary
      v-if="activeName == 'first'"
      :dataInfo="clusterSummaryInfo"
    ></clusterSummary>
    <pagePhysicalHost
      v-if="activeName == 'second'"
      :dataInfo="clusterSummaryInfo"
    ></pagePhysicalHost>
  </div>
</template>

<script>
import clusterSummary from "./detailPage/clusterSummary.vue";
import pagePhysicalHost from "./detailPage/pagePhysicalHost.vue";
import { zoneDetail } from "@/api/zoneapi";
export default {
  name: "availabilityZoneDetail",
  components: { clusterSummary, pagePhysicalHost },
  data() {
    return {
      activeName: "first",
      zoneId: this.$route.params.id,
      clusterSummaryInfo: {},
    };
  },
  created() {
    this.getzoneDetail();
  },
  methods: {
    getzoneDetail() {
      let pramas = {
        zoneId: this.zoneId,
      };
      zoneDetail(pramas)
        .then((res) => {
          this.clusterSummaryInfo = res;
          this.clusterSummaryInfo.zoneId = this.zoneId;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.availabilityZoneDetail-detail {
  display: flex;
  flex: 1;
  height: 0px;
  flex-direction: column;
}
</style>