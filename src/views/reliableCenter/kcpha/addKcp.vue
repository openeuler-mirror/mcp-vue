<template>
  <el-drawer
    size="1100px"
    title="新增KCP节点"
    direction="rtl"
    :wrapperClosable="false"
    custom-class=""
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content">
        <div>
          <p style="margin: 0">{{ $t("reliableCenter.configurationGuide") }}</p>
          <p>{{ $t("reliableCenter.configurationGuideStep1") }}</p>
          <p>{{ $t("reliableCenter.configurationGuideStep2") }}</p>
          <p>{{ $t("reliableCenter.configurationGuideStep3") }}</p>
        </div>
        <div class="template-box">
          <el-form
            ref="createDataForm"
            label-width="auto"
            :model="createFormData"
            :rules="rulesTemplate"
          >
            <!-- 节点IP -->
            <el-form-item :label="$t('reliableCenter.nodeIp')" prop="slaveIp">
              <el-input
                type="text"
                v-model="createFormData.slaveIp"
                autocomplete="off"
                :placeholder="
                  $t('common.pleaseEnter') + 'KCP' + $t('reliableCenter.nodeIp')
                "
              />
            </el-form-item>
            <!-- 用户名 -->
            <el-form-item :label="$t('common.userName')" prop="sysadmin">
              <!-- 请输入节点用户名 -->
              <el-input
                v-model="createFormData.sysadmin"
                readonly
                class="disable-input"
                :placeholder="$t('common.pleaseEnter') + $t('common.userName')"
              />
            </el-form-item>
            <!-- 管理员密码 -->
            <el-form-item
              :label="$t('reliableCenter.password')"
              prop="password"
            >
              <el-input
                v-model="createFormData.password"
                type="password"
                :placeholder="$t('authorityMgr.loginPwdplaceholder')"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="drawer-foot">
        <el-button type="primary" @click="handelSubmit">{{
          $t("externalCloud.vmOperate.sure")
        }}</el-button>
        <el-button @click="handelClose">{{
          $t("externalCloud.vmOperate.cancel")
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import validate from "@/utils/validate";
import md5 from "js-md5";
import { handelAddHa } from "@/api/remoteDisasterRecovery";
export default {
  name: "addKcp",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      // 汪雷8.9日要求修改为admin
      createFormData: {
        sysadmin: "admin",
      },
      drawerLoading: false,
      rulesTemplate: {
        // 用户名不能为空
        sysadmin: [
          {
            required: true,
            message:
              this.$t("resourceMgr.clusterAdminName") +
              this.$t("common.notNull"),
            trigger: "blur",
          },
          // 用户名长度应控制在 6 ~ 32 个字符
          {
            min: 2,
            max: 32,
            message:
              this.$t("resourceMgr.clusterAdminName") +
              this.$t("externalCloud.vcenter.nameLength"),
            trigger: "blur",
          },
          // 用户名只能由英文字母、数字组合
          {
            trigger: "blur",
            message:
              this.$t("resourceMgr.clusterAdminName") +
              this.$t("common.adminNameWranMsg"),
            validator: validate.validateCharEnNum,
          },
        ],
        slaveIp: [
          {
            required: true,
            message: this.$t("workOrder.ipSet.ipNotNull"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("workOrder.ipSet.ipWran"),
            validator: validate.validateIp,
          },
        ],
        password: [
          //  密码不能为空
          {
            required: true,
            message: this.$t("resourceMgr.clusterAdminPasswordplac"),
            trigger: "blur",
          },
          // 密码长度应控制在 6 ~ 32 个字符
          {
            min: 6,
            max: 32,
            message:
              this.$t("resourceMgr.clusterAdminPassword") +
              this.$t("externalCloud.vcenter.nameLength"),
            trigger: "blur",
          },
          // 密码只能由英文字母、数字组合
          {
            trigger: "blur",
            message:
              this.$t("resourceMgr.clusterAdminPassword") +
              this.$t("common.adminPwdWranMsg"),
            validator: validate.validateCharEnNum,
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
  methods: {
    handelClose() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
    handelSubmit() {
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          const { slaveIp, sysadmin, password } = this.createFormData;
          const params = { slaveIp, sysadmin, password: md5(password) };
          handelAddHa(params).then((res) => {
            this.$message.success(this.$t("resourceMgr.vMwareMgr.addSucc"));
            this.$emit("freshTable");
          });
          this.$emit("selectChange", this.selectData);
          this.handelClose();
        }
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
.disable-input::v-deep input {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
