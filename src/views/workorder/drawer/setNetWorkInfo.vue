<template>
  <!-- 设置网卡信息 -->
  <div class="setNetWorkInfo-box">
    <!-- 网卡 -->
    <div class="network-group-wrap" v-if="orinetworksShowList.length === 0">
      <el-form-item
        :label="$t('common.network')"
        v-if="orinetworksShowList.length === 0"
      >
        <!-- 该云服务器没有申请，请按需添加网卡 -->
        <span>{{ $t("common.addnetworkMsg") }}</span>
        <i class="el-icon-circle-plus-outline" @click="addNetworkItem" />
      </el-form-item>
    </div>

    <div v-else class="network-group-wrap">
      <el-form-item
        v-for="(item, index) in orinetworksShowList"
        :key="index"
        :label="
          $t('common.network') +
          (orinetworksShowList.length > 1 ? index + 1 : '')
        "
        prop="network"
      >
        <div v-if="item.type === 'custom'">
          <el-input
            :placeholder="item.purpose"
            v-model="item.networkName"
            :disabled="true"
          >
            <el-button slot="append" @click="changeSelectNetwork(item.index)">
              {{ $t("common.select") }}
            </el-button>
          </el-input>
          <i class="el-icon-remove-outline" @click="deleteNetworkItem(item)" />

          <i
            v-if="index === orinetworksShowList.length - 1"
            class="el-icon-circle-plus-outline"
            @click="addNetworkItem"
          />
          <span v-if="item.applyModifyType === 'DELETE'" class="applyDelete">
            <!-- 申请删除 -->
            ({{ $t("common.applyDelete") }})
          </span>
        </div>
        <div v-else class="switch-port-wrap">
          <span>{{ item.purpose }}</span>

          <i
            class="el-icon-remove-outline"
            v-if="item.applyModifyType === 'DELETE'"
            @click="deleteNetworkItem(item)"
          />

          <i
            v-if="index === orinetworksShowList.length - 1"
            class="el-icon-circle-plus-outline"
            @click="addNetworkItem"
          />

          <span v-if="item.applyModifyType === 'DELETE'" class="applyDelete">
            <!-- 申请删除 -->
            ({{ $t("common.applyDelete") }})
          </span>
        </div>

        <div class="bingIp" v-if="showbingIpBox">
          <div class="bingIp-warp">
            <el-checkbox
              :disabled="item.networkruleForm.automaticAcqIp"
              v-model="item.networkruleForm.ipBindMac"
            >
              <!-- IP/MAC绑定 -->
              {{ $t("workOrder.ipSet.ipBindMac") }}
            </el-checkbox>
            <el-checkbox
              :disabled="item.networkruleForm.automaticAcqIp"
              v-model="item.networkruleForm.manualSetIp"
            >
              <!-- 手动 -->
              {{ $t("workOrder.ipSet.manual") }}
            </el-checkbox>
            <el-checkbox
              :disabled="
                item.networkruleForm.manualSetIp ||
                item.networkruleForm.ipBindMac
              "
              v-model="item.networkruleForm.automaticAcqIp"
            >
              <!-- 自动 -->
              {{ $t("workOrder.ipSet.auto") }}
            </el-checkbox>

            <el-tooltip
              :content="$t('workOrder.ipSet.tooltip')"
              placement="top-start"
            >
              <i class="kcp-infoQues icon-infoQues" />
            </el-tooltip>
          </div>
          <div v-if="!item.networkruleForm.automaticAcqIp">
            <el-form
              :model="item.networkruleForm"
              :rules="networkruleFormrules"
              :ref="'ruleForm' + index"
              label-width="auto"
            >
              <!-- IP地址 -->
              <el-form-item
                v-if="
                  item.networkruleForm.ipBindMac ||
                  item.networkruleForm.manualSetIp
                "
                :label="$t('workOrder.ipSet.ip')"
                prop="ip"
              >
                <el-input v-model="item.networkruleForm.ip"></el-input>
              </el-form-item>
              <!-- 子网掩码 -->
              <el-form-item
                v-if="item.networkruleForm.manualSetIp"
                :label="$t('workOrder.ipSet.mask')"
                prop="mask"
              >
                <el-input v-model="item.networkruleForm.mask"></el-input>
              </el-form-item>
              <!-- 默认网关 -->
              <el-form-item
                v-if="item.networkruleForm.manualSetIp"
                :label="$t('workOrder.ipSet.gw')"
                prop="gw"
              >
                <el-input v-model="item.networkruleForm.gw"></el-input>
              </el-form-item>
              <!-- 首选DNS -->
              <el-form-item
                v-if="item.networkruleForm.manualSetIp"
                :label="$t('workOrder.ipSet.dns1')"
                prop="dns1"
              >
                <el-input v-model="item.networkruleForm.dns1"></el-input>
              </el-form-item>
              <!-- 备用DNS -->
              <el-form-item
                v-if="item.networkruleForm.manualSetIp"
                :label="$t('workOrder.ipSet.dns2')"
                prop="dns2"
              >
                <el-input v-model="item.networkruleForm.dns2"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-form-item>
    </div>
    <!-- 选择网卡 -->
    <selectNetwork-drawer
      :visible.sync="showSelectNetworkDrawer"
      :networkList="networkList"
      :selectedNetworkInfo="selectedNetworkInfo"
      @handlerConfirm="selectNetworkConfirm"
    />
  </div>
