<template>
  <!-- home page -->
  <div class="homePage">
    <!-- top -->
    <div class="homePage-top homePage-bannerbg">
      <!-- 文本 -->
      <div class="homeText">
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
      </div>
      <div class="homePage-bottom-center">
        <!-- 利用率、总览-->
        <utilizationOverview :pageData="pageData"></utilizationOverview>
      </div>
      <div class="homePage-bottom-right">
        <!-- 审核工单、告警 -->
        <reviewWorkorderAlerts :pageData="pageData"></reviewWorkorderAlerts>
        <!-- 物理机 -->
        <physicalMachine :pageData="pageData"></physicalMachine>
        <!-- 云服务器 -->
        <cloudHosting :pageData="pageData"></cloudHosting>
      </div>
    </div>
  </div>
</template>

<script>
import vdclist from './vdcListBox.vue'
import reviewWorkorderAlerts from './reviewWorkorderAlerts.vue' // 审核工单、告警
import physicalMachine from './physicalMachine' // 物理机
import cloudHosting from './cloudHosting' // 云服务器
import utilizationOverview from './utilizationOverview' // 利用率、总览
import bus from '@/utils/eventBus'
import { indexStatistic } from '@/api/homeApi'
export default {
  name: 'homePage',
  components: {
    vdclist,
    reviewWorkorderAlerts,
    physicalMachine,
    cloudHosting,
    utilizationOverview
  },
  computed: {},
  data() {
    return {
      homeText: this.$t('common.home.homeText'), // "资源池化与标准化，智能规划与管理",
      homeSubText: this.$t('common.home.homeSubText'), // "单个中立的控制台对下纳管异构的基础设施，对接已有业务流程平台。将云上的资源进行逻辑池化，从而基于企业组织架构来实行资源分配，并提供标准的流程和规范的云服务",
      homeBtnList: [
        {
          label: this.$t('common.home.createZone'), // "添加可用区",
          pagekey: 'resource',
          routeKey: 'zone',
          key: 'create_zone'
        },
        {
          label: this.$t('common.home.createCluster'), // "添加集群",
          pagekey: 'resource',
          routeKey: 'cluster',
          key: 'create_cluster'
        },
        { label: '添加物理机', pagekey: '', routeKey: '', key: '' },
        {
          label: this.$t('common.home.createVdc'), // "添加VDC",
          pagekey: 'resource',
          routeKey: 'vdc',
          key: 'create_vdc'
        },
        { label: '添加云服务器', pagekey: '', routeKey: '', key: '' }
      ],
      homeShowBtnList: [],
      pageData: {}
    }
  },
  created() {},
  mounted() {
    this.getPageData()
    this.getBtnList()
  },
  methods: {
    getBtnList() {
      let list = []
      this.homeBtnList.forEach((element) => {
        let { routeKey, key } = element
        if (this.otherBtnShow(routeKey, key)) {
          list.push(element)
        }
      })
      this.homeShowBtnList = list
    },
    toPage(pageItem) {
      let { key } = pageItem
      switch (key) {
        // 添加可用区
        case 'create_zone':
          this.toCreateZone()
          break
        // 添加集群
        case 'create_cluster':
          this.toCreateCluster()
          break
        // 添加VDC
        case 'create_vdc':
          this.toCreateVdc()
          break

        default:
          break
      }
    },
    // 添加可用区
    toCreateZone() {
      bus.$emit('changeMenuNav', 'resource')
      this.$router.push({
        name: 'availabilityZone',
        params: { create: true }
      })
    },
    // 添加集群
    toCreateCluster() {
      bus.$emit('changeMenuNav', 'resource')
      this.$router.push({
        name: 'physicalCluster',
        params: { create: true }
      })
    },
    // 添加VDC
    toCreateVdc() {
      bus.$emit('changeMenuNav', 'resource')
      this.$router.push({
        name: 'vdcPage',
        params: { create: true }
      })
    },
    getPageData() {
      indexStatistic()
        .then((res) => {
          this.pageData = res
        })
        .catch((err) => {})
    }
  }
}
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
        width: 100px;
        height: 36px;
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
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: calc(100% - 230px);
    .homePage-bottom-left,
    .homePage-bottom-right {
      height: 100%;
      width: 360px;
    }
    .homePage-bottom-center {
      height: 100%;
      flex: 1;
      margin: 0px 10px;
    }
    .homePage-bottom-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}
</style>
