<template>
  <div class="drawer-content" v-loading="loading">
    <div class="drawer-body-content">
      <el-form
        ref="passApplyServervmForm"
        label-width="80px"
        :model="passApplyServervmFormData"
        :rules="rulesTemplate"
      >
        <el-form-item :label="$t('workOrder.howtocreate')">
          <span>
            {{ applyServerVmType[passApplyServervmFormData.applyServerVmType] }}
          </span>
        </el-form-item>
        <!-- 集群 -->
        <el-form-item label="集群" prop="imageCluster">
          <el-select
            v-model="passApplyServervmFormData.imageCluster"
            placeholder="请选择"
            @change="imageClusterchange"
          >
            <el-option
              v-for="item in imageClusterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 镜像名称 -->
        <el-form-item
          class="selectTemplateBtn"
          label="镜像名称"
          prop="templateName"
        >
          <el-input
            v-model="passApplyServervmFormData.templateName"
            :placeholder="$t('workOrder.pserverVmTypeISO')"
            disabled
            readonly
          >
          </el-input>
        </el-form-item>
        <!-- 名称 -->
        <el-form-item :label="$t('workOrder.aliasName')" prop="aliasName">
          <el-input v-model="passApplyServervmFormData.aliasName" />
        </el-form-item>

        <!-- <el-form-item label="系统">
            <span>{{ passApplyServervmFormData.osMachine }}</span>
          </el-form-item> -->

        <!-- 架构 -->
        <el-form-item :label="$t('workOrder.architecture')" prop="architecture">
          <el-select
            v-model="passApplyServervmFormData.architecture"
            :placeholder="$t('workOrder.parchitecture')"
            disabled
          >
            <el-option
              v-for="item in architectureoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 操作系统  -->
        <el-form-item :label="$t('workOrder.osMachine')" prop="osMachine">
          <el-select
            v-model="passApplyServervmFormData.osMachine"
            :placeholder="$t('workOrder.posMachine')"
            disabled
          >
            <el-option-group
              v-for="group in machineoptions"
              :key="group[0].osType"
              :label="group[0].osTypeAlias"
            >
              <el-option
                v-for="item in group"
                :key="item.systemName"
                :label="item.systemName"
                :value="item.systemName"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="ISO镜像">
            <span>{{ passApplyServervmFormData.templateName }}</span>
          </el-form-item> -->

        <!-- 自动安置 -->
        <el-form-item :label="$t('workOrder.autoConfiguration')">
          <el-switch
            class="switchStyle"
            v-model="passApplyServervmFormData.autoConfiguration"
            :active-value="true"
            :inactive-value="false"
            :active-text="$t('workOrder.autoConfigurationOn')"
            :inactive-text="$t('workOrder.autoConfigurationOff')"
          >
          </el-switch>
        </el-form-item>

        <!-- 计算资源 -->
        <computResources
          v-if="!passApplyServervmFormData.autoConfiguration"
          ref="computResources"
          :formData="computResourcesformData"
        ></computResources>
        <!-- 存储位置  -->
        <el-form-item
          :label="$t('workOrder.storageLocation')"
          prop="storageLocationId"
          v-if="!passApplyServervmFormData.autoConfiguration"
        >
          <el-select
            v-model="passApplyServervmFormData.storageLocationId"
            :placeholder="$t('workOrder.placstorageLocation')"
          >
            <el-option
              v-for="item in storageLocationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="CPU" prop="cpu">
          <el-input-number v-model="passApplyServervmFormData.cpu" />
        </el-form-item>

        <el-form-item :label="$t('common.mem')" prop="mem">
          <el-input v-model="passApplyServervmFormData.mem" v-only-num>
            <template slot="append">GB</template>
          </el-input>
        </el-form-item>
        <!-- 磁盘 -->
        <setDiskInfo
          ref="setDiskInfo"
          :formData="disksformData"
          pageMode="ISOADD"
        >
        </setDiskInfo>

        <!-- 网卡 -->
        <setNetWorkInfo
          ref="setNetWorkInfo"
          :formData="networksformData"
          pageMode="ISOADD"
        >
        </setNetWorkInfo>

        <!-- 审核意见 -->
        <el-form-item
          :label="$t('workOrder.reviewComments')"
          prop="auditOpinion"
        >
          <el-input
            v-model="passApplyServervmFormData.auditOpinion"
            type="textarea"
            placeholder=""
            maxlength="400"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>
      </el-form>
    </div>
    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>
