<template>
  <div class="testCenterstatus">
    <!-- 成功 -->
    <div v-if="status === 'SUCCESS'">
      <span class="el-icon-success success"></span>
      <span>{{ statusDesc }}</span>
    </div>
    <!-- 失败 -->
    <div v-else-if="status === 'FAIL'">
      <span class="el-icon-error error"></span>
      <span>{{ statusDesc }}</span>
    </div>
    <!-- 执行中 -->
    <div v-else-if="status === 'RUNNING'" class="processing-box">
      <!-- <span class="el-icon-loading success"></span>
      <span>{{ statusDesc }}</span> -->
      <div class="processing">
        <el-progress
          :percentage="percentage"
          :show-text="false"
          status="success"
        ></el-progress>
      </div>
      <div class="">{{ percentageDesc }}</div>
    </div>
    <!-- 待开始 -->
    <div v-else-if="status === 'WAIT_START'">
      <span class="el-icon-warning warn"></span>
      <span>{{ statusDesc }}</span>
    </div>
    <!-- 已取消 -->
    <div v-else-if="status === 'CANCELED'">
      <span class="el-icon-more notice"></span>
      <span>{{ statusDesc }}</span>
    </div>
    <!-- 取消中 -->
    <div v-else-if="status === 'CANCELING'">
      <span class="el-icon-loading notice"></span>
      <span>{{ statusDesc }}</span>
    </div>
    <!-- 超时 -->
    <div v-else-if="status === 'TIMEOUT'">
      <span class="el-icon-more warn"></span>
      <span>{{ statusDesc }}</span>
    </div>
    <!-- 未知 -->
    <div v-else-if="status === 'UNKNOWN'">
      <span class="el-icon-more warn"></span>
      <span>{{ statusDesc }}</span>
    </div>
    <div v-else-if="status === 'processing'" class="processing-box">
      <div class="processing">
        <el-progress
          :percentage="percentage"
          :show-text="false"
          status="success"
        ></el-progress>
      </div>
      <div class="">{{ percentageDesc }}</div>
    </div>
    <div v-else>{{ status }}</div>
  </div>
</template>

<script>
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  props: {
    pageData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      status: "",
      statusDesc: "",
      percentage: 50,
      percentageDesc: "50%",
    };
  },
  mounted() {
    this.setPageData();
  },
  methods: {
    setPageData() {
      let { statusValue, percent } = this.pageData;
      let statusDesc = "";
      statusDesc = dictionary.getDesc(statusValue, dictionary.teskstatusList);
      this.status = statusValue;
      this.statusDesc = statusDesc;
      this.percentage = parseInt(percent) || 0;
      this.percentageDesc = this.percentage + "%";
    },
  },
};
</script>
<style lang="scss">
.testCenterstatus {
  .success {
    color: $msgSuccess;
  }
  .error {
    color: $msgDanger;
  }
  .offline {
    // color: #fff;
  }
  .warn {
    color: $msgWarning;
  }
  .notice {
    color: #999;
  }
  [class*="el-icon-"] {
    margin-left: 0px;
    margin-right: 5px;
    font-size: 14px;
  }

  .processing-box {
    width: 100%;
    display: flex;
    align-items: center;
    .processing {
      width: 60%;
      margin-right: 15px;
    }
  }
}
</style>
