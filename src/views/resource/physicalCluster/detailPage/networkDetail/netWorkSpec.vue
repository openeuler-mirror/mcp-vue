<template>
  <el-drawer
    size="900px"
    :title="formOptions.editflag ? '编辑网络规格' : '创建网络规格'"
    direction="rtl"
    :wrapperClosable="false"
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content">
        <!-- 物理集群 网络名称 描述 网络层及 网卡类型 MAC地址池 虚拟交换机 端口组 队列个数 MTU -->
        <el-form
          ref="createnetworkDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <el-form-item
            :label="$t('resourceMgr.network.cluster')"
            prop="clusterId"
          >
            <el-select
              v-model="createDataFormData.clusterId"
              disabled
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
          <!-- 描述 -->
          <el-form-item
            :label="$t('resourceMgr.vMwareMgr.remark')"
            prop="remark"
          >
            <el-input
              type="textarea"
              maxlength="400"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
              :placeholder="$t('common.placeholder')"
              v-model="createDataFormData.remark"
            >
            </el-input>
          </el-form-item>
          <!-- 网络层级 -->
          <el-form-item
            :label="$t('resourceMgr.network.networkHierarchy')"
            prop="networkLevelType"
          >
            <el-radio-group v-model="createDataFormData.networkLevelType">
              <el-radio label="LAYER_2_NETWORK">{{
                $t("resourceMgr.network.netSpecSec")
              }}</el-radio>
              <el-radio
                :disabled="!l3NetworkList || l3NetworkList.length === 0"
                label="LAYER_3_NETWORK"
                >{{ $t("resourceMgr.network.netSpec3rd") }}</el-radio
              >
            </el-radio-group>
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
          <!-- 网络类型 -->
          <el-form-item
            v-if="createDataFormData.networkLevelType === 'LAYER_2_NETWORK'"
            :label="$t('resourceMgr.network.networkType')"
            prop="interfaceType"
          >
            <el-select
              v-model="createDataFormData.interfaceType"
              :placeholder="$t('resourceMgr.network.selectnetworkType')"
            >
              <el-option
                v-for="(item, index) in interfaceTypeList"
                :key="'type' + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- MAC地址池 -->
          <el-form-item
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
            v-if="
              createDataFormData.networkLevelType === 'LAYER_2_NETWORK' &&
              createDataFormData.interfaceType !== 'NAT'
            "
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
            v-if="
              createDataFormData.networkLevelType === 'LAYER_2_NETWORK' &&
              createDataFormData.interfaceType !== 'NAT'
            "
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
          <el-form-item
            v-if="createDataFormData.networkLevelType === 'LAYER_2_NETWORK'"
            :label="$t('resourceMgr.network.securityPolicy')"
            prop="securityPolicy"
          >
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
            v-if="
              createDataFormData.securityPolicy == 'SECURITY_GROUP' &&
              createDataFormData.networkLevelType === 'LAYER_2_NETWORK'
            "
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
            v-if="
              createDataFormData.securityPolicy == 'VIRTUAL_FIREWALL' &&
              createDataFormData.networkLevelType === 'LAYER_2_NETWORK'
            "
            :label="$t('resourceMgr.network.virtualFirewallName')"
            prop="virtualFirewallName"
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
          <!-- IP获取 -->
          <el-form-item
            v-if="createDataFormData.networkLevelType === 'LAYER_3_NETWORK'"
            label="IP获取"
            prop="IPGet"
          >
            <el-radio-group v-model="networkLevelType">
              <el-radio label="auto"
                >{{ $t("resourceMgr.network.auto") }}（DHCP）</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!-- 三层网络 -->
          <el-form-item
            v-if="createDataFormData.networkLevelType === 'LAYER_3_NETWORK'"
            :label="$t('resourceMgr.network.netSpec3rd')"
            prop="threeLayerNetworkName"
          >
            <el-input
              v-model="createDataFormData.threeLayerNetworkName"
              disabled
              class="input-with-select"
            >
              <template #append>
                <el-button @click="openSelectModal('LAYER_3_NETWORK')">
                  {{ $t("common.select") }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <div class="high-set" @click="highLevelSet = !highLevelSet">
            <i
              style="font-size: 12px"
              :class="[
                highLevelSet ? 'el-icon-caret-top' : 'el-icon-caret-bottom',
              ]"
            ></i>
            {{ $t("resourceMgr.network.advacedSetting") }}
          </div>
          <!-- 队列个数 -->
          <el-form-item
            v-if="highLevelSet"
            :label="$t('resourceMgr.network.numberOfQueues')"
            prop="queueCount"
          >
            <el-input-number
              v-model="createDataFormData.queueCount"
              v-only-num
              type="number"
              :min="1"
              controls-position="right"
              :placeholder="$t('resourceMgr.network.numberOfQueues')"
            />
          </el-form-item>
          <!-- MTU -->
          <el-form-item v-if="highLevelSet" label="MTU" prop="mtuValue">
            <el-input-number
              v-only-num
              :min="1000"
              :max="9000"
              controls-position="right"
              v-model="createDataFormData.mtuValue"
              type="number"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer-foot">
        <el-button type="primary" @click="handelVaild">
          {{ $t("externalCloud.vmOperate.sure") }}
        </el-button>
        <el-button @click="handelClose">
          {{ $t("externalCloud.vmOperate.cancel") }}
        </el-button>
      </div>
    </div>
    <!-- 安全策略 -->
    <bindVirtualFirewall
      :visible.sync="openVirtualFirewall"
      :defaultTableData="virtualFirewallTableData"
      :defaultSelectedKeys="virtualFirewallSelectedKeys"
      @confirm="virtualFirewallconfirm"
    >
    </bindVirtualFirewall>
    <!-- 三层网络 -->
    <mcL3Network
      :visible.sync="openMcL3Network"
      :l3NetworkList="l3NetworkList"
      :defaultTableData="mcL3NetworkTableData"
      :defaultSelectedKeys="mcL3NetworkSelectedKeys"
      @confirm="mcL3NetworkConfirm"
    ></mcL3Network>
  </el-drawer>
