<template>
  <div class="header-outbox">
    <div class="header-box">
      <div class="header-left">
        <el-select
          v-model="clusterValue"
          :placeholder="$t('resourceMgr.plccluster')"
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
      </div>
      <div class="header-right">
        <utilsButton type="fresh" :spinBol="spinBol" @refresh="refresh" />
      </div>
    </div>
  </div>
</template>

<script>
import utilsButton from "@/components/utilsButton";
import { getLoginUserCluster } from "@/api/clusterapi";
export default {
  components: {
    utilsButton,
  },
  props: {
    spinBol: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 集群
      clusterValue: "",
      clusterList: [],
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
    // 集群
    clusterChange(value) {
      this.clusterValue = value;
      this.$parent.changeClusterValue(value);
      this.$emit("refreshTable");
    },
    // 刷新
    refresh() {
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
