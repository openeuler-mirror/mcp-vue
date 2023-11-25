<template>
  <div class="app-container">
    <headerBox @refreshTable="freshTable">
      <template slot="headerLeft">
        <!-- 创建容灾策略  立即执行容灾策略 启用 禁用-->
        <el-button @click="showAddSite = true">{{
          $t("reliableCenter.createDrPolicy")
        }}</el-button>
        <el-button @click="showAddSite = true">{{
          $t("reliableCenter.executeDrPolicy")
        }}</el-button>
        <el-button @click="showAddSite = true">{{
          $t("reliableCenter.enable")
        }}</el-button>
        <el-button @click="showAddSite = true">{{
          $t("reliableCenter.disable")
        }}</el-button>
        <el-button
          v-show="!showSearch"
          class="btn-margin"
          @click="showSearch = true"
          icon="el-icon-search"
        >
        </el-button>
        <el-input
          class="btn-margin"
          v-model="searchText"
          prefix-icon="el-icon-search"
          v-show="showSearch"
          @keyup.enter.native="handleSearch"
        >
          <i
            slot="suffix"
            @click="showSearch = false"
            class="el-input__icon el-icon-close"
          ></i>
        </el-input>
      </template>
    </headerBox>
  </div>
</template>
<script>
import headerBox from "@/components/headerBox";
import mcTable from "@/components/MctablePro";
import { linkSiteList, delLinkConnect } from "@/api/remoteDisasterRecovery";
export default {
  name: "secSiteDisaterRecoverData",
  data() {
    return {
      showAddSite: false,
      showSearch: false,
    };
  },
  methods: {
    freshTable() {},
  },
};
</script>
<style lang="scss" scoped></style>
