<template>
  <!-- 一级vdc -->
  <div class="firstVdcresource">
    <div class="create-new-formtable-main">
      <!-- 架构 -->
      <span class="divider-title">
        {{ $t("resourceMgr.vdcArchitecture") }}
      </span>
      <el-divider></el-divider>
      <div
        v-for="(item, index) in architectureResourceFormList"
        :key="item.architectureType + index"
        class="vdcCluserForm-box flex"
      >
        <span class="divider-title">{{ item.architectureType }}</span>
        <div class="vdcCluserForm">
          <el-form
            :ref="item.architectureType"
            label-width="60px"
            :model="item"
            :rules="DataFormrules[item.architectureType]"
            :label-position="labelPosition"
          >
            <el-form-item label="vCPU" prop="applyCpu">
              <div class="vdcCluser-flexbox">
                <span v-if="editDisable" class="vdcCluser-box">
                  <span>{{ item.currentVcpu + $t("common.cpu") }}</span>
                  <span>-></span>
                </span>
                <el-input v-model="item.applyCpu">
                  <template #append> {{ $t("common.cpu") }} </template>
                </el-input>
                <el-tooltip
                  v-if="!editDisable"
                  class="item"
                  effect="light"
                  :content="$t('resourceMgr.vdcallocatedtooltip')"
                  placement="top"
                >
                  <i class="kcp-infoQues icon-infoQues"></i>
                </el-tooltip>
                <div class="split-line"></div>
                <span class="vdcCluser-msg">
                  <span>
                    <!-- 上级可分配 -->
                    {{ $t("resourceMgr.firstvdcSupCanassigned") }}
                    {{ item.usableVcpu }}
                    {{ $t("common.cpu") }}
                  </span>
                </span>
                <span v-if="editDisable" class="vdcCluser-msg">
                  {{ $t("resourceMgr.vdcAllocationChild") }}
                  {{ item.usedCpu }}
                  {{ $t("common.cpu") }}
                </span>
              </div>
            </el-form-item>
            <el-form-item :label="$t('common.mem')" prop="applyMem">
              <div class="vdcCluser-flexbox">
                <span v-if="editDisable" class="vdcCluser-box">
                  <span>{{ item.currentMem + item.memUnit }}</span>
                  <span>-></span>
                </span>
                <el-input v-model="item.applyMem">
                  <template #append> {{ item.memUnit }} </template>
                </el-input>
                <el-tooltip
                  v-if="!editDisable"
                  class="item"
                  effect="light"
                  :content="$t('resourceMgr.vdcallocatedtooltip')"
                  placement="top"
                >
                  <i class="kcp-infoQues icon-infoQues"></i>
                </el-tooltip>
                <div class="split-line"></div>
                <span class="vdcCluser-msg">
                  <span>
                    <!-- 上级可分配 -->
                    {{ $t("resourceMgr.firstvdcSupCanassigned") }}
                    {{ item.usableMem + item.memUnit }}
                  </span>
                </span>
                <span v-if="editDisable" class="vdcCluser-msg">
                  {{ $t("resourceMgr.vdcAllocationChild") }}
                  {{ item.usedMem + item.memUnit }}
                </span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="create-new-formtable-main">
      <span class="divider-title">{{ $t("common.disk") }}</span>
      <el-divider></el-divider>
      <!-- Storage -->
      <div class="vdcCluserForm-box flex">
        <span class="divider-title">{{ $t("common.diskSize") }} </span>
        <div class="vdcCluserForm">
          <el-form
            ref="storageDataForm"
            label-width="60px"
            :model="storageDataForm"
            :rules="storageDataFormrules"
            :label-position="labelPosition"
          >
            <el-form-item label="" prop="applyStorage">
              <div class="vdcCluser-flexbox">
                <span v-if="editDisable" class="vdcCluser-box">
                  <span>
                    {{
                      storageDataForm.currentStorage +
                      storageDataForm.storageUnit
                    }}
                  </span>
                  <span>-></span>
                </span>
                <el-input v-model="storageDataForm.applyStorage">
                  <template #append>
                    {{ storageDataForm.storageUnit }}
                  </template>
                </el-input>
                <el-tooltip
                  v-if="!editDisable"
                  class="item"
                  effect="light"
                  :content="$t('resourceMgr.vdcallocatedtooltip')"
                  placement="top"
                >
                  <i class="kcp-infoQues icon-infoQues"></i>
                </el-tooltip>
                <div class="split-line"></div>
                <span class="vdcCluser-msg">
                  <!-- 上级可分配 -->
                  {{ $t("resourceMgr.firstvdcSupCanassigned") }}
                  {{
                    storageDataForm.usableStorage + storageDataForm.storageUnit
                  }}
                </span>
                <span v-if="editDisable" class="vdcCluser-msg">
                  {{ $t("resourceMgr.vdcAllocationChild") }}
                  {{
                    storageDataForm.usedStorage + storageDataForm.storageUnit
                  }}
                </span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { validNum } from "@/utils/validate.js";
