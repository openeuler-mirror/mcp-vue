<template>
  <!-- availabilityZoneDetail -->
  <div class="availabilityZoneDetail-detail app-container">
    <el-tabs v-model="activeName">
      <!-- 概要 -->
      <el-tab-pane
        :label="$t('resourceMgr.vdcSummary')"
        name="first"
      ></el-tab-pane>
    </el-tabs>
    <clusterSummary
      v-if="activeName == 'first'"
      :dataInfo="clusterSummaryInfo"
    ></clusterSummary>
   
  </div>
</template>

<script>
import clusterSummary from "./detailPage/clusterSummary.vue";
import { vdcDetail } from "@/api/vdcapi";
export default {
  name: "availabilityZoneDetail",
  components: { clusterSummary },
  data() {
    return {
      activeName: "first",
      vdcId: this.$route.params.id,
      clusterSummaryInfo: {},
    };
  },
  created() {
    this.getvdcDetail();
  },
  methods: {
    getvdcDetail() {
      let pramas = {
        vdcId: this.vdcId,
      };
      vdcDetail(pramas)
        .then((res) => {
          this.clusterSummaryInfo = res;
          // this.clusterSummaryInfo.zoneId = this.zoneId;
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