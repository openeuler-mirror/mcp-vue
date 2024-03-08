<template>
  <div class="drawer-content">
    <div class="create-new-form">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 用户名  -->
          <el-form-item :label="$t('authorityMgr.userName')" prop="userName">
            <el-input
              v-model="createDataFormData.userName"
              :disabled="formOptions.editflag"
              :placeholder="$t('authorityMgr.userNameplaceholder')"
            />
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('authorityMgr.userNametootip')"
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
          </el-form-item>
          <!--真实姓名  -->
          <el-form-item :label="$t('authorityMgr.realName')" prop="realName">
            <el-input
              v-model="createDataFormData.realName"
              :disabled="formOptions.editflag"
              :placeholder="$t('authorityMgr.realNameplaceholder')"
            />
          </el-form-item>
          <!-- 编辑用户 登录密码-->
          <el-form-item
            v-if="formOptions.editflag && !showEditPwd"
            :label="$t('authorityMgr.loginPwd')"
          >
            <el-input
              v-model="createDataFormData.loginPwd"
              type="password"
              auto-complete="new-password"
              disabled
              :placeholder="$t('authorityMgr.loginPwdplaceholder')"
            />
            <el-link
              type="primary"
              @click="editpassword"
              style="margin-left: 20px"
            >
              {{ $t("authorityMgr.editpassword") }}
            </el-link>
          </el-form-item>

          <!-- 创建用户 -->
          <div v-if="!formOptions.editflag">
            <el-form-item :label="$t('authorityMgr.loginPwd')" prop="loginPwd">
              <el-input
                v-model="createDataFormData.loginPwd"
                type="password"
                auto-complete="new-password"
                :placeholder="$t('authorityMgr.loginPwdplaceholder')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('authorityMgr.confirmPwd')"
              prop="confirmPwd"
            >
              <el-input
                v-model="createDataFormData.confirmPwd"
                type="password"
                auto-complete="new-password"
                :placeholder="$t('authorityMgr.confirmPwdplaceholder')"
              />
            </el-form-item>
          </div>

          <div v-if="showEditPwd">
            <el-form-item
              :label="$t('authorityMgr.loginNewPwd')"
              prop="loginPwd"
            >
              <el-input
                v-model="createDataFormData.loginPwd"
                type="password"
                auto-complete="new-password"
                :placeholder="$t('authorityMgr.loginNewPwdplaceholder')"
              />
            </el-form-item>
            <el-form-item
              :label="$t('authorityMgr.confirmPwd')"
              prop="confirmPwd"
            >
              <el-input
                v-model="createDataFormData.confirmPwd"
                type="password"
                auto-complete="new-password"
                :placeholder="$t('authorityMgr.confirmPwdplaceholder')"
              />
            </el-form-item>
          </div>

          <el-form-item
            :label="$t('authorityMgr.bindorgName')"
            prop="orgName"
            class="input-with-select"
          >
            <el-input
              v-model="createDataFormData.orgName"
              qlinput-readonly
              readonly
              :placeholder="$t('authorityMgr.bindorgNameplaceholder')"
            >
              <template #append>
                <el-button
                  :disabled="!canModifyOrg"
                  @click="openSelectModal('org')"
                >
                  {{ $t("common.select") }}
                </el-button>
              </template>
            </el-input>

            <div
              v-if="canModifyOrg && otherBtnShow('org', 'create_org')"
              class="flex align-center"
            >
              {{ $t("authorityMgr.noorgName") }}
              <el-link type="primary" @click="toCreateOrg">
                {{ $t("common.create") }}
              </el-link>
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('authorityMgr.bindroleName')"
            prop="roleName"
            class="input-with-select"
          >
            <el-input
              v-model="createDataFormData.roleName"
              qlinput-readonly
              readonly
              :placeholder="$t('authorityMgr.bindroleNameplaceholder')"
            >
              <template #append>
                <el-button
                  :disabled="!canModifyRole && createDataFormData.orgName != ''"
                  @click="openSelectModal('role')"
                >
                  {{ $t("common.select") }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('authorityMgr.mobile')" prop="mobile">
            <el-input
              v-model="createDataFormData.mobile"
              :placeholder="$t('authorityMgr.mobileplaceholder')"
            />
          </el-form-item>
          <el-form-item
            v-if="currentBtnShow('active_user')"
            :label="$t('authorityMgr.userStatus')"
            prop="status"
          >
            <el-switch
              class="switch"
              :active-text="$t('common.open')"
              active-value="ACTIVATE"
              :inactive-text="$t('common.close')"
              inactive-value="NO_ACTIVATE"
              v-model="createDataFormData.status"
            >
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
    <!-- 选择绑定组织 -->
    <bindOrgModal
      :visible.sync="showbindOrgModal"
      :defaultSelectedKeys="orgSelectedKeys"
      @confirm="bindOrgModalConfirm"
    ></bindOrgModal>
    <!-- 绑定角色 -->
    <bindRoleModal
      :visible.sync="showbindRoleModal"
      :defaultSelectedKeys="roleSelectedKeys"
      :roleOrgId="roleOrgId"
      @confirm="bindRoleModalConfirm"
    ></bindRoleModal>
  </div>
</template>
<script>
import validate from "@/utils/validate";
import footBtn from "@/components/Footbtn";
import bindOrgModal from "../../../organizationMgr/bindOrganization/bindOrgModal.vue";
import bindRoleModal from "../bindRoleModal/bindRoleModal.vue";
import { createUser, modifyUser } from "@/api/userMgr";
import md5 from "js-md5";

export default {
  components: {
    footBtn,
    bindOrgModal,
    bindRoleModal,
  },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    // 确认密码
    const validateCheckPwd = (rule, value, callback) => {
      if (value !== this.createDataFormData.loginPwd) {
        callback(new Error(this.$t("authorityMgr.pwdInconsistent")));
      } else {
        callback();
      }
    };
    const validatePwd = (rule, value, callback) => {
      const char_en_num = /(?!^d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{4,23}/;
      if (!char_en_num.test(value)) {
        callback(new Error(this.$t("authorityMgr.pwdNotcombination")));
      } else {
        if (
          this.createDataFormData.confirmPwd &&
          value !== this.createDataFormData.confirmPwd
        ) {
          callback(new Error(this.$t("authorityMgr.pwdInconsistent")));
        } else {
          this.$refs.createDataForm.validateField("confirmPwd");
          callback();
        }
      }
    };
    return {
      oriFormData: {
        orgId: "",
        orgName: "", // 绑定组织
        roleId: "",
        roleName: "", //绑定角色

        userName: "", // 用户名
        realName: "", // 真实姓名
        loginPwd: "", // 登录密码
        confirmPwd: "", // 确认密码
        mobile: "",
        status: "ACTIVATE", // ACTIVATE(激活) NO_ACTIVATE(不激活)
      },
      createDataFormData: {},

      rulesTemplate: {
        roleName: [
          {
            required: true,
            message: this.$t("authorityMgr.bindroleNameplaceholder"),
            trigger: "blur",
          },
        ],
        orgName: [
          {
            required: true,
            message: this.$t("authorityMgr.bindorgNameplaceholder"),
            trigger: "blur",
          },
        ],
        userName: [
          {
            required: true,
            message: this.$t("authorityMgr.userNameNotNull"),
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: this.$t("authorityMgr.userNameLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("authorityMgr.userNamecombination"),
            validator: validate.validateEnNum,
          },
        ],
        realName: [
          {
            required: true,
            message: this.$t("authorityMgr.realNameNotNull"),
            trigger: "blur",
          },
        ],
        loginPwd: [
          {
            required: true,
            message: this.$t("authorityMgr.pwdNotNull"),
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: this.$t("authorityMgr.pwdNotLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: validatePwd,
          },
        ],
        confirmPwd: [
          {
            required: true,
            message: this.$t("authorityMgr.confirmpwdNotNull"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("authorityMgr.confirmpwdInconsistent"),
            validator: validateCheckPwd,
          },
        ],
      },

      showbindOrgModal: false,
      orgSelectedKeys: [],
      showbindRoleModal: false,
      roleSelectedKeys: [],
      showEditPwd: false,
      canModifyOrg: true,
      canModifyRole: true,
      roleOrgId: "",
    };
  },
  watch: {},
  created() {
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    let info = JSON.parse(localStorage.getItem("userInfo"));
    let { editflag, formData } = this.formOptions;
    this.showEditPwd = false;
    if (editflag) {
      // 编辑
      this.canModifyRole = formData.canModifyRole;
      this.canModifyOrg = formData.canModifyOrg;
      this.createDataFormData.userId = formData.userId;
      this.createDataFormData.userName = formData.userName;
      this.createDataFormData.realName = formData.realName;
      this.createDataFormData.loginPwd = formData.password;

      this.createDataFormData.orgId = formData.organizationId;
      this.createDataFormData.orgName = formData.organizationName;

      this.createDataFormData.roleId = formData.roleId;
      this.createDataFormData.roleName = formData.roleName;
      this.createDataFormData.mobile = formData.mobile;
      this.createDataFormData.status = formData.status;
    } else {
      // 新增
      this.canModifyRole = true;
      this.canModifyOrg = true;
      let { topUser } = info;
      if (topUser) {
        this.createDataFormData.orgId = "";
        this.createDataFormData.orgName = "";
      } else {
        this.createDataFormData.orgId = info.organizationId;
        this.createDataFormData.orgName = info.organizationName;
      }

      this.createDataFormData.roleId = "";
      this.createDataFormData.roleName = "";
    }

    this.setorgSelectedKeys();
  },
  computed: {},
  methods: {
    toCreateOrg() {
      this.$router.push({ name: "organization", params: { createdOrg: true } });
    },
    setorgSelectedKeys() {
      this.orgSelectedKeys = [
        {
          organizationId: this.createDataFormData.orgId,
          organizationName: this.createDataFormData.orgName,
        },
      ];
      this.setroleSelectedKeys();
    },
    setroleSelectedKeys() {
      this.roleSelectedKeys = [
        {
          roleId: this.createDataFormData.roleId,
          roleName: this.createDataFormData.roleName,
        },
      ];
    },
    bindOrgModalConfirm(rows) {
      // roleType: "SELF_SERVICE"
      if (rows && rows.length >= 1) {
        this.createDataFormData.orgId = rows[0].organizationId;
        this.createDataFormData.orgName = rows[0].organizationName;
      } else {
        this.createDataFormData.orgId = "";
        this.createDataFormData.orgName = "";
      }

      let { editflag, formData } = this.formOptions;
      if (editflag) {
        // 编辑
        if (formData.roleType !== "SELF_SERVICE") {
          this.createDataFormData.roleId = "";
          this.createDataFormData.roleName = "";
        }
      } else {
        // 新增
        this.createDataFormData.roleId = "";
        this.createDataFormData.roleName = "";
      }

      this.setorgSelectedKeys();
      this.setroleSelectedKeys();
    },
    bindRoleModalConfirm(rows) {
      if (rows && rows.length >= 1) {
        this.createDataFormData.roleId = rows[0].roleId;
        this.createDataFormData.roleName = rows[0].roleName;
      } else {
        this.createDataFormData.roleId = "";
        this.createDataFormData.roleName = "";
      }

      this.setroleSelectedKeys();
    },
    // 提交
    handlerConfirm() {
      let { editflag } = this.formOptions;
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          if (editflag) {
            // 编辑信息
            this.commitEdit();
          } else {
            // 新增信息
            this.commitCreate();
          }
        } else {
          return false;
        }
      });
    },
    commitEdit() {
      let password = "";
      let { formData } = this.formOptions;
      if (this.showEditPwd) {
        password = md5(this.createDataFormData.confirmPwd);
      } else {
        password = formData.password;
      }
      let editData = {
        userId: this.createDataFormData.userId,
        userName: this.createDataFormData.userName, // 用户名
        realName: this.createDataFormData.realName, // 真实姓名
        password: password, // 密码
        mobile: this.createDataFormData.mobile, // 手机号
        remark: this.createDataFormData.remark, // 描述
        status: this.createDataFormData.status, // 激活状态 // ACTIVATE,NO_ACTIVATE // 枚举备注: ACTIVATE(激活) NO_ACTIVATE(不激活)
        organizationId: this.createDataFormData.orgId, // 组织ID
        roleId: this.createDataFormData.roleId, // 角色ID
      };
      modifyUser(editData)
        .then((res) => {
          this.alertTips(this.$t("authorityMgr.modifyUsersuccess"), "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    commitCreate() {
      let createData = {
        userName: this.createDataFormData.userName, // 用户名
        realName: this.createDataFormData.realName, // 真实姓名
        password: md5(this.createDataFormData.confirmPwd), // 密码
        mobile: this.createDataFormData.mobile, // 手机号
        remark: this.createDataFormData.remark, // 描述
        status: this.createDataFormData.status, // 激活状态 // ACTIVATE,NO_ACTIVATE // 枚举备注: ACTIVATE(激活) NO_ACTIVATE(不激活)
        organizationId: this.createDataFormData.orgId, // 组织ID
        roleId: this.createDataFormData.roleId, // 角色ID
      };
      createUser(createData)
        .then((res) => {
          this.alertTips(this.$t("authorityMgr.createUsersuccess"), "success");
          this.$parent.closeDrawer();
          this.$emit("freshTree");
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },
    openSelectModal(key) {
      switch (key) {
        case "role":
          let bindOrgNamePlc = this.$t("authorityMgr.bindOrgNamePlc"); // "请选择绑定组织"
          if (this.createDataFormData.orgId == "") {
            this.alertTips(bindOrgNamePlc, "error");
          } else {
            this.roleOrgId = this.createDataFormData.orgId.toString();
            this.showbindRoleModal = true;
          }
          break;
        case "org":
          this.showbindOrgModal = true;
          break;

        default:
          this.showbindRoleModal = false;
          this.showbindOrgModal = false;
          break;
      }
    },
    editpassword() {
      this.showEditPwd = true;
      this.createDataFormData.loginPwd = "";
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
@include DrawerRtl;

.create-new-form {
  @include formStyle;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;

  .el-input {
    width: $input-width;
  }

  .el-textarea {
    width: $input-width;
  }
}
</style>
