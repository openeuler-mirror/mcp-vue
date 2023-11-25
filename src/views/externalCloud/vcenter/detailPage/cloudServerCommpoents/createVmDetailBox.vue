<template>
  <el-drawer
    size="900px"
    :title="$t('externalCloud.vmOperate.createVm')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :destroy-on-close="true"
    :before-close="handleCloseCreate"
  >
    <div class="drawer-content">
      <div class="create-new-form-steps">
        <el-steps :active="activestep" class="kcp-steps">
          <el-step :title="$t('resourceMgr.clusterBaseInfo')"></el-step>
          <el-step :title="$t('resourceMgr.clusterSettingInfo')"></el-step>
          <el-step :title="$t('resourceMgr.clusterConfirmInfo')"></el-step>
        </el-steps>
      </div>
      <!-- 基本信息 -->
      <div v-show="activestep == 0" class="drawer-body-content">
        <el-form
          class="createForm"
          :model="createForm1"
          ref="createForm1"
          label-width="80px"
          :rules="createBase1Rule"
        >
          <!-- 物理集群 -->
          <el-form-item :label="$t('externalCloud.vmOperate.physicalCluster')">
            <el-input disabled v-model="createForm1.clusterName"></el-input>
          </el-form-item>
          <!-- 名称 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.name')"
            prop="serverName"
          >
            <el-input v-model="createForm1.serverName"></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('externalCloud.vmOperate.description')"
            prop="serverDescription"
          >
            <el-input v-model="createForm1.serverDescription"></el-input>
          </el-form-item>
          <!-- 运行位置 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.runningPosition')"
            ref="cascaderRpForm"
            prop="runningLocationName"
          >
            <el-cascader
              v-model="createForm1.runningLocationName"
              :options="runPlace"
              :props="rpProps"
              ref="cascaderRp"
              @change="changeRp"
              :show-all-levels="false"
              @visible-change="fixCascaderBug"
            >
            </el-cascader>
          </el-form-item>
          <!-- 存储位置 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.storageLocation')"
            ref="storageForm"
            prop="storageName"
          >
            <el-input readonly v-model="createForm1.storageName">
              <template slot="append">
                <el-button :disabled="false" @click="getStorageBoxShow">{{
                  $t("externalCloud.vmOperate.choose")
                }}</el-button>
              </template>
            </el-input>
          </el-form-item>
          <!-- 镜像文件 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.MirrorFir')"
            ref="osForm"
            prop="templateName"
          >
            <el-input readonly v-model="createForm1.templateName">
              <template slot="append">
                <el-button :disabled="false" @click="showTemplate = true">{{
                  $t("externalCloud.vmOperate.choose")
                }}</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="activestep == 1" class="drawer-body-content">
        <el-form
          class="createForm"
          :model="createForm2"
          ref="createForm2"
          label-width="80px"
          :rules="createBase2Rule"
        >
          <el-form-item
            label="cpu"
            ref="cpuCores"
            prop="cpuCores"
            class="flex template-group-flex"
          >
            <el-radio-group
              class="create-radio-group"
              v-model="cpuDefaultVal"
              @change="handleCpuChange"
              size="medium"
            >
              <el-radio-button
                v-for="item in cpuCore"
                :label="item"
                :disabled="Number(item) > maxCpuCore"
                :key="item + 'radio'"
                >{{ item }}
                {{ $t("externalCloud.vmOperate.core") }}</el-radio-button
              >
            </el-radio-group>
            <el-radio-group
              v-model="cpuType"
              @change="changeCpuType"
              class="custom-radio"
            >
              <el-radio :label="1">{{
                $t("externalCloud.vmOperate.custom")
              }}</el-radio>
            </el-radio-group>
            <div v-if="cpuType" class="custom-group-wrap">
              <el-input
                style="width: 200px"
                v-model="cpuCostermVal"
                v-only-num
                :min="1"
                :max="maxCpuCore"
                @change="changeCostermVal"
              >
                <template slot="append">{{
                  $t("externalCloud.vmOperate.core")
                }}</template>
              </el-input>
            </div>
          </el-form-item>
          <!-- 内存 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.memory')"
            ref="memItem"
            prop="memorySize"
            class="flex template-group-flex"
          >
            <el-radio-group
              class="create-radio-group"
              v-model="memDefaultVal"
              @change="handleMemChange"
              size="medium"
            >
              <el-radio-button
                v-for="item in memArr"
                :label="item"
                :key="item + 'medium'"
                :disabled="Number(item) > maxMemorySize"
                >{{ item }} GB</el-radio-button
              >
            </el-radio-group>
            <el-radio-group
              v-model="memType"
              class="custom-radio"
              @change="changeMemType"
            >
              <el-radio :label="1">{{
                $t("externalCloud.vmOperate.custom")
              }}</el-radio>
            </el-radio-group>
            <div v-if="memType" class="custom-group-wrap">
              <el-input
                style="width: 200px"
                v-model="memCostermVal"
                v-only-num
                :min="1"
                key="mem"
                :max="maxCpuCore"
                @change="changeMemCostermVal"
              >
                <template slot="append">GB</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in disksList"
            :rules="{
              required: true,
              message: $t('externalCloud.vmOperate.diskCnatNull'),
              trigger: ['blur', 'change'],
            }"
            :prop="`disk_${index}`"
            :key="index + 'disk'"
            :label="
              $t('externalCloud.vmOperate.disk') +
              (index === 0 ? '' : index + 1)
            "
          >
            <el-input v-only-num v-model="createForm2[`disk_${index}`]">
              <template slot="append">GB</template>
            </el-input>
            <i
              v-show="index === disksList.length - 1"
              class="el-icon-circle-plus-outline"
              @click="addDiskItem"
            />
            <i
              v-show="item.type === 'custom' && index !== 0"
              class="el-icon-remove-outline"
              @click="deleteDiskItem(index)"
            />
          </el-form-item>
          <el-form-item
            v-for="(item, index) in ntList"
            :rules="{
              required: true,
              message: $t('externalCloud.vmOperate.netCardCantNull'),
              trigger: ['blur', 'change'],
            }"
            :prop="`nt_${index}`"
            :key="index + 'nt'"
            :label="
              $t('externalCloud.vmOperate.netCard') +
              (index === 0 ? '' : index + 1)
            "
          >
            <el-cascader
              v-model="createForm2[`nt_${index}`]"
              :options="netCardPlace"
              :props="netProps"
              :key="'cascaderNC' + index"
              :ref="'cascaderNC' + index"
              :show-all-levels="false"
              @visible-change="fixCascaderBug"
            >
            </el-cascader>
            <i
              v-show="index === ntList.length - 1"
              class="el-icon-circle-plus-outline"
              :key="index + 'netadd'"
              @click="addNtItem"
            />
            <i
              :key="index + 'netdel'"
              class="el-icon-remove-outline"
              @click="deletNtItem(index)"
            />
          </el-form-item>
          <el-button
            v-if="ntList.length === 0"
            class="net-add-btn"
            icon="el-icon-circle-plus-outline"
            @click="addNtItem"
            type="text"
            >{{ $t("externalCloud.vmOperate.addntCard") }}</el-button
          >
        </el-form>
      </div>
      <div v-show="activestep == 2" class="drawer-body-content">
        <div class="create-show-text">
          <div class="create-show-text-left">
            {{ $t("externalCloud.vmOperate.basicInfo") }}
          </div>
          <div class="create-show-text-right">
            <div class="create-show-content">
              {{ $t("externalCloud.vmOperate.name") }}：{{
                finalData.serverName
              }}
            </div>
            <div class="create-show-content">
              {{ $t("externalCloud.vmOperate.description") }}：{{
                finalData.serverDescription
              }}
            </div>
            <div class="create-show-content">
              {{ $t("externalCloud.vmOperate.runningPosition") }}：{{
                finalData.runningLocationName
              }}（{{ finalData.runningLocationType }}）
            </div>
            <div class="create-show-content">
              {{ $t("externalCloud.vmOperate.storageLocation") }}：{{
                finalData.storageName
              }}
            </div>
            <div class="create-show-content">
              {{ $t("externalCloud.vmOperate.os") }}：{{ finalData.osType }}
            </div>
            <div class="create-show-content">
              {{ $t("externalCloud.vmOperate.MirrorFir") }}：{{
                finalData.templateName
              }}
            </div>
          </div>
        </div>
        <div class="create-show-text">
          <div class="create-show-text-left">
            {{ $t("externalCloud.vmOperate.configInfo") }}
          </div>
          <div class="create-show-text-right">
            <div class="create-show-content">CPU：{{ finalData.cpuCores }}</div>
            <div class="create-show-content">
              {{ $t("externalCloud.vmOperate.memory") }}：{{
                finalData.memorySize
              }}
            </div>
            <template v-if="finalData.diskCapacityList.length > 0">
              <div
                class="create-show-content"
                v-for="(item, index) in finalData.diskCapacityList"
                :key="index + 'disk'"
              >
                {{ $t("externalCloud.vmOperate.disk") }}{{ index + 1 }}：{{
                  item
                }}GB
              </div>
            </template>
            <template v-if="finalData.networks.length > 0">
              <div
                class="create-show-content"
                v-for="(item, index) in finalData.networks"
                :key="index + 'nt'"
              >
                <div class="network-list-border">
                  {{ $t("externalCloud.vmOperate.network") }}{{ index + 1 }}：
                </div>
                <div class="network-card-border">
                  <span
                    >{{ $t("externalCloud.vmOperate.networkName") }}：{{
                      item.networkName
                    }}</span
                  >
                  <span
                    >{{ $t("externalCloud.vmOperate.ntAdapter") }}：{{
                      item.adapterName
                    }}</span
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="drawer-foot">
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
        <el-button @click="handleCloseCreate">{{
          $t("common.cancel")
        }}</el-button>
      </div>
    </div>
    <!-- 存储位置 -->
    <getStorageBox
      :visible.sync="showStorage"
      :vcenterId="vmInfo.vcenterId"
      :locationData="locationData"
      type="location"
      @selectChange="selectStorageChange"
    />
    <!-- 镜像 -->
    <getTemplateBox
      :visible.sync="showTemplate"
      :vcenterId="vmInfo.vcenterId"
      @selectChange="selectTemChange"
    />
  </el-drawer>
