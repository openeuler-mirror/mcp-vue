<template>
  <div class="drawer-content">
    <div class="create-new-form-steps">
      <el-steps :active="activestep">
        <!-- 基本信息 -->
        <el-step :title="$t('resourceMgr.vdcBaseInfo')"></el-step>
        <!-- 分配资源 -->
        <el-step :title="$t('resourceMgr.vdcResouse')"></el-step>
        <!-- 网络 -->
        <el-step :title="$t('resourceMgr.vdcnetworkNum')"></el-step>
        <!-- 确认信息 -->
        <el-step :title="$t('resourceMgr.vdcConfirmInfo')"></el-step>
      </el-steps>
    </div>

    <!-- 基本信息 -->
    <div v-if="activestep == 0" class="create-new-form">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 名称 -->
          <el-form-item :label="$t('resourceMgr.vdcName')" prop="vdcName">
            <el-input
              v-model="createDataFormData.vdcName"
              :placeholder="
                $t('common.pleaseEnter') + $t('resourceMgr.vdcName')
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
          <!-- 可用区 -->
          <el-form-item :label="$t('resourceMgr.zoneName')" prop="zoneId">
            <el-select
              v-model="createDataFormData.zoneId"
              :placeholder="
                $t('common.pleaseSelsect') + $t('resourceMgr.zoneName')
              "
              @change="zoneIdchange"
              :disabled="editDisable"
            >
              <el-option
                v-for="(item, index) in zoneList"
                :key="'zoneId' + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('resourceMgr.vdcparentName')"
            class="input-with-select"
          >
            <el-input
              v-model="createDataFormData.parentName"
              qlinput-readonly
              readonly
              :placeholder="$t('authorityMgr.vdcIdPlc')"
            >
              <template #append>
                <el-button
                  :disabled="editDisable"
                  @click="openSelectModal('vdc')"
                >
                  {{ $t("common.select") }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 分配资源 -->
    <div v-if="activestep == 1" class="create-new-formtable">
      <!-- 一级vdc -->
      <firstVdcresource
        v-if="showfirstVdc"
        ref="firstVdcresource"
        :formOptions="firstVdcFormData"
      >
      </firstVdcresource>
      <!-- 非一级vdc -->
      <vdcresource
        v-else
        ref="vdcresource"
        :formOptions="vdcFormData"
      ></vdcresource>
    </div>
    <!-- 网络 -->
    <div v-if="activestep == 2" class="create-new-form">
      <createEditNetworkBox ref="netWorkForm" :networkOptions="networkOptions">
      </createEditNetworkBox>
    </div>
    <!-- 确认信息 -->
    <div v-if="activestep == 3" class="create-new-form">
      <div class="template-box flex">
        <!-- 基本信息 -->
        <div class="template-box-title">
          {{ $t("resourceMgr.vdcBaseInfo") }}
        </div>
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 名称 -->
          <el-form-item :label="$t('resourceMgr.vdcName') + '：'">
            <span>{{ createDataFormData.vdcName }}</span>
          </el-form-item>
          <!-- 可用区 -->
          <el-form-item :label="$t('resourceMgr.zoneName') + '：'">
            <span>{{ createDataFormData.zoneName }}</span>
          </el-form-item>
          <!-- 上级VDC -->
          <el-form-item :label="$t('resourceMgr.vdcparentName') + '：'">
            <span>{{ createDataFormData.parentName }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="template-box flex">
        <!-- 分配资源 -->
        <div class="template-box-title">{{ $t("resourceMgr.vdcResouse") }}</div>
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <el-form-item label="vCPU：">
            <span
              v-for="(item, resousei) in architectureResourceFormList"
              :key="'cpu' + item.architectureType + resousei"
            >
              {{ item.architectureType }}
              （ {{ item.applyCpu }}{{ $t("common.cpu") }}）；
            </span>
          </el-form-item>
          <el-form-item :label="$t('common.mem') + '：'">
            <span
              v-for="(item, memresousei) in architectureResourceFormList"
              :key="'mem' + item.architectureType + memresousei"
            >
              {{ item.architectureType }}
              （ {{ item.applyMem + item.memUnit }}）；
            </span>
          </el-form-item>
          <el-form-item :label="$t('common.disk') + '：'">
            <span>
              {{ storageDataForm.applyStorage + storageDataForm.storageUnit }}
            </span>
          </el-form-item>
        </el-form>
      </div>

      <div class="template-box flex">
        <div class="template-box-title">
          {{ $t("resourceMgr.vdcnetworkNum") }}
        </div>
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
        >
          <el-form-item
            v-for="(item, index) in networkList"
            :key="'network' + index"
            :label="$t('resourceMgr.vdcnetworkNum') + (index + 1) + '：'"
          >
            <span>
              {{ $t("resourceMgr.vdcClusterDesc") }}（{{ item.clusterName }}）；
              {{ $t("resourceMgr.vdcNetWorkDesc") }}（{{ item.networkName }}）
            </span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="drawer-foot footBtn">
      <el-button
        v-if="activestep == 1 || activestep == 2 || activestep == 3"
        @click="handleConfirm(-1)"
      >
        <!-- 上一步 -->
        {{ $t("common.previous") }}
      </el-button>
      <el-button
        type="primary"
        v-if="activestep == 0 || activestep == 1 || activestep == 2"
        @click="handleConfirm(1)"
      >
        <!-- 下一步 -->
        {{ $t("common.nextStep") }}
      </el-button>
      <el-button
        type="primary"
        @click="handleConfirm(0)"
        v-if="activestep == 3"
      >
        <!-- 确认 -->
        {{ $t("common.confirmation") }}
      </el-button>

      <el-button @click="handleCancel">{{ $t("common.cancel") }}</el-button>
    </div>

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
import { zoneList, checkCreateVdc, createVdc, modifyVdc } from "@/api/vdcapi";
import bindVdcModal from "@/views/components/vdcBindVdc/bindVdcModal.vue";
import createEditNetworkBox from "@/views/components/setVdcNetWork/createEditNetworkBox.vue";
import firstVdcresource from "@/views/components/vdcResourceAss/firstVdcresource.vue"; // 一级VDC
import vdcresource from "@/views/components/vdcResourceAss/vdcresource.vue"; // 非一级VDC
import validate from "@/utils/validate";
import _ from "lodash";
export default {
  components: {
    bindVdcModal,
    firstVdcresource,
    vdcresource,
    createEditNetworkBox,
  },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      labelPosition: "left",
      vdcparentId: "",
      showbindVdcModal: false,
      vdcSelectedKeys: [],
      clickBol: true,
      zoneList: [],

      oriFormData: {
        vdcId: "",
        vdcName: "", // 名称
        zoneId: "", // vdc
        zoneName: "",
        parentId: 0,
        parentName: "",

        architectureResourceList: [],
        networkList: [],
      },
      createDataFormData: {},
      rulesTemplate: {
        vdcName: [
          {
            required: true,
            message: this.$t("resourceMgr.vdcName") + this.$t("common.notNull"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 18,
            message:
              this.$t("resourceMgr.zoneNameDesc") +
              this.$t("common.nameLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("common.nametooltip"), // "输入有误",
            validator: validate.validateCharZhEnNum,
          },
        ],
        zoneId: [
          {
            required: true,
            message:
              this.$t("common.pleaseSelsect") + this.$t("resourceMgr.zoneName"),
            trigger: "blur",
          },
        ],
      },
      activestep: 0,

      architectureResourceFormList: [],

      storageDataForm: {
        applyStorage: "", // 分配存储大小
        usedStorage: "", // 已使用
        storageUnit: "", // 存储单位

        totalStorage: "", //  总存储
        usableStorage: "", //  可用存储
      },

      networkOptions: {},

      editDisable: false,
      // 一级Vdc
      firstVdcFormData: {},
      // 非一级VDC
      vdcFormData: {},
      showfirstVdc: false,
    };
  },
  watch: {},
  created() {
    this.tableColumns = this.columnArr;
    this.activestep = 0;
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    let { editflag, formData } = this.formOptions;

    if (editflag) {
      this.editDisable = true;
      // 编辑
      this.createDataFormData.vdcId = formData.vdcId;
      this.createDataFormData.vdcName = formData.vdcName; // 名称

      this.createDataFormData.zoneId = formData.zoneId; // vdc
      this.createDataFormData.zoneName = formData.zoneName;
      this.zoneList = [{ value: formData.zoneId, label: formData.zoneName }];

      this.createDataFormData.parentId = formData.parentId;
      this.createDataFormData.parentName = formData.parentName;

      this.networkList = formData.networkList;
    } else {
      this.editDisable = false;
      this.networkList = [];
      this.createDataFormData.parentId = formData.parentId;
      this.createDataFormData.parentName = formData.parentName;
      // 新增
      this.getzoneList();
    }
    this.setvdcSelectedKeys();

    this.setshowfirstVdc();
  },
  computed: {},
  methods: {
    setvdcSelectedKeys() {
      this.vdcSelectedKeys = [
        {
          vdcId: this.createDataFormData.parentId,
          vdcName: this.createDataFormData.parentName,
        },
      ];
    },
    setshowfirstVdc() {
      if (this.createDataFormData.parentId > 0) {
        // 非一级VDC
        this.showfirstVdc = false;
      } else {
        // 一级Vdc
        this.showfirstVdc = true;
      }
    },
    getzoneList() {
      let list = [];
      zoneList()
        .then((res) => {
          res.forEach((element) => {
            list.push({
              value: element.zoneId,
              label: element.name,
            });
          });
          this.zoneList = list;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    zoneIdchange(zoneId) {
      this.createDataFormData.zoneId = zoneId;
      this.zoneList.forEach((element) => {
        if (element.value == zoneId) {
          this.createDataFormData.zoneName = element.label;
        }
      });
    },
    openSelectModal(key, index) {
      switch (key) {
        case "vdc":
          this.vdcparentId = this.createDataFormData.zoneId.toString();
          if (this.vdcparentId) {
            this.showbindVdcModal = true;
          } else {
            let msg =
              this.$t("common.pleaseSelsect") + this.$t("resourceMgr.zoneName");
            this.alertTips(msg);
          }
          break;

        default:
          this.showbindVdcModal = false;
          break;
      }
    },

    bindVdcModalConfirm(rows) {
      if (rows && rows.length >= 1) {
        this.createDataFormData.parentId = rows[0].vdcId;
        this.createDataFormData.parentName = rows[0].vdcName;
      } else {
        this.createDataFormData.parentId = 0;
        this.createDataFormData.parentName = "";
      }

      this.setvdcSelectedKeys();

      this.setshowfirstVdc();
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
          if (!this.clickBol) return;
          this.handleConfirmvalidate(step);
          break;
        default:
          this.activestep = 0;
          break;
      }
    },
    tovdcResource(formData) {
      let architectureList = formData.architectureResourceList;

      let list = [];
      architectureList.forEach((element) => {
        // currentVcpu	// 当前cpu
        // usedCpu	// 已使用cpu
        // parentUsableCpu	// 上级剩余CPU
        // currentMem	// 当前内存
        // usedMem	// 已使用内存
        // parentUsableMem	// 上级剩余内存
        // memUnit	// 内存单位
        // architectureType	// 架构
        list.push({
          usableVcpu: element.usableVcpu,
          totalCpu: element.totalCpu,
          currentVcpu: 0,
          applyCpu: 0,
          usedCpu: element.usedCpu,
          usableMem: element.usableMem,
          totalMem: element.totalMem,
          currentMem: 0,
          applyMem: 0,
          usedMem: element.usedMem,
          memUnit: element.memUnit,
          architectureType: element.architectureType,
        });
      });

      let vdcResource = {
        storageUnit: formData.storageUnit,
        totalStorage: formData.totalStorage,
        usableStorage: formData.usableStorage,
        currentStorage: 0,
        applyStorage: 0,
        usedStorage: formData.usedStorage,
        architectureResourceList: [],

        modifyChild: true,
      };

      vdcResource.architectureResourceList = list;
      return vdcResource;
    },
    handleConfirmvalidate(step) {
      this.clickBol = false;
      switch (this.activestep) {
        case 0: // 基本信息校验
          this.$refs.createDataForm.validate((valid) => {
            if (valid) {
              if (this.editDisable) {
                // let { editflag, formData } = this.formOptions;
                // let vdcResource = this.tovdcResource(formData.vdcResource);
                // if (this.showfirstVdc) {
                //   // 一级vdc
                //   this.firstVdcFormData = {
                //     vdcResource: vdcResource,
                //     editflag,
                //     formData,
                //   };
                // } else {
                //   // 非一级vdc
                //   this.vdcFormData = {
                //     vdcResource: vdcResource,
                //     editflag,
                //     formData,
                //   };
                // }
                // this.activestep = this.activestep + step;
                this.clickBol = true;
              } else {
                // 获取上级vdc资源
                let params = {
                  parentVdcId: this.createDataFormData.parentId, // '上级VDC (没有上级VDC时传0)	'
                  zoneId: this.createDataFormData.zoneId, // 可用区ID
                };
                checkCreateVdc(params)
                  .then((res) => {
                    // let vdcResource = {
                    //   storageUnit: res.storageUnit,
                    //   totalStorage: res.totalStorage,
                    //   usableStorage: res.usableStorage,
                    //   currentStorage: 0,
                    //   applyStorage: 0,
                    //   usedStorage: res.usedStorage,
                    //   architectureResourceList: res.architectureResourceList,
                    // };
                    let vdcResource = this.tovdcResource(res);

                    if (this.showfirstVdc) {
                      // 一级vdc
                      this.firstVdcFormData = {
                        vdcResource: vdcResource,
                        editflag,
                        formData,
                      };
                    } else {
                      // 非一级vdc
                      this.vdcFormData = {
                        vdcResource: vdcResource,
                        editflag,
                        formData,
                      };
                    }
                    this.clickBol = true;
                    this.activestep = this.activestep + step;
                  })
                  .catch((err) => {
                    this.clickBol = true;
                    this.alertTips(err);
                  });
              }
            } else {
              this.clickBol = true;
              return false;
            }
          });

          break;
        case 1: // 分配资源信息校验
          let { editflag, formData } = this.formOptions;

          this.networkOptions = {
            editflag: editflag,
            firstVdc: this.showfirstVdc,
            formData: {
              zoneId: this.createDataFormData.zoneId,
              vdcparentId: this.createDataFormData.parentId,
              networkList: this.networkList,
            },
          };
          if (this.showfirstVdc) {
            // 一级vdc
            this.$refs.firstVdcresource
              .handleConfirm()
              .then(() => {
                // 一级vdc
                this.architectureResourceList =
                  this.$refs.firstVdcresource.architectureResourceFormList;
                this.architectureResourceFormList =
                  this.architectureResourceList;

                this.storageDataForm =
                  this.$refs.firstVdcresource.storageDataForm;

                this.firstVdcFormData = {
                  vdcResource: {
                    ...this.storageDataForm,
                    architectureResourceList: this.architectureResourceList,
                  },
                  editflag,
                  formData,
                };
                this.activestep = this.activestep + step;
                this.clickBol = true;
              })
              .catch(() => {
                this.clickBol = true;
              });
          } else {
            // 非一级vdc
            this.$refs.vdcresource
              .handleConfirm()
              .then(() => {
                // 非一级vdc
                this.architectureResourceList =
                  this.$refs.vdcresource.architectureResourceFormList;
                this.architectureResourceFormList =
                  this.architectureResourceList;
                this.storageDataForm = this.$refs.vdcresource.storageDataForm;

                // 非一级vdc
                this.vdcFormData = {
                  vdcResource: {
                    ...this.storageDataForm,
                    architectureResourceList: this.architectureResourceList,
                  },
                  editflag,
                  formData,
                };
                this.activestep = this.activestep + step;
                this.clickBol = true;
              })
              .catch(() => {
                this.clickBol = true;
              });
          }

          break;
        case 2: // 网络信息校验
          let netWorkFormDatavalid = this.$refs.netWorkForm.handleConfirm();

          // let { editflag, formData } = this.formOptions;
          if (netWorkFormDatavalid) {
            this.networkList =
              this.$refs.netWorkForm.netWorkFormData.vdcNetWorkList;

            this.networkOptions = {
              editflag: editflag,
              firstVdc: this.showfirstVdc,
              formData: {
                zoneId: this.createDataFormData.zoneId,
                vdcparentId: this.createDataFormData.parentId,
                networkList: this.networkList,
              },
            };
            this.activestep = this.activestep + step;
            this.clickBol = true;
          } else {
            this.clickBol = true;
            return false;
          }
          break;
        default:
          this.activestep = this.activestep + step; // 新增用户信息
          this.clickBol = true;
          break;
      }
    },
    commitEdit() {
      let architectureResourceList = this.architectureResourceList;
      for (let index = 0; index < architectureResourceList.length; index++) {
        const element = architectureResourceList[index];
        architectureResourceList[index].allocationCpu = element.applyCpu;
        architectureResourceList[index].allocationMem = element.applyMem;
      }

      let editData = {
        parentVdcId: this.createDataFormData.parentId, // "", // 上级VDC (没有上级VDC时传0)
        zoneId: this.createDataFormData.zoneId, // 可用区ID
        vdcName: this.createDataFormData.vdcName, // vdc名称
        remark: this.createDataFormData.remark || "", // 描述
        allocationStorage: this.storageDataForm.applyStorage, // 分配存储大小
        storageUnit: this.storageDataForm.storageUnit, // 存储单位
        architectureResourceList: architectureResourceList,
        networkList: this.networkList,
        vdcId: this.createDataFormData.vdcId,
      };
      modifyVdc(editData)
        .then((res) => {
          this.alertTips(this.$t("resourceMgr.vdcEditSuccess"), "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    commitCreate() {
      let architectureResourceList = this.architectureResourceList;
      for (let index = 0; index < architectureResourceList.length; index++) {
        const element = architectureResourceList[index];
        architectureResourceList[index].allocationCpu = element.applyCpu;
        architectureResourceList[index].allocationMem = element.applyMem;
      }

      let createData = {
        parentVdcId: this.createDataFormData.parentId, // "", // 上级VDC (没有上级VDC时传0)
        zoneId: this.createDataFormData.zoneId, // 可用区ID
        vdcName: this.createDataFormData.vdcName, // vdc名称
        remark: this.createDataFormData.remark || "", // 描述
        allocationStorage: this.storageDataForm.applyStorage, // 分配存储大小
        storageUnit: this.storageDataForm.storageUnit, // 存储单位
        architectureResourceList: architectureResourceList,
        networkList: this.networkList,
      };
      createVdc(createData)
        .then((res) => {
          this.alertTips(this.$t("resourceMgr.vdcAddSuccess"), "success");
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
  },
};
</script>
<style lang="scss">
.template-box {
  .el-form {
    flex: 1;
  }
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@include DrawerRtl;
.create-new-form-steps {
  padding: 20px 50px;
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
      flex: 1;
      margin-right: 25px;
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
.create-new-formtable {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  max-height: 82vh;
  padding: 0 50px;
}
.footBtn {
  //position: absolute;bottom: 0;right: 0;left: 0;
  padding: 25px 70px;

  border-top: 1px $borderColor solid;
  .el-button {
    margin-right: 15px;
  }
}
</style>
