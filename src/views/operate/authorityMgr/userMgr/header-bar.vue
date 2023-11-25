<template>
  <div class="header-box">
    <div class="header-left">
      <el-button v-if="currentBtnShow('create_user')" @click="newlyBuild">
        {{ $t("authorityMgr.creatUser") }}
      </el-button>
      <!-- <el-button type="primary" @click="editInfo" style="margin-left: 15px">
        编辑用户
      </el-button> -->
      <el-button
        v-if="currentBtnShow('delete_user')"
        :disabled="deleteDis"
        @click="deleteInfo"
        style="margin-left: 15px"
      >
        {{ $t("authorityMgr.deleteUsers") }}
      </el-button>
    </div>
    <div class="header-right">
      <searchInput
        v-if="currentBtnShow('search_user')"
        @change="searchInputChange"
      />
      <utilsButton type="fresh" :spinBol="spinBol" @refresh="refresh" />
    </div>
  </div>
</template>

<script>
import utilsButton from "@/components/utilsButton";
import searchInput from "@/components/SearchInput";
export default {
  components: {
    searchInput,
    utilsButton,
  },
  props: {
    spinBol: {
      type: Boolean,
      default: false,
    },
    // 选中的数组
    selectData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return { deleteDis: true };
  },
  watch: {
    selectData: {
      handler: function (newV, oldV) {
        if (newV.length > 0) {
          this.setBtnsDis(newV);
        } else {
          this.deleteDis = true;
        }
      },
      deep: true,
    },
  },
  created() {},
  methods: {
    setBtnsDis(selectData) {
      // 开机按钮  start
      let deleteDis = selectData.some((item) => item.canDeleteUser == true);
      if (deleteDis) {
        this.deleteDis = false;
      } else {
        this.deleteDis = true;
      }
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
    newlyBuild() {
      this.$emit("newlyBuild");
    },

    editInfo() {
      this.$emit("editInfo");
    },

    deleteInfo() {
      this.$emit("deleteInfos");
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
