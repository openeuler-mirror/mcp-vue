<template>
  <div class="drawer-content" v-loading="loading">
    <div class="drawer-body-content">
      <div v-if="basicInfoForm.type == 'x'" class="template-tipbox">
        <div class="template-tipbox-icon el-icon-warning"></div>
        <div class="template-tipbox-mag">
          <!-- 跨组织转移云服务器，会断开云服务器网络；需为云服务器配置网络。 -->
          {{ $t("transferMgr.transferMsg") }}
        </div>
      </div>
      <div class="template-box">
        <el-form
          ref="basicInfoForm"
          label-width="auto"
          :model="basicInfoForm"
          :rules="rulesTemplate"
        >
          <!-- 类型 -->
          <el-form-item
            v-if="transforType !== 'MCDEFAULT'"
            :label="$t('transferMgr.type')"
            prop="type"
          >
            <el-radio-group v-model="basicInfoForm.type" @change="typeChange">
              <el-radio label="1">
                <!-- 同组织转移 -->
                {{ $t("transferMgr.sameOrgTransfer") }}
              </el-radio>
              <el-radio label="2">
                <!-- 跨组织转移 -->
                {{ $t("transferMgr.transferAcrossOrg") }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div
            v-if="basicInfoForm.type == '1' && transforType !== 'MCDEFAULT'"
            key="sameOrgTransfer"
          >
            <!-- 选择用户 -->
            <el-form-item :label="$t('transferMgr.selectUser')" prop="userName">
              <el-input
                v-model="basicInfoForm.userName"
                qlinput-readonly
                readonly
                :placeholder="$t('common.select')"
              >
                <template #append>
                  <el-button @click="openSelectModal('user')">
                    {{ $t("common.select") }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div
            v-if="basicInfoForm.type == '2' || transforType === 'MCDEFAULT'"
            key="transferAcrossOrg"
          >
            <!-- 选择组织 -->
            <el-form-item :label="$t('transferMgr.selectOrg')" prop="orgName">
              <el-input
                v-model="basicInfoForm.orgName"
                qlinput-readonly
                readonly
                :placeholder="$t('common.select')"
              >
                <template #append>
                  <el-button @click="openSelectModal('org')">
                    {{ $t("common.select") }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <!-- 选择组织用户 -->
            <el-form-item
              :label="$t('transferMgr.selectOrgUser')"
              prop="selectOrgUser"
            >
              <el-input
                v-model="basicInfoForm.userName"
                qlinput-readonly
                readonly
                :placeholder="$t('common.select')"
              >
                <template #append>
                  <el-button
                    :disabled="selectUserDis"
                    @click="openSelectModal('orguser')"
                  >
                    {{ $t("common.select") }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <!-- 网卡1 -->
            <!-- <el-form-item label="网卡1" prop="user">
              <el-input
                v-model="basicInfoForm.network1"
                qlinput-readonly
                readonly
                :placeholder="$t('common.select')"
              >
                <template #append>
                  <el-button @click="openSelectModal('network')">
                    {{ $t("common.select") }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item> -->
            <!-- 网卡2 -->
            <!-- <el-form-item label="网卡2" prop="user">
              <el-input
                v-model="basicInfoForm.network2"
                qlinput-readonly
                readonly
                :placeholder="$t('common.select')"
              >
                <template #append>
                  <el-button @click="openSelectModal('network')">
                    {{ $t("common.select") }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item> -->
          </div>
          <div v-else key="other"></div>
        </el-form>
      </div>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />

    <!-- 选择用户 -->
    <bindUserModal
      :options="bindUserModalOption"
      :visible.sync="showbindUserModal"
      @confirm="bindUserConfirm"
    ></bindUserModal>
    <!-- 选择组织 -->
    <bindOrgModal
      :options="bindOrgModalOption"
      :visible.sync="showbindOrgModal"
      @confirm="bindOrgConfirm"
    ></bindOrgModal>
    <!-- 选择网络 -->
    <bindNetworkModal
      :options="bindNetworkModalOption"
      :visible.sync="showbindNetworkModal"
      @confirm="bindOrgConfirm"
    ></bindNetworkModal>
  </div>
</template>
<script>
import footBtn from "@/components/Footbtn";
import bindUserModal from "./bindUserModal/bindUserModal.vue";
import bindOrgModal from "./bindOrgModal/bindOrgModal.vue";
import bindNetworkModal from "./bindNetworkModal/bindNetworkModal.vue";
import { serverVmTransfer } from "@/api/serverVm";

export default {
  components: {
    footBtn,
    bindUserModal,
    bindOrgModal,
    bindNetworkModal,
  },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
    //ZONE,ORG,USER,MCDEFAULT:默认分组
    transforType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      oriFormData: {
        type: "1",
        orgId: "",
        orgName: "",
        userId: "",
        userName: "",
        network1: "",
        network2: "",
        selectOrgUser: "",
        selectOrgUserId: "",
      },
      basicInfoForm: {},
      loading: false,
      rulesTemplate: {
        userName: [
          {
            required: true,
            message: this.$t("transferMgr.selectUserPlac"), // "请选择用户",
            trigger: "blur",
          },
        ],
        orgName: [
          {
            required: true,
            message: this.$t("transferMgr.selectOrgPlac"), // "请选择组织",
            trigger: "blur",
          },
        ],
        selectOrgUser: [
          {
            required: true,
            message: this.$t("transferMgr.selectOrgUserPlac"), // "请选择组织",
            trigger: "blur",
          },
        ],
      },
      showbindUserModal: false,
      bindUserModalOption: {
        title: "",
        formData: "", // 表单数据
      },
      showbindOrgModal: false,
      bindOrgModalOption: {
        title: "",
        formData: "", // 表单数据
      },

      showbindNetworkModal: false,
      bindNetworkModalOption: {
        title: "",
        formData: "", // 表单数据
      },

      selectUserDis: true,
    };
  },
  watch: {},
  created() {},
  computed: {},
  mounted() {
    this.setPageData();
  },
  methods: {
    setPageData() {
      this.basicInfoForm = JSON.parse(JSON.stringify(this.oriFormData));
      let { formData } = this.formOptions;
      this.basicInfoForm.orgId = formData.orgId;
      this.basicInfoForm.orgName = formData.orgName;
      this.selectUserDis =
        this.basicInfoForm.orgId || this.transforType === "MCDEFAULT"
          ? false
          : true;
      // this.basicInfoForm = {};
    },
    typeChange() {
      // this.selectUserDis = true;
      this.basicInfoForm.userId = "";
      this.basicInfoForm.userName = "";
      this.basicInfoForm.selectOrgUser = "";
      this.basicInfoForm.selectOrgUserId = "";
    },
    // 提交
    handlerConfirm() {
      this.$refs.basicInfoForm.validate((valid) => {
        if (valid) {
          // 编辑信息
          this.commitEdit();
        } else {
          return false;
        }
      });
    },
    commitEdit() {
      this.loading = true;
      let { formData } = this.formOptions;
      let params = {
        machineUUid: formData.serverVmUuid, //	云服务器uuid
        transferToUserId: this.basicInfoForm.userId, //	转移用户ID
        clusterId: formData.clusterId, //	集群ID
      };
      let successMsg = this.$t("common.successfulOperation"); // "操作成功";
      let errorMsg = this.$t("common.operationFailed"); // "操作失败";
      serverVmTransfer(params)
        .then((res) => {
          this.alertTips(successMsg, "success");
          this.$emit("confirm");
        })
        .catch((err) => {
          this.alertTips(err, "error");
          this.$emit("confirm");
        })
        .finally((_) => {
          this.loading = false;
        });
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },
    openSelectModal(key) {
      let { formData } = this.formOptions;
      switch (key) {
        case "user":
          this.bindUserModalOption = {
            title: this.$t("transferMgr.selectUser"), // "选择用户",
            editflag: "",
            formData: {
              orgId: formData.orgId,
              orgName: formData.orgName,
              userId: this.basicInfoForm.userId,
              userName: this.basicInfoForm.userName,
              transforType: this.transforType,
            }, // 表单数据
          };
          this.showbindUserModal = true;
          break;
        case "org":
          this.bindOrgModalOption = {
            title: this.$t("transferMgr.selectOrg"), // "选择组织",
            editflag: "",
            formData: {
              orgId: this.basicInfoForm.orgId,
              orgName: this.basicInfoForm.orgName,
              userId: this.basicInfoForm.userId,
              userName: this.basicInfoForm.userName,
              clusterId: formData.clusterId,
              machineUUid: formData.serverVmUuid,
              transforType: this.transforType,
            }, // 表单数据
          };
          this.showbindOrgModal = true;
          break;
        case "network":
          this.bindNetworkModalOption = {
            title: "选择网卡",
            editflag: "",
            formData: formData, // 表单数据
          };
          this.showbindNetworkModal = true;
          break;
        case "orguser":
          this.bindUserModalOption = {
            title: this.$t("transferMgr.selectOrgUser"), // "选择组织用户",
            editflag: "",
            formData: {
              orgId: this.basicInfoForm.orgId,
              orgName: this.basicInfoForm.orgName,
              userId: this.basicInfoForm.userId,
              userName: this.basicInfoForm.userName,
            }, // 表单数据
          };
          this.showbindUserModal = true;
          break;

        default:
          break;
      }
    },
    bindOrgConfirm(orgList) {
      if (orgList.length === 0) {
        return;
      }
      let ids = [];
      let names = [];
      orgList.forEach((element) => {
        const { organizationId, organizationName } = element;
        ids.push(organizationId);
        names.push(organizationName);
      });
      this.basicInfoForm.orgId = ids.toString();
      this.basicInfoForm.orgName = names.toString();
      this.basicInfoForm.userId = "";
      this.basicInfoForm.userName = "";
      this.basicInfoForm.selectOrgUser = "";
      this.basicInfoForm.selectOrgUserId = "";
    },
    bindUserConfirm(userList) {
      if (userList.length === 0) {
        return;
      }
      let ids = [];
      let names = [];
      userList.forEach((element) => {
        const { userId, userName } = element;
        ids.push(userId);
        names.push(userName);
      });
      this.basicInfoForm.userId = ids.toString();
      this.basicInfoForm.userName = names.toString();
      this.basicInfoForm.selectOrgUserId = ids.toString();
      this.basicInfoForm.selectOrgUser = names.toString();
      this.selectUserDis = this.basicInfoForm.orgId ? false : true;
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.drawer-body-content {
  @include formStyle;
}

.template-tipbox {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
  padding: 20px;
  line-height: 20px;
  .template-tipbox-icon {
    width: 20px;
    margin-right: 15px;
    font-size: 20px;
  }
  .template-tipbox-mag {
    flex: 1;
  }
}
</style>
