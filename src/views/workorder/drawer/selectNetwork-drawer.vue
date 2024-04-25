<template>
  <!-- 选择网络信息 -->
  <el-drawer
    size="800px"
    :title="$t('workOrder.chooseNetworkInfo')"
    direction="rtl"
    :wrapper-closable="true"
    :visible.sync="drawerVisible"
    :before-close="handleCloseSelectNetwork"
    :destroy-on-close="true"
    append-to-body
    @opened="setTableSelectedNetwork"
  >
    <div class="drawer-content">
      <div class="bind-table">
        <mc-table
          ref="multiTable"
          :data="networkList"
          :rowkey="rowkey"
          :selection-type="selectionType"
          style="margin-top: 20px"
          @selection-change="handlerSelectionNetworkChange"
        >
          <template v-for="(item, index) in columnArr">
            <el-table-column
              v-if="item.prop == 'securityPolicy'"
              :key="index"
              :label="item.label"
              :resizable="index != 0 && index != columnArr.length - 1"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <el-tooltip
                  effect="light"
                  :content="getsecurityPolicyDesc(row[item.prop])"
                  placement="top"
                  :visible-arrow="true"
                >
                  <span>{{ getsecurityPolicyDesc(row[item.prop]) }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="index"
              :label="item.label"
              :width="item.width"
              :resizable="index != 0 && index != columnArr.length - 1"
            >
              <template slot-scope="{ row }">
                <el-tooltip
                  v-if="item.tooltipsFlag"
                  effect="light"
                  :content="row[item.prop] + ''"
                  placement="top"
                  :visible-arrow="true"
                >
                  <span>{{ row[item.prop] }}</span>
                </el-tooltip>
                <span v-else>{{ row[item.prop] }}</span>
              </template>
            </el-table-column>
          </template>
        </mc-table>
      </div>
      <foot-btn
        class="drawer-foot"
        @confirm="handlerConfirm"
        @cancel="handlerCancel"
      />
    </div>
  </el-drawer>
</template>

<script>
import mcTable from '@/components/MctablePro'
import footBtn from '@/components/Footbtn'
import ReMessage from '@/utils/message'
import dictionary from '@/assets/common/dataDictionary/dictionary'
export default {
  components: {
    mcTable,
    footBtn
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    networkList: {
      type: Array,
      default: () => []
    },
    selectedNetworkInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rowkey: 'networkId',
      selectionType: 'singleTable',
      drawerVisible: this.visible,
      selectTable: [],
      selectNetworkName: '',
      selectNetworkId: 0,
      columnArr: [
        // {
        //   label: this.$t("authorityMgr.netWorkSet.ID"), // "ID",
        //   prop: "networkId",
        // },
        {
          label: this.$t('authorityMgr.netWorkSet.networkName'), // "网络名称",
          prop: 'networkName'
        },
        // {
        //   label: this.$t("authorityMgr.netWorkSet.interfaceType"), // "网络类型",
        //   prop: "interfaceType",
        // },
        {
          label: this.$t('authorityMgr.netWorkSet.virtualSwitch'), // "虚拟交换机",
          prop: 'virtualSwitch'
        },
        {
          label: this.$t('authorityMgr.netWorkSet.modelType'), // "网卡类型",
          prop: 'modelType'
        },
        {
          label: this.$t('authorityMgr.netWorkSet.addressPool'), // "地址池",
          prop: 'addressPool'
        },
        {
          label: this.$t('authorityMgr.netWorkSet.portGroup'), // "端口组",
          prop: 'portGroup'
        },
        {
          label: this.$t('resourceMgr.network.securityPolicy'), // "安全策略"
          prop: 'securityPolicy',
          tooltipsFlag: true
        },
        {
          label: this.$t('authorityMgr.netWorkSet.securityGroup'), // "安全组",
          prop: 'securityGroup',
          tooltipsFlag: true
        },
        {
          label: this.$t('resourceMgr.network.virtualFirewallName'), // "虚拟防火墙",
          prop: 'virtualFirewallName',
          tooltipsFlag: true
        }
      ]
    }
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis
    },
    networkList(val) {}
  },
  methods: {
    getsecurityPolicyDesc(securityPolicy) {
      return dictionary.getDesc(securityPolicy, dictionary.securityPolicyArr)
    },
    setTableSelectedNetwork() {
      const selected = this.selectedNetworkInfo.networkId
      this.$refs.multiTable.$refs.elTable.clearSelection()

      const row = this.networkList.find((item) => item.networkId === selected)
      if (row) {
        this.$refs.multiTable.$refs.elTable.toggleRowSelection(row)
      }
    },
    // 表格勾选
    handlerSelectionNetworkChange(selection) {
      this.selectTable = selection
    },

    // 提交
    handlerConfirm() {
      const length = this.selectTable.length
      const errMsg = this.$t('workOrder.pchooseNetworkInfo') // "请至少勾选一个网络配置";
      if (length < 1) {
        ReMessage.error(errMsg)
        return
      }
      const obj = JSON.parse(JSON.stringify(this.selectedNetworkInfo))
      obj.networkId = this.selectTable[0].networkId
      obj.networkName = this.selectTable[0].networkName
      this.$emit('handlerConfirm', obj)
      this.handlerCancel()
    },
    handlerCancel() {
      if (this.selectTable.length > 0) {
        this.$refs.multiTable.$refs.elTable.clearSelection()
      }
      this.selectTable = []
      this.handleCloseSelectNetwork()
    },
    handleCloseSelectNetwork() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scope >
@import "~@/styles/mixin.scss";
@include DrawerRtl;

.bind-table {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  // max-height: 82vh;
  padding: 0 50px;
  .demo-table-expand {
    box-shadow: 0px 0px 4px 3px #ededed;
    padding: 10px;
  }
}
.search-box {
  display: inline-block;
  .el-button {
    margin-left: 15px;
  }
  .small-input-box {
    width: 60px;
    margin-left: 5px;
  }
  .input-box {
    width: 100%;
  }
}
</style>
