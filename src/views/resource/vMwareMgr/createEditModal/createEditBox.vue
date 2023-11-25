<template>
  <div class="drawer-content">
    <!-- 基本信息 -->
    <div class="drawer-body-content">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 名称 -->
          <el-form-item :label="$t('resourceMgr.vMwareMgr.name')" prop="name">
            <el-input
              v-model="createDataFormData.name"
              :placeholder="$t('common.pleaseEnter')"
            />
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('common.nametooltip')"
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 描述 -->
          <el-form-item
            :label="$t('resourceMgr.vMwareMgr.remark')"
            prop="remark"
          >
            <el-input
              type="textarea"
              maxlength="400"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="createDataFormData.remark"
            />
          </el-form-item>
          <!-- 类型 -->
          <el-form-item :label="$t('resourceMgr.vMwareMgr.type')" prop="type">
            <el-select
              v-model="createDataFormData.type"
              :placeholder="$t('common.pleaseSelsect')"
              disabled
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="'type' + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- URL -->
          <div
            class=""
            v-for="(item, index) in createDataFormData.clusterNodeList"
            :key="'clusterURL' + index"
          >
            <el-form-item
              :label="
                'URL' +
                (createDataFormData.clusterNodeList.length > 1 ? index + 1 : '')
              "
              :prop="'clusterNodeList.' + index + '.ipAddress'"
              :rules="{
                required: true,
                message: $t('resourceMgr.clusterUrlWranMsg'),
                trigger: 'blur',
              }"
            >
              <el-input
                :placeholder="$t('common.pleaseEnter') + 'ip'"
                v-model="item.ipAddress"
                class="input-with-select"
              >
                <el-select
                  slot="prepend"
                  v-model="item.httpType"
                  :placeholder="$t('common.pleaseSelsect')"
                >
                  <!-- <el-option label="http://" value="http://"></el-option> -->
                  <el-option label="https://" value="https://"></el-option>
                </el-select>
                <div slot="append" class="input-with-append">
                  <el-input
                    v-model="item.port"
                    :placeholder="$t('common.pleaseEnter')"
                  ></el-input>
                </div>
              </el-input>
            </el-form-item>
          </div>
          <!-- 用户名 -->
          <el-form-item
            :label="$t('resourceMgr.vMwareMgr.vcenterAdminName')"
            prop="clusterAdminName"
          >
            <!-- 输入vCenter管理员用户名 -->
            <el-input
              v-model="createDataFormData.clusterAdminName"
              :placeholder="$t('resourceMgr.vMwareMgr.vcenterAdminNamePlac')"
            />
          </el-form-item>
          <!-- 密码 -->
          <el-form-item
            :label="$t('resourceMgr.vMwareMgr.vcenterAdminPassword')"
            prop="clusterAdminPassword"
          >
            <el-input
              v-model="createDataFormData.clusterAdminPassword"
              type="password"
              autocomplete="new-password"
              :placeholder="
                $t('resourceMgr.vMwareMgr.vcenterAdminPasswordPlac')
              "
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="drawer-foot footBtn">
      <el-button type="primary" @click="handleConfirm()">
        {{ $t("common.confirmation") }}
      </el-button>
      <el-button @click="handleCancel()">{{ $t("common.cancel") }}</el-button>
    </div>
  </div>