</template>
<script>
import {
  zoneClusterList,
  clusterNetworkConfig,
  handelSubmitSpec,
  handelmodifySpecDetail,
  mcPortGroupListByVirtualSwitch,
} from "@/api/vdcapi";
import dictionary from "@/assets/common/dataDictionary/dictionary";
import mcL3Network from "./mcL3Network.vue";
import bindVirtualFirewall from "./bindVirtualFirewall/bindVirtualFirewallModal.vue";
export default {
  name: "",
  components: { bindVirtualFirewall, mcL3Network },
  props: {
    dataInfo: {
      type: Object,
      default: {},
    },
    formOptions: {
      type: Object,
      default: {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      drawerLoading: false,
      btniconLeft: ">",
      btniconRight: "<",
      leftcheckList: [],
      leftGroupList: [],
      rightcheckList: [],
      rightGroupList: [],
      clusterList: [],
      pagepoolList: [],
      networkLevelType: "auto",
      pageseGroupList: [], // 安全组
      pageviSwitchList: [],
      pageportGroupList: [], // 端口组
      createDataFormData: {
        networkLevelType: "LAYER_2_NETWORK",
        securityPolicy: "NONE",
        mtuValue: 1500,
        queueCount: 1,
      },
      highLevelSet: false,
      interfaceTypeList: [
        {
          label: "Bridge",
          value: "bridge",
        },
        {
          label: "NAT",
          value: "NAT",
        },
      ],
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
        networkLevelType: [
          {
            required: true,
            message: this.$t("resourceMgr.selectNetLevel"), // "请选择端口组",
            trigger: "blur",
          },
        ],
        modelType: [
          {
            required: true,
            message: this.$t("resourceMgr.network.modelTypeplac"), // "请选择网卡类型",
            trigger: "blur",
          },
        ],
        interfaceType: [
          {
            required: true,
            message: this.$t("resourceMgr.network.selectnetworkType"), // "请选择网络类型",
            trigger: "blur",
          },
        ],
        securityPolicy: [
          {
            required: true,
            message: this.$t("resourceMgr.selectSecPolicy"), // "请选择安全策略",
            trigger: "blur",
          },
        ],
        virtualFirewallName: [
          {
            required: true,
            message: this.$t("resourceMgr.selectVirFirewall"), // "请选择虚拟防火墙",
            trigger: ["blur", "change"],
          },
        ],
        threeLayerNetworkName: [
          {
            required: true,
            message: this.$t("resourceMgr.selectThreeLayerNet"), // "请选择三层网络",
            trigger: ["blur", "change"],
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
      l3NetworkList: [],
      // 安全策略列表
      securityPolicyList: dictionary.securityPolicyArr,
      openVirtualFirewall: false,
      openMcL3Network: false,
      virtualFirewallTableData: [],
      mcL3NetworkTableData: [],
      virtualFirewallSelectedKeys: [],
      mcL3NetworkSelectedKeys: [],
      pageVirtualFirewallList: [],
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      //初始化
      isvis ? this.intPage() : "";
    },
  },
  methods: {
    intPage() {
      //初始化页面集群数据
      const { name, clusterId } = this.dataInfo;
      this.rightGroupList = [];
      this.leftGroupList = [];
      this.leftcheckList = [];
      this.rightcheckList = [];
      this.virtualFirewallTableData = [];
      this.clusterList = [
        {
          label: name,
          value: clusterId,
        },
      ];
      this.createDataFormData.clusterId = clusterId;
      let { editflag, formData } = this.formOptions;
      if (editflag) {
        this.$set(
          this,
          "createDataFormData",
          JSON.parse(JSON.stringify(formData))
        );
        this.$forceUpdate();
      }
      this.setPageData();
    },
    setPageData() {
      let clusterId = this.createDataFormData.clusterId;
      let virtualSwitch = this.createDataFormData.virtualSwitch;
      this.clusterIdchange(clusterId);
      if (virtualSwitch) {
        this.virtualSwitchchange(virtualSwitch);
      }
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
    handelClose() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
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
    // 设置虚拟防火墙数据
    setVirtualFirewallList(virtualFirewallList) {
      if (virtualFirewallList && virtualFirewallList.length > 0) {
        this.virtualFirewallTableData = virtualFirewallList;
      } else {
        this.virtualFirewallTableData = [];
      }
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
      this.leftcheckList = securityGroupUuid
        ? securityGroupUuid.split(",")
        : [];
      this.getLeftCheckedKeys();
    },
    setNonedata() {
      this.createDataFormData.virtualFirewallId = 0;
      this.createDataFormData.virtualFirewallName = "";
      this.createDataFormData.securityGroupUuid = "";
      this.createDataFormData.securityGroup = "";
      this.setSecurityGroupList(this.pagesecurityGroupList);
      this.setVirtualFirewallList(this.pageVirtualFirewallList);
    },

    getLeftCheckedKeys() {
      let checkedList = JSON.parse(JSON.stringify(this.leftcheckList));
      this.rightGroupList = [];
      this.rightcheckList = [];
      this.pageseGroupList.forEach((element) => {
        if (checkedList.indexOf(element.value) > -1) {
          this.rightGroupList.push(element);
          this.rightcheckList.push(element.value);
        }
      });
    },
    getRightCheckedKeys() {
      let checkedList = JSON.parse(JSON.stringify(this.rightcheckList));
      this.rightGroupList = [];
      this.leftcheckList = [];
      this.pageseGroupList.forEach((element) => {
        if (checkedList.indexOf(element.value) > -1) {
          this.rightGroupList.push(element);
          this.leftcheckList.push(element.value);
        }
      });
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
      clusterNetworkConfig({ clusterId: clusterId })
        .then((res) => {
          let poolList = [];
          let viSwitchList = [];
          const {
            addressPoolList,
            securityGroupList,
            virtualSwitchList,
            virtualFirewallList,
            l3NetworkList,
          } = res;
          this.l3NetworkList = l3NetworkList;
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
          console.error(err);
          this.alertTips(err);
        });
    },
    //地址池切换
    addressPoolIdchange(clusterId) {
      this.pagepoolList.forEach((element) => {
        let { label, value } = element;
        if (clusterId == value) {
          this.createDataFormData.addressPoolId = value;
          this.createDataFormData.addressPool = label;
          this.$forceUpdate();
        }
      });
    },
    portGroupUuidchange(portGroupUuid) {
      this.pageportGroupList.forEach((element) => {
        let { label, value } = element;
        if (portGroupUuid == value) {
          this.createDataFormData.portGroupUuid = value;
          this.createDataFormData.portGroup = label;
          this.$forceUpdate();
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
        case "LAYER_3_NETWORK":
          // 打开虚拟防火墙
          if (this.createDataFormData.threeLayerNetworkId) {
            const newSelect = [
              {
                threeLayerNetworkId:
                  this.createDataFormData.threeLayerNetworkId,
                threeLayerNetworkName:
                  this.createDataFormData.threeLayerNetworkName,
                threeLayerNetworkType:
                  this.createDataFormData.threeLayerNetworkType,
              },
            ];
            this.$set(this, "mcL3NetworkSelectedKeys", newSelect);
          }

          this.openMcL3Network = true;
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
    mcL3NetworkConfirm(selectlist) {
      let selected = selectlist[0];
      const { mcL3NetworkType, mcL3NetworkId, mcL3NetworkName } = selected;
      this.$set(
        this.createDataFormData,
        "threeLayerNetworkType",
        mcL3NetworkType
      );
      this.$set(this.createDataFormData, "threeLayerNetworkId", mcL3NetworkId);
      this.$set(
        this.createDataFormData,
        "threeLayerNetworkName",
        mcL3NetworkName
      );
      const newSelect = [
        {
          threeLayerNetworkId: mcL3NetworkId,
          threeLayerNetworkName: mcL3NetworkName,
          threeLayerNetworkType: mcL3NetworkType,
        },
      ];
      this.$set(this, "mcL3NetworkSelectedKeys", newSelect);
    },
    //提交前进行参数校验
    handelVaild() {
      this.$refs.createnetworkDataForm.validate((valid) => {
        if (valid) {
          this.handelSubmit();
        } else {
          return false;
        }
      });
    },
    handelSubmit() {
      /**
       * clusterId 集权id -通用
       * networkName 网络名称-通用
       * remark 备注-通用
       * networkLevelType 网络层级-通用
       * modelType 网卡类型-通用
       * addressPool  mac地址池-通用
       * addressPoolId mac地址池id-通用
       * queueCount 多队列-通用
       * mtuValue mtu-通用
       * interfaceType 网络类型-二级
       * virtualSwitch 虚拟交换机
       * portGroup 端口组
       * portGroupUuid 端口组uuid
       * securityPolicy 安全策略
       * securityGroup 安全组    用逗号 拼接
       * securityGroupUuid 安全组uuid    用逗号 拼接
       * virtualFirewallId 虚拟防火墙id
       * virtualFirewallName 虚拟防火墙名称
       * threeLayerNetworkId mc3层网络id
       * threeLayerNetworkName mc3层网络名称
       * threeLayerNetworkType mc3层网络类型
       * **/

      const {
        clusterId,
        networkName,
        remark,
        networkLevelType,
        modelType,
        addressPool,
        addressPoolId,
        queueCount,
        mtuValue,
      } = this.createDataFormData;
      //先把通用的参数生成
      let params = {
        clusterId,
        networkName,
        remark,
        networkLevelType,
        modelType,
        addressPool,
        addressPoolId,
        queueCount,
        mtuValue,
      };
      if (networkLevelType === "LAYER_2_NETWORK") {
        const {
          interfaceType,
          virtualSwitch,
          portGroup,
          portGroupUuid,
          securityPolicy,
          securityGroup,
          securityGroupUuid,
          virtualFirewallId,
          virtualFirewallName,
        } = this.createDataFormData;
        params = {
          ...params,
          interfaceType,
          virtualSwitch,
          portGroupUuid,
          securityPolicy,
          portGroup,
          portGroupUuid,
        };
        switch (securityPolicy) {
          //安全组
          case "SECURITY_GROUP":
            if (this.rightcheckList.length === 0) {
              this.$message.error(this.$t("resourceMgr.selectEffectGroup"));
              return;
            }
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
            params.securityGroup = securityGroup.toString();
            params.securityGroupUuid = securityGroupUuid.toString();
            break;
          //防火墙
          case "VIRTUAL_FIREWALL":
            break;
        }
      } else {
        const {
          threeLayerNetworkId,
          threeLayerNetworkName,
          threeLayerNetworkType,
        } = this.createDataFormData;
        params.threeLayerNetworkId = threeLayerNetworkId;
        params.threeLayerNetworkName = threeLayerNetworkName;
        params.threeLayerNetworkType = threeLayerNetworkType;
      }
      if (this.formOptions.editflag) {
        params.networkSpecId = this.formOptions.formData.networkSpecId;
        handelmodifySpecDetail(params).then((res) => {
          this.$message.success(
            this.$t("resourceMgr.network.netSpecEditSuccess")
          );
          this.$emit("freshTable");
          this.handelClose();
        });
      } else {
        handelSubmitSpec(params).then((res) => {
          this.$message.success(
            this.$t("resourceMgr.network.netSpecCreatSuccess")
          );
          this.$emit("freshTable");
          this.handelClose();
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.top-title {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 15px;
}
.drawer-body-content {
  @include formStyle;
}
.disable-input::v-deep input {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
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
.high-set {
  margin-bottom: 18px;
  cursor: pointer;
}
</style>
