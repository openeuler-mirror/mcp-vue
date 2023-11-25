<template>
  <el-drawer
    size="1300px"
    :title="$t('common.detailsInfo')"
    v-if="drawerVisible"
    direction="rtl"
    :wrapperClosable="false"
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-body-content">
      <div>
        <div
          class="detail-page-content"
          v-for="(item, index) in pageData"
          :key="index"
        >
          <div
            v-for="(data, num) in item"
            :key="'datail-' + num"
            class="detail-page"
          >
            <div class="detail-text">{{ data }}</div>
            <div v-if="num < item.length - 1">|</div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-foot">
      <el-button type="primary" @click="handelClose">
        {{ $t("externalCloud.vmOperate.sure") }}
      </el-button>
      <el-button @click="handelClose">
        {{ $t("externalCloud.vmOperate.cancel") }}
      </el-button>
    </div>
  </el-drawer>
</template>
<script>
import { bareMetalmonitor } from "@/api/vMwareMgr";
export default {
  name: "",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      drawerLoading: false,
      pageData: [],
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.intInfor();
      }
    },
  },
  methods: {
    handelClose() {
      this.$emit("update:visible", false);
    },
    intInfor() {
      this.drawerLoading = true;
      bareMetalmonitor({ bareMetalId: this.id })
        .then((res) => {
          this.pageData = res.map((data) => {
            const newData = data.split(/[\t\r\f\n\s]*/g).join("");
            return newData.split("|");
          });
        })
        .finally((_) => {
          this.drawerLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.top-title {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 15px;
}
.drawer-content {
  padding: 10px 20px;
  overflow: hidden;
}
.drawer-body-content {
  overflow-y: scroll;
}
.detail-page {
  width: 10%;
  display: flex;
  align-items: center;
}
.detail-page-content {
  display: flex;
  align-items: center;
  overflow-y: scroll;
  .detail-text {
    flex: 1;
    margin-left: 5px;
  }
}
.disable-input::v-deep input {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
