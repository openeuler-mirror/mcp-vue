<template>
  <el-dialog
    :title="mainTitle"
    width="400px"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="new-dailog"
  >
    <div class="dialog-top" v-if="topTitle">
      <p class="dialog-main-text">{{ topTitle }}</p>
    </div>
    <div class="dialog-content">
      <div class="dialog-main">
        <i class="el-icon-warning warin"></i>
        <div class="dialog-main-content">
          <p class="body-title">{{ bodyTitle }}</p>
          <p class="body-body-des">{{ bodyDes }}</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="hadnelSubmit" :loading="loading">
          {{ $t("common.confirm") }}
        </el-button>
        <el-button @click="handelCancel">{{ $t("common.cancel") }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    mainTitle: {
      type: String,
      default: "",
    },
    bodyTitle: {
      type: String,
      default: "",
    },
    bodyDes: {
      type: String,
      default: "",
    },
    topTitle: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  watch: {
    dialogVisible(newdata) {
      this.visible = newdata;
    },
  },
  computed: {},
  methods: {
    hadnelSubmit() {
      this.$emit("hadnelSubmit");
    },
    handelCancel() {
      this.$emit("hadnelCancel");
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.main-title {
  font-size: 20px;
}
.dialog-main {
  display: flex;
  align-items: center;
}
.warin {
  font-size: 40px;
  color: #e6a23c;
  margin-right: 10px;
}
.body-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: rgb(51, 51, 51);
}
.dialog-main,
.dialog-main-text {
  padding: 0px 20px 10px;
}
.dialog-main-text {
  font-size: 20px;
}
.dialog-main-content {
  flex: 1;
}
.body-title {
  font-size: 17px;
  color: #333333;
}
.body-body-des {
  color: #606266;
}

.new-dailog::v-deep {
  .el-dialog__body {
    padding: 0;
  }
}
.dialog-footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-top: 1px solid #eee;
}
</style>
