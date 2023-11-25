<template>
  <!-- cloudHosting -->
  <div class="cloudHosting">
    <commonBox :title="cloudHostingTit">
      <!-- <el-link
        class="cloudHostingelink"
        :underline="false"
        type="primary"
        @click="toggleInfo()"
      >
        {{ toggleTit }}
      </el-link> -->
      <div class="cloudHosting-content">
        <percentageBox
          v-for="(item, index) in cloudHostingList"
          :key="'cloudHosting' + index"
          :option="item"
        ></percentageBox>
      </div>
    </commonBox>
  </div>
</template>

<script>
import commonBox from "./commonBox.vue";
import percentageBox from "./percentageBox.vue";
export default {
  name: "cloudHosting",
  props: ["pageData", "pagekey"],
  components: { commonBox, percentageBox },
  computed: {},
  data() {
    return {
      cloudHostingTit: "",
      cloudHostingList: [],
      cloudHostingCpuList: [],
      cloudHostingMemList: [],
      shouCpu: false,
      toggleTit: "",
      cpuUseRatio: this.$t("common.home.cpuUseRatio"), // CPU使用率
      memUseRatio: this.$t("common.home.memUseRatio"), // 内存使用率
      owningCluster: this.$t("common.home.owningCluster"), // 所属集群
      cloudHosting: this.$t("common.home.cloudHosting"), // 云服务器
    };
  },
  created() {
    this.shouCpu = false;
    this.toggleTit = "";
  },
  watch: {
    pageData(val) {
      this.setpageData(val);
      this.toggleInfo();
    },
  },
  mounted() {
    this.shouCpu = false;
    this.toggleTit = "";
  },
  methods: {
    setpageData(pageData) {
      let { serverVmCpuTopUseRatioList, serverVmMemTopUseRatioList } = pageData;
      let cpulist = [];
      serverVmCpuTopUseRatioList.forEach((element) => {
        let { serverVmName, clusterName, cpuUseRatio } = element;
        cpulist.push({
          label:
            serverVmName + "(" + this.owningCluster + "：" + clusterName + ")",
          percentageNum: cpuUseRatio,
          percentage: cpuUseRatio,
        });
      });
      this.cloudHostingCpuList = cpulist;

      let memlist = [];
      serverVmMemTopUseRatioList.forEach((element) => {
        let { serverVmName, clusterName, memUseRatio } = element;
        memlist.push({
          label:
            serverVmName + "(" + this.owningCluster + "：" + clusterName + ")",
          percentageNum: memUseRatio,
          percentage: memUseRatio,
        });
      });
      this.cloudHostingMemList = memlist;
    },
    toggleInfo() {
      if (this.pagekey == "cpu") {
        this.shouCpu = true;
      } else {
        this.shouCpu = false;
      }
      if (this.shouCpu) {
        this.cloudHostingList = this.cloudHostingCpuList;
        this.toggleTit = this.memUseRatio;
        this.cloudHostingTit =
          this.cloudHosting + "( " + this.cpuUseRatio + ")";
      } else {
        this.cloudHostingList = this.cloudHostingMemList;
        this.toggleTit = this.cpuUseRatio;
        this.cloudHostingTit =
          this.cloudHosting + "( " + this.memUseRatio + ")";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cloudHosting {
  width: 100%;
  min-height: 315px;
  height: 49%;
  position: relative;
  .cloudHostingelink {
    position: absolute;
    top: 10px;
    right: 12px;
  }
  .cloudHosting-content {
    border-top: 1px solid #c0c4cc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    flex: 1;
    padding: 0 15px;
  }
}
</style>