</template>
<script>
import {
  handelGetRp,
  handelGetNetCardList,
  createVm,
  checkExistVmName,
  vcenterResourceMax,
} from "@/api/vcenter";
import validate from "@/utils/validate";
import getStorageBox from "./getStorageBox";
import getTemplateBox from "./getTemplateBox";
export default {
  name: "createVmDetailBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    choosenData: {
      type: Object,
      default: () => ({}),
    },
    vmInfo: {
      type: Object,
      default: () => ({}),
    },
    modelType: {
      type: String,
      default: "",
    },
  },
  components: { getStorageBox, getTemplateBox },
  data() {
    const vaildNameExit = async (rule, value, callback) => {
      if (value) {
        const vcenterId = this.createForm1.vcenterId;
        const serverName = value;
        await checkExistVmName({
          vcenterId,
          serverName,
          serverOriginalName: "",
        }).then((res) => {
          //直接返回bol
          if (res) {
            return callback(new Error(this.$t("externalCloud.nameExiseted")));
          }
          return callback();
        });
      }
    };
    const validateCpuVal = (rule, value, callback) => {
      const vaildValue = Number(value);
      if (vaildValue !== 1 && vaildValue % 2 !== 0) {
        return callback(new Error(this.$t("common.cpuValtip")));
      } else if (vaildValue > this.maxCpuCore) {
        return callback(
          new Error(
            this.$t("externalCloud.overCpuMaxRes", {
              maxCpuCore: this.maxCpuCore,
            })
          )
        );
      } else {
        return callback();
      }
    };
    const validateMemorySize = (rule, value, callback) => {
      const vaildValue = Number(value);
      if (vaildValue > this.maxMemorySize) {
        return callback(
          new Error(
            this.$t("externalCloud.overMemMaxRes", {
              max: this.maxMemorySize,
            })
          )
        );
      } else {
        return callback();
      }
    };
    return {
      drawerVisible: this.visible,
      formOptions: this.options,
      showStorage: false,
      showTemplate: false,
      cpuType: null,
      memType: null,
      cpuCostermVal: 1,
      memCostermVal: 1,
      cpuDefaultVal: 1,
      memDefaultVal: 2,
      maxCpuCore: 0, //vcenter允许最大核数 vcenterResourceMax获取
      maxFreeDiskSize: 0, //vcenter允许最大磁盘数量vcenterResourceMax获取
      maxMemorySize: 0,
      locationData: {},
      activestep: 0,
      cpuCore: [1, 2, 4, 6],
      memArr: [2, 4, 8, 12],
      runPlace: [],
      netCardPlace: [],
      disksList: [{ type: "custom" }],
      ntList: [{ type: "custom" }],
      rpProps: {
        value: "name",
        label: "name",
        children: "childrenNav",
        checkStrictly: true,
        disabled: "elementDisabled",
      },
      netProps: {
        value: "networkName",
        label: "networkName",
      },
      value: "",
      createBase1Rule: {
        serverName: [
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
          {
            trigger: "blur",
            validator: vaildNameExit,
          },
        ],
        runningLocationName: {
          required: true,
          message:
            this.$t("externalCloud.vmOperate.runningPosition") +
            this.$t("common.notNull"),
          trigger: "change",
        },
        storageName: {
          required: true,
          message:
            this.$t("externalCloud.vmOperate.storageLocation") +
            this.$t("common.notNull"),
          trigger: "blur",
        },
        templateName: {
          required: true,
          message:
            this.$t("externalCloud.vmOperate.MirrorFir") +
            this.$t("common.notNull"),
          trigger: "blur",
        },
      },
      createBase2Rule: {
        cpuCores: [
          {
            required: true,
            message:
              this.$t("externalCloud.vmOperate.cpuCore") +
              this.$t("common.notNull"),
            trigger: "blur",
          },
          {
            trigger: "blur", // "输入有误",
            validator: validateCpuVal,
          },
        ],
        memorySize: [
          {
            required: true,
            message:
              this.$t("externalCloud.vmOperate.memSize") +
              this.$t("common.notNull"),
            trigger: "blur",
          },
          {
            trigger: "blur", // "输入有误",
            validator: validateMemorySize,
          },
        ],
      },
      createForm1: {
        runningLocationName: [],
      },
      createForm2: {
        cpuCores: 1,
        memorySize: 2,
      },
      finalData: {
        diskCapacityList: [],
        networks: [],
      },
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      isvis ? this.intData() : "";
    },
  },
  methods: {
    getStorageBoxShow() {
      const { runningLocationName } = this.createForm1;
      if (!runningLocationName || runningLocationName.length == 0) {
        this.$message.error(
          this.$t("externalCloud.vmOperate.chooseRunWayTips")
        );
        return;
      }
      this.showStorage = true;
    },
    intData() {
      //获取运行位置、可输入最大值
      this.getMaxResData();
      this.intRp();
    },
    getMaxResData() {
      const { vcenterId } = this.vmInfo;
      vcenterResourceMax({ vcenterId }).then((res) => {
        this.maxCpuCore = res.maxCpuCore;
        this.maxFreeDiskSize = res.maxFreeDiskSize;
        this.maxMemorySize = res.maxMemorySize;
      });
    },
    intRp() {
      const { vcenterName, vcenterId } = this.vmInfo;
      this.createForm1.clusterName = vcenterName;
      this.createForm1.vcenterId = vcenterId;
      const params = {
        vcenterId,
      };
      handelGetRp(params).then((res) => {
        this.runPlace = this.getTreeData([res]);
      });
    },

    //选中自定义cpu
    changeCpuType(e) {
      this.cpuCostermVal = this.createForm2.cpuCores;
      e ? (this.cpuDefaultVal = null) : "";
    },
    changeMemType(e) {
      this.memCostermVal = this.createForm2.memorySize;
      e ? (this.memDefaultVal = null) : "";
    },
    changeCostermVal(e) {
      this.$set(this.createForm2, "cpuCores", e);
    },
    changeMemCostermVal(e) {
      this.$set(this.createForm2, "memorySize", e);
      this.$forceUpdate();
    },
    //默认cpu数值更改
    handleCpuChange(e) {
      this.$refs.cpuCores.clearValidate();
      this.$set(this.createForm2, "cpuCores", e);
      this.cpuType = null;
    },
    handleMemChange(e) {
      this.$refs.memItem.clearValidate();
      this.$set(this.createForm2, "memorySize", e);
      this.memType = null;
    },

    getTreeData(e) {
      e.forEach((val) => {
        if (!val.childrenNav) {
          delete val.childrenNav;
        } else {
          this.getTreeData(val.childrenNav);
        }
      });
      return e;
    },
    fixCascaderBug() {
      this.$nextTick(() => {
        const $el = document.querySelectorAll(
          ".el-cascader-panel .el-cascader-node[aria-owns]"
        );
        Array.from($el).map((item) => item.removeAttribute("aria-owns"));
      });
    },
    handleCloseCreate() {
      this.$refs.createForm1.resetFields();
      this.$refs.createForm2.resetFields();
      //初始化数据
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
    // 提交
    handleConfirm(step) {
      switch (step) {
        case 0: // 确认
          this.commitCreate();
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
    commitCreate() {
      createVm(this.finalData).then((res) => {
        this.$message.success(this.$t("externalCloud.vmOperate.createSuccess"));
        this.handleCloseCreate();
        this.$emit("refreshTable");
      });
    },
    selectStorageChange(e) {
      this.$refs.storageForm.resetField();
      this.$set(this.createForm1, "storageName", e[0].datastoreName);
    },
    selectTemChange(e) {
      this.$refs.osForm.resetField();
      this.$set(this.createForm1, "templateName", e[0].templateName);
      this.$set(this.createForm1, "osType", e[0].osType);
      this.$set(this.createForm1, "osBits", e[0].osBits);
    },
    changeRp(e, n) {
      const choosenData = this.$refs.cascaderRp.getCheckedNodes()[0].data;
      this.$set(this, "locationData", {
        locationType: choosenData.type,
        locationName: choosenData.name,
      });
    },
    addDiskItem() {
      if (this.disksList.length >= 14) {
        this.alertTips(this.$t("externalCloud.vmOperate.cantMoreDisk"));
        return false;
      }
      this.disksList.push({
        type: "custom",
        diskId: 0,
      });
    },
    deleteDiskItem(index) {
      delete this.createForm2[`disk_${index}`];
      this.disksList.splice(index, 1);
    },
    addNtItem() {
      if (this.ntList.length >= 14) {
        this.alertTips(this.$t("externalCloud.vmOperate.cantMoreNt"));
        return false;
      }
      this.ntList.push({
        type: "custom",
      });
    },
    deletNtItem(index) {
      delete this.createForm2[`nt_${index}`];
      this.ntList.splice(index, 1);
    },
    handleConfirmvalidate() {
      switch (this.activestep) {
        case 0:
          this.$refs.createForm1.validate((valid) => {
            if (valid) {
              const { vcenterName, vcenterId } = this.vmInfo;
              const params = {
                vcenterId,
                imageOsType: this.createForm1.osType,
                imageOsBits: this.createForm1.osBits,
              };
              handelGetNetCardList(params).then((res) => {
                this.activestep += 1;
                this.netCardPlace = this.getCasderNetCard(res);
              });
            }
          });
          break;
        case 1:
          this.$refs.createForm2.validate((valid) => {
            if (valid) {
              const {
                serverName,
                serverDescription,
                storageName,
                templateName,
                osType,
                osBits,
              } = this.createForm1;
              const { cpuCores, memorySize } = this.createForm2;
              const diskCapacityList = [];
              const networks = [];
              let totalDIskVal = 0;
              for (const key in this.createForm2) {
                if (Object.hasOwnProperty.call(this.createForm2, key)) {
                  const element = this.createForm2[key];
                  if (key.indexOf("disk_") === 0) {
                    diskCapacityList.push(element);
                    totalDIskVal += element;
                  }
                  if (key.indexOf("nt_") === 0) {
                    networks.push({
                      networkName: element[0],
                      adapterName: element[1],
                    });
                  }
                }
              }
              if (totalDIskVal > this.maxFreeDiskSize) {
                this.$message.error(
                  this.$t("externalCloud.overDiskMaxRes", {
                    max: this.maxFreeDiskSize,
                  })
                );
                return;
              }
              const params = {
                vcenterId: this.vmInfo.vcenterId,
                serverName,
                serverDescription,
                runningLocationName: this.locationData.locationName,
                runningLocationType: this.locationData.locationType,
                storageName,
                templateName,
                osType,
                osBits,
                cpuCores,
                memorySize,
                diskCapacityList,
                networks,
              };
              this.$set(this, "finalData", params);
              this.activestep += 1;
            }
          });

          break;
        case 2:
          break;
        default:
          break;
      }
    },
    getCasderNetCard(res) {
      res.forEach((e, i) => {
        e.disabled = !e.isAccessible;
        if (e.adapters && e.adapters.length > 0) {
          const children = [];
          e.adapters.forEach((val) => {
            children.push({ networkName: val });
          });
          res[i].children = children;
        }
      });
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.create-new-form-steps {
  padding: 20px 30px 0;
}
.custom-group-wrap {
  display: flex;
  span {
    margin: 0 10px 0 15px;
  }
  .el-input {
    width: 140px;
  }
}
.drawer-content {
  height: 85%;
}

.template-group-flex {
  ::v-deep.el-form-item__content {
    display: flex;
    align-items: center;
    margin-left: 0 !important;
    .custom-group-wrap {
      margin-bottom: 0;
    }
    .custom-radio {
      margin: 0 10px;
    }
  }
}
.create-radio-group {
  ::v-deep.el-radio-button__inner {
    width: 80px;
  }
}
.final-show-content {
  padding: 30px;
}
.create-show-text {
  display: flex;
  flex-direction: row;
  .create-show-text-left {
    font-weight: 600;
    margin-right: 60px;
  }
  .create-show-text-right {
    flex: 1;
    .create-show-content {
      margin-bottom: 30px;
    }
  }
}
.drawer-body-content {
  @include formStyle;
}

.net-add-btn {
  ::v-deep.el-icon-circle-plus-outline {
    font-size: 13px !important;
  }
}
.network-list-border {
  margin-bottom: 0;
}
.network-card-border span {
  margin-right: 10px;
}
</style>
