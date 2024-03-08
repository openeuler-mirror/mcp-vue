<template>
  <div class="header-outbox">
    <div class="header-box">
      <div class="header-left">
        <div class="filter-item"></div>
        <div class="filter-item"></div>
        <div class="filter-item"></div>
        <div class="filter-item"></div>
        <div class="filter-item"></div>
      </div>
      <div class="header-right">
        <searchInput @change="searchInputChange" />
        <i
          class="el-icon-refresh setting-icon"
          style="margin-left: 15px"
          :title="$t('common.refresh')"
          @click="refresh"
        />
        <!-- <i
          v-if="currentBtnShow('exportCloudServerEvent')"
          class="el-icon-download setting-icon"
          style="margin-left: 15px"
          title="导出"
          @click="refresh"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import searchInput from "@/components/SearchInput";
import { getLoginUserCluster } from "@/api/clusterapi";
import { serverVirtualizationEventsFilter } from "@/api/monitoringApi";
export default {
  components: {
    searchInput,
  },
  props: {},
  data() {
    return {
      // 集群
      clusterValue: "",
      clusterList: [],
      timeData: "",
      levelOptions: [],
      levelValue: "",
      typeOptions: [],
      typeValue: "",
      serversValue: "",
      serversOptions: [],
    };
  },
  watch: {},
  created() {
    this.clusterValue = "";
    this.clusterList = [];
    this.getUserCluster();
  },
  methods: {
    getUserCluster() {
      getLoginUserCluster()
        .then((res) => {
          let list = res;
          list.forEach((element) => {
            let { clusterId, clusterName } = element;
            this.clusterList.push({
              label: clusterName,
              value: clusterId,
            });
          });
          this.clusterValue = this.clusterList[0].value;
          this.clusterChange(this.clusterValue);
        })
        .catch((err) => {});
    },
    getserverVirtualizationEventsFilter() {
      let params = {
        clusterId: this.clusterValue,
      };
      return new Promise((resolve, reject) => {
        // 一段耗时的异步操作
        serverVirtualizationEventsFilter(params)
          .then((res) => {
            let { level, type, servers } = res;
            this.levelOptions = level;
            this.levelValue = level[0].value;
            this.$parent.changeLevelValue(this.levelValue);
            this.typeOptions = type;
            this.typeValue = type[0].value;
            this.$parent.changeTypeValue(this.typeValue);
            this.serversOptions = servers;
            this.serversValue = servers[0].value;
            this.$parent.changeserversValue(this.serversValue);
            resolve("成功"); // 数据处理完成
          })
          .catch((err) => {
            reject("失败"); // 数据处理出错
          });
      });
    },
    // 集群
    clusterChange(value) {
      this.clusterValue = value;
      this.$parent.changeClusterValue(value);
      this.getserverVirtualizationEventsFilter().then((res) => {
        this.$emit("refreshTable");
      });
    },
    // 级别
    levelChange(value) {
      this.$parent.changeLevelValue(value);
      this.$emit("refreshTable");
    },
    // 类型
    typeChange(value) {
      this.$parent.changeTypeValue(value);
      this.$emit("refreshTable");
    },
    // 搜索
    searchInputChange(val) {
      this.$parent.changeSearchKey(val);
      this.$emit("refreshTable");
    },
    // 对象
    serversChange(value) {
      this.$parent.changeserversValue(value);
      this.$emit("refreshTable");
    },
    // 刷新
    refresh() {
      this.$emit("refreshTable");
    },
    // 选择时间
    timeDatachange(date) {
      let startTime = "";
      let endTime = "";
      if (date) {
        startTime = this.$moment(date[0]).format("X");
        endTime = this.$moment(date[1]).format("X");
      }
      this.$parent.changetimeData({ startTime, endTime });
      this.$emit("refreshTable");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  height: unset;
  min-height: 62px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .header-left {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex: 1;
    margin-left: -8px;
    margin-right: -8px;
    .filter-item {
      width: 200px;
      height: 30px;
      margin: 5px 8px;
      border: 1px solid red;
    }
  }
  .header-right {
    display: flex;
    align-self: flex-start;
  }
}
</style>