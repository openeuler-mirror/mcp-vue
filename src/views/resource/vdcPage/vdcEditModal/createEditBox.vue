<template>
  <div class="drawer-content">
    <div class="create-new-form-steps">
      <el-steps :active="activestep" class="kcp-steps">
        <!-- 基本信息 -->
        <el-step :title="$t('resourceMgr.vdcBaseInfo')"></el-step>
        <!-- 网络 -->
        <el-step :title="$t('resourceMgr.vdcnetworkNum')"></el-step>
        <!-- 确认信息 -->
        <el-step :title="$t('resourceMgr.vdcConfirmInfo')"></el-step>
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

    <!-- 网络 -->
    <div v-if="activestep == 1" class="drawer-body-content">
      <!-- 这里的网络选择与设置为旧版代码 819-1-server-3版本更改为新版2、3层网络规格 -->
      <!-- <createEditNetworkBox ref="netWorkForm" :networkOptions="networkOptions">
      </createEditNetworkBox> -->
      <selectNetSpecList
        ref="netWorkForm"
        :showfirstVdc="showfirstVdc"
        :selectedNetworkIds="networkIds"
        :netPecArr="netPecArr"
        @change="handelChangeNetPec"
      ></selectNetSpecList>
    </div>
    <!-- 确认信息 -->
    <div v-if="activestep == 2" class="drawer-body-content">
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
        v-if="activestep == 1 || activestep == 2"
        @click="handleConfirm(-1)"
      >
        <!-- 上一步 -->
        {{ $t("common.previous") }}
      </el-button>
      <el-button
        type="primary"
        v-if="activestep == 0 || activestep == 1"
        @click="handleConfirm(1)"
      >
        <!-- 下一步 -->
        {{ $t("common.nextStep") }}
      </el-button>
      <el-button
        type="primary"
        @click="handleConfirm(0)"
        v-if="activestep == 2"
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
      @confirm="bindVdcModalConfirm"
    ></bindVdcModal>
  </div>
</template>
<script>
import { modifyVdc } from "@/api/vdcapi";
import bindVdcModal from "@/views/components/vdcBindVdc/bindVdcModal.vue";
import selectNetSpecList from "../../components/selectNetSpecList/selectNetSpecList.vue";
import createEditNetworkBox from "@/views/components/setVdcNetWork/createEditNetworkBox.vue";
import validate from "@/utils/validate";
export default {
  components: {
    bindVdcModal,
    createEditNetworkBox,
    selectNetSpecList,
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
      networkList: [],
      zoneList: [],

      oriFormData: {
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
      //选择网络规格
      netPecArr: [],
      //选择网络规格的IDs
      networkIds: [],

      editDisable: false,
      showfirstVdc: false,
    };
  },
  watch: {},
  created() {
    this.tableColumns = this.columnArr;
    this.activestep = 0;
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    let { editflag, formData } = this.formOptions;
    this.netPecArr = formData.canSelectedNetworkList;
    this.networkIds = formData.selectedNetworkIds;
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
      this.networkList = this.netPecArr.filter(
        (e) => this.networkIds.indexOf(e.networkSpecId) >= 0
      );
    } else {
      this.editDisable = false;
      this.networkList = [];
      this.createDataFormData.parentId = formData.parentId;
      this.createDataFormData.parentName = formData.parentName;
    }

    this.setshowfirstVdc();
  },
  computed: {},
  methods: {
    setshowfirstVdc() {
      if (this.createDataFormData.parentId > 0) {
        // 非一级VDC
        this.showfirstVdc = false;
      } else {
        // 一级Vdc
        this.showfirstVdc = true;
      }
    },
    zoneIdchange(zoneId) {
      this.createDataFormData.zoneId = zoneId;
      this.createDataFormData.zoneName = zoneId;
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
      this.createDataFormData.parentId = rows[0].vdcId;
      this.createDataFormData.parentName = rows[0].vdcName;
    },

    // 提交
    handleConfirm(step) {
      switch (step) {
        case 0: // 确认
          // 编辑信息
          this.commitEdit();
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
      switch (this.activestep) {
        case 0: // 基本信息校验
          this.$refs.createDataForm.validate((valid) => {
            if (valid) {
              let { editflag, formData } = this.formOptions;
              this.activestep = this.activestep + step; // 编辑用户信息
            } else {
              return false;
            }
          });

          break;
        case 1: // 网络信息校验
          let netWorkFormDatavalid = this.networkList.length > 0;
          if (netWorkFormDatavalid) {
            this.activestep = this.activestep + step;
          } else {
            this.$message.error("请选择网络规格");
            return false;
          }
          break;
        default:
          this.activestep = this.activestep + step;
          break;
      }
    },
    commitEdit() {
      let editData = {
        parentVdcId: this.createDataFormData.parentId, // "", // 上级VDC (没有上级VDC时传0)
        zoneId: this.createDataFormData.zoneId, // 可用区ID
        vdcName: this.createDataFormData.vdcName, // vdc名称
        remark: this.createDataFormData.remark || "", // 描述
        networkIds: this.networkIds,
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
    handleCancel() {
      this.activestep = 0;
      this.$parent.closeDrawer();
    },
    handelChangeNetPec(e) {
      this.networkList = e;
      const networkId = e.map((item) => item.networkSpecId);
      this.$set(this, "networkIds", networkId);
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
.drawer-body-content {
  @include formStyle;
}
.footBtn {
  border-top: 1px $borderColor dashed;
  .el-button {
    margin-right: 15px;
  }
}
</style>
