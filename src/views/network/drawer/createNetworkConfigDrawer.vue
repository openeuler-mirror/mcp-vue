<template>
  <div class="drawer-content">
    <div class="create-new-network">
      <div class="template-box">
        <el-form
          ref="createNeworkForm"
          label-width="auto"
          :model="createNeworkFormData"
          :rules="rulesTemplate"
        >
          <el-form-item label="名称" prop="networkName">
            <el-input v-model="createNeworkFormData.networkName" />
          </el-form-item>
          <el-form-item label="网络类型" prop="interfaceType">
            <el-input
              v-model="createNeworkFormData.interfaceType"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item label="网卡类型" prop="modelType">
            <el-select
              v-model="createNeworkFormData.modelType"
              placeholder="网卡类型"
            >
              <el-option
                v-for="item in modelTypeList"
                :key="item.index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="地址池" prop="addressPoolId">
            <el-select
              v-model="createNeworkFormData.addressPoolId"
              placeholder="请选择地址池"
            >
              <el-option
                v-for="(item, index) in addressPoolList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="虚拟交换机" prop="virtualSwitch">
            <el-select
              v-model="createNeworkFormData.virtualSwitch"
              placeholder="请选择虚拟交换机"
              @change="changeVirtualSwitch"
            >
              <el-option
                v-for="(item, index) in virtualSwitchList"
                :key="index"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="端口组" prop="portGroupUuid">
            <el-select
              v-model="createNeworkFormData.portGroupUuid"
              placeholder="请选择端口组"
            >
              <el-option
                v-for="item in portGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.uuid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="安全组" prop="securityGroupUuid">
            <el-select
              v-model="createNeworkFormData.securityGroupUuid"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in securityGroupList"
                :key="index"
                :label="item.name"
                :value="item.uuid"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
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
import {
  mcNetworkConfig,
  mcPortGroupListByVirtualSwitch,
  createNetwork,
} from "@/api/networkConfig";
export default {
  components: {
    footBtn,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      createNeworkFormData: {
        networkName: "",
        interfaceType: "bridge",
        modelType: "virtio",
        addressPoolId: "",
        virtualSwitch: "",
        portGroupUuid: "",
        securityGroupUuid: "",
      },
      modelTypeList: [
        { value: "virtio", label: "virtio", index: 0 },
        { value: "e1000", label: "e1000", index: 1 },
        { value: "rtl8139", label: "rtl8139", index: 2 },
      ],
      addressPoolList: [],
      virtualSwitchList: [],
      portGroupList: [],
      securityGroupList: [],
      rulesTemplate: {
        networkName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "名称长度应控制在 6 ~ 18 个字符",
            trigger: "blur",
          },
        ],
        addressPoolId: [
          { required: true, message: "地址池不能为空", trigger: "blur" },
        ],
        virtualSwitch: [
          { required: true, message: "虚拟机交换机不能为空", trigger: "blur" },
        ],
        portGroupUuid: [
          { required: true, message: "端口组不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  created() {
    this.getMcNetworkConfig();
  },
  methods: {
    getMcNetworkConfig() {
      mcNetworkConfig().then((res) => {
        this.virtualSwitchList = res.virtualSwitchList;
        this.addressPoolList = res.addressPoolList;
        let defauleAddressPool = this.addressPoolList.find(
          (item) => item.defaultPool === true
        );
        if (defauleAddressPool) {
          this.createNeworkFormData.addressPool = defauleAddressPool.name;
        }
        this.securityGroupList = res.securityGroupList;
      });
    },
    // 提交
    handlerConfirm() {
      this.$refs.createNeworkForm.validate((valid) => {
        if (valid) {
          this.commitCreate();
        } else {
          return false;
        }
      });
    },
    commitCreate() {
      let networkName = this.createNeworkFormData.networkName;
      let interfaceType = this.createNeworkFormData.interfaceType;
      let modelType = this.createNeworkFormData.modelType;
      let addressPoolId = this.createNeworkFormData.addressPoolId;
      let addressPool = this.addressPoolList.find(
        (item) => item.id === addressPoolId
      ).name;
      let virtualSwitch = this.createNeworkFormData.virtualSwitch;
      let portGroupUuid = this.createNeworkFormData.portGroupUuid;
      let portGroup = this.portGroupList.find(
        (item) => item.uuid === portGroupUuid
      ).name;
      let securityGroupUuid = this.createNeworkFormData.securityGroupUuid + "";
      let securityGroup = "";

      if (securityGroupUuid.length > 0) {
        let securityGroupUuidArray = securityGroupUuid.split(",");
        for (let i = 0; i < securityGroupUuidArray.length; i++) {
          let securityGroupName = this.securityGroupList.find(
            (item) => item.uuid === securityGroupUuidArray[i]
          ).name;
          if (i === securityGroupUuidArray.length - 1) {
            securityGroup += securityGroupName;
          } else {
            securityGroup += securityGroupName + ",";
          }
        }
      }

      createNetwork({
        networkName,
        interfaceType,
        modelType,
        addressPoolId,
        addressPool,
        virtualSwitch,
        portGroupUuid,
        portGroup,
        securityGroupUuid,
        securityGroup,
      }).then((res) => {
        ReMessage.success("创建网络配置成功");
        this.$parent.closeDrawer();
      });
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },
    passSuccess() {
      this.$parent.refreshTable();
      ReMessage.success("创建成功");
      this.handlerCancel();
      this.$emit("update:visible", false);
    },
    changeVirtualSwitch(value) {
      let virtualSwitchName = value;
      mcPortGroupListByVirtualSwitch({ virtualSwitchName }).then((res) => {
        this.portGroupList = res;
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
@include DrawerRtl;
.create-new-network {
  @include formStyle;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;
  .el-input {
    width: $input-width;
  }

  .el-textarea {
    width: 380px;
    max-height: 100px;
  }
}
</style>
