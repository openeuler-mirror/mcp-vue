<template>
  <!-- 组织管理 -->
  <div class="organizationMgr-detail app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 概要 -->
      <el-tab-pane :label="$t('common.details.summary')" name="first">
      </el-tab-pane>
      <!-- <el-tab-pane label="概要" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="概要" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="概要" name="fourth">定时任务补偿</el-tab-pane> -->
    </el-tabs>
    <orgoutline v-if="activeName == 'first'"></orgoutline>
  </div>
</template>

<script>
import orgoutline from "./orgdetail/outline.vue";
export default {
  name: "organizationdetail",
  components: { orgoutline },
  data() {
    return {
      activeName: "first",
    };
  },
  created() {},
  methods: {
    handleClick() {},
  },
};
</script>
<style lang="scss" scoped>
.organizationMgr-detail {
  display: flex;
  flex: 1;
  height: 0px;
  flex-direction: column;
}
</style>


