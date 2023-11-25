<template>
  <!-- physicalClusterDetail -->
  <div class="physicalClusterDetail-detail app-container">
    <el-tabs v-model="activeName">
      <!-- 云服务器列表 -->
      <el-tab-pane
        :label="$t('resourceMgr.vMwareMgr.vmlist')"
        name="first"
      ></el-tab-pane>
    </el-tabs>

    <pagePhysicalHost :dataInfo="clusterSummaryInfo"></pagePhysicalHost>
  </div>
</template>

<script>
import pagePhysicalHost from "./detailPage/pagePhysicalHost.vue";
import { vCenterInfo } from "@/api/vMwareMgr";
export default {
  name: "physicalClusterDetail",
  components: { pagePhysicalHost },
  data() {
    return {
      activeName: "first",
      vcenterId: this.$route.params.id,
      vcentername: this.$route.params.name,
      clusterSummaryInfo: {
        vcenterId: this.$route.params.id,
      },
    };
  },
  created() {
    // this.getclusterInfo();
  },
  methods: {
    getclusterInfo() {
      let params = {
        vcenterId: this.vcenterId,
        name: this.vcentername,
      };
      vCenterInfo(params)
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