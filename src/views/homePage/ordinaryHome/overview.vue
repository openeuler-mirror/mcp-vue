<template>
  <!-- 总览 Overview -->
  <div class="overview">
    <!-- 账户总览 -->

    <commonBox :title="accountOverview.title">
      <div class="accountOverview-content">
        <percentageBox
          v-for="(item, index) in accountOverview.list"
          :key="'accountOverview' + index"
          :option="item"
          :unit="''"
        >
        </percentageBox>
      </div>
    </commonBox>
  </div>
</template>

<script>
import commonBox from "./commonBox.vue";
import percentageBox from "./percentageBox.vue";
export default {
  name: "overview",
  props: ["pageData"],
  components: { commonBox, percentageBox },
  computed: {},
  data() {
    return {
      // 账户总览
      accountOverview: {
        title: this.$t("common.home.accountOverview"), // "账户总览",
        list: [
          {
            label: this.$t("common.home.platformManage"), // "平台管理用户",
            key: "platformManage",
            percentage: "0",
            percentageNum: "0",
          },
          {
            label: this.$t("common.home.orgManage"), // "组织管理用户",
            key: "orgManage",
            percentage: "0",
            percentageNum: "0",
          },
          {
            label: this.$t("common.home.selfService"), // "自服务用户",
            key: "selfService",
            percentage: "0",
            percentageNum: "0",
          },
        ],
      },
    };
  },
  watch: {
    pageData(val) {
      this.setpageData(val);
    },
  },
  mounted() {},
  methods: {
    setpageData(pageData) {
      let { userData } = pageData;
      let total =
        userData.platformManageUserCount +
        userData.orgManageUserCount +
        userData.selfServiceUserCount;
      this.accountOverview.list.forEach((element) => {
        let { key } = element;
        switch (key) {
          case "platformManage":
            element.percentage =
              (userData.platformManageUserCount / total) * 100;
            element.percentageNum = userData.platformManageUserCount || 0;
            break;
          case "orgManage":
            element.percentage = (userData.orgManageUserCount / total) * 100;
            element.percentageNum = userData.orgManageUserCount || 0;
            break;
          case "selfService":
            element.percentage = (userData.selfServiceUserCount / total) * 100;
            element.percentageNum = userData.selfServiceUserCount || 0;
            break;

          default:
            break;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.overview {
  display: flex;
  flex: 1;

  .accountOverview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    flex: 1;
    padding: 0 40px;
  }
}
</style>
