<template>
  <div class="template-box netWorkForm">
    <el-form ref="netWorkForm" label-width="auto" :model="netWorkFormData">
      <div
        class=""
        v-for="(item, index) in netWorkFormData.vdcNetWorkList"
        :key="'vdcNetWork' + index"
      >
        <el-form-item
          :label="
            $t('resourceMgr.vdcnetworkNum') +
            (netWorkFormData.vdcNetWorkList.length > 1 ? index + 1 : '')
          "
          :prop="'vdcNetWorkList.' + index + '.networkName'"
          :rules="{
            required: true,
            message:
              $t('common.pleaseSet') + $t('resourceMgr.vdcNetWorkResouse'),
            trigger: 'blur',
          }"
          class="input-with-select"
        >
          <el-input placeholder="" readonly v-model="item.networkName">
            <template #append>
              <el-button @click="openSelectModal('vdcNetWork', item)">
                {{ $t("common.set") }}
              </el-button>
            </template>
          </el-input>

          <i
            v-show="index !== 0"
            class="el-icon-remove-outline"
            @click="deleteClusterItem(item)"
          />
          <i
            v-show="index === netWorkFormData.vdcNetWorkList.length - 1"
            class="el-icon-circle-plus-outline"
            @click="addClusterItem(item.index)"
          />
        </el-form-item>
      </div>
    </el-form>

    <setVdcNetWorkModal
      :visible.sync="showSetvdcNetWork"
      :vdczoneId="vdczoneId"
      :vdcparentId="vdcparentId"
      :options="netWorkformOptions"
      @confirm="setVdcNetWorkConfirm"
    ></setVdcNetWorkModal>
  </div>
</template>

<script>
import ReMessage from "@/utils/message";
import setVdcNetWorkModal from "./setVdcNetWorkModal.vue";
export default {
  components: { setVdcNetWorkModal },
  props: {
    networkOptions: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      vdczoneId: "",
      vdcparentId: "", // 上级vdcId
      showSetvdcNetWork: false,
      netWorkformOptions: {
        index: "",
        formData: "",
      },
      netWorkFormData: {
        vdcNetWorkList: [
          {
            // clusterId: "", //集群ID
            // clusterName: "", //集群Name
            // networkName: "", // 网络名称
            // interfaceType: "", //网络类型
            // addressPool: "", //地址池
            // addressPoolId: "", //地址池ID
            // virtualSwitch: "", //虚拟交换机
            // modelType: "", //网卡类型
            // portGroup: "", //端口组
            // portGroupUuid: "", //端口组uuid
            // securityGroup: "", //安全组
            // securityGroupUuid: "", // 安全组uuid
          },
        ],
      },
      orivdcNetWorkList: [],
      pagenetworkList: [],
      orinetWorkFormData: {
        vdcNetWorkList: [
          {
            clusterId: "", //集群ID
            clusterName: "", //集群Name
            networkId: "",
            networkName: "", // 网络名称
            interfaceType: "", //网络类型
            addressPool: "", //地址池
            addressPoolId: "", //地址池ID
            virtualSwitch: "", //虚拟交换机
            modelType: "virtio", //网卡类型
            portGroup: "", //端口组
            portGroupUuid: "", //端口组uuid
            securityGroup: "", //安全组
            securityGroupUuid: "", // 安全组uuid
            index: "",
            modifyType: "",
            securityPolicy: "NONE", // 安全策略
            virtualFirewallId: "", // 	虚拟防火墙ID
            virtualFirewallName: "", // 	虚拟防火墙名称
          },
        ],
      },
    };
  },
  watch: {},
  created() {
    let { editflag, formData, firstVdc } = this.networkOptions;
    if (editflag) {
      // 编辑数据
      let { networkList } = formData;
      this.setorivdcNetWorkList(networkList, firstVdc);
    } else {
      let { networkList } = formData;
      if (networkList && networkList.length > 0) {
        this.setorivdcNetWorkList(formData.networkList, firstVdc);
      } else {
        this.setorivdcNetWorkList(
          this.orinetWorkFormData.vdcNetWorkList,
          firstVdc
        );
      }
    }
  },
  mounted() {},
  methods: {
    setorivdcNetWorkList(list, firstVdc) {
      list.forEach((element, index) => {
        element.index = index;
        element.modifyType = "NONE";
        element.firstVdc = firstVdc;
      });
      this.orivdcNetWorkList = JSON.parse(JSON.stringify(list));
      this.dealNetworkList();
    },
    openSelectModal(key, item) {
      let { editflag, formData } = this.networkOptions;
      switch (key) {
        case "vdcNetWork":
          this.netWorkformOptions = {
            editflag: editflag,
            formData: item,
          };
          this.vdczoneId = formData.zoneId.toString();
          this.vdcparentId = formData.vdcparentId.toString();
          this.showSetvdcNetWork = true;

          break;

        default:
          this.showSetvdcNetWork = false;
          break;
      }
    },
    deleteClusterItem(item) {
      let { modifyType, index } = item;
      this.orivdcNetWorkList[index] = item;
      if (modifyType == "ADD") {
        this.orivdcNetWorkList[index].modifyType = "ADDDELETE";
      } else {
        this.orivdcNetWorkList[index].modifyType = "DELETE";
      }
      this.dealNetworkList();
    },
    addClusterItem() {
      let { editflag, formData, firstVdc } = this.networkOptions;
      let index = this.orivdcNetWorkList.length;

      this.orivdcNetWorkList.push({
        clusterId: "", //集群ID
        clusterName: "", //集群Name
        networkId: "",
        networkName: "", // 网络名称
        interfaceType: "", //网络类型
        addressPool: "", //地址池
        addressPoolId: "", //地址池ID
        virtualSwitch: "", //虚拟交换机
        modelType: "", //网卡类型
        portGroup: "", //端口组
        portGroupUuid: "", //端口组uuid
        securityGroup: "", //安全组
        securityGroupUuid: "", // 安全组uuid
        networkId: 0,
        modifyType: "ADD",
        index: index,
        firstVdc: firstVdc,
        securityPolicy: "NONE", // 安全策略
        virtualFirewallId: "", // 	虚拟防火墙ID
        virtualFirewallName: "", // 	虚拟防火墙名称
      });

      this.dealNetworkList();
    },

    setVdcNetWorkConfirm(setVdcNetWorkConfirm) {
      let { index } = setVdcNetWorkConfirm;

      this.orivdcNetWorkList[index] = setVdcNetWorkConfirm;
      this.dealNetworkList();
    },
    dealNetworkList() {
      let list = [];
      let filtermodifyType = ["DELETE", "ADDDELETE"];
      this.orivdcNetWorkList.forEach((element, index) => {
        let { modifyType } = element;
        if (filtermodifyType.indexOf(modifyType) == -1) {
          list.push(element);
        }
      });
      this.netWorkFormData.vdcNetWorkList = list;
    },

    handleConfirm() {
      this.dealNetworkList();
      let list = this.netWorkFormData.vdcNetWorkList;
      let setFlag = false;
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        setFlag = true;
        if (element.clusterId.toString() == "") {
          setFlag = false;
          break;
        }
      }
      if (!setFlag) {
        ReMessage.error(
          this.$t("common.pleaseSet") + this.$t("resourceMgr.vdcNetWorkResouse")
        );
        return;
      }
      let flag = false;
      this.$refs.netWorkForm.validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
  },
};
</script>

<style lang="scss" scoped>
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
  .el-textarea {
    width: $input-width;
  }
}
</style>
