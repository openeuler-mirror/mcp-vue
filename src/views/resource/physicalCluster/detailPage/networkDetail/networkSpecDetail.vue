<template>
  <el-drawer
    size="880px"
    :title="$t('resourceMgr.netSepcDetail')"
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
      <div class="detail-content">
        <p>{{ $t("resourceMgr.zoneClusterDesc") }}：</p>
        <p>{{ clusterName }}</p>
      </div>
      <div class="detail-content">
        <p>{{ $t("resourceMgr.networkName") }}：</p>
        <p>{{ net.networkName }}</p>
      </div>
      <div class="detail-content">
        <p>{{ $t("resourceMgr.network.networkHierarchy") }}：</p>
        <p>
          {{
            net.networkLevelType === "LAYER_2_NETWORK" ? >{{$t("resourceMgr.network.netSpecSec")}}
          :>{{ $t("resourceMgr.network.netSpec3rd") }}
          }}
        </p>
      </div>
      <div class="detail-content">
        <p>{{ $t("resourceMgr.network.modelType") }}：</p>
        <p>{{ net.modelType }}</p>
      </div>
      <div
        v-if="net.networkLevelType === 'LAYER_2_NETWORK'"
        class="detail-content"
      >
        <p>{{ $t("resourceMgr.network.networkType") }}：</p>
        <p>{{ net.interfaceType }}</p>
      </div>
      <div class="detail-content">
        <p>{{ $t("resourceMgr.macPool") }}：</p>
        <p>{{ net.addressPool }}</p>
      </div>
      <div
        v-if="net.networkLevelType === 'LAYER_2_NETWORK'"
        class="detail-content"
      >
        <p>{{ $t("resourceMgr.network.virtualSwitch") }}：</p>
        <p>{{ net.virtualSwitch }}</p>
      </div>
      <div
        v-if="net.networkLevelType === 'LAYER_2_NETWORK'"
        class="detail-content"
      >
        <p>{{ $t("resourceMgr.network.portGroup") }}：</p>
        <p>{{ net.portGroup }}</p>
      </div>
      <div
        v-if="net.networkLevelType === 'LAYER_2_NETWORK'"
        class="detail-content"
      >
        <p>{{ $t("resourceMgr.network.securityPolicy") }}:</p>
        <p>{{ getSecVal() }}</p>
      </div>
      <div
        v-if="net.networkLevelType === 'LAYER_3_NETWORK'"
        class="detail-content"
      >
        <p>{{ $t("resourceMgr.layerNet3") }}:</p>
        <p>{{ net.threeLayerNetworkName }}</p>
      </div>
      <div
        v-if="net.networkLevelType === 'LAYER_3_NETWORK'"
        class="detail-content"
      >
        <p>{{ $t("resourceMgr.ipAcq") }}:</p>
        <p>{{ $t("resourceMgr.autoDhcp") }}</p>
      </div>
      <div class="detail-content">
        <p>{{ $t("resourceMgr.network.numberOfQueues") }}：</p>
        <p>{{ net.queueCount }}</p>
      </div>
      <div class="detail-content">
        <p>MTU：</p>
        <p>{{ net.mtuValue }}</p>
      </div>
      <div class="detail-content">
        <p>{{ $t("resourceMgr.zonecreateDate") }}：</p>
        <p>{{ net.createTime }}</p>
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
          text = `${this.$t("resourceMgr.network.virtualFirewallName")}[${
            this.net.virtualFirewallName
          }]`;
          break;
        case "SECURITY_GROUP":
          text = `${this.$t("resourceMgr.network.permission")}[${
            this.net.securityGroup
          }]`;
          break;
        case "NONE":
          text = this.$t("resourceMgr.network.none");
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
}
</style>
