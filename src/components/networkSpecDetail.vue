<template>
  <el-drawer
    size="880px"
    title="网络规格详情"
    direction="rtl"
    :append-to-body="true"
    :modal="false"
    custom-class="setVirtualFirewall"
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :before-close="handleCancel"
    :destroy-on-close="true"
  >
    <div class="drawer-content" v-loading="showLoading">
      <div class="spec-detail">
        <div class="detail-content">
          <p>物理集群：</p>
          <p>{{ net.clusterName }}</p>
        </div>
        <div class="detail-content">
          <p>网络名称：</p>
          <p>{{ net.networkName }}</p>
        </div>
        <div class="detail-content">
          <p>网络层级：</p>
          <p>
            {{
              net.networkLevelType === "LAYER_2_NETWORK"
                ? "二级网络"
                : "三级网络"
            }}
          </p>
        </div>
        <div class="detail-content">
          <p>网卡类型：</p>
          <p>{{ net.modelType }}</p>
        </div>
        <div
          v-if="net.networkLevelType === 'LAYER_2_NETWORK'"
          class="detail-content"
        >
          <p>网络类型：</p>
          <p>{{ net.interfaceType }}</p>
        </div>
        <div class="detail-content">
          <p>mac地址池：</p>
          <p>{{ net.addressPool }}</p>
        </div>
        <div
          v-if="net.networkLevelType === 'LAYER_2_NETWORK'"
          class="detail-content"
        >
          <p>虚拟交换机：</p>
          <p>{{ net.virtualSwitch }}</p>
        </div>
        <div
          v-if="net.networkLevelType === 'LAYER_2_NETWORK'"
          class="detail-content"
        >
          <p>端口组：</p>
          <p>{{ net.portGroup }}</p>
        </div>
        <div
          v-if="net.networkLevelType === 'LAYER_2_NETWORK'"
          class="detail-content"
        >
          <p>安全策略:</p>
          <p>{{ getSecVal() }}</p>
        </div>
        <div
          v-if="net.networkLevelType === 'LAYER_3_NETWORK'"
          class="detail-content"
        >
          <p>三层网络:</p>
          <p>{{ net.threeLayerNetworkName }}</p>
        </div>
        <div
          v-if="net.networkLevelType === 'LAYER_3_NETWORK'"
          class="detail-content"
        >
          <p>IP获取:</p>
          <p>自动（DHCP）</p>
        </div>
        <div class="detail-content">
          <p>队列个数：</p>
          <p>{{ net.queueCount }}</p>
        </div>
        <div class="detail-content">
          <p>MTU：</p>
          <p>{{ net.mtuValue }}</p>
        </div>
        <div class="detail-content">
          <p>创建时间：</p>
          <p>{{ net.createTime }}</p>
        </div>
      </div>
      <div class="drawer-foot footBtn">
        <el-button @click="handleCancel">{{ $t("common.cancel") }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import footBtn from "@/components/Footbtn";
import { handelGetSpecDetail } from "@/api/vdcapi";
export default {
  name: "networkSpecDetail",
  components: { footBtn },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    networkSpecId: {
      type: Number,
      default: null,
    },
    clusterName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      net: {
        networkName: "",
        remark: "",
        networkLevelType: "",
        modelType: "",
        interfaceType: "",
        addressPool: "",
        virtualSwitch: "",
        portGroup: "",
        threeLayerNetworkName: "",
        queueCount: "",
        mtuValue: "",
        createTime: "",
      },
      drawerVisible: this.visible,
      showLoading: false,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      isvis ? this.setPageData() : "";
    },
  },
  methods: {
    setPageData() {
      this.showLoading = true;
      handelGetSpecDetail({ networkSpecId: this.networkSpecId })
        .then((res) => {
          this.net = res;
        })
        .finally((e) => {
          this.showLoading = false;
        });
    },
    getSecVal() {
      let text = "";
      switch (this.net.securityPolicy) {
        case "VIRTUAL_FIREWALL":
          text = `虚拟防火墙[${this.net.virtualFirewallName}]`;
          break;
        case "SECURITY_GROUP":
          text = `安全组[${this.net.securityGroup}]`;
          break;
        case "NONE":
          text = "无";
          break;
      }
      return text;
    },
    handleCancel() {
      this.$emit("update:visible", false);
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.drawer-content {
  .detail-content {
    display: flex;
    align-items: center;
    margin-left: 20px;
    :nth-child(1) {
      width: 120px;
    }
  }
  .spec-detail {
    flex: 1;
  }
}
</style>
