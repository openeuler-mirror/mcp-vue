<template>
  <div class="drawer-content">
    <div class="bind-table">
      <mc-table
        ref="bindVdcTable"
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        @handleSelectione="handleSelectione"
        :rowkey="rowkey"
        selectionType="singleTable"
        style="margin-top: 20px"
      >
        <template v-for="(item, index) in columnArr">
          <el-table-column
            :key="index"
            :resizable="index != 0 && index != columnArr.length - 1"
            :label="item.label"
            :width="item.width"
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
</template>
<script>
import mcTable from "@/components/MctablePro";
import footBtn from "@/components/Footbtn";
import { listNetworkListByVdcId } from "@/api/vdcapi";

export default {
  components: { mcTable, footBtn },
  props: {
    vdcparentId: {
      type: String,
      default: "",
    },
    formOptions: {
      type: Object,
      default: () => ({}),
    },
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      input: "",
      rowkey: "networkId",
      columnArr: [
        {
          label: this.$t("authorityMgr.netWorkSet.networkName"), // "网络名称",
          prop: "networkName",
          tooltipsFlag: true,
        },
        {
          label: this.$t("authorityMgr.netWorkSet.interfaceType"), // "网络类型",
          prop: "interfaceType",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.virtualSwitch"), // "虚拟交换机",
          prop: "virtualSwitch",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.modelType"), // "网卡类型",
          prop: "modelType",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.addressPool"), // "地址池",
          prop: "addressPool",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.portGroup"), // "端口组",
          prop: "portGroup",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.securityGroup"), // "安全组",
          prop: "securityGroup",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.clusterName"), //  // "集群名称",
          prop: "clusterName",
          tooltipsFlag: true,
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      oriFormData: "",
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.getVdcList();
  },
  computed: {},
  methods: {
    // 提交
    handlerConfirm() {
      this.commitCreate();
    },
    commitCreate() {
      let { formData } = this.formOptions;
      this.oriFormData = formData;
      this.oriFormData.addressPool = this.selectList[0].addressPool;
      this.oriFormData.clusterId = this.selectList[0].clusterId;
      this.oriFormData.clusterName = this.selectList[0].clusterName;
      this.oriFormData.createTime = this.selectList[0].createTime;
      this.oriFormData.interfaceType = this.selectList[0].interfaceType;
      this.oriFormData.modelType = this.selectList[0].modelType;
      this.oriFormData.networkId = this.selectList[0].networkId;
      this.oriFormData.networkName = this.selectList[0].networkName;
      this.oriFormData.portGroup = this.selectList[0].portGroup;
      this.oriFormData.portGroupUuid = this.selectList[0].portGroupUuid;
      this.oriFormData.securityGroup = this.selectList[0].securityGroup;
      this.oriFormData.securityGroupUuid = this.selectList[0].securityGroupUuid;
      this.oriFormData.vdcName = this.selectList[0].vdcName;
      this.oriFormData.virtualSwitch = this.selectList[0].virtualSwitch;
      this.$emit("confirm", this.oriFormData);
      this.$parent.closeDrawer();
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
    getVdcList() {
      listNetworkListByVdcId({ vdcId: this.vdcparentId })
        .then((res) => {
          this.tableData = res;
          let selected = [];

          let { editflag, formData } = this.formOptions;
          selected.push(formData.networkId);
          this.$nextTick(() => {
            for (let i = 0; i < selected.length; i++) {
              let row = this.tableData.find(
                (item) => item.networkId.toString() === selected[i].toString()
              );
              if (row) {
                this.selectList = [row];
                this.$refs.bindVdcTable.$refs.elTable.toggleRowSelection(row);
              }
            }
          });
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    handlePageChange() {},
    handleSizeChange() {},
    handleSelectione(rows) {
      this.selectList = rows;
    },
  },
};
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
  max-height: 82vh;
  padding: 0 50px;
}
</style>