</template>
<script>
import validate from "@/utils/validate";
import ReMessage from "@/utils/message";
import { addVCenter, modifyVCenter } from "@/api/vMwareMgr";
export default {
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      typeList: [{ value: "VMware", label: "VMware" }],
      oriFormData: {
        vcenterId: "",
        name: "", // 名称
        remark: "", // 描述
        type: "VMware",
        clusterUrl: [],
        clusterAdminName: "", // 用户名
        clusterAdminPassword: "", // 登录密码
        clusterNodeList: [{ httpType: "https://", ipAddress: "", port: "443" }],
      },
      createDataFormData: {},
      rulesTemplate: {
        name: [
          {
            required: true,
            message: this.$t("resourceMgr.vMwareMgr.namePlac"), // 名称不能为空
            trigger: "blur",
          },
        ],

        type: [
          {
            required: true,
            message: this.$t("resourceMgr.vMwareMgr.typePlac"), // 类型不能为空
            trigger: "blur",
          },
        ],
        clusterAdminName: [
          {
            required: true,
            message: this.$t("resourceMgr.vMwareMgr.vcenterAdminNameNot"), // "用户名不能为空",
            trigger: "blur",
          },
        ],

        clusterAdminPassword: [
          {
            required: true,
            message: this.$t("resourceMgr.vMwareMgr.vcenterAdminPasswordNot"), // "密码不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {},
  created() {
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    let { editflag, formData } = this.formOptions;
    if (editflag) {
      // 编辑
      this.createDataFormData.vcenterId = formData.vcenterId;
      this.createDataFormData.name = formData.name;
      this.createDataFormData.remark = formData.remark;
      this.createDataFormData.clusterNodeList = [
        {
          httpType: "https://",
          ipAddress: formData.vcenterIp,
          port: formData.vcenterPort,
        },
      ];
      this.createDataFormData.clusterAdminName = formData.vcenterAccount;
      this.createDataFormData.clusterAdminPassword = formData.vcenterPassword;
    } else {
    }
  },
  computed: {},
  methods: {
    // 提交
    handleConfirm(step) {
      let { editflag } = this.formOptions;
      if (editflag) {
        // 编辑信息
        if (this.handleConfirmvalidate()) {
          this.commitEdit();
        }
      } else {
        // 新增信息
        if (this.handleConfirmvalidate()) {
          this.commitCreate();
        }
      }
    },
    handleConfirmvalidate() {
      let confirmvalidate = false;
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          // 校验集群URL
          let text = "URL"; // "URL";
          let clusterNodeList = this.createDataFormData.clusterNodeList;
          let clusterUrl = [];
          let clusterUrlObj = [];
          for (let index = 0; index < clusterNodeList.length; index++) {
            const element = clusterNodeList[index];
            let { httpType, ipAddress, port } = element;
            let subscript = "";
            if (clusterNodeList.length > 1) {
              subscript = clusterNodeList.length > 1 ? index + 1 : "";
            }

            if (!validate.isValidIP(ipAddress)) {
              ReMessage.error(
                text + subscript + this.$t("resourceMgr.clusterUrlIpWranMsg")
              );
              return false;
            }
            if (!validate.isPort(port)) {
              ReMessage.error(
                text + subscript + this.$t("resourceMgr.clusterUrlPortWranMsg")
              );
              return false;
            }
            let url = httpType + ipAddress + ":" + port;
            let urlObj = {
              httpType: httpType, // http类型
              ipAddress: ipAddress, // ip地址
              port: port, // 端口号
            };

            clusterUrl.push(url);
            clusterUrlObj.push(urlObj);
          }
          this.createDataFormData.clusterUrl = clusterUrl;
          this.createDataFormData.clusterUrlObj = clusterUrlObj;
          confirmvalidate = true;
        } else {
          confirmvalidate = false;
        }
      });
      return confirmvalidate;
    },
    commitEdit() {
      let {
        vcenterId,
        name,
        remark,
        clusterUrlObj,
        clusterAdminName,
        clusterAdminPassword,
      } = this.createDataFormData;
      let editOrgData = {
        vcenterId: vcenterId, //
        name: name, //	名称
        remark: remark, //	描述
        vcenterIp: clusterUrlObj[0].ipAddress, //	IP
        vcenterPort: clusterUrlObj[0].port, //	端口
        vcenterAccount: clusterAdminName, //	账号
        vcenterPassword: clusterAdminPassword, //	密码
      };
      let editSucc = this.$t("resourceMgr.vMwareMgr.editSucc"); // 添加成功
      modifyVCenter(editOrgData)
        .then((res) => {
          this.alertTips(editSucc, "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    commitCreate() {
      let {
        name,
        remark,
        clusterUrlObj,
        clusterAdminName,
        clusterAdminPassword,
      } = this.createDataFormData;
      let createData = {
        name: name, //	名称
        remark: remark, //	描述
        vcenterIp: clusterUrlObj[0].ipAddress, //	IP
        vcenterPort: clusterUrlObj[0].port, //	端口
        vcenterAccount: clusterAdminName, //	账号
        vcenterPassword: clusterAdminPassword, //	密码
      };
      let addSucc = this.$t("resourceMgr.vMwareMgr.addSucc"); // 添加成功
      addVCenter(createData)
        .then((res) => {
          this.alertTips(addSucc, "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    handleCancel() {
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.create-new-form-steps {
  padding: 20px 30px 0;
}
.create-new-form {
  @include formStyle;

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
}
.footBtn {
  border-top: 1px $borderColor dashed;
}
.input-with-select {
  .el-input-group__prepend {
    .el-input {
      width: 100px;
    }
  }
  .el-input-group__append {
    padding: 0 5px;
    background-color: transparent;
    .el-input {
      width: 80px;
    }
    .el-input__inner {
      border: 0px;
      height: unset;
      line-height: unset;
    }
  }
}
</style>
