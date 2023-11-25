<template>
  <el-drawer
    size="900px"
    :title="$t('externalCloud.vmOperate.editVm')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseEdit"
  >
    <div class="drawer-content" v-loading="drawLoading">
      <div class="drawer-body-content">
        <el-form
          ref="editForm"
          label-position="left"
          label-width="90px"
          :model="form"
          :rules="rules"
        >
          <!-- 名称 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.name')"
            prop="serverName"
          >
            <el-input v-model="form.serverName"></el-input>
          </el-form-item>
          <!-- 描述 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.description')"
            prop="serverDescription"
          >
            <el-input
              v-model="form.serverDescription"
              :maxlength="100"
              show-word-limit
              type="text"
            ></el-input>
          </el-form-item>
          <!-- cpu -->
          <el-form-item
            label="cpu"
            ref="cpuCores"
            prop="cpuCores"
            class="flex template-group-flex"
          >
            <el-radio-group
              class="create-radio-group"
              v-model="cpuDefaultVal"
              :disabled="serverStatus === 1"
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
              :disabled="serverStatus === 1"
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
                :disabled="serverStatus === 1"
                v-only-num
                :min="1"
                @change="changeCostermVal"
              >
                <template slot="append">{{
                  $t("externalCloud.vmOperate.core")
                }}</template>
              </el-input>
            </div>
            <el-tooltip
              v-if="serverStatus === 1"
              class="item"
              :content="$t('externalCloud.vmOperate.cantChangeOnlineCpu')"
              placement="top"
            >
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 内存 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.memory')"
            ref="memItem"
            prop="memorySize"
            class="flex template-group-flex"
          >
            <el-radio-group
              v-model="memDefaultVal"
              :disabled="serverStatus === 1"
              class="create-radio-group"
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
              :disabled="serverStatus === 1"
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
                :disabled="serverStatus === 1"
                min="1"
                @change="changeMemCostermVal"
              >
                <template slot="append">GB</template>
              </el-input>
            </div>
            <el-tooltip
              v-if="serverStatus === 1"
              class="item"
              :content="$t('externalCloud.vmOperate.cantChangeOnlineMem')"
              placement="top"
            >
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-form-item>
          <!-- 旧有磁盘 type：custom -->
          <el-form-item
            v-for="(item, index) in disksList"
            :rules="[
              {
                required: true,
                message: $t('externalCloud.vmOperate.diskCantNull'),
                trigger: ['blur', 'change'],
              },
              { validator: validateDisk, trigger: 'blur' },
            ]"
            :prop="`disk_${index}`"
            :key="index + 'disk'"
            :label="
              $t('externalCloud.vmOperate.disk') +
              (index === 0 ? '' : index + 1)
            "
          >
            <el-input
              v-if="item.operation === 'edit'"
              v-only-num
              v-model="form[`disk_${index}`]"
            >
              <template slot="append">GB</template>
            </el-input>
            <el-input
              v-else
              v-only-num
              :placeholder="$t('externalCloud.vmOperate.willDelDisk')"
              disabled
            >
            </el-input>
            <el-tooltip
              v-if="serverStatus !== 1"
              class="item"
              :content="$t('externalCloud.vmOperate.delThisDisk')"
              placement="top"
            >
              <i
                v-show="item.operation === 'edit'"
                class="el-icon-delete"
                @click="deleteDiskItem(index)"
              />
            </el-tooltip>
            <el-tooltip
              v-if="serverStatus === 1 && index === 0"
              class="item"
              :content="$t('externalCloud.vmOperate.cantDelOnlineDisk')"
              placement="top"
            >
              <i class="el-icon-warning"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              :content="$t('externalCloud.vmOperate.cancelThisDisk')"
              placement="top"
            >
              <svg-icon
                @click="recoverDiskItem(index)"
                v-show="item.operation === 'remove'"
                icon-class="recover"
                className="recover-btn"
              />
            </el-tooltip>
          </el-form-item>
          <!-- 新磁盘 -->
          <el-form-item
            v-for="(item, index) in newDisksList"
            :rules="{
              required: true,
              message: $t('externalCloud.vmOperate.diskCantNull'),
              trigger: ['blur', 'change'],
            }"
            :prop="`new_disk_${index}`"
            :key="'new_disk_' + index"
            :label="
              $t('externalCloud.vmOperate.addNewDisk') +
              (index === 0 ? '' : index + 1)
            "
          >
            <el-input v-only-num v-model="form[`new_disk_${index}`]">
              <template slot="append">GB</template>
            </el-input>
            <i class="el-icon-circle-plus-outline" @click="addNewDiskItem" />
            <i
              class="el-icon-remove-outline"
              @click="deleteNewDiskItem(index)"
            />
          </el-form-item>
          <el-button
            v-if="newDisksList.length === 0"
            class="net-add-btn"
            icon="el-icon-circle-plus-outline"
            @click="addNewDiskItem"
            type="text"
            >{{ $t("externalCloud.vmOperate.addNewDisk") }}</el-button
          >
          <!-- 网卡 -->
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
              v-model="form[`nt_${index}`]"
              :options="netCardPlace"
              :props="netProps"
              v-show="item.operation != 'remove'"
              :disabled="item.operation === 'edit'"
              :key="'cascaderNC' + index"
              :ref="'cascaderNC' + index"
              @visible-change="fixCascaderBug"
            >
            </el-cascader>
            <el-input
              v-show="item.operation === 'remove'"
              v-only-num
              disabled
              :placeholder="$t('externalCloud.vmOperate.delNetCard')"
            >
            </el-input>
            <!-- 新增网卡 -->
            <i
              v-show="index === ntList.length - 1"
              class="el-icon-circle-plus-outline"
              :key="index + 'netadd'"
              @click="addNtItem"
            />
            <!-- 新网卡假删除 -->
            <i
              v-if="item.operation === 'add'"
              :key="index + 'netdel'"
              class="el-icon-remove-outline"
              @click="deletNtItem(index, 'add')"
            />
            <!-- 旧有网卡假删除 -->
            <i
              v-if="item.operation === 'edit'"
              :key="index + 'netdel'"
              class="el-icon-delete"
              @click="deletNtItem(index, 'edit')"
            />
            <el-tooltip
              class="item"
              :content="$t('externalCloud.vmOperate.recoverNetCard')"
              placement="top"
            >
              <svg-icon
                @click="recoverNtItem(index)"
                v-show="item.operation === 'remove'"
                icon-class="recover"
                className="recover-btn"
              />
            </el-tooltip>
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
      <div class="drawer-foot">
        <el-button type="primary" @click="handelSubmit">{{
          $t("externalCloud.vmOperate.sure")
        }}</el-button>
        <el-button @click="handleCloseEdit('cancel')">{{
          $t("externalCloud.vmOperate.cancel")
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import {
  handelGetNetCardList,
  handelSubmitEdit,
  modifyDetail,
  checkExistVmName,
  vcenterResourceMax,
} from "@/api/vcenter";
import validate from "@/utils/validate";
export default {
  name: "editVmBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    choosenData: {
      type: Object,
      default: () => ({}),
    },
    modelType: {
      type: String,
      default: "",
    },
    vcenterId: {
      type: String,
      default: "",
    },
    rowData: {
      type: Object,
      default: "",
    },
  },
  data() {
    const vaildNameExit = async (rule, value, callback) => {
      if (value) {
        const vcenterId = this.vcenterId;
        const serverOriginalName = this.serverOriginalName;
        const serverName = value;
        await checkExistVmName({
          vcenterId,
          serverName,
          serverOriginalName,
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
      checkExistVmName: "",
      serverStatus: null,
      drawerVisible: this.visible,
      form: {},
      netCardPlace: [],
      drawLoading: false,
      showStorage: false,
      cpuDefaultVal: 1,
      cpuType: null,
      memType: null,
      serverOriginalName: "",
      cpuCostermVal: 1,
      disksList: [],
      newDisksList: [],
      oldFormData: {},
      ntList: [],
      maxCpuCore: 0, //vcenter允许最大核数 vcenterResourceMax获取
      maxFreeDiskSize: 0, //vcenter允许最大磁盘数量vcenterResourceMax获取
      maxMemorySize: 0,
      memDefaultVal: 2,
      memCostermVal: null,
      cpuCore: [1, 2, 4, 6],
      memArr: [2, 4, 8, 12],
      netProps: {
        value: "networkName",
        label: "networkName",
      },
      rules: {
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
            message: this.$t("common.vmName"), // "输入有误",
            validator: validate.validateCharNum,
          },
          {
            trigger: "blur",
            validator: vaildNameExit,
          },
        ],
        // cpu不能为空
        cpuCores: [
          {
            required: true,
            message:
              this.$t("externalCloud.vmOperate.cpuCore") +
              this.$t("common.notNull"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("common.cpuValtip"), // "输入有误",
            validator: validateCpuVal,
          },
        ],
        // 内存不能为空
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
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.$set(this.form, "serverName", this.rowData.serverName);
        //获取运行位置、可输入最大值
        this.getMaxResData();
        this.intData();
      }
    },
  },
  methods: {
    intData() {
      this.getModifyDetail();
    },
    getMaxResData() {
      const vcenterId = this.vcenterId;
      vcenterResourceMax({ vcenterId }).then((res) => {
        this.maxCpuCore = res.maxCpuCore;
        this.maxFreeDiskSize = res.maxFreeDiskSize;
        this.maxMemorySize = res.maxMemorySize;
      });
    },
    getModifyDetail() {
      this.drawLoading = true;
      const params = {
        vcenterId: this.vcenterId,
        serverName: this.choosenData.serverName,
      };
      modifyDetail(params)
        .then((res) => {
          const {
            cpuCores,
            disks,
            memorySize,
            networks,
            serverDatastore,
            imageOsBits,
            serverStatus,
            imageOsType,
            serverDescription,
            serverName,
          } = res;
          this.serverOriginalName = serverName;
          this.oldFormData = res;
          this.serverStatus = serverStatus;
          this.$set(this, "form", {
            serverName,
            serverOriginalName: serverName,
            serverDescription,
            imageOsBits,
            imageOsType,
            cpuCores,
            memorySize,
            serverDatastore,
          });
          this.cpuCostermVal = cpuCores;
          this.memCostermVal = memorySize;
          // 初始化cpu选项
          if (this.cpuCore.indexOf(cpuCores) >= 0) {
            this.cpuDefaultVal = cpuCores;
          } else {
            this.$set(this, "cpuType", 1);
            this.cpuDefaultVal = null;
          }
          // 初始化内存选项
          if (this.memArr.indexOf(memorySize) >= 0) {
            this.memDefaultVal = memorySize;
          } else {
            this.$set(this, "memType", 1);
            this.memDefaultVal = null;
          }
          //初始化磁盘
          const newDisksList = disks.map((e, index) => {
            e.operation = "edit";
            e.oldVal = e.diskCapacity;
            this.$set(this.form, `disk_${index}`, e.diskCapacity);
            return e;
          });
          this.$set(this, "disksList", newDisksList);
          //初始化网卡
          const newntList = networks.map((e, index) => {
            e.operation = "edit";
            return e;
          });
          this.$set(this, "ntList", newntList);
          this.getNetCardList(newntList);
        })
        .catch(() => {
          this.drawLoading = false;
        });
    },
    getNetCardList(listVal) {
      const params = {
        vcenterId: this.vcenterId,
        imageOsType: this.form.imageOsType,
        imageOsBits: this.form.imageOsBits,
      };

      handelGetNetCardList(params)
        .then((res) => {
          this.netCardPlace = this.getCasderNetCard(res);
          if (listVal.length > 0) {
            listVal.forEach((e, index) => {
              const arrData = [e.networkName, e.adapterName];
              this.$set(this.form, `nt_${index}`, arrData);
            });
          }
          this.drawLoading = false;
        })
        .catch(() => {
          this.drawLoading = false;
        });
    },
    submitData() {
      const { serverName, serverDescription, hostName, datastoreName } =
        this.form;

      const data = {
        serverName: this.choosenData.serverName,
        serverName,
        serverDescription,
        hostName,
        datastoreName,
      };
    },
    addNtItem() {
      if (this.ntList.length >= 14) {
        this.alertTips(this.$t("externalCloud.vmOperate.cantMoreNt"));
        return false;
      }

      this.ntList.push({
        networkName: "",
        adapterName: "",
        networkKey: -1,
        networkControllerKey: -1,
        unitNumber: -1,
        operation: "add",
      });
    },
    deletNtItem(index, type) {
      switch (type) {
        case "add":
          delete this.form[`nt_${index}`];
          this.ntList.splice(index, 1);
          break;
        case "edit":
          this.$set(this.ntList[index], "operation", "remove");
          this.$forceUpdate();
          break;
        default:
          break;
      }
    },
    recoverNtItem(index) {
      this.$set(this.ntList[index], "operation", "edit");
      this.$forceUpdate();
    },
    //默认cpu数值更改
    handleCpuChange(e) {
      this.$refs.cpuCores.clearValidate();
      this.$set(this.form, "cpuCores", e);
      this.cpuType = null;
    },
    //选中自定义cpu
    changeCpuType(e) {
      this.cpuCostermVal = this.form.cpuCores;
      e ? (this.cpuDefaultVal = null) : "";
    },
    changeCostermVal(e) {
      this.$set(this.form, "cpuCores", e);
    },
    handleMemChange(e) {
      this.$refs.memItem.clearValidate();
      this.$set(this.form, "memorySize", e);
      this.$set(this, "memType", null);
    },
    changeMemType(e) {
      this.memCostermVal = this.form.memorySize;
      e ? (this.memDefaultVal = null) : "";
    },
    changeMemCostermVal(e) {
      if (e) {
        this.$set(this.form, "memorySize", e);
      }
    },
    handleCloseEdit(type) {
      this.form = {};
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
      type === "fresh" ? this.$emit("freshTable") : "";
    },
    addDiskItem() {
      if (this.newDisksList.length + this.disksList.length >= 14) {
        this.alertTips(this.$t("externalCloud.vmOperate.cantMoreDisk"));
        return false;
      }
      this.disksList.push({
        type: "new",
        diskId: 0,
      });
    },
    addNewDiskItem() {
      if (this.newDisksList.length + this.disksList.length >= 14) {
        this.alertTips(this.$t("externalCloud.vmOperate.cantMoreDisk"));
        return false;
      }
      this.newDisksList.push({
        unitNumber: "-1",
        diskCapacity: 1,
        deviceKey: "-1",
        diskObjectId: "",
        diskBackingUuid: "",
        diskBackingFile: "",
        operation: "add",
      });
    },
    deleteNewDiskItem(index) {
      delete this.form[`new_disk_${index}`];
      this.newDisksList.splice(index, 1);
    },
    deleteDiskItem(index) {
      this.$set(this.disksList[index], "operation", "remove");
      this.$forceUpdate();
    },
    recoverDiskItem(index) {
      this.$set(this.disksList[index], "operation", "edit");
      this.$forceUpdate();
    },
    //转换树状结构
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
    fixCascaderBug() {
      this.$nextTick(() => {
        const $el = document.querySelectorAll(
          ".el-cascader-panel .el-cascader-node[aria-owns]"
        );
        Array.from($el).map((item) => item.removeAttribute("aria-owns"));
      });
    },
    validateDisk(rule, value, callback) {
      const oldIndex = rule.field.split("_")[1];
      const oldValue = this.oldFormData.disks[oldIndex]["diskCapacity"];
      if (value < oldValue) {
        callback(
          new Error(
            this.$t("externalCloud.vmOperate.cantChangeLessBefor") +
              `${oldValue}GB`
          )
        );
      }
      callback();
    },
    handelSubmit(e) {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.drawLoading = true;
          const {
            serverOriginalName,
            serverName,
            serverDatastore,
            serverDescription,
            cpuCores,
            memorySize,
          } = this.form;
          const diskArr = [];
          const ntList = [];
          this.disksList.forEach((e, i) => {
            let operation = e.operation;
            if (operation === "edit") {
              // 没有操作的时候类型为none
              e.oldVal * 1 === this.form[`disk_${i}`] * 1
                ? (operation = "none")
                : "edit";
            }
            delete e.oldVal;
            diskArr.push({
              ...e,
              operation,
              diskCapacity: this.form[`disk_${i}`] * 1,
            });
          });
          this.newDisksList.forEach((e, i) => {
            diskArr.push({
              ...e,
              diskCapacity: this.form[`new_disk_${i}`] * 1,
            });
          });
          let totalDIskVal = 0;
          diskArr.forEach((e) => {
            totalDIskVal += e.diskCapacity;
          });
          if (totalDIskVal > this.maxFreeDiskSize) {
            this.$message.error(
              this.$t("externalCloud.overDiskMaxRes", {
                max: this.maxFreeDiskSize,
              })
            );
            this.drawLoading = false;
            return;
          }
          this.ntList.forEach((e, i) => {
            let operation = e.operation;
            // 没有操作的时候类型为none
            operation === "edit" ? (operation = "none") : "";
            ntList.push({
              ...e,
              operation,
              networkName: this.form[`nt_${i}`][0],
              adapterName: this.form[`nt_${i}`][1],
            });
          });
          const params = {
            vcenterId: this.vcenterId * 1,
            serverOriginalName,
            serverName,
            serverDatastore,
            serverDescription,
            cpuCores: cpuCores * 1,
            memorySize: memorySize * 1,
            networks: ntList,
            disks: diskArr,
          };
          handelSubmitEdit(params)
            .then((res) => {
              this.$message.success(
                this.$t("externalCloud.vmOperate.editSuccessTips")
              );
              this.handleCloseEdit("fresh");
            })
            .finally(() => {
              this.drawLoading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.success {
  color: $msgSuccess;
}
.error {
  color: $msgDanger;
}
.drawer-body-content {
  @include formStyle;
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
.net-add-btn {
  ::v-deep.el-icon-circle-plus-outline {
    font-size: 13px !important;
  }
}
.recover-btn {
  font-size: 20px;
  color: #c0c4cc;
  margin-left: 10px;
  cursor: pointer;
}
.recover-btn:hover {
  color: #67c23a;
}
</style>
