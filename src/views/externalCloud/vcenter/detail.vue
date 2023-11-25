<template>
  <!-- physicalClusterDetail -->
  <div class="app-container">
    <div class="physicalClusterDetail-detail app-container">
      <el-tabs v-model="activeName">
        <!-- 概要 -->
        <el-tab-pane
          :label="$t('externalCloud.vcenter.clusterSummary')"
          name="1"
        ></el-tab-pane>
        <!-- 物理主机 -->
        <el-tab-pane
          :label="$t('externalCloud.vcenter.clusterPhysicalHost')"
          name="2"
        ></el-tab-pane>
        <!-- 存储 -->
        <el-tab-pane
          :label="$t('externalCloud.vcenter.clusterStorage')"
          name="3"
        ></el-tab-pane>
        <!-- 云服务器 -->
        <el-tab-pane
          :label="$t('externalCloud.vcenter.cloudServer')"
          name="4"
        ></el-tab-pane>
      </el-tabs>
      <clusterSummary
        v-if="activeName == '1'"
        :dataInfo="vcenterInfo"
      ></clusterSummary>
      <pagePhysicalHost
        v-if="activeName == '2'"
        :dataInfo="vcenterInfo"
      ></pagePhysicalHost>
      <detailStorage
        v-if="activeName == '3'"
        :dataInfo="vcenterInfo"
      ></detailStorage>
      <cloudServer
        v-if="activeName == '4'"
        :dataInfo="vcenterInfo"
      ></cloudServer>
    </div>
  </div>
</template>

<script>
import clusterSummary from "./detailPage/clusterSummary.vue";
import pagePhysicalHost from "./detailPage/pagePhysicalHost.vue";
import detailStorage from "./detailPage/detailStorage";
import cloudServer from "./detailPage/cloudServer";
import { getVcenterDetail } from "@/api/vcenter";
export default {
  name: "physicalClusterDetail",
  components: { clusterSummary, pagePhysicalHost, detailStorage, cloudServer },
  data() {
    return {
      activeName: "1",
      vcenterId: this.$route.params.id,
      vcenterInfo: {},
    };
  },
  beforeRouteEnter(to, from, next) {
    let name = from.name;
    next((vm) => {
      if (name === "cloudServerDetail") {
        vm.setpage("4");
      }
    });
  },
  created() {
    this.getclusterInfo();
  },
  methods: {
    setpage(name) {
      this.activeName = name;
    },
    getclusterInfo() {
      this.$showFullScreenLoading();
      getVcenterDetail({ vcenterId: this.vcenterId })
        .then((res) => {
          this.vcenterInfo = res;
          this.vcenterInfo.vcenterId = this.vcenterId.toString();
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.$hideFullScreenLoading();
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
