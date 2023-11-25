<template>
  <!-- physicalMachine -->
  <div class="physicalMachine">
    <commonBox :title="physicalMachineTit">
      <el-link
        class="physicalMachinelink"
        :underline="false"
        type="primary"
        @click="toggleInfo()"
      >
        {{ toggleTit }}
      </el-link>
      <div class="physicalMachine-content">
        <percentageBox
          v-for="(item, index) in physicalMachineList"
          :key="'physicalMachine' + index"
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
  name: "physicalMachine",
  props: ["pageData"],
  components: { commonBox, percentageBox },
  computed: {},
  data() {
    return {
      physicalMachineTit: "",
      physicalMachineList: [],
      physicalMachineCpuList: [],
      physicalMachineMemList: [],
      shouCpu: false,
      toggleTit: "",
      cpuUseRatio: this.$t("common.home.cpuUseRatio"), // CPU使用率
      memUseRatio: this.$t("common.home.memUseRatio"), // 内存使用率
      physicalMachine: this.$t("common.home.physicalMachine"), // 物理主机
    };
  },
  created() {
    this.shouCpu = false;
    this.toggleTit = "";
  },
  watch: {
    pageData(val) {
      this.setpageData(val);
      this.shouCpu = false;
      this.toggleInfo();
    },
  },
  mounted() {
    this.shouCpu = false;
    this.toggleTit = "";
  },
  methods: {
    setpageData(pageData) {
      let { physicalHostCpuTopUseRatioList, physicalHostMemTopUseRatioList } =
        pageData;
      let cpulist = [];
      physicalHostCpuTopUseRatioList.forEach((element) => {
        let { serverIp, usedRatio } = element;
        cpulist.push({
          label: serverIp,
          percentageNum: usedRatio,
          percentage: usedRatio,
        });
      });
      this.physicalMachineCpuList = cpulist;

      let memlist = [];
      physicalHostMemTopUseRatioList.forEach((element) => {
        let { serverIp, usedRatio } = element;
        memlist.push({
          label: serverIp,
          percentageNum: usedRatio,
          percentage: usedRatio,
        });
      });
      this.physicalMachineMemList = memlist;
    },
    toggleInfo() {
      this.shouCpu = !this.shouCpu;
      if (this.shouCpu) {
        this.physicalMachineList = this.physicalMachineCpuList;
        this.toggleTit = this.memUseRatio;
        this.physicalMachineTit =
          this.physicalMachine + "( " + this.cpuUseRatio + ")";
      } else {
        this.physicalMachineList = this.physicalMachineMemList;
        this.toggleTit = this.cpuUseRatio;
        this.physicalMachineTit =
          this.physicalMachine + "( " + this.memUseRatio + ")";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.physicalMachine {
  width: 100%;
  min-height: 240px;
  height: 38%;
  position: relative;

  .physicalMachinelink {
    position: absolute;
    top: 10px;
    right: 12px;
  }
  .physicalMachine-content {
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