<script>
import footBtn from "@/components/Footbtn";
import ReMessage from "@/utils/message";
import { passApplyServerVm, refreshMcBaseInfo } from "@/api/workOrder";
import validate from "@/utils/validate";
import computResources from "./computResources.vue"; // 计算资源
import setDiskInfo from "./setDiskInfo.vue"; // 设置磁盘信息
import setNetWorkInfo from "./setNetWorkInfo.vue"; // 设置网卡信息
export default {
  components: {
    footBtn,
    computResources,
    setDiskInfo,
    setNetWorkInfo,
  },
  props: ["passApplyData", "formData"],
  data() {
    const validApplyNum = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error(rule.message));
      } else if (Number(value) < 1 || Number(value) > 4) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    };
    return {
      applyServerVmType: {
        ISO: this.$t("workOrder.serverVmType.ISO"), // ISO镜像
        TEMPLATE: this.$t("workOrder.serverVmType.TEMPLATE"), // 模板
      },
      architectureoptions: [
        // 架构
        { value: "X86_64", label: "X86_64" },
        { value: "aarch64", label: "ARM64" },
        { value: "mips", label: "MIPS" },
      ],
      machineoptions: [],
      loading: false,
      passApplyServervmFormData: {
        imageCluster: "", // 镜像集群
        auditOpinion: "",
        osMachine: "",
        architecture: "",
        systemType: "",
        templateName: "",
        applyNum: 5,
        aliasName: "",
        autoConfiguration: true,
        selectCluster: "",
        selectClusterUuid: "",
        storageLocationId: "",
        cpu: "",
        mem: "",
        memUnit: "GB",
        disks: [], //磁盘信息
        networks: [], //网卡信息
      },
      storageLocationList: [],
      rulesTemplate: {
        imageCluster: [
          {
            required: true,
            message: this.$t("resourceMgr.plccluster"), // "请选择集群",
            trigger: "blur",
          },
        ],
        aliasName: [
          {
            required: true,
            message: this.$t("workOrder.aliasNameNotNull"), // "名称不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 32,
            message: this.$t("workOrder.aliasNameLength"), // "名称长度应控制在 6 ~ 32 个字符",
            trigger: "blur",
          },
        ],
        applyNum: [
          {
            required: true,
            message: this.$t("workOrder.serverNumNotNull"), // "申请个数不能为空",
            trigger: "blur",
          },
          {
            message: this.$t("workOrder.serverNumIsoRange"), //"申请个数应控制在 1 ~ 4 范围",
            trigger: "blur",
            validator: validApplyNum,
          },
        ],
        auditOpinion: [
          {
            required: true,
            message: this.$t("workOrder.commentsNotempty"), // "审核意见不能为空",
            trigger: "blur",
          },
          {
            required: true,
            trigger: "blur",
            message: this.$t("workOrder.commentsspecialChar"), // "审核意见不能出现特殊字符",

            validator: validate.special_char,
          },
        ],
      },
      // 磁盘信息
      disksformData: {},
      // 网卡信息
      networksformData: {},

      imageClusterOptions: [],

      computResourcesformData: {},
    };
  },

  created() {
    this.getApplyDetail();
  },
  methods: {
    imageClusterchange(val) {
      this.loading = true;
      let params = {
        workOrderId: this.passApplyData.workOrderId, //	工单ID
        clusterId: val, //	集群ID
      };
      refreshMcBaseInfo(params)
        .then((res) => {
          let oldData = JSON.parse(JSON.stringify(this.formData));
          this.computResourcesformData = JSON.parse(JSON.stringify(res));
          let network = {
            interfaceList: oldData.interfaceList,
            canSelectedNetworkList: res.canSelectedNetworkList,
            applyNum: this.passApplyServervmFormData.applyNum,
            networkConfigList: res.interfaceList,
          };
          this.$set(
            this,
            "networksformData",
            JSON.parse(JSON.stringify(network))
          );
          this.passApplyServervmFormData.templateId = res.templateId;
        })
        .finally((res) => {
          this.loading = false;
        });
    },
    //获取模板详情
    getApplyDetail() {
      let res = JSON.parse(JSON.stringify(this.formData));
      this.passApplyServervmFormData.applyServerVmType = res.applyServerVmType;
      this.passApplyServervmFormData.aliasName = res.aliasName;
      this.passApplyServervmFormData.applyNum = res.applyNum;
      this.passApplyServervmFormData.templateId = res.templateId;
      this.passApplyServervmFormData.templateName = res.imageName;
      this.passApplyServervmFormData.osMachine = res.osMachine;
      this.passApplyServervmFormData.architecture = res.architecture;
      this.passApplyServervmFormData.systemType = res.systemType;
      this.passApplyServervmFormData.cpu = res.cpu;
      this.passApplyServervmFormData.mem = res.mem;
      this.passApplyServervmFormData.memUnit = res.memUnit;
      this.passApplyServervmFormData.storageLocationId = res.storageLocationId;
      this.computResourcesformData = JSON.parse(JSON.stringify(res));
      this.storageLocationList = res.storageLocationList;
      // 处理网卡数据
      this.networksformData = JSON.parse(JSON.stringify(this.formData));
      // 处理磁盘数据
      this.disksformData = JSON.parse(JSON.stringify(this.formData));

      // 处理磁盘数据
      this.passApplyServervmFormData.disks = res.disks;

      // 处理集群数据
      this.imageClusterOptions = this.getimageClusterList(res.imageClusterList);
      this.passApplyServervmFormData.imageCluster =
        this.imageClusterOptions[0].value;
    },
    getimageClusterList(imageClusterList) {
      let list = [];
      imageClusterList.forEach((element) => {
        list.push({
          label: element.clusterName,
          value: element.clusterId,
          ...element,
        });
      });
      return list;
    },
    // 提交
    handlerConfirm() {
      const that = this;
      let computResourcesvalidate = true;
      let netWorkInfovalidate = true;
      let setDiskInfovalidate = true;
      // 检验计算资源
      if (!this.passApplyServervmFormData.autoConfiguration) {
        computResourcesvalidate = this.$refs.computResources.submitForm();
      }

      // 检验磁盘信息
      setDiskInfovalidate = this.$refs.setDiskInfo.submitForm();
      // 检验网卡信息
      netWorkInfovalidate = this.$refs.setNetWorkInfo.submitForm();

      let confirmMsg = this.$t("workOrder.sureApproved"); // "确定审核通过？";
      this.$refs.passApplyServervmForm.validate((valid) => {
        if (
          valid &&
          computResourcesvalidate &&
          netWorkInfovalidate &&
          setDiskInfovalidate
        ) {
          this.alertConfirm(confirmMsg)
            .then((err) => {
              that.commitPass();
            })
            .catch((err) => {});
        } else {
          return false;
        }
      });
    },
    commitPass() {
      let workOrderId = this.passApplyData.workOrderId;
      let auditOpinion = this.passApplyServervmFormData.auditOpinion;
      let aliasName = this.passApplyServervmFormData.aliasName;

      let storageLocationId = this.passApplyServervmFormData.storageLocationId;
      let vcpus = this.passApplyServervmFormData.cpu;
      let memory = this.passApplyServervmFormData.mem;
      let memUnit = this.passApplyServervmFormData.memUnit;

      let plateformType = this.passApplyServervmFormData.architecture;
      let operatingSystem = this.passApplyServervmFormData.osMachine;
      let systemType = this.passApplyServervmFormData.systemType;
      let vmNumber = this.passApplyServervmFormData.applyNum;

      let remotePassword = this.createRemotePassword();

      // 枚举: TEMPLATE,ISO
      // 枚举备注: TEMPLATE(基于模板创建) ISO(ISO创建)
      let applyServerVmType = "ISO";
      // 计算资源
      let computResourcesFormData = {
        serverClusterType: this.formData.serverClusterType,
        // 自定义 选择主机
        selectCluster: this.formData.selectCluster, // 模板所选计算资源
        selectClusterUuid: this.formData.selectClusterUuid, // 模板所选计算资源uuid

        selectResourceTagId: this.formData.selectTagIds, // 绑定资源ID
        selectTagNames: this.formData.selectTagNames, // 绑定资源的名称
      };
      if (!this.passApplyServervmFormData.autoConfiguration) {
        let computResources =
          this.$refs.computResources.computResourcesFormData;
        computResourcesFormData = {
          serverClusterType: computResources.serverClusterType,
          // 自定义 选择主机
          selectCluster: computResources.selectCluster, // 模板所选计算资源
          selectClusterUuid: computResources.selectClusterUuid, // 模板所选计算资源uuid

          selectResourceTagId: computResources.selectTagIds, // 绑定资源ID
          selectTagNames: computResources.selectTagNames, // 绑定资源的名称
        };
      }

      //网络
      let networkList = this.$refs.setNetWorkInfo.cmtnetworkList;

      //磁盘处理
      let diskList = this.$refs.setDiskInfo.cmtdiskList;

      let templateId = 0;

      let clusterId = this.passApplyServervmFormData.imageCluster;

      let commitData = {
        workOrderId,
        auditOpinion,
        aliasName,
        plateformType,
        operatingSystem,
        systemType,
        vmNumber,
        storageLocationId,
        vcpus,
        memory,
        memUnit,
        diskList,
        networkList,
        remotePassword,
        applyServerVmType,
        ...computResourcesFormData,
        templateId,
        clusterId,
      };
      //申请云服务器
      passApplyServerVm(commitData).then((res) => {
        this.passSuccess();
      });
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
    passSuccess() {
      ReMessage.success(this.$t("common.reviewsucc"));
      this.$parent.$parent.$parent.refreshTable();
      this.handlerCancel();
    },
    createRemotePassword() {
      var arr = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
      ];
      var rand1 = Math.floor(Math.random() * 62);
      var rand2 = Math.floor(Math.random() * 62);
      var rand3 = Math.floor(Math.random() * 62);
      var rand4 = Math.floor(Math.random() * 62);
      var rand5 = Math.floor(Math.random() * 62);
      var rand6 = Math.floor(Math.random() * 62);
      return (
        arr[rand1] +
        arr[rand2] +
        arr[rand3] +
        arr[rand4] +
        arr[rand5] +
        arr[rand6]
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.check-applyiso-servervm {
  @include formStyle;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;
  .el-input {
    width: $input-width;
  }
  .el-input-number {
    width: $input-width;
  }
  .el-textarea {
    width: 380px;
    max-height: 100px;
  }
}
</style>
