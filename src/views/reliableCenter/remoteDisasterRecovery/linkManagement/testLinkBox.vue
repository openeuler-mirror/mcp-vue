<template>
  <el-drawer
    size="900px"
    :title="$t('reliableCenter.connectivityTest')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    @opened="opened"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <div class="drawer-body-content">
      <div class="flex-content test-content">
        <div class="test-tips">{{ $t("reliableCenter.probeObj") }}</div>
        <div class="flex-content">
          <div class="test-title">{{ targetLink.masterSiteName }}</div>
          <div class="icon-border">
            <i class="el-icon-arrow-left"></i>
            <i class="el-icon-minus"></i>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="test-title">{{ targetLink.slaveSiteName }}</div>
        </div>
      </div>
      <div class="flex-content test-content">
        <div class="test-tips">{{ $t("reliableCenter.detectionRes") }}</div>
        <div>
          <div v-if="pageStatus === 'loading'" class="flex-content-center">
            <i class="el-icon-refresh loading-icon"></i
            >{{ $t("reliableCenter.underDete") }}<span class="dot-ani"></span>
          </div>
          <div v-if="pageStatus === 'success'" class="flex-content-center">
            <i class="el-icon-success"></i
            >{{ $t("reliableCenter.probObjectCom") }}
          </div>
          <div v-if="pageStatus === 'error'">
            <div class="flex-content-center">
              <i class="el-icon-warning"></i
              >{{ $t("reliableCenter.communicationError") }}
            </div>
            <div>
              <div
                v-for="(item, index) in errorList"
                :key="index"
                class="flex-content-center err-detail"
              >
                <i class="el-icon-warning-outline"></i>
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-foot">
      <el-button type="primary" :loading="drawLoading" @click="handelCheck">{{
        drawLoading
          ? $t("reliableCenter.linkDetection")
          : $t("reliableCenter.retest")
      }}</el-button>
      <el-button @click="handleCloseCreate">{{
        $t("externalCloud.vmOperate.cancel")
      }}</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { checkLinkConnect } from "@/api/remoteDisasterRecovery";
export default {
  name: "addLinkBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    targetLink: {
      type: Object,
      default: {
        masterSiteName: "",
        slaveSiteName: "",
      },
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      drawLoading: false,
      pageStatus: "loading",
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  mounted() {},
  methods: {
    opened() {
      this.pageStatus = "loading";
      this.drawLoading = true;
      const params = {
        siteLinkId: this.targetLink.siteLinkId,
      };
      checkLinkConnect(params)
        .then((res) => {
          this.pageStatus = res.checkStatus === "ERROR" ? "error" : "success";
          this.errorList = res.errorList;
        })
        .finally((res) => {
          this.drawLoading = false;
        });
    },
    handelCheck() {
      this.pageStatus = "loading";
      this.drawLoading = true;
      const params = {
        siteLinkId: this.targetLink.siteLinkId,
      };
      checkLinkConnect(params)
        .then((res) => {
          this.pageStatus = res.checkStatus === "ERROR" ? "error" : "success";
          this.errorList = res.errorList;
        })
        .finally((res) => {
          this.drawLoading = false;
        });
    },
    handleCloseCreate() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.flex-content {
  display: flex;
  ::v-deep.el-icon-success,
  .el-icon-refresh {
    color: #67c23a;
  }
  .el-icon-warning,
  .el-icon-warning-outline {
    color: #e6a23c;
  }
}
.icon-border {
  margin: 0 10px;
  & [class*="el-icon-"] {
    margin: 0;
  }
}
.test-title {
  font-weight: 700;
}
.test-content {
  margin-bottom: 30px;
  & [class*="el-icon-"] {
    margin-right: 20px;
    font-size: 20px;
  }
}
.test-tips {
  min-width: 60px;
  margin-right: 40px;
}
.loading-icon {
  animation: 1s rotate infinite;
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
.flex-content-center {
  display: flex;
  align-items: center;
}
.dot-ani {
  display: inline-block;
  height: 12px;
  line-height: 12px;
  overflow: hidden;
}
.dot-ani::after {
  display: inline-table;
  white-space: pre;
  content: "\A.\A..\A...";
  animation: spin 2s steps(4) infinite;
}
.err-detail {
  padding: 10px 30px;
}
@keyframes spin {
  to {
    -webkit-transform: translateY(-48px);
    transform: translateY(-48px);
  }
}
</style>