</template>
<script>
import selectNetworkDrawer from "./selectNetwork-drawer";
import ReMessage from "@/utils/message";
import validate from "@/utils/validate";
export default {
  components: { selectNetworkDrawer },
  props: ["formData", "pageMode"],
  data() {
    const validIp = (rule, value, callback) => {
      if (value) {
        if (!validate.isValidIP(value)) {
          callback(new Error(rule.message));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      showSelectNetworkDrawer: false,
      selectedNetworkInfo: {},
      networkList: [],
      applyNum: 0,
      showbingIpBox: false,
      // 网卡列表
      orinetworksList: [],
      orinetworksShowList: [],

      networkruleForm: {
        ipBindMac: false,
        manualSetIp: false,
        automaticAcqIp: false,
        ip: "", // ip地址
        mask: "", // 掩码
        gw: "", // 网关
        dns1: "", // dns1
        dns2: "", // dns2
      },
      networkruleFormrules: {
        ip: [
          {
            required: true,
            message: this.$t("workOrder.ipSet.ipNotNull"), // "ip地址不能为空",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("workOrder.ipSet.ipWran"), // "ip地址输入有误",
            validator: validIp,
          },
        ],
        mask: [
          {
            required: true,
            message: this.$t("workOrder.ipSet.maskNotNull"), // "子网掩码不能为空",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("workOrder.ipSet.maskWran"), // "子网掩码输入有误",
            validator: validIp,
          },
        ],
        gw: [
          {
            required: false,
            trigger: "blur",
            message: this.$t("workOrder.ipSet.gwWran"), // "网关输入有误",
            validator: validIp,
          },
        ],
        dns1: [
          {
            required: false,
            trigger: "blur",
            message: this.$t("workOrder.ipSet.dns1Wran"), // "首选DNS输入有误",
            validator: validIp,
          },
        ],
        dns2: [
          {
            required: false,
            trigger: "blur",
            message: this.$t("workOrder.ipSet.dns2Wran"), // "备用DNS输入有误",
            validator: validIp,
          },
        ],
      },
      cmtnetworkList: [],
    };
  },

  created() {},
  mounted() {
    if (this.formData) {
      this.setPageDefaultData(this.formData);
    }
  },
  watch: {
    formData(val) {
      this.setPageDefaultData(val);
    },
  },
  // watch: {
  //   data: {
  //     handler: function (newValue, oldValue) {
  //       if (newValue) {
  //         this.$refs.elTable.clearSelection();
  //         this.tableData = newValue;
  //         this.toggleSelection();
  //         this.$nextTick(() => {
  //           this.calcTableHeight();
  //         });
  //       }
  //     },
  //     // 代表在wacth里声明了 立即先去执行handler方法
  //     immediate: false,
  //     deep: true,
  //   },
  // },
  methods: {
    setPageDefaultData(defaultData) {
      if (JSON.stringify(defaultData) == "{}") {
        return;
      } else {
        let { interfaceList, applyNum, networkConfigList } = defaultData;

        switch (this.pageMode) {
          case "TEMPADD": // 模板新增
            if (applyNum == 1) {
              this.showbingIpBox = true;
            }
            break;
          case "ISOADD": // ISO新增
            this.showbingIpBox = false;
            break;
          case "CHANGE": // 变更
            this.showbingIpBox = true;
            break;

          default:
            this.showbingIpBox = false;
            break;
        }
        this.applyNum = applyNum;
        this.networkList = networkConfigList;
        this.dealnetworksListIndex(interfaceList);
      }
    },
    dealnetworksListIndex(networksList) {
      networksList.forEach((element, index) => {
        element.index = index;
        if (this.showbingIpBox) {
          element.networkruleForm = JSON.parse(
            JSON.stringify(this.networkruleForm)
          );
        }
      });
      this.orinetworksList = JSON.parse(JSON.stringify(networksList));

      this.dealnetworksList(this.orinetworksList);
    },
    dealnetworksList(oriList) {
      let list = [];

      let filtermodifyType = ["DELETE", "ADDDELETE"];
      oriList.forEach((element) => {
        let { modifyType } = element;
        if (filtermodifyType.indexOf(modifyType) == -1) {
          list.push(element);
        }
      });
      this.orinetworksShowList = list;
    },
    // 选择网卡
    changeSelectNetwork(index) {
      this.showSelectNetworkDrawer = true;
      this.selectedNetworkInfo = this.orinetworksList[index];
    },
    selectNetworkConfirm(val) {
      let { index } = val;
      this.orinetworksList[index] = val;
      this.dealnetworksList(this.orinetworksList);
    },
    // 添加网卡
    addNetworkItem() {
      let length = this.orinetworksShowList.length;

      let networkNumMaxMsg = this.$t("common.networkNumMaxMsg"); // "磁盘数目已达上限";
      let networkpurpose = this.$t("common.networkpurpose"); // "请选择网络配置";
      if (length >= 4) {
        this.alertTips(networkNumMaxMsg);
        return false;
      }
      let index = this.orinetworksList.length;
      this.orinetworksList.push({
        purpose: networkpurpose,
        networkName: "",
        networkId: 0,
        type: "custom",
        modifyType: "ADD",
        applyId: 0,
        index: index,
        networkruleForm: JSON.parse(JSON.stringify(this.networkruleForm)),
      });

      this.dealnetworksList(this.orinetworksList);
    },
    // 删除网卡
    deleteNetworkItem(deleteitem) {
      let { modifyType, applyId, index } = deleteitem;
      if (modifyType == "ADD" && applyId == 0) {
        this.orinetworksList[index].modifyType = "ADDDELETE";
      } else {
        this.orinetworksList[index].modifyType = "DELETE";
      }
      this.dealnetworksList(this.orinetworksList);
    },
    // 检验ip等数据
    checkIpvalidate() {
      let flag = true;
      let refs = this.$refs;
      for (let key in refs) {
        if (key.indexOf("ruleForm") > -1) {
          this.$refs[key][0] &&
            this.$refs[key][0].validate((valid) => {
              if (valid) {
                flag = true;
              } else {
                flag = false;
              }
            });
        }
      }
      return flag;
    },
    submitForm() {
      let flag = true;
      if (this.showbingIpBox) {
        if (!this.checkIpvalidate()) {
          flag = false;
          return flag;
        }
      }

      let filtermodifyType = ["DELETE", "ADDDELETE"];
      let networks = this.orinetworksList;
      let networkList = [];
      let networkpurpose = this.$t("common.networkpurpose"); // "请选择网络配置";
      for (let i = 0; i < networks.length; i++) {
        let { modifyType } = networks[i];
        if (modifyType !== "ADDDELETE") {
          let network = {};
          network.type = networks[i].type;
          network.interfaceType = networks[i].interfaceType;
          network.virtualSwitch = networks[i].virtualSwitch;
          network.portGroup = networks[i].portGroup;
          network.portGroupUuid = networks[i].portGroupUuid;
          network.modelType = networks[i].modelType;
          network.modifyType = networks[i].modifyType;
          network.macAddressPool = networks[i].macAddressPool;
          network.applyId = networks[i].applyId;
          network.networkId = networks[i].networkId;
          network.networkName = networks[i].networkName;
          network.id = networks[i].id || 0;
          if (networks[i].type === "custom") {
            if (
              networks[i].networkId === 0 &&
              filtermodifyType.indexOf(network.modifyType) == -1
            ) {
              ReMessage.error(networkpurpose);
              flag = false;
              break;
            }
            network.networkId = networks[i].networkId;
            network.networkName = networks[i].networkName;
          }

          if (this.showbingIpBox) {
            // 处理ip等数据
            // ipBindMac; // ip和mac绑定  false:为未勾选  true：勾选
            // manualSetIp; // 手动设置ip false:为未勾选  true：勾选
            // automaticAcqIp; // 自动DHCP false:为未勾选  true：勾选

            let { networkruleForm } = networks[i];
            network.ipBindMac = networkruleForm.ipBindMac;
            network.manualSetIp = networkruleForm.manualSetIp;
            network.automaticAcqIp = networkruleForm.automaticAcqIp;
            network.ip = networkruleForm.ip;
            network.mask = networkruleForm.mask; // 掩码
            network.gw = networkruleForm.gw; // 网关
            network.dns1 = networkruleForm.dns1; // dns1
            network.dns2 = networkruleForm.dns2; // dns2
          }

          network.securityStrategy = networks[i].securityStrategy; // 安全策略
          network.securityGroupUuid = networks[i].securityGroupUuid; // 安全组
          network.virtualFirewall = networks[i].virtualFirewall; // 虚拟防火墙
          network.mtuCount = networks[i].mtuCount; // mtu值
          network.queueCount = networks[i].queueCount; // 网卡多队列

          networkList.push(network);
        }
      }
      this.cmtnetworkList = networkList;
      return flag;
    },
    resetForm() {
      this.showSelectNetworkDrawer = false;
      this.selectedNetworkInfo = {};
      this.networkList = [];
      this.applyNum = 0;
      // 网卡列表
      this.orinetworksList = [];
      this.orinetworksShowList = [];
    },
  },
  beforeDestroy() {
    this.resetForm();
  },
};
</script>

<style lang="scss" scope>
.setNetWorkInfo-box {
  .applyDelete {
    margin-left: 10px;
    font-size: 8px;
    color: rgb(226, 111, 17);
  }
  .switch-port-wrap,
  .bingIp-warp {
    display: flex;
    align-items: center;
  }
  .bingIp-warp {
    .el-checkbox__label {
      padding-left: 5px;
    }
    .el-checkbox {
      margin-right: 15px;
    }
    .el-tooltip {
      margin-left: 0;
    }
  }
}
</style>