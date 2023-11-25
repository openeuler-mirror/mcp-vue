<template>
  <div class="drawer-content">
    <div class="drawer-body-content-steps">
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
          <el-form-item :label="$t('resourceMgr.clusterName')" prop="name">
            <el-input
              v-model="createDataFormData.name"
              :placeholder="
                $t('common.pleaseEnter') + $t('resourceMgr.clusterName')
              "
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
          <el-form-item :label="$t('resourceMgr.clusterRemark')" prop="remark">
            <el-input
              type="textarea"
              maxlength="400"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="createDataFormData.remark"
            />
          </el-form-item>
          <!-- 集群类型 -->
          <el-form-item :label="$t('resourceMgr.clustertype')" prop="type">
            <el-select
              v-model="createDataFormData.type"
              :placeholder="$t('resourceMgr.clustertypeplaceholder')"
              disabled
            >
              <el-option
                v-for="(item, index) in clustertypeList"
                :key="'type' + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 集群URL -->
          <div
            class=""
            v-for="(item, index) in createDataFormData.clusterNodeList"
            :key="'clusterURL' + index"
          >
            <el-form-item
              :label="
                $t('resourceMgr.clusterUrl') +
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
                class="input-with-elselect"
              >
                <el-select
                  slot="prepend"
                  v-model="item.httpType"
                  :placeholder="
                    $t('common.pleaseSelsect') +
                    $t('resourceMgr.clusterUrlprotocol')
                  "
                >
                  <el-option label="http://" value="http://"></el-option>
                  <el-option label="https://" value="https://"></el-option>
                </el-select>
                <div slot="append" class="input-with-append">
                  <el-input
                    v-model="item.port"
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
              <i
                v-show="index !== 0"
                class="el-icon-remove-outline"
                @click="deleteClusterItem(item)"
              />
              <i
                v-show="index === createDataFormData.clusterNodeList.length - 1"
                class="el-icon-circle-plus-outline"
                @click="addClusterItem"
              />
            </el-form-item>
          </div>
          <!-- 用户名 -->
          <el-form-item
            :label="$t('resourceMgr.clusterAdminName')"
            prop="clusterAdminName"
          >
            <!-- 请输入集群管理员用户名 -->
            <el-input
              v-model="createDataFormData.clusterAdminName"
              :disabled="clusterAdminNameDis"
              :placeholder="
                $t('common.pleaseEnter') +
                $t('resourceMgr.clusterAdmin') +
                $t('resourceMgr.clusterAdminName')
              "
            />
            <!-- 物理集群的登录用户名 -->
            <el-tooltip
              class="item"
              effect="light"
              :content="
                $t('resourceMgr.clusterAdmin') +
                $t('resourceMgr.clusterAdminName')
              "
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 管理员密码 -->
          <el-form-item
            :label="$t('resourceMgr.clusterAdminPassword')"
            prop="clusterAdminPassword"
          >
            <el-input
              v-model="createDataFormData.clusterAdminPassword"
              :disabled="passwordDis"
              type="password"
              autocomplete="nope"
              :placeholder="$t('resourceMgr.clusterAdminPasswordplac')"
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
          <!-- root密码 -->
          <el-form-item
            :label="$t('resourceMgr.rootPassword')"
            prop="rootPassword"
          >
            <el-input
              v-model="createDataFormData.rootPassword"
              :disabled="rootPasswordDis"
              type="password"
              autocomplete="nope"
              :placeholder="$t('resourceMgr.rootPasswordplac')"
            />

            <el-link
              v-if="formOptions.editflag"
              type="primary"
              style="margin-left: 10px"
              @click="editrootPassword()"
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
            v-if="item.prop == 'userate'"
            :key="item.prop + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <mcAllocationratio
                :option="{
                  percentage: calculatePercentage(row.usedSize, row.totalSize),
                }"
              ></mcAllocationratio>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            v-else-if="item.prop == 'status'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <statuscell :status="row.status"></statuscell>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop == 'type'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <span>{{ getStorageType(row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop == 'usage'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <span>{{ getStorageUsage(row.usage) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="item.prop + index"
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
              <span>{{ createDataFormData.name }}</span>
            </el-form-item>
            <!-- 描述 -->
            <el-form-item :label="$t('resourceMgr.clusterRemark')">
              <span>{{ createDataFormData.remark }}</span>
            </el-form-item>
            <!-- 集群类型 -->
            <el-form-item :label="$t('resourceMgr.clustertype')">
              <span>{{ createDataFormData.type }}</span>
            </el-form-item>
            <!-- 集群URL -->
            <el-form-item :label="$t('resourceMgr.clusterUrl')">
              <span>{{ createDataFormData.clusterUrl.toString() }}</span>
            </el-form-item>
            <!-- 用户名 -->
            <el-form-item :label="$t('resourceMgr.clusterAdminName')">
              <span>{{ createDataFormData.clusterAdminName }}</span>
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
                  {{ $t("resourceMgr.clusterStorageName") }}：{{ item.name }}
                </span>
                <span class="clusterStorage-box-item">
                  {{ $t("resourceMgr.storagetotalSize") }}：
                  {{ item.totalSize + "GB" }}
                </span>
                <span class="clusterStorage-box-item">
                  {{ $t("resourceMgr.storageUsedSize") }}：
                  {{ item.availableSize + "GB" }}
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
  creatCluster,
  pageStorage,
  modifyCluster,
  checkClusterUserNameAndPassword,
} from "@/api/clusterapi";
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
      oriFormData: {
        name: "", // 集群名称
        remark: "", // 描述
        type: "KSVD",
        clusterUrl: [],
        clusterAdminName: "", // 用户名
        clusterAdminPassword: "", // 登录密码
        rootPassword: "", // root登录密码
        clusterNodeList: [
          { httpType: "https://", ipAddress: "", port: "8443" },
        ],
      },
      createDataFormData: {},
      rulesTemplate: {
        name: [
          // 集群名称不能为空
          {
            required: true,
            message:
              this.$t("resourceMgr.clusterName") + this.$t("common.notNull"),
            trigger: "blur",
          },
          // 名称长度应控制在 2 ~ 18 个字符
          {
            min: 2,
            max: 18,
            message:
              this.$t("resourceMgr.clusterName") + this.$t("common.nameLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("common.nametooltip"), // "输入有误",
            validator: validate.validateCharZhEnNum,
          },
        ],
        // 集群类型不能为空
        type: [
          {
            required: true,
            message:
              this.$t("resourceMgr.clustertype") + this.$t("common.notNull"),
            trigger: "blur",
          },
        ],
        // 用户名不能为空
        clusterAdminName: [
          {
            required: true,
            message:
              this.$t("resourceMgr.clusterAdminName") +
              this.$t("common.notNull"),
            trigger: "blur",
          },
          // 用户名长度应控制在 6 ~ 20 个字符
          {
            min: 6,
            max: 20,
            message:
              this.$t("resourceMgr.clusterAdminName") +
              this.$t("common.adminNameLength"),
            trigger: "blur",
          },
          // 用户名只能由英文字母、数字组合
          {
            trigger: "blur",
            message:
              this.$t("resourceMgr.clusterAdminName") +
              this.$t("common.adminNameWranMsg"),
            validator: validate.validateEnNum,
          },
        ],

        clusterAdminPassword: [
          //  密码不能为空
          {
            required: true,
            message: this.$t("resourceMgr.clusterAdminPasswordplac"),
            trigger: "blur",
          },
          // 密码长度应控制在 6 ~ 18 个字符
          {
            min: 6,
            max: 18,
            message:
              this.$t("resourceMgr.clusterAdminPassword") +
              this.$t("common.adminPwdLength"),
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
        rootPassword: [
          //  密码不能为空
          {
            required: true,
            message: this.$t("resourceMgr.rootPasswordplac"),
            trigger: "blur",
          },
          // 密码长度应控制在 6 ~ 18 个字符
          {
            min: 6,
            max: 18,
            message:
              this.$t("resourceMgr.clusterAdminPassword") +
              this.$t("common.adminPwdLength"),
            trigger: "blur",
          },
          // 密码只能由英文字母、数字组合
          {
            trigger: "blur",
            message:
              this.$t("resourceMgr.clusterAdminPassword") +
              this.$t("common.adminPwdWranMsg"),
            validator: validate.validateEnNum,
          },
        ],
      },

      activestep: 0,
      passwordDis: false,
      rootPasswordDis: false,
      clusterAdminNameDis: false,

      rowkey: "id",
      columnArr: [
        // "存储名称"
        { label: this.$t("resourceMgr.storageName"), prop: "name", width: 150 },
        // 存储类型
        { label: this.$t("resourceMgr.storageType"), prop: "type", width: 150 },
        // 存储状态
        {
          label: this.$t("resourceMgr.storageStatus"),
          prop: "status",
          width: 150,
        },
        // 存储用途
        {
          label: this.$t("resourceMgr.storageUsage"),
          prop: "usage",
          width: 150,
        },
        // 总容量
        {
          label: this.$t("resourceMgr.storagetotalSize") + "(GB)",
          prop: "totalSize",
          width: 150,
        },
        // 可用容量
        {
          label: this.$t("resourceMgr.storageUsedSize") + "(GB)",
          prop: "availableSize",
          width: 150,
        },
        // 利用率
        {
          label: this.$t("resourceMgr.storageUserate"),
          prop: "userate",
          width: 150,
        },
      ],
      tableData: [],
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
    if (editflag) {
      // 编辑
      this.clusterAdminNameDis = true;
      this.passwordDis = true;
      this.rootPasswordDis = true;
      this.createDataFormData.name = formData.name;
      this.createDataFormData.remark = formData.remark;
      this.createDataFormData.type = formData.type;
      this.createDataFormData.clusterNodeList = formData.clusterNodeList;
      this.createDataFormData.clusterAdminName = formData.clusterAdminName;
      this.createDataFormData.clusterAdminPassword =
        formData.clusterAdminPassword.slice(0, 10);
      this.createDataFormData.rootPassword = formData.rootPassword.slice(0, 10);
    } else {
      // 新增
      this.clusterAdminNameDis = false;
      this.passwordDis = false;
      this.rootPasswordDis = false;
    }
  },
  computed: {},
  methods: {
    getStorageType(type) {
      return dictionary.storage.type[type];
    },
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
      this.createDataFormData.clusterAdminPassword = "";
    },
    editrootPassword() {
      this.rootPasswordDis = false;
      this.createDataFormData.rootPassword = "";
    },
    getpageStorage() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".el-drawer__body");
      });
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        clusterNodeList: this.createDataFormData.clusterNodeList,
        clusterId: "",
      };
      return new Promise((resolve, reject) => {
        pageStorage(pramas)
          .then((res) => {
            this.tableData = this.totableData(res.list);
            this.$hideFullScreenLoading();
            resolve();
          })
          .catch((err) => {
            this.alertTips(err);
            this.tableData = [];
            this.$hideFullScreenLoading();
            reject();
          });
      });
    },
    totableData(list) {
      list.forEach((element, index) => {
        let { totalSize, usedSize } = element;

        list[index].availableSize = (totalSize - usedSize).toFixed(2);
      });
      return list;
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
            // 校验集群URL
            let text = this.$t("resourceMgr.clusterUrl"); // "集群URL";
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
                  text +
                    subscript +
                    this.$t("resourceMgr.clusterUrlPortWranMsg")
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

            let { formData } = this.formOptions;
            let oriPassword = formData.clusterAdminPassword || "";
            let clusterAdminPassword = "";
            if (this.passwordDis) {
              clusterAdminPassword = formData.clusterAdminPassword;
            } else {
              clusterAdminPassword =
                this.createDataFormData.clusterAdminPassword;
            }
            if (oriPassword == clusterAdminPassword) {
              this.getpageStorage()
                .then(() => {
                  this.activestep = this.activestep + step; // 新增用户信息
                })
                .catch(() => {
                  this.activestep = this.activestep + 0; // 新增用户信息
                });
            } else {
              // 校验集群账号密码
              let checkClusterData = {
                clusterId: formData.clusterId || "", // 查询集群详情时
                clusterAdminName: this.createDataFormData.clusterAdminName, // 集群账号
                clusterAdminPassword: clusterAdminPassword, // 集群密码
                clusterNodeList: clusterUrlObj,
              };

              this.$showFullScreenLoading(".el-drawer__body");
              checkClusterUserNameAndPassword(checkClusterData)
                .then((res) => {
                  this.getpageStorage()
                    .then(() => {
                      this.activestep = this.activestep + step; // 新增用户信息
                    })
                    .catch(() => {
                      this.activestep = this.activestep + 0; // 新增用户信息
                    });
                })
                .catch((err) => {
                  this.alertTips(err);
                  this.$hideFullScreenLoading();
                });
            }
          } else {
            return false;
          }
        });
      } else {
        this.activestep = this.activestep + step;
      }
    },
    commitEdit() {
      let { formData } = this.formOptions;
      let clusterAdminPassword = "";
      let rootPassword = "";
      let ifModifyPassword = false;
      let ifModifyRootPassword = false;
      if (this.passwordDis) {
        clusterAdminPassword = formData.clusterAdminPassword;
        ifModifyPassword = false;
      } else {
        clusterAdminPassword = this.createDataFormData.clusterAdminPassword;
        ifModifyPassword = true;
      }

      if (this.rootPasswordDis) {
        rootPassword = formData.rootPassword;
        ifModifyRootPassword = false;
      } else {
        rootPassword = this.createDataFormData.rootPassword;
        ifModifyRootPassword = true;
      }
      let editOrgData = {
        clusterId: formData.clusterId,
        name: this.createDataFormData.name, // 集群名称
        remark: this.createDataFormData.remark,
        type: this.createDataFormData.type, // 集群类型
        clusterNodeList: this.createDataFormData.clusterNodeList, // 集群url(用逗号隔开)
        clusterAdminName: this.createDataFormData.clusterAdminName, // 集群管理员名称
        clusterAdminPassword: clusterAdminPassword, // 集群管理员密码
        ifModifyPassword: ifModifyPassword,
        rootPassword: rootPassword,
        ifModifyRootPassword: ifModifyRootPassword,
      };
      modifyCluster(editOrgData)
        .then((res) => {
          this.alertTips(this.$t("resourceMgr.clusterEditSussess"), "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    commitCreate() {
      let createData = {
        name: this.createDataFormData.name, // 集群名称
        remark: this.createDataFormData.remark,
        type: this.createDataFormData.type, // 集群类型
        clusterNodeList: this.createDataFormData.clusterNodeList, // 集群url(用逗号隔开)
        clusterAdminName: this.createDataFormData.clusterAdminName, // 集群管理员名称
        clusterAdminPassword: this.createDataFormData.clusterAdminPassword, // 集群管理员密码
        rootPassword: this.createDataFormData.rootPassword,
      };

      creatCluster(createData)
        .then((res) => {
          this.alertTips(this.$t("resourceMgr.clusterAddtSussess"), "success");
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

    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.drawer-body-content-steps {
  padding: 20px 30px;
}
.drawer-body-content {
  @include formStyle;
  .template-box {
    .template-box-title {
      font-size: 16px;
      font-weight: bold;
      margin-right: 25px;
      line-height: 32px;
    }
    .template-box-content::v-deep {
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
  .el-button {
    margin-right: 15px;
  }
}
.input-with-elselect ::v-deep {
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
