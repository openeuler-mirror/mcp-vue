<template>
  <div class="drawer-content vdcSetNetWork">
    <div class="drawer-body-content">
      <el-form
        ref="createnetworkDataForm"
        label-width="auto"
        :model="createDataFormData"
        :rules="rulesTemplate"
      >
        <!--  物理集群-->
        <el-form-item
          :label="$t('resourceMgr.network.cluster')"
          prop="clusterId"
        >
          <el-select
            v-model="createDataFormData.clusterId"
            :placeholder="$t('resourceMgr.network.selectcluster')"
            @change="clusterIdchange"
          >
            <el-option
              v-for="(item, index) in clusterList"
              :key="'type' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 网络名称 -->
        <el-form-item
          :label="$t('resourceMgr.network.networkName')"
          prop="networkName"
        >
          <el-input
            v-model="createDataFormData.networkName"
            :placeholder="$t('resourceMgr.network.networkNameplac')"
          />
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('resourceMgr.network.networkNametooltip')"
            placement="top"
          >
            <i class="kcp-infoQues icon-infoQues"></i>
          </el-tooltip>
        </el-form-item>
        <!-- 网卡类型 -->
        <el-form-item
          :label="$t('resourceMgr.network.modelType')"
          prop="modelType"
        >
          <el-select
            v-model="createDataFormData.modelType"
            :placeholder="$t('resourceMgr.network.modelTypeplac')"
          >
            <el-option
              v-for="(item, index) in networkTypeList"
              :key="'type' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 地址池 -->
        <el-form-item
          v-if="createDataFormData.clusterId"
          :label="$t('resourceMgr.network.addressPool')"
          prop="addressPoolId"
        >
          <el-select
            v-model="createDataFormData.addressPoolId"
            :placeholder="$t('resourceMgr.network.addressPoolplac')"
            @change="addressPoolIdchange"
          >
            <el-option
              v-for="(item, index) in pagepoolList"
              :key="'type' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 虚拟交换机 -->
        <el-form-item
          v-if="createDataFormData.clusterId"
          :label="$t('resourceMgr.network.virtualSwitch')"
          prop="virtualSwitch"
        >
          <el-select
            v-model="createDataFormData.virtualSwitch"
            :placeholder="$t('resourceMgr.network.virtualSwitchplac')"
            @change="virtualSwitchchange"
          >
            <el-option
              v-for="(item, index) in pageviSwitchList"
              :key="'type' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 端口组 -->
        <el-form-item
          v-if="createDataFormData.virtualSwitch"
          :label="$t('resourceMgr.network.portGroup')"
          prop="portGroupUuid"
        >
          <el-select
            v-model="createDataFormData.portGroupUuid"
            :placeholder="$t('resourceMgr.network.portGroupplac')"
            @change="portGroupUuidchange"
          >
            <el-option
              v-for="(item, index) in pageportGroupList"
              :key="'type' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 安全策略 -->
        <el-form-item :label="$t('resourceMgr.network.securityPolicy')">
          <el-radio-group
            v-model="createDataFormData.securityPolicy"
            @change="securityPolicyChange"
          >
            <el-radio
              v-for="(item, index) in securityPolicyList"
              :label="item.value"
              :key="item.value + index"
              >{{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 安全组 -->
        <el-form-item
          v-if="createDataFormData.securityPolicy == 'SECURITY_GROUP'"
          :label="$t('resourceMgr.network.permission')"
          prop="permissionset"
        >
          <div class="vdcSetNetWork-box">
            <div class="left-vdcSetNetWork">
              <!-- 安全组资源 -->
              <div class="vdcSetNetWork-title">
                {{ $t("resourceMgr.network.permissionresouse") }}
              </div>
              <div class="vdcSetNetWork-content">
                <el-checkbox-group v-model="leftcheckList">
                  <el-checkbox
                    v-for="item in leftGroupList"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="cneter-vdcSetNetWork">
              <div class="vdcSetNetWork-toright">
                <div class="vdcSetNetWork-btn" @click="getLeftCheckedKeys">
                  {{ btniconLeft }}
                </div>
              </div>
              <div class="vdcSetNetWork-toleft">
                <div class="vdcSetNetWork-btn" @click="getRightCheckedKeys">
                  {{ btniconRight }}
                </div>
              </div>
            </div>
            <div class="right-vdcSetNetWork">
              <!-- 生效安全组资源 -->
              <div class="vdcSetNetWork-title">
                {{ $t("resourceMgr.network.effectivepermission") }}
              </div>
              <div class="vdcSetNetWork-content">
                <el-checkbox-group v-model="rightcheckList">
                  <el-checkbox
                    v-for="item in rightGroupList"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- 虚拟防火墙 -->
        <el-form-item
          v-if="createDataFormData.securityPolicy == 'VIRTUAL_FIREWALL'"
          :label="$t('resourceMgr.network.virtualFirewallName')"
        >
          <el-input
            v-model="createDataFormData.virtualFirewallName"
            readonly
            :placeholder="$t('resourceMgr.network.virtualFirewallNamePlc')"
            class="input-with-select"
          >
            <template #append>
              <el-button @click="openSelectModal('VIRTUAL_FIREWALL')">
                {{ $t("common.select") }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />

    <!-- 安全策略 -->
    <bindVirtualFirewall
      :visible.sync="openVirtualFirewall"
      :defaultTableData="virtualFirewallTableData"
      :defaultSelectedKeys="virtualFirewallSelectedKeys"
      @confirm="virtualFirewallconfirm"
    >
    </bindVirtualFirewall>
  </div>
</template>
<script>
import {
  zoneClusterList,
  clusterNetworkConfig,
  mcPortGroupListByVirtualSwitch,
} from "@/api/vdcapi";
import footBtn from "@/components/Footbtn";
import dictionary from "@/assets/common/dataDictionary/dictionary";
import bindVirtualFirewall from "../bindVirtualFirewall/bindVirtualFirewallModal.vue";

export default {
  components: { footBtn, bindVirtualFirewall },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vdczoneId: {
      type: String,
      default: "",
    },
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      btniconLeft: ">",
      btniconRight: "<",
      leftcheckList: [],
      leftGroupList: [],
      rightcheckList: [],
      rightGroupList: [],
      clusterList: [],
      pagepoolList: [],
      pageseGroupList: [], // 安全组
      pageviSwitchList: [],
      pageportGroupList: [], // 端口组
      oriFormData: {
        clusterId: "", //可用区ID
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
        securityPolicy: "NONE", // 安全策略
        virtualFirewallId: "", // 	虚拟防火墙ID
        virtualFirewallName: "", // 	虚拟防火墙名称
      },
      createDataFormData: {},
      rulesTemplate: {
        clusterId: [
          {
            required: true,
            message: this.$t("resourceMgr.network.selectcluster"), // "请选择物理集群",
            trigger: "blur",
          },
        ],
        networkName: [
          {
            required: true,
            message: this.$t("resourceMgr.network.networkNameplac"), // "请输入网络名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 18,
            message: this.$t("resourceMgr.network.networkNamelen"), // "名称长度应控制在 2 ~ 18 个字符",
            trigger: "blur",
          },
        ],
        addressPoolId: [
          {
            required: true,
            message: this.$t("resourceMgr.network.addressPoolplac"), // "请选择地址池",
            trigger: "blur",
          },
        ],
        virtualSwitch: [
          {
            required: true,
            message: this.$t("resourceMgr.network.virtualSwitchplac"), // "请选择虚拟交换机",
            trigger: "blur",
          },
        ],
        portGroupUuid: [
          {
            required: true,
            message: this.$t("resourceMgr.network.portGroupplac"), // "请选择端口组",
            trigger: "blur",
          },
        ],
      },
      networkTypeList: [
        // virtio e1000 rtl8139
        { value: "virtio", label: "virtio" },
        { value: "e1000", label: "e1000" },
        { value: "rtl8139", label: "rtl8139" },
      ],
      // 安全组数据
      pagesecurityGroupList: [],

      // 安全策略列表
      securityPolicyList: dictionary.securityPolicyArr,
      openVirtualFirewall: false,
      virtualFirewallTableData: [],
      virtualFirewallSelectedKeys: [],
      pageVirtualFirewallList: [],
    };
  },

  created() {
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    this.rightGroupList = [];
    this.leftGroupList = [];
    this.leftcheckList = [];
    this.rightcheckList = [];
    this.virtualFirewallTableData = [];
    this.getzoneClusterList();

    let { editflag, formData } = this.formOptions;
    if (editflag) {
      this.createDataFormData = JSON.parse(JSON.stringify(formData));
    } else {
      this.createDataFormData = JSON.parse(JSON.stringify(formData));
    }
  },
  computed: {},
  methods: {
    getzoneClusterList() {
      let list = [];
      zoneClusterList({ zoneId: this.vdczoneId })
        .then((res) => {
          res.forEach((element) => {
            list.push({
              value: element.clusterId,
              label: element.clusterName,
            });
          });
          this.clusterList = list;
          this.setPageData();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    setPageData() {
      let clusterId = this.createDataFormData.clusterId;
      let virtualSwitch = this.createDataFormData.virtualSwitch;
      if (clusterId) {
        this.clusterIdchange(clusterId);
      } else {
        this.clusterIdchange(this.clusterList[0].value);
      }
      if (virtualSwitch) {
        this.virtualSwitchchange(virtualSwitch);
      }
    },

    clusterIdchange(clusterId) {
      // 根据集群获取网络配置
      this.clusterList.forEach((element) => {
        let { label, value } = element;
        if (clusterId == value) {
          this.createDataFormData.clusterId = value;
          this.createDataFormData.clusterName = label;
        }
      });
      this.createDataFormData.addressPoolId = "";
      this.createDataFormData.virtualSwitch = "";
      // this.createDataFormData.portGroupUuid = "";

      clusterNetworkConfig({ clusterId: clusterId })
        .then((res) => {
          let poolList = [];
          let viSwitchList = [];
          let {
            addressPoolList,
            securityGroupList,
            virtualSwitchList,
            virtualFirewallList,
          } = res;
          // 地址池
          addressPoolList.forEach((element) => {
            let { defaultPool, name, id } = element;
            poolList.push({
              value: id,
              label: name,
            });
            if (defaultPool) {
              this.createDataFormData.addressPoolId = id;
              this.createDataFormData.addressPool = name;
            }
          });
          this.pagepoolList = poolList;

          // 虚拟交换机
          virtualSwitchList.forEach((element) => {
            viSwitchList.push({
              value: element.name,
              label: element.name,
            });
          });
          this.pageviSwitchList = viSwitchList;

          // 安全组数据
          this.pagesecurityGroupList = securityGroupList;

          // 虚拟防火墙数据
          this.pageVirtualFirewallList = virtualFirewallList;

          this.securityPolicyChange(this.createDataFormData.securityPolicy);
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    portGroupUuidchange(portGroupUuid) {
      this.pageportGroupList.forEach((element) => {
        let { label, value } = element;
        if (portGroupUuid == value) {
          this.createDataFormData.portGroupUuid = value;
          this.createDataFormData.portGroup = label;
        }
      });
    },
    virtualSwitchchange(virtualSwitchName) {
      // 根据虚拟交换机获取端口组
      let portGroupUuid = this.createDataFormData.portGroupUuid;
      this.createDataFormData.virtualSwitch = virtualSwitchName;
      let params = {
        clusterId: this.createDataFormData.clusterId,
        virtualSwitchName: this.createDataFormData.virtualSwitch,
      };
      mcPortGroupListByVirtualSwitch(params)
        .then((res) => {
          let portGroupList = [];
          res.forEach((element) => {
            portGroupList.push({
              value: element.uuid,
              label: element.name,
            });
          });
          this.pageportGroupList = portGroupList;
          let portGroupUuidFlag = false;
          for (let index = 0; index < portGroupList.length; index++) {
            const element = portGroupList[index];

            if (element.value == portGroupUuid) {
              portGroupUuidFlag = true;
              break;
            }
          }
          if (portGroupUuidFlag) {
            this.createDataFormData.portGroupUuid = portGroupUuid;
          } else {
            this.createDataFormData.portGroupUuid = "";
          }
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    addressPoolIdchange(clusterId) {
      this.pagepoolList.forEach((element) => {
        let { label, value } = element;
        if (clusterId == value) {
          this.createDataFormData.addressPoolId = value;
          this.createDataFormData.addressPool = label;
        }
      });
    },
    // 提交
    handlerConfirm() {
      this.$refs.createnetworkDataForm.validate((valid) => {
        if (valid) {
          this.commitCreate();
        } else {
          return false;
        }
      });
    },
    commitCreate() {
      let checkedList = JSON.parse(JSON.stringify(this.rightcheckList));
      let securityGroup = [];
      let securityGroupUuid = [];
      this.leftcheckList = [];
      this.pageseGroupList.forEach((element) => {
        if (checkedList.indexOf(element.value) > -1) {
          securityGroup.push(element.label);
          securityGroupUuid.push(element.value);
          this.leftcheckList.push(element.value);
        }
      });
      this.createDataFormData.securityGroup = securityGroup.toString();
      this.createDataFormData.securityGroupUuid = securityGroupUuid.toString();
      this.$emit("confirm", this.createDataFormData);
      this.$parent.closeDrawer();
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
    getLeftCheckedKeys() {
      let checkedList = JSON.parse(JSON.stringify(this.leftcheckList));
      this.rightGroupList = [];
      // this.leftGroupList = [];
      // this.leftcheckList = [];
      this.rightcheckList = [];
      this.pageseGroupList.forEach((element) => {
        if (checkedList.indexOf(element.value) > -1) {
          this.rightGroupList.push(element);
          this.rightcheckList.push(element.value);
        } else {
          // this.leftGroupList.push(element);
          // this.leftcheckList.push(element.value);
        }
      });
    },
    getRightCheckedKeys() {
      let checkedList = JSON.parse(JSON.stringify(this.rightcheckList));
      this.rightGroupList = [];
      // this.leftGroupList = [];
      this.leftcheckList = [];
      // this.rightcheckList = [];
      this.pageseGroupList.forEach((element) => {
        if (checkedList.indexOf(element.value) > -1) {
          this.rightGroupList.push(element);
          this.leftcheckList.push(element.value);
        } else {
          // this.rightGroupList.push(element);
          // this.rightcheckList.push(element.value);
        }
      });
    },
    openSelectModal(key) {
      switch (key) {
        case "VIRTUAL_FIREWALL":
          // 打开虚拟防火墙
          this.virtualFirewallSelectedKeys = [
            {
              virtualFirewallId: this.createDataFormData.virtualFirewallId,
              virtualFirewallName: this.createDataFormData.virtualFirewallName,
            },
          ];
          this.openVirtualFirewall = true;
          break;

        default:
          this.openVirtualFirewall = false;
          break;
      }
    },
    virtualFirewallconfirm(selectlist) {
      let selected = selectlist[0];
      this.createDataFormData.virtualFirewallId = selected.virtualFirewallId; // 	虚拟防火墙ID
      this.createDataFormData.virtualFirewallName =
        selected.virtualFirewallName; //	虚拟防火墙名称
    },
    securityPolicyChange(key) {
      let { formData } = this.formOptions;
      switch (key) {
        // 无
        case "NONE":
          this.setNonedata();
          break;
        // '安全组'
        case "SECURITY_GROUP":
          this.createDataFormData.securityGroupUuid =
            formData.securityGroupUuid;
          this.createDataFormData.securityGroup = formData.securityGroup;
          this.setSecurityGroupList(this.pagesecurityGroupList);
          break;
        // '虚拟防火墙'
        case "VIRTUAL_FIREWALL":
          this.createDataFormData.virtualFirewallId =
            formData.virtualFirewallId;
          this.createDataFormData.virtualFirewallName =
            formData.virtualFirewallName;
          this.setVirtualFirewallList(this.pageVirtualFirewallList);
          break;
        default:
          this.setNonedata();
          break;
      }
    },
    setNonedata() {
      this.createDataFormData.virtualFirewallId = 0;
      this.createDataFormData.virtualFirewallName = "";
      this.createDataFormData.securityGroupUuid = "";
      this.createDataFormData.securityGroup = "";
      this.setSecurityGroupList(this.pagesecurityGroupList);
      this.setVirtualFirewallList(this.pageVirtualFirewallList);
    },
    // 设置端口组数据
    setSecurityGroupList(securityGroupList) {
      this.rightGroupList = [];
      this.leftGroupList = [];
      this.leftcheckList = [];
      this.rightcheckList = [];

      let seGroupList = [];
      securityGroupList.forEach((element) => {
        seGroupList.push({
          value: element.uuid,
          label: element.name,
        });
      });
      this.pageseGroupList = seGroupList;
      this.leftGroupList = JSON.parse(JSON.stringify(this.pageseGroupList));

      let securityGroupUuid = this.createDataFormData.securityGroupUuid;
      this.leftcheckList = securityGroupUuid.split(",");
      this.getLeftCheckedKeys();
    },

    // 设置虚拟防火墙数据
    setVirtualFirewallList(virtualFirewallList) {
      if (virtualFirewallList && virtualFirewallList.length > 0) {
        this.virtualFirewallTableData = virtualFirewallList;
      } else {
        this.virtualFirewallTableData = [];
      }
    },
  },
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.vdcSetNetWork {
  .drawer-body-content {
    @include formStyle;
  }
  .vdcSetNetWork-box {
    width: 400px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left-vdcSetNetWork,
    .right-vdcSetNetWork {
      width: 200px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .vdcSetNetWork-content {
        width: 200px;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid #e8e8e8;
        padding: 5px;
        overflow: auto;
        .el-checkbox-group {
          display: flex;
          flex-direction: column;

          .el-checkbox {
            margin: 0px;
          }
        }
      }
    }
    .cneter-vdcSetNetWork {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin: 0 15px;
      .vdcSetNetWork-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid;
        font-size: 20px;
        font-weight: 400;
        background-color: transparent;
        border-color: #e8e8e8;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .vdcSetNetWork-btn:hover {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
  }
}
</style>
