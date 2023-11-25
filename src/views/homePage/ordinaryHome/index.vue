<template>
  <!-- home page -->
  <div class="homePage">
    <!-- top -->
    <div class="homePage-top homePage-bannerbg">
      <!-- 文本 -->
      <div class="homeText">
        <!-- 普通用户 -->
        <div class="homeText-title">
          {{ homeText }}
        </div>
        <div class="homeText-detail">
          {{ homeSubText }}
        </div>
      </div>
      <!-- 按钮 -->
      <div class="homeBtn">
        <div
          class="homeBtn-item"
          v-for="(item, index) in homeShowBtnList"
          :key="'homeBtn' + index"
          @click="toPage(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <!-- bottom -->
    <div class="homePage-bottom">
      <div class="homePage-bottom-left">
        <vdclist :pageData="pageData"></vdclist>
        <!-- 审核工单、告警 -->
        <reviewWorkorderAlerts :pageData="pageData"></reviewWorkorderAlerts>
        <!-- 总览 -->
        <overview :pageData="pageData"></overview>
      </div>
      <div class="homePage-bottom-center">
        <!-- 利用率-->
        <utilizationOverview :pageData="pageData"></utilizationOverview>
      </div>
      <div class="homePage-bottom-right">
        <!-- 云服务器 CPU使用率-->
        <cloudHosting :pageData="pageData" pagekey="cpu"></cloudHosting>
        <!-- 云服务器 CPU使用率-->
        <cloudHosting :pageData="pageData" pagekey="mem"></cloudHosting>
      </div>
    </div>
  </div>
</template>

<script>
import vdclist from "./vdcListBox.vue";
import reviewWorkorderAlerts from "./reviewWorkorderAlerts.vue"; // 审核工单、告警
import cloudHosting from "./cloudHosting"; // 云服务器
import utilizationOverview from "./utilizationOverview"; // 利用率、总览
import overview from "./overview.vue"; // 总览
import bus from "@/utils/eventBus";
import { orgLeaderStatistic } from "@/api/homeApi";
export default {
  name: "homePage",
  components: {
    vdclist,
    reviewWorkorderAlerts,
    cloudHosting,
    utilizationOverview,
    overview,
  },
  computed: {},
  data() {
    return {
      homeText: this.$t("common.home.homeText"), // "资源池化与标准化，智能规划与管理",
      homeSubText: this.$t("common.home.homeSubText"), // "单个中立的控制台对下纳管异构的基础设施，对接已有业务流程平台。将云上的资源进行逻辑池化，从而基于企业组织架构来实行资源分配，并提供标准的流程和规范的云服务",
      homeBtnList: [
        {
          label: this.$t("common.home.createZone"), // "添加可用区",
          pagekey: "resource",
          routeKey: "zone",
          key: "create_zone",
        },
        {
          label: this.$t("common.home.createCluster"), // "添加集群",
          pagekey: "resource",
          routeKey: "cluster",
          key: "create_cluster",
        },
        { label: "添加物理机", pagekey: "", routeKey: "", key: "" },
        {
          label: this.$t("common.home.createVdc"), // "添加VDC",
          pagekey: "resource",
          routeKey: "vdc",
          key: "create_vdc",
        },
        {
          label: this.$t("authorityMgr.createOrg"), // "创建组织",
          pagekey: "operator",
          routeKey: "org",
          key: "create_org",
        },
        {
          label: this.$t("common.home.workerOrder"), // "工单审核",
          pagekey: "operator",
          routeKey: "workorder",
          key: "check_workorder",
        },
        { label: "添加云服务器", pagekey: "", routeKey: "", key: "" },
      ],
      homeShowBtnList: [],
      pageData: {},
    };
  },
  created() {},
  mounted() {
    this.getPageData();
    this.getBtnList();
  },
  methods: {
    getBtnList() {
      let list = [];
      this.homeBtnList.forEach((element) => {
        let { routeKey, key } = element;
        if (this.otherBtnShow(routeKey, key)) {
          list.push(element);
        }
      });
      this.homeShowBtnList = list;
    },
    toPage(pageItem) {
      let { key } = pageItem;
      switch (key) {
        // 工单审核
        case "check_workorder":
          this.tocheckworkorder();
          break;
        // 创建组织
        case "create_org":
          this.toCreateOrg();
          break;
        // 添加VDC
        case "create_vdc":
          this.toCreateVdc();
          break;

        default:
          break;
      }
    },
    // 创建组织
    toCreateOrg() {
      bus.$emit("changeMenuNav", "operator");
      this.$router.push({
        name: "organization",
        params: { create: true },
      });
    },
    // 工单审核
    tocheckworkorder() {
      bus.$emit("changeMenuNav", "operator");
      this.$router.push({
        name: "workorder",
        params: { create: true },
      });
    },
    // 添加VDC
    toCreateVdc() {
      bus.$emit("changeMenuNav", "resource");
      this.$router.push({
        name: "vdcPage",
        params: { create: true },
      });
    },
    getPageData() {
      orgLeaderStatistic()
        .then((res) => {
          this.pageData = res;
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.homePage {
  height: 100%;
  .homePage-top {
    width: 100%;
    height: 200px;
    // background: linear-gradient(to right, #2779ff, #4bdeff);
    position: relative;
    .homeText {
      position: absolute;
      top: 0;
      left: 400px;
      height: 100%;
      width: 620px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      .homeText-title,
      .homeText-detail {
        width: 100%;
      }
      .homeText-title {
        font-size: 30px;
        margin: 5px 0px;
      }
      .homeText-detail {
        font-size: 14px;
        line-height: 20px;
      }
    }
    .homeBtn {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-bottom: 60px;
      margin-right: 180px;
      display: flex;
      flex-direction: row;
      .homeBtn-item {
        min-width: 100px;
        padding: 0 10px;
        text-align: center;
        line-height: 36px;
        margin: 0 5px;
        color: #fff;
        background-color: $btnBg;
        cursor: pointer;
        border-radius: 4px;
      }
    }
  }
  .homePage-bottom {
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 -5px;
    margin-top: 10px;
    height: calc(100% - 230px);
    .homePage-bottom-left,
    .homePage-bottom-right {
      height: 100%;
      width: 360px;
      margin: 0 5px;
      display: flex;
      flex-direction: column;
    }
    .homePage-bottom-center {
      height: 100%;
      flex: 1;
      margin: 0 5px;
    }
    .homePage-bottom-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}
</style>