export default {
  components: {},
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      labelPosition: "left",

      resouseFormData: {},
      DataFormrules: {},
      architectureResourceFormList: [],

      editDisable: false,
      storageDataForm: {
        applyStorage: "", // 分配存储大小
        usedStorage: "", // 已使用
        storageUnit: "", // 存储单位

        totalStorage: "", //  总存储
        usableStorage: "", //  可用存储
      },
      storageDataFormrules: {
        applyStorage: [
          {
            required: false,
            message: "",
            trigger: "blur",

            validator: (rule, value, callback) => {
              let options = {};

              if (this.editDisable) {
                options = {
                  min: this.storageDataForm.usedStorage,
                  max: this.storageDataForm.usableStorage,
                  message: this.$t("resourceMgr.vdcAllocateStorageused"), // "分配存储大小应大于已使用存储大小",
                };
              } else {
                options = {
                  min: 0,
                  max: this.storageDataForm.usableStorage,
                  message: this.$t("resourceMgr.vdcAllocateStorageequal"), // "分配存储大小为大于等于1的正整数",
                };
              }
              this.validNumNew(rule, value, callback, options);
            },
          },
        ],
      },
    };
  },
  watch: {},
  created() {},
  computed: {},
  mounted() {
    let { vdcResource, editflag, formData } = this.formOptions;
    this.editDisable = editflag;
    this.seteditvdcResource(vdcResource);
  },
  methods: {
    // 设置资源数据
    seteditvdcResource(vdcResource) {
      let {
        storageUnit,
        totalStorage,
        usableStorage,
        currentStorage,
        usedStorage,
        applyStorage,
        architectureResourceList,
      } = vdcResource;
      this.DataFormrules = [];
      this.DataFormrules = this.setarchitectureResourcevalid(
        architectureResourceList
      );
      this.architectureResourceFormList = [];
      this.architectureResourceFormList = architectureResourceList;

      this.storageDataForm = {
        applyStorage: applyStorage, // 分配存储大小
        currentStorage: currentStorage, // 分配存储大小
        usedStorage: usedStorage, // 已使用
        storageUnit: storageUnit, // 存储单位
        totalStorage: totalStorage, //  总存储
        usableStorage: usableStorage, //  可用存储
      };
    },
    validNumNew(rule, value, callback, options) {
      let { min, max, message } = options;
      rule.message = message;
      if (!validNum(value)) {
        callback(new Error(rule.message));
      } else if (Number(value) == 0) {
        callback(new Error(rule.message));
      } else if (Number(value) < min) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    },
    // 设置资源校验信息
    setarchitectureResourcevalid(architectureResourceList) {
      let DataFormrules = {};
      for (let index = 0; index < architectureResourceList.length; index++) {
        const element = architectureResourceList[index];
        let architectureType = element.architectureType;
        this.resouseFormData[architectureType] = element;
        DataFormrules[architectureType] = {
          applyCpu: [
            {
              required: false,
              message: "",
              trigger: "blur",
              validator: (rule, value, callback) => {
                let options = {};
                if (this.editDisable) {
                  options = {
                    min: element.usedCpu,
                    max: element.usableVcpu,
                    message: this.$t("resourceMgr.vdcAllocateCPUused"), // "分配CPU数应大于已使用CPU数",
                  };
                } else {
                  options = {
                    min: 0,
                    max: element.usableVcpu,
                    message: this.$t("resourceMgr.vdcAllocateCPUequal"), // "分配CPU数为大于等于1的正整数",
                  };
                }
                this.validNumNew(rule, value, callback, options);
              },
            },
          ],
          applyMem: [
            {
              required: false,
              message: "",
              trigger: "blur",

              validator: (rule, value, callback) => {
                let options = {};
                if (this.editDisable) {
                  options = {
                    min: element.usedMem,
                    max: element.usableMem,
                    message: this.$t("resourceMgr.vdcAllocateMemused"), // "分配内存数应大于已使用内存数",
                  };
                } else {
                  options = {
                    min: 0,
                    max: element.usableMem,
                    message: this.$t("resourceMgr.vdcAllocateMemequal"), // "分配内存数为大于等于1的正整数",
                  };
                }
                this.validNumNew(rule, value, callback, options);
              },
            },
          ],
        };
      }
      return DataFormrules;
    },

    handleConfirm() {
      let This = this;
      let allValidate = [];

      this.architectureResourceFormList.forEach((item, index) => {
        // 有多个输入框需校验，待都校验成功后再进行别的操作，所以需要使用Promise
        let architectureType = item.architectureType;
        // this.resouseFormData[architectureType] = item;
        allValidate.push(
          new Promise((rev, rej) => {
            //划重点：This.$refs['item'+index][0]
            This.$refs[architectureType][0].validate((valid) => {
              if (valid) {
                rev();
              } else {
                rej();
              }
            });
          })
        );
      });
      allValidate.push(
        new Promise((rev, rej) => {
          //划重点：This.$refs['item'+index][0]
          This.$refs.storageDataForm.validate((valid) => {
            if (valid) {
              rev();
            } else {
              rej();
            }
          });
        })
      );

      return Promise.all(allValidate);
    },
  },
};
</script>
<style lang="scss" >
.firstVdcresource {
  .create-new-formtable-main {
    .el-input-group--prepend .el-input__inner,
    .el-input-group__append {
      text-align: center;
      width: 40px !important;
      padding: 0 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.firstVdcresource {
  .create-new-formtable-main {
    .el-input-group--prepend .el-input__inner,
    .el-input-group__append {
      text-align: center;
      width: 40px !important;
      padding: 0 !important;
    }
    .divider-title {
      width: 90px;
      height: 32px;
      line-height: 32px;
    }
    .vdcCluserForm-box {
      border-bottom: 1px dashed #dcdfe6;
      margin-top: 15px;
    }
    .vdcCluserForm-box:last-child {
      border-bottom: 0px dashed #dcdfe6;
    }
    .vdcCluserForm {
      .vdcCluser-flexbox {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 32px;
      }
      .el-input {
        width: 200px;
      }
      .split-line {
        display: inline-block;
        height: 100%;
        width: 1px;
        border-left: 1px dashed #999;
        margin: 0 30px;
      }
      .vdcCluser-msg {
        color: #999;
        margin-left: 10px;
      }
      .vdcCluser-box {
        width: 80px;
        margin-right: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        color: #999;
      }
    }
  }
}
</style>
