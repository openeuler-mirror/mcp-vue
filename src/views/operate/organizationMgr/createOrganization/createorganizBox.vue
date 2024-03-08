<template>
  <div class="drawer-content">
    <div class="create-new-form">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
          :label-position="labelPosition"
        >
          <el-form-item
            :label="$t('authorityMgr.organizationName')"
            prop="organizationName"
          >
            <el-input
              v-model="createDataFormData.organizationName"
              :placeholder="$t('authorityMgr.organizationNameplc')"
            />
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('authorityMgr.roleNametooltip')"
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('authorityMgr.remark')" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="createDataFormData.remark"
            />
          </el-form-item>

          <el-form-item
            :label="$t('authorityMgr.parentName')"
            prop="parentName"
            class="input-with-select"
          >
            <el-input
              v-model="createDataFormData.parentName"
              qlinput-readonly
              readonly
              :placeholder="$t('authorityMgr.parentNameSelect')"
            >
              <template #append>
                <el-button
                  :disabled="!canModifyParent"
                  @click="openSelectModal('org')"
                >
                  {{ $t("common.select") }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            :label="$t('authorityMgr.vdcId')"
            prop="vdcId"
            class="input-with-select"
          >
            <el-input
              v-model="createDataFormData.vdcName"
              qlinput-readonly
              readonly
              :placeholder="$t('authorityMgr.vdcIdPlcInput')"
            >
              <template #append>
                <el-button
                  :disabled="!canModifyVdc"
                  @click="openSelectModal('vdc')"
                >
                  {{ $t("common.select") }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="showcreateLeader"
            :label="$t('authorityMgr.createLeader')"
            prop="createLeader"
          >
            <el-radio-group v-model="createDataFormData.createLeader">
              <el-radio :label="true">
                {{ $t("authorityMgr.createLeaderis") }}
              </el-radio>
              <el-radio :label="false">
                {{ $t("authorityMgr.createLeadernot") }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="createDataFormData.createLeader">
            <el-form-item
              :label="$t('authorityMgr.userName')"
              prop="leaderUserName"
            >
              <el-input
                v-model="createDataFormData.leaderUserName"
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
            <el-form-item
              :label="$t('authorityMgr.realName')"
              prop="leaderRealName"
            >
              <el-input
                :disabled="!editLeaderRealName"
                v-model="createDataFormData.leaderRealName"
                :placeholder="$t('authorityMgr.realNameplaceholder')"
              />
            </el-form-item>
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
                :placeholder="$t('authorityMgr.loginPwdplaceholder')"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
    <!-- 选择上级组织 -->
    <bindOrgModal
      :visible.sync="showbindOrgModal"
      :organizationId="formOptions.formData.organizationId"
      :defaultSelectedKeys="orgSelectedKeys"
      @confirm="bindOrgModalConfirm"
    ></bindOrgModal>
    <!-- 绑定VDC -->
    <bindVdcModal
      :visible.sync="showbindVdcModal"
      :vdcparentId="vdcparentId"
      :defaultSelectedKeys="vdcSelectedKeys"
      @confirm="bindVdcModalConfirm"
    ></bindVdcModal>
  </div>
</template>
<script>
import validate from "@/utils/validate";
import footBtn from "@/components/Footbtn";
import bindOrgModal from "../bindOrganization/bindOrgModal.vue";
import bindVdcModal from "@/views/components/bindVdc/bindVdcModal.vue";

import { createOrg, modifyOrg } from "@/api/organization";
import md5 from "js-md5";
export default {
  components: {
    footBtn,
    bindOrgModal,
    bindVdcModal,
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
    return {
      labelPosition: "right",
      vdcparentId: "",
      showcreateLeader: true,
      oriFormData: {
        organizationName: "", // 组织名称
        remark: "", // 描述
        vdcId: "", // 绑定VDC
        vdcName: "",
        parentId: "",
        parentName: "", // 上级组织
        createLeader: true, // 组织管理员
        leaderUserName: "", // 用户名
        leaderRealName: "", // 真实姓名
        loginPwd: "", // 登录密码
        confirmPwd: "", // 确认密码
      },
      createDataFormData: {},

      rulesTemplate: {
        organizationName: [
          {
            required: true,
            message: this.$t("authorityMgr.organizationNameNotNull"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 18,
            message: this.$t("authorityMgr.roleNameLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("authorityMgr.roleNametooltip"),
            validator: validate.validateCharZhEnNum,
          },
        ],
        parentName: [
          {
            required: true,
            message: this.$t("authorityMgr.parentNameSelect"), // "请选择上级组织",
            trigger: "blur",
          },
        ],
        vdcId: [
          {
            required: true,
            message: this.$t("authorityMgr.vdcIdPlcInput"),
            trigger: "blur",
          },
        ],
        createLeader: [
          {
            required: true,
            message: this.$t("authorityMgr.createLeaderselect"),
            trigger: "blur",
          },
        ],
        leaderUserName: [
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
        leaderRealName: [
          {
            required: false,
            message: this.$t("authorityMgr.userNameNotNull"),
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
            message: this.$t("authorityMgr.pwdNotcombination"),
            validator: validate.validateEnNum,
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
      showbindVdcModal: false,
      vdcSelectedKeys: [],
      editLeaderRealName: true,
      canModifyParent: true,
      canModifyVdc: true,
    };
  },
  watch: {},
  created() {
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    let { editflag, formData } = this.formOptions;
    if (editflag) {
      // 编辑
      this.oriEditFormData = JSON.parse(JSON.stringify(this.formOptions));
      this.createDataFormData.orgId = formData.organizationId;
      this.createDataFormData.organizationName = formData.organizationName;
      this.createDataFormData.remark = formData.remark;

      this.createDataFormData.parentId = formData.parentId;
      this.createDataFormData.parentName = formData.parentName;

      this.createDataFormData.vdcId = formData.vdcId;
      this.createDataFormData.vdcName = formData.vdcName;
      this.vdcSelectedKeys = [
        { vdcId: formData.vdcId, vdcName: formData.vdcName },
      ];
      this.showcreateLeader = !formData.hasOrgLeader;
      this.canModifyParent = formData.canModifyParent;
      this.canModifyVdc = formData.canModifyVdc;

      if (this.showcreateLeader) {
        this.createDataFormData.createLeader = false;
        this.editLeaderRealName = true;
        this.createDataFormData.leaderUserName = "";
        this.createDataFormData.orgLeaderUserId = "";
        this.createDataFormData.leaderRealName = "";
        this.createDataFormData.loginPwd = "";
        this.createDataFormData.confirmPwd = "";
      } else {
        this.createDataFormData.createLeader = true;
        this.createDataFormData.leaderUserName = formData.orgLeaderUserName;
        this.createDataFormData.orgLeaderUserId = formData.orgLeaderUserId;
        this.createDataFormData.leaderRealName = formData.orgLeaderRealName;
        this.editLeaderRealName = false;

        this.createDataFormData.loginPwd =
          formData.orgLeaderUserPassword.substring(0, 17);
        this.createDataFormData.confirmPwd =
          formData.orgLeaderUserPassword.substring(0, 17);
      }
    } else {
      // 新增
      this.showcreateLeader = true;
      this.editLeaderRealName = true;
      let info = JSON.parse(localStorage.getItem("userInfo"));
      this.createDataFormData.parentId = 0;
      this.createDataFormData.parentName = "";
      // topUser: true
      // let { topUser } = info;
      // if (topUser) {
      //   this.createDataFormData.parentId = 0;
      //   this.createDataFormData.parentName = "";
      // } else {
      //   this.createDataFormData.parentId = info.organizationId;
      //   this.createDataFormData.parentName = info.organizationName;
      // }
      this.canModifyParent = true;
      this.canModifyVdc = true;
      this.vdcSelectedKeys = [
        {
          vdcId: this.createDataFormData.vdcId,
          vdcName: this.createDataFormData.vdcName,
        },
      ];
    }
    this.vdcparentId = this.createDataFormData.parentId.toString();
    this.setorgSelectedKeys();
  },
  computed: {},
  methods: {
    setorgSelectedKeys() {
      this.orgSelectedKeys = [
        {
          organizationId: this.createDataFormData.parentId,
          organizationName: this.createDataFormData.parentName,
        },
      ];
    },
    bindOrgModalConfirm(rows) {
      if (rows && rows.length >= 1) {
        this.createDataFormData.parentId = rows[0].organizationId;
        this.createDataFormData.parentName = rows[0].organizationName;
      } else {
        this.createDataFormData.parentId = "";
        this.createDataFormData.parentName = "";
      }
      this.createDataFormData.vdcId = "";
      this.createDataFormData.vdcName = "";
      this.vdcparentId = this.createDataFormData.parentId.toString();
      this.setorgSelectedKeys();
    },
    bindVdcModalConfirm(rows) {
      if (rows && rows.length >= 1) {
        this.createDataFormData.vdcId = rows[0].vdcId;
        this.createDataFormData.vdcName = rows[0].vdcName;
      } else {
        this.createDataFormData.vdcId = "";
        this.createDataFormData.vdcName = "";
      }
      this.vdcSelectedKeys = [
        {
          vdcId: this.createDataFormData.vdcId,
          vdcName: this.createDataFormData.vdcName,
        },
      ];
    },
    // 提交
    handlerConfirm() {
      let { editflag } = this.formOptions;
      let parentNameSelect = this.$t("authorityMgr.parentNameSelect"); // 请选择上级组织
      if (this.createDataFormData.parentName == "") {
        this.alertTips(parentNameSelect, "error");
        return;
      }
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          if (editflag) {
            // 编辑组织信息
            this.commitEdit();
          } else {
            // 新增组织信息
            this.commitCreate();
          }
        } else {
          return false;
        }
      });
    },
    commitEdit() {
      let commitPwd = "";
      if (this.createDataFormData.createLeader) {
        let oripwd = "";
        let orgLeaderUserPassword =
          this.oriEditFormData.formData.orgLeaderUserPassword;
        let loginPwd = this.createDataFormData.loginPwd;
        if (orgLeaderUserPassword) {
          oripwd = orgLeaderUserPassword.substring(0, 17);
        }
        if (oripwd === loginPwd) {
          commitPwd = orgLeaderUserPassword;
        } else {
          commitPwd = md5(loginPwd);
        }
      } else {
        commitPwd = "";
      }

      let editOrgData = {
        orgId: this.createDataFormData.orgId,
        organizationName: this.createDataFormData.organizationName, // 组织名称
        remark: this.createDataFormData.remark, // 组织描述
        parentId: this.createDataFormData.parentId, // 父组织   没有父组织是传0
        parentName: this.createDataFormData.parentName, // 父组织   没有父组织是传0
        vdcId: this.createDataFormData.vdcId, // VDC数据中心id
        vdcName: this.createDataFormData.vdcName, // VDC数据中心
        createLeader: this.createDataFormData.createLeader, // 是否创建组织管理员 true:创建 false不创建
        leaderUserName: this.createDataFormData.leaderUserName, // 同户名 createLeader=true时必传
        leaderRealName: this.createDataFormData.leaderRealName, // 真是姓名  createLeader=true时必传
        leaderPassword: commitPwd, // 密码(MD5后)  createLeader=true时必传
        leaderUserId: this.createDataFormData.orgLeaderUserId,
      };
      modifyOrg(editOrgData)
        .then((res) => {
          this.alertTips(this.$t("authorityMgr.editOrgSucc"), "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    commitCreate() {
      let commitPwd = "";
      if (this.createDataFormData.createLeader) {
        let loginPwd = this.createDataFormData.loginPwd;
        commitPwd = md5(loginPwd);
      } else {
        commitPwd = "";
      }
      let createOrgData = {
        organizationName: this.createDataFormData.organizationName, // 组织名称
        remark: this.createDataFormData.remark, // 组织描述
        parentId: this.createDataFormData.parentId || 0, // 父组织   没有父组织是传0
        parentName: this.createDataFormData.parentName, // 父组织   没有父组织是传0
        vdcId: this.createDataFormData.vdcId, // VDC数据中心id
        vdcName: this.createDataFormData.vdcName, // VDC数据中心
        createLeader: this.createDataFormData.createLeader, // 是否创建组织管理员 true:创建 false不创建
        leaderUserName: this.createDataFormData.leaderUserName, // 同户名 createLeader=true时必传
        leaderRealName: this.createDataFormData.leaderRealName, // 真是姓名  createLeader=true时必传
        leaderPassword: commitPwd, // 密码(MD5后)  createLeader=true时必传
      };
      createOrg(createOrgData)
        .then((res) => {
          this.alertTips(this.$t("authorityMgr.createOrgSucc"), "success");
          this.$parent.closeDrawer();
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
        case "vdc":
          let parentNameSelect = this.$t("authorityMgr.parentNameSelect"); // 请选择上级组织
          if (this.createDataFormData.parentName == "") {
            this.alertTips(parentNameSelect, "error");
          } else {
            this.showbindVdcModal = true;
          }
          break;
        case "org":
          this.showbindOrgModal = true;
          break;

        default:
          this.showbindVdcModal = false;
          this.showbindOrgModal = false;
          break;
      }
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
