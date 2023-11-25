<template>
  <el-drawer
    size="900px"
    :title="
      modeltype === 'create'
        ? $t('resourceMgr.addBareMetal')
        : $t('resourceMgr.editBareMetal')
    "
    direction="rtl"
    :wrapperClosable="false"
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content">
        <el-form ref="form" label-width="auto" :model="form" :rules="rules">
          <el-form-item :label="$t('common.name')" prop="name">
            <el-input v-model="form.name" type="text" />
          </el-form-item>
          <el-form-item :label="$t('common.desc')" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              maxlength="400"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </el-form-item>
          <!-- 主机管理IP   rootName password -->
          <!-- <el-form-item :label="'主机管理IP'" prop="hostIp">
            <el-input
              v-model="form.hostIp"
              :disabled="modeltype === 'edit'"
              type="text"
              auto-complete="new-password"
            />
          </el-form-item> -->
          <!-- root密码  -->
          <!-- <el-form-item
            :label="'root密码'"
            prop="rootPwd"
            v-if="modeltype !== 'edit'"
          >
            <el-input
              v-model="form.rootPwd"
              :disabled="modeltype === 'edit'"
              type="password"
              :placeholder="$t('common.login.placeholder')"
              auto-complete="new-password"
            />
          </el-form-item> -->
          <!-- BMC IP  -->

          <el-form-item :label="'BMC IP'" prop="bmcIp">
            <el-input
              :disabled="modeltype === 'edit'"
              v-model="form.bmcIp"
              type="text"
            />
          </el-form-item>
          <!-- BMC账号 -->
          <el-form-item :label="$t('resourceMgr.BMCAccount')" prop="bmcName">
            <el-input v-model="form.bmcName" type="text" />
          </el-form-item>
          <el-form-item :label="$t('common.password')" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              name="password"
              auto-complete="on"
            />
          </el-form-item>
          <!-- <el-form-item
            :label="$t('common.login.confirmPwd')"
            prop="confirmPwd"
            v-if="modeltype !== 'edit'"
          >
            <el-input
              v-model="form.confirmPwd"
              type="password"
              :placeholder="$t('common.login.placeholder')"
              name="password"
              auto-complete="on"
            />
          </el-form-item> -->
        </el-form>
      </div>
      <div class="drawer-foot">
        <el-button type="primary" @click="handelSubmit">
          {{ $t("externalCloud.vmOperate.sure") }}
        </el-button>
        <el-button @click="handelClose">
          {{ $t("externalCloud.vmOperate.cancel") }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import validate from "@/utils/validate";
import { bareMetalcreate, bareMetalupdate } from "@/api/vMwareMgr";
export default {
  name: "",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detailData: {
      type: Object,
      default: {},
    },
    modeltype: {
      type: String,
      default: "create",
    },
  },
  data() {
    const validateCheckPwd = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error(this.$t("common.login.confirmPwdErr")));
      } else {
        callback();
      }
    };
    return {
      drawerVisible: this.visible,
      drawerLoading: false,
      form: {},
      rules: {
        // name
        name: [
          {
            required: true,
            message: this.$t("resourceMgr.nameCantNull"),
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
            message: this.$t("common.nametooltip"), // "输入有误",
            validator: validate.validateCharZhEnNum,
          },
        ],
        // 原主机管理IP密码
        // hostIp: [
        //   {
        //     required: true,
        //     message: "主机管理IP不得为空",
        //     trigger: "blur",
        //   },
        //   {
        //     trigger: "blur",
        //     message: this.$t("workOrder.ipSet.ipWran"),
        //     validator: validate.validateIp,
        //   },
        // ],
        // rootPwd: [
        //   {
        //     required: true,
        //     message: "root密码不得为空",
        //     trigger: "blur",
        //   },
        // ],
        bmcIp: [
          {
            required: true,
            message: this.$t("resourceMgr.bmcIpCantNull"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("workOrder.ipSet.ipWran"),
            validator: validate.validateIp,
          },
        ],
        bmcName: [
          {
            required: true,
            message: this.$t("resourceMgr.bmcAccountCantNull"),
            trigger: "blur",
          },
        ],
        // 密码
        password: [
          {
            required: true,
            message: this.$t("common.passwordCantNull"),
            trigger: "blur",
          },
        ],
        // confirmPwd: [
        //   {
        //     required: true,
        //     message: this.$t("common.login.pwdMsg"),
        //     trigger: "blur",
        //   },
        //   {
        //     trigger: "blur",
        //     message: this.$t("common.login.confirmPwdMsg"),
        //     validator: validateCheckPwd,
        //   },
        // ],
      },
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis && this.modeltype === "edit") {
        this.$set(this, "form", this.detailData);
        this.$forceUpdate();
      }
    },
  },
  methods: {
    handelClose() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$refs.form.resetFields();
      this.$emit("update:visible", false);
      this.$emit("resetData");
    },
    handelSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const {
            hostIp,
            rootPwd,
            bmcIp,
            bmcName,
            name,
            remark,
            password,
            bareMetalId,
          } = this.form;
          this.modeltype === "create"
            ? this.handelSubmitCreate({
                name,
                remark,
                hostIp,
                rootPwd,
                bmcIp,
                bmcName,
                password,
              })
            : this.handelSubmitEdit({
                name,
                hostIp,
                remark,
                bmcIp,
                bmcName,
                password,
                bareMetalId,
              });
        }
      });
    },
    handelSubmitCreate(params) {
      bareMetalcreate(params).then((res) => {
        this.$message.success(this.$t("common.createSuccess"));
        this.$emit("fresh");
        this.handelClose();
      });
    },
    handelSubmitEdit(params) {
      bareMetalupdate(params).then((res) => {
        this.$message.success(this.$t("common.editSuccess"));
        this.$emit("fresh");
        this.handelClose();
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
.drawer-body-content {
  overflow-y: scroll;
}
.disable-input::v-deep input {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
