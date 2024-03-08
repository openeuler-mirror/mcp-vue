<template>
  <div class="header-outbox">
    <div class="header-box">
      <div class="header-left">
        <el-select
          v-model="clusterValue"
          placeholder="请选择集群"
          @change="clusterChange"
        >
          <el-option
            v-for="item in clusterList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 时间 -->
        <el-date-picker
          style="margin-left: 15px"
          v-model="timeData"
          type="daterange"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :range-separator="$t('common.to')"
          :start-placeholder="$t('common.startdate')"
          :end-placeholder="$t('common.enddate')"
          :default-time="['00:00:00', '23:59:59']"
          @change="timeDatachange"
        >
        </el-date-picker>
        <!-- 级别 -->
        <el-select
          style="margin-left: 15px"
          v-model="levelValue"
          placeholder="请选择级别"
          @change="levelChange"
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <!-- 类型-->
        <el-select
          style="margin-left: 15px"
          v-model="typeValue"
          placeholder="请选择类型"
          @change="typeChange"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
          v-if="currentBtnShow('ecportServerEvent')"
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
import { serverEventTypeList } from "@/api/monitoringApi";
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
    getServerEventTypeList() {
      let params = {
        clusterId: this.clusterValue,
      };
      return new Promise((resolve, reject) => {
        // 一段耗时的异步操作
        serverEventTypeList(params)
          .then((res) => {
            let { level, type } = res;
            this.levelOptions = level;
            this.levelValue = level[0].value;
            this.$parent.changeLevelValue(this.levelValue);
            this.typeOptions = type;
            this.typeValue = type[0].value;
            this.$parent.changeTypeValue(this.typeValue);
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
      this.getServerEventTypeList().then((res) => {
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

<style lang="scss">
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>