<template>
  <div class="drawer-content">
    <div class="create-new-form-steps">
      <el-steps :active="activestep" class="kcp-steps">
        <el-step :title="$t('resourceMgr.clusterBaseInfo')"></el-step>
        <el-step :title="$t('resourceMgr.clusterStorageInfo')"></el-step>
        <el-step :title="$t('resourceMgr.clusterConfirmInfo')"></el-step>
      </el-steps>
    </div>

    <!-- 基本信息 -->
    <div v-if="activestep == 0" class="drawer-body-content">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 集群名称 -->
          <el-form-item
            :label="$t('externalCloud.vcenter.name')"
            prop="clusterName"
          >
            <el-input
              v-model="createDataFormData.clusterName"
              :placeholder="
                $t('common.pleaseEnter') + $t('externalCloud.vcenter.name')
              "
            />
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('externalCloud.vcenter.nametooltip')"
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 描述 -->
          <el-form-item
            :label="$t('externalCloud.vcenter.remark')"
            prop="clusterDescription"
          >
            <el-input
              type="textarea"
              maxlength="400"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="createDataFormData.clusterDescription"
            />
          </el-form-item>
          <!-- IP地址 -->
          <el-form-item label="IP" prop="clusterURL">
            <el-input
              :placeholder="
                $t('common.pleaseEnter') +
                $t('externalCloud.vcenter.domainName') +
                'ip'
              "
              v-model="createDataFormData.clusterURL"
              :disabled="editflag"
              class="input-with-elselect"
            >
            </el-input>
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('resourceMgr.clusterUrlContent')"
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 协议 -->
          <el-form-item
            :label="$t('resourceMgr.clusterUrlprotocol')"
            prop="clusterURLProtocol"
          >
            <el-select
              v-model="createDataFormData.clusterURLProtocol"
              :disabled="editflag"
              @change="changeUrlType"
              :placeholder="
                $t('common.pleaseSelsect') +
                $t('resourceMgr.clusterUrlprotocol')
              "
            >
              <el-option label="http" value="0"></el-option>
              <el-option label="https" value="1"></el-option>
            </el-select>
          </el-form-item>
          <!-- 端口 -->
          <el-form-item
            :label="$t('externalCloud.vMwareMgr.vcenterPort')"
            prop="clusterURLPort"
          >
            <el-input
              v-model="createDataFormData.clusterURLPort"
              :disabled="editflag"
              :placeholder="
                $t('common.pleaseEnter') + $t('resourceMgr.clusterUrlprotocol')
              "
            ></el-input>
          </el-form-item>

          <!-- <el-form-item
            :label="$t('externalCloud.vcenter.domainName')"
            :prop="'clusterURL'"
            :rules="{
              required: true,
              message: $t('externalCloud.vcenter.domainNameUrlWranMsg'),
              trigger: 'blur',
            }"
          >
            <el-input
              :placeholder="
                $t('common.pleaseEnter') +
                $t('externalCloud.vcenter.domainName') +
                'ip'
              "
              v-model="createDataFormData.clusterURL"
              :disabled="passwordDis"
              class="input-with-elselect"
            >
              <el-select
                slot="prepend"
                v-model="createDataFormData.clusterURLProtocol"
                :disabled="passwordDis"
                @change="changeUrlType"
                :placeholder="
                  $t('common.pleaseSelsect') +
                  $t('resourceMgr.clusterUrlprotocol')
                "
              >
                <el-option label="http://" value="0"></el-option>
                <el-option label="https://" value="1"></el-option>
              </el-select>
              <div slot="append" class="input-with-append">
                <el-input
                  v-model="createDataFormData.clusterURLPort"
                  :disabled="passwordDis"
                  :placeholder="
                    $t('common.pleaseEnter') +
                    $t('resourceMgr.clusterUrlprotocol')
                  "
                ></el-input>
              </div>
            </el-input>
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('resourceMgr.clusterUrlContent')"
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
          </el-form-item> -->
          <!-- 用户名 -->
          <el-form-item
            :label="$t('externalCloud.vMwareMgr.vcenterAdminName')"
            prop="vcenterUserName"
          >
            <!-- 请输入集群管理员用户名 -->
            <el-input
              v-model="createDataFormData.vcenterUserName"
              :disabled="clusterAdminNameDis"
              :placeholder="
                $t('common.pleaseEnter') +
                $t('externalCloud.vMwareMgr.vcenterAdminName')
              "
            />
          </el-form-item>
          <!-- 管理员密码 -->
          <el-form-item
            :label="$t('resourceMgr.clusterAdminPassword')"
            prop="vcenterUserPassword"
          >
            <el-input
              v-model="createDataFormData.vcenterUserPassword"
              :disabled="passwordDis"
              type="password"
              autocomplete="nope"
            />

            <el-link
              v-if="formOptions.editflag"
              type="primary"
              style="margin-left: 10px"
              @click="editpassword()"
            >
              {{ $t("resourceMgr.clusterEditPassword") }}
            </el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 存储信息 -->
    <div v-if="activestep == 1" class="drawer-body-content">
      <mc-table
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        :rowkey="rowkey"
      >
        <template v-for="(item, index) in columnArr">
          <el-table-column
            v-if="item.prop == 'storageCapacityUsedRate'"
            :key="item.prop + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <mcAllocationratio
                :option="{
                  percentage: row.storageCapacityUsedRate * 1,
                }"
              ></mcAllocationratio>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            v-else-if="item.prop == 'storageStatus'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <span v-if="row.storageStatus === 1" class="success">
                <!-- 正常 -->
                {{ $t("externalCloud.statuscell.NORMAL") }}
              </span>
              <span v-else class="error">
                <!-- 异常 -->
                {{ $t("externalCloud.statuscell.HALT") }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="item.label + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <span>{{ row[item.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </mc-table>
    </div>
    <!-- 确认信息 -->
    <div v-if="activestep == 2" class="drawer-body-content">
      <div class="template-box flex">
        <div class="template-box-title">
          {{ $t("resourceMgr.clusterBaseInfo") }}
        </div>
        <div class="template-box-content">
          <el-form
            ref="createDataForm"
            label-width="auto"
            :model="createDataFormData"
            :rules="rulesTemplate"
          >
            <!-- 集群名称 -->
            <el-form-item :label="$t('resourceMgr.clusterName')">
              <span>{{ createDataFormData.clusterName }}</span>
            </el-form-item>
            <!-- 描述 -->
            <el-form-item :label="$t('resourceMgr.clusterRemark')">
              <span>{{ createDataFormData.clusterDescription }}</span>
            </el-form-item>
            <!-- 集群URL -->
            <el-form-item :label="$t('resourceMgr.clusterUrl')">
              <span>{{ createDataFormData.clusterURL.toString() }}</span>
            </el-form-item>
            <!-- 用户名 -->
            <el-form-item :label="$t('resourceMgr.clusterAdminName')">
              <span>{{ createDataFormData.vcenterUserName }}</span>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item :label="$t('resourceMgr.clusterAdminPassword')">
              <span>**********</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="template-box flex">
        <div class="template-box-title">
          {{ $t("resourceMgr.clusterStorageInfo") }}
        </div>
        <div class="template-box-content">
          <el-form
            ref="createDataForm"
            label-width="auto"
            :model="createDataFormData"
            :rules="rulesTemplate"
          >
            <!-- 集群名称 -->
            <el-form-item
              v-for="(item, index) in tableData"
              :key="item.id + ''"
              :label="$t('resourceMgr.clusterStorage') + (index + 1)"
            >
              <div class="clusterStorage-box">
                <!-- 名称 -->
                <span class="clusterStorage-box-item">
                  {{ $t("resourceMgr.clusterStorageName") }}：{{
                    item.storageName
                  }}
                </span>
                <span class="clusterStorage-box-item">
                  {{ $t("resourceMgr.storagetotalSize") }}：
                  {{ item.storageTotalCapacity + "GB" }}
                </span>
                <span class="clusterStorage-box-item">
                  {{ $t("resourceMgr.storageUsedSize") }}：
                  {{ item.storageFreeCapacity + "GB" }}
                </span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="drawer-foot footBtn">
      <el-button
        v-if="activestep == 1 || activestep == 2"
        @click="handleConfirm(-1)"
      >
        {{ $t("common.previous") }}
      </el-button>
      <el-button
        type="primary"
        v-if="activestep == 0 || activestep == 1"
        @click="handleConfirm(1)"
      >
        {{ $t("common.nextStep") }}
      </el-button>
      <el-button
        type="primary"
        @click="handleConfirm(0)"
        v-if="activestep == 2"
      >
        {{ $t("common.confirmation") }}
      </el-button>

      <el-button @click="handleCancel">{{ $t("common.cancel") }}</el-button>
    </div>
  </div>
</template>
<script>
import mcTable from "@/components/MctablePro";
import validate from "@/utils/validate";
import ReMessage from "@/utils/message";
import mcAllocationratio from "@/components/Mcallocationratio";
import {
  createVcenter,
  getVcenterStorage,
  editVcenter,
  checkVcenterLogin,
  checkNameIp,
} from "@/api/vcenter";
import statuscell from "../../components/statuscell/index.vue";
import transformat from "@/utils/transformat";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  components: { mcTable, mcAllocationratio, statuscell },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      clustertypeList: [{ value: "KSVD", label: "KSVD" }],
      vcenterId: "",
      oriFormData: {
        clusterName: "", // 集群名称
        clusterDescription: "", // 描述
        clusterURL: "",
        clusterURLProtocol: "1",
        clusterURLPort: "443",
        vcenterUserName: "", // 用户名
        vcenterUserPassword: "", // 登录密码
      },
      createDataFormData: {},

      rulesTemplate: {
        clusterName: [
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
            message: this.$t("common.nametooltip"), // "输入有误",
            validator: validate.validateCharZhEnNum,
          },
        ],
        // 用户名不能为空
        vcenterUserName: [
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

        vcenterUserPassword: [
          //  密码不能为空
          {
            required: true,
            message: this.$t("externalCloud.vcenter.clusterEditPassword"),
            trigger: "blur",
          },
          // 密码长度应控制在 6 ~ 32 个字符
          {
            min: 6,
            max: 32,
            message:
              this.$t("externalCloud.vcenter.clusterEditPassword") +
              this.$t("externalCloud.vcenter.nameLength"),
            trigger: "blur",
          },
          // 密码只能由英文字母、数字组合
          {
            trigger: "blur",
            message:
              this.$t("externalCloud.vcenter.clusterEditPassword") +
              this.$t("common.adminPwdWranMsg"),
            validator: validate.validateCharEnNum,
          },
        ],
        clusterURL: [
          {
            required: true,
            message: this.$t("externalCloud.vcenter.domainNameUrlWranMsg"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("resourceMgr.clusterUrlIpWranMsg"),
            validator: validate.validIP,
          },
        ],
        clusterURLPort: [
          {
            required: true,
            message: this.$t("externalCloud.vcenter.enterPort"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("resourceMgr.clusterUrlPortWranMsg"),
            validator: validate.validPort,
          },
        ],
        clusterURLProtocol: [
          {
            required: true,
            message: this.$t("externalCloud.vcenter.enterProtocol"),
            trigger: "blur",
          },
        ],
      },

      activestep: 0,
      passwordDis: false,
      rootPasswordDis: false,
      clusterAdminNameDis: false,

      rowkey: "id",
      columnArr: [
        // "名称"
        {
          label: this.$t("externalCloud.vcenter.name"),
          prop: "storageName",
        },
        // 类型
        {
          label: this.$t("externalCloud.vcenter.type"),
          prop: "storageType",
          width: 150,
        },
        // 状态
        {
          label: this.$t("externalCloud.vcenter.status"),
          prop: "storageStatus",
          width: 150,
        },
        // 总容量
        {
          label: this.$t("externalCloud.vcenter.storageTotalCapacity") + "(GB)",
          prop: "storageTotalCapacity",
          width: 150,
        },
        // 利用率
        {
          label: this.$t("externalCloud.vcenter.storageTotalCapacity"),
          prop: "storageCapacityUsedRate",
          width: 150,
        },
      ],
      tableData: [],
      editflag: false,
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 1000,
    };
  },
  watch: {},
  created() {
    this.activestep = 0;
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    let { editflag, formData } = this.formOptions;
    this.editflag = editflag;
    if (editflag) {
      // 编辑
      this.clusterAdminNameDis = true;
      this.passwordDis = true;
      this.rootPasswordDis = true;
      this.vcenterId = formData.id;
      for (const key in this.oriFormData) {
        if (Object.hasOwnProperty.call(this.oriFormData, key)) {
          this.createDataFormData[key] = formData[key];
        }
      }
    } else {
      // 新增
      this.clusterAdminNameDis = false;
      this.passwordDis = false;
      this.rootPasswordDis = false;
    }
  },
  computed: {},
  methods: {
    getStorageUsage(usage) {
      return dictionary.storage.usage[usage];
    },
    deleteClusterItem(item) {
      var index = this.createDataFormData.clusterNodeList.indexOf(item);
      if (index !== -1) {
        this.createDataFormData.clusterNodeList.splice(index, 1);
      }
    },
    addClusterItem() {
      this.createDataFormData.clusterNodeList.push({
        httpType: "https://",
        ipAddress: "",
        port: "8443",
      });
    },
    editpassword() {
      this.passwordDis = false;
      this.createDataFormData.vcenterUserPassword = "";
    },
    // 提交
    handleConfirm(step) {
      let { editflag } = this.formOptions;
      switch (step) {
        case 0: // 确认
          if (editflag) {
            // 编辑信息
            this.commitEdit();
          } else {
            // 新增信息
            this.commitCreate();
          }
          break;
        case -1: // 上一步
          this.activestep = this.activestep + step;
          break;
        case 1:
          this.handleConfirmvalidate(step);
          break;
        default:
          this.activestep = 0;
          break;
      }
    },
    handleConfirmvalidate(step) {
      if (this.$refs.createDataForm) {
        this.$refs.createDataForm.validate((valid) => {
          if (valid) {
            let {
              clusterURL,
              clusterURLPort,
              clusterName,
              clusterURLProtocol,
              vcenterUserName,
              vcenterUserPassword,
            } = this.createDataFormData;
            let text = this.$t("resourceMgr.clusterUrl"); // "集群URL";
            //校验ip
            if (!validate.isValidIP(clusterURL)) {
              ReMessage.error(
                text + this.$t("resourceMgr.clusterUrlIpWranMsg")
              );
              return;
            }
            //校验端口号
            if (!validate.isPort(clusterURLPort)) {
              ReMessage.error(
                text + this.$t("resourceMgr.clusterUrlPortWranMsg")
              );
              return;
            }
            this.$nextTick(() => {
              this.$showFullScreenLoading(".el-drawer__body");
            });
            checkNameIp({
              name: clusterName,
              vcenterIp: clusterURL,
              vcenterId: this.vcenterId,
            })
              .then((res) => {
                checkVcenterLogin({
                  clusterURL,
                  clusterURLPort,
                  clusterName,
                  clusterURLProtocol,
                  vcenterUserName,
                  vcenterUserPassword,
                })
                  .then((res) => {
                    if (!res) {
                      ReMessage.error(
                        this.$t("externalCloud.vcenter.loginFalse")
                      );
                      return;
                    }

                    getVcenterStorage({
                      clusterURL,
                      clusterURLPort,
                      clusterName,
                      clusterURLProtocol,
                      vcenterUserName,
                      vcenterUserPassword,
                    })
                      .then((res) => {
                        this.tableData = res;
                        this.$hideFullScreenLoading();
                        this.activestep = this.activestep + step; // 新增用户信息
                      })
                      .catch(() => {
                        this.activestep = this.activestep + 0; // 新增用户信息
                        this.$hideFullScreenLoading();
                      });
                  })
                  .catch((e) => {
                    this.$hideFullScreenLoading();
                  });
              })
              .catch((e) => {
                this.$hideFullScreenLoading();
              });
          } else {
            return false;
          }
        });
      } else {
        this.activestep = this.activestep + step;
      }
    },
    commitEdit() {
      const { id } = this.formOptions.formData;
      const {
        clusterURL,
        clusterURLPort,
        clusterDescription,
        clusterName,
        clusterURLProtocol,
        vcenterUserName,
        vcenterUserPassword,
      } = this.createDataFormData;
      let editOrgData = {
        vcenterId: id,
        clusterURL,
        clusterURLPort,
        clusterDescription,
        clusterName,
        clusterURLProtocol,
        vcenterUserName,
        vcenterUserPassword,
      };
      editVcenter(editOrgData)
        .then((res) => {
          this.alertTips(
            this.$t("externalCloud.vcenter.clusterEditSussess"),
            "success"
          );
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    commitCreate() {
      let {
        clusterURL,
        clusterURLPort,
        clusterDescription,
        clusterName,
        clusterURLProtocol,
        vcenterUserName,
        vcenterUserPassword,
      } = this.createDataFormData;
      let createData = {
        clusterURL,
        clusterURLPort,
        clusterDescription,
        clusterName,
        clusterURLProtocol,
        vcenterUserName,
        vcenterUserPassword,
      };

      createVcenter(createData)
        .then((res) => {
          this.alertTips(
            this.$t("externalCloud.vcenter.clusterAddtSussess"),
            "success"
          );
          this.activestep = 0;
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    handleCancel() {
      this.activestep = 0;
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },
    changeUrlType(e) {
      const port = e === "1" ? "443" : "80";
      this.$set(this.createDataFormData, "clusterURLPort", port);
    },
    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.create-new-form-steps {
  padding: 20px 30px 0;
}
.success {
  color: $msgSuccess;
}
.error {
  color: $msgDanger;
}
.drawer-body-content {
  @include formStyle;
}

.footBtn {
  border-top: 1px $borderColor dashed;
  .el-button {
    margin-right: 15px;
  }
}
.input-with-elselect {
  .el-input-group__prepend {
    background-color: transparent;
    overflow: hidden;
    .el-input {
      width: 100px;
    }
    .el-select {
      background-color: transparent;
    }
    .el-select:hover {
      background-color: #e9f5ff;
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
