<template>
  <div class="drawer-content">
    <div class="create-new-network">
      <div class="template-box">
        <el-form
          ref="changePwdForm"
          label-width="auto"
          :model="changePwdFormData"
          :rules="rulesTemplate"
        >
          <el-form-item :label="$t('common.login.oldPwd')" prop="oldPwd">
            <el-input
              v-model="changePwdFormData.oldPwd"
              type="password"
              :placeholder="$t('common.login.placeholder')"
              name="password"
              auto-complete="on"
            />
          </el-form-item>
          <el-form-item :label="$t('common.login.newPwd')" prop="newPwd">
            <el-input
              v-model="changePwdFormData.newPwd"
              type="password"
              :placeholder="$t('common.login.placeholder')"
              name="password"
              auto-complete="on"
            />
          </el-form-item>
          <el-form-item
            :label="$t('common.login.confirmPwd')"
            prop="confirmPwd"
          >
            <el-input
              v-model="changePwdFormData.confirmPwd"
              type="password"
              :placeholder="$t('common.login.placeholder')"
              name="password"
              auto-complete="on"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>
<script>
import validate from "@/utils/validate";
import footBtn from "@/components/Footbtn";
import { resetPassword } from "@/api/login";
import md5 from "js-md5";
export default {
  components: {
    footBtn,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateCheckPwd = (rule, value, callback) => {
      if (value !== this.changePwdFormData.newPwd) {
        callback(new Error(this.$t("common.login.confirmPwdErr")));
      } else {
        callback();
      }
    };
    return {
      drawerVisible: this.visible,
      changePwdFormData: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      rulesTemplate: {
        // 原密码
        oldPwd: [
          {
            required: true,
            message: this.$t("common.login.pwdMsg"),
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: this.$t("common.login.placeholder"),
            trigger: "blur",
          },
        ],

        // 新密码
        newPwd: [
          {
            required: true,
            message: this.$t("common.login.pwdMsg"),
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: this.$t("common.login.placeholder"),
            trigger: "blur",
          },
        ],
        confirmPwd: [
          {
            required: true,
            message: this.$t("common.login.pwdMsg"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("common.login.confirmPwdMsg"),
            validator: validateCheckPwd,
          },
        ],
      },
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  created() {},
  methods: {
    // 提交
    handlerConfirm() {
      this.$refs.changePwdForm.validate((valid) => {
        if (valid) {
          this.commitCreate();
        } else {
          return false;
        }
      });
    },
    commitCreate() {
      let oldPwd = this.changePwdFormData.oldPwd;
      let newPwd = this.changePwdFormData.newPwd;

      resetPassword({
        oldPassword: md5(oldPwd),
        newPassword: md5(newPwd),
      })
        .then((res) => {
          this.$store.dispatch("user/logout");
          location.reload();
          // this.$router.go(0);
          // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          this.alertTips("密码重置成功!", "success");
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.create-new-network {
  @include formStyle;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;

  .el-input {
    width: $input-width;
  }
}
</style>
