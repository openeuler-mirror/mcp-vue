<template>
  <el-drawer
    size="900px"
    :title="$t('externalCloud.vmOperate.cloneVm')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseClone"
  >
    <div class="drawer-content">
      <div class="drawer-body-content">
        <el-form
          ref="cloneDataForm"
          label-width="80px"
          :model="form"
          label-position="left"
          :rules="rules"
        >
          <el-form-item
            :label="$t('externalCloud.vmOperate.name')"
            prop="targetServerName"
          >
            <el-input v-model="form.targetServerName"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('externalCloud.vmOperate.description')"
            prop="cloneServerDescription"
          >
            <el-input
              v-model="form.cloneServerDescription"
              :maxlength="100"
              show-word-limit
              type="text"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('externalCloud.vmOperate.chooseHost')"
            prop="hostName"
          >
            <el-select
              v-model="form.hostName"
              :placeholder="
                $t('common.pleaseSelsect') + $t('externalCloud.vmOperate.host')
              "
            >
              <el-option
                v-for="(item, index) in hostList"
                :key="index"
                :label="item.hostName"
                :value="item.hostName"
                >{{ item.hostName }}</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('externalCloud.vmOperate.storageLocation')"
            prop="datastoreName"
          >
            <el-input v-model="form.datastoreName" readonly>
              <template slot="append">
                <el-button :disabled="false" @click="handelChooseStorage">{{
                  $t("externalCloud.vmOperate.choose")
                }}</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer-foot">
        <el-button type="primary" @click="handelSubmit">{{
          $t("externalCloud.vmOperate.sure")
        }}</el-button>
        <el-button @click="handleCloseClone">{{
          $t("externalCloud.vmOperate.cancel")
        }}</el-button>
      </div>
    </div>

    <getStorageBox
      :visible.sync="showStorage"
      :vcenterId="vcenterId"
      :hostName="form.hostName"
      @selectChange="selectChange"
    />
  </el-drawer>
</template>
<script>
import { getVcenterhostList, handelCloneVm } from "@/api/vcenter";
import getStorageBox from "./getStorageBox";
import validate from "@/utils/validate";
export default {
  name: "cloneVmDetailBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    choosenData: {
      type: Object,
      default: () => ({}),
    },
    modelType: {
      type: String,
      default: "",
    },
    vcenterId: {
      type: String,
      default: "",
    },
    rowData: {
      type: Object,
      default: "",
    },
  },
  components: {
    getStorageBox,
  },
  data() {
    return {
      drawerVisible: this.visible,
      form: {},
      hostList: [],
      showStorage: false,
      rules: {
        targetServerName: [
          // 名称不能为空
          {
            required: true,
            message:
              this.$t("externalCloud.vcenter.name") + this.$t("common.notNull"),
            trigger: "blur",
          },
          // 名称长度应控制在 2 ~ 32 个字符
          {
            min: 2,
            max: 32,
            message:
              this.$t("externalCloud.vcenter.name") +
              this.$t("externalCloud.vcenter.nameLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("common.vmName"), // "输入有误",
            validator: validate.validateCharNum,
          },
        ],
        // 主机不能为空
        hostName: {
          required: true,
          message:
            this.$t("externalCloud.vmOperate.host") + this.$t("common.notNull"),
          trigger: "blur",
        },
        // 存储不能为空
        datastoreName: {
          required: true,
          message:
            this.$t("externalCloud.vcenter.clusterStorage") +
            this.$t("common.notNull"),
          trigger: "blur",
        },
      },
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.$set(
          this.form,
          "targetServerName",
          this.rowData.serverName + "_clone"
        );
      }
    },
  },
  created() {
    this.intData();
  },
  methods: {
    intData() {
      const params = {
        pageNo: 1,
        pageSize: 1000,
        vcenterId: this.vcenterId,
      };
      getVcenterhostList(params).then((res) => {
        this.hostList = res;
      });
    },
    submitData() {
      const {
        targetServerName,
        cloneServerDescription,
        hostName,
        datastoreName,
      } = this.form;

      const data = {
        targetServerName: this.choosenData.targetServerName,
        targetServerName,
        cloneServerDescription,
        hostName,
        datastoreName,
      };
    },
    handleCloseClone() {
      this.form = {};
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
    handelChooseStorage() {
      if (!this.form.hostName) {
        this.$message.error(this.$t("externalCloud.vmOperate.chooseHostTips"));
        return;
      }
      this.showStorage = true;
    },
    selectChange(e) {
      this.$set(this.form, "datastoreName", e[0].datastoreName);
    },
    handelSubmit(e) {
      this.$refs.cloneDataForm.validate((valid) => {
        if (valid) {
          const {
            targetServerName,
            cloneServerDescription,
            hostName,
            datastoreName,
          } = this.form;
          handelCloneVm({
            vcenterId: this.vcenterId,
            cloneServerDescription,
            sourceServerName: this.rowData.serverName,
            targetServerName,
            hostName,
            datastoreName,
          }).then((res) => {
            this.$message.success(
              this.$t("externalCloud.vmOperate.cloneSuccess")
            );
            this.handleCloseClone();
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.success {
  color: $msgSuccess;
}
.error {
  color: $msgDanger;
}

.create-new-form {
  @include formStyle;
  display: flex;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;
  flex-direction: column;
  .template-box {
    .template-box-title {
      font-size: 16px;
      font-weight: bold;
      margin-right: 25px;
      line-height: 32px;
    }
    .template-box-content {
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        margin-bottom: 0px !important;
      }
      flex: 1;
      margin-right: 25px;
      .clusterStorage-box {
        display: flex;
        align-items: center;

        .clusterStorage-box-item {
          flex: 1;
        }
      }
    }
  }
  .el-input {
    width: $input-width;
  }
  .el-select {
    width: $input-width;
  }
  .el-textarea {
    width: $input-width;
  }
}
.drawer-content {
  height: 85%;
}
</style>
