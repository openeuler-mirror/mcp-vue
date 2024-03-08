<template>
  <div class="networkconfig app-container">
    <!-- 头部菜单栏 -->
    <header-bar
      ref="headerBar"
      @refreshTable="refreshTable"
      @handleToCreateNewNetwork="handleToCreateNewNetwork"
    />
    <mc-table
      ref="networkTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
      style="margin-top: 20px"
    >
      <template>
        <el-table-column
          v-for="(item, index) in columnArr"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != columnArr.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              effect="light"
              :content="row[item.prop] + ''"
              placement="top"
              :visible-arrow="true"
            >
              <span>{{ row[item.prop] }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>

      <!-- <el-table-column
        :label="$t('common.operation')"
        min-width="100px"
        className="tableoperation"
      >
        <template slot-scope="{ row }">
          <el-link
            v-if="currentBtnShow('modify_network')"
            type="primary"
            @click="editInfo(row)"
          >
            {{ $t("common.modify") }}
          </el-link>
          <el-link
            v-if="currentBtnShow('delete_network')"
            type="primary"
            @click="deleteInfo(row)"
          >
            {{ $t("common.delete") }}
          </el-link>
        </template>
      </el-table-column> -->
    </mc-table>
    <!-- 新建网络设置 -->
    <create-network-drawer :visible.sync="showCreateNewNetworkDrawer" />
  </div>
</template>

<script>
import { pageNetworkConfig } from "@/api/networkConfig";
import headerBar from "./header-bar";
import mcTable from "@/components/MctablePro";
import createNetworkDrawer from "./drawer/create-network-drawer";
export default {
  name: "network",
  components: {
    headerBar,
    mcTable,
    createNetworkDrawer,
  },
  data() {
    return {
      rowkey: "networkId",
      columnArr: [
        {
          label: this.$t("authorityMgr.netWorkSet.ID"), // "ID",
          prop: "networkId",
          width: "50px",
        },
        {
          label: this.$t("authorityMgr.vdcName"), // "VDC名称",
          prop: "vdcName",
          width: "150px",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.networkName"), // "网络名称",
          prop: "networkName",
          width: "150px",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.interfaceType"), // "网络类型",
          prop: "interfaceType",
          width: "150px",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.virtualSwitch"), // "虚拟交换机",
          prop: "virtualSwitch",
          width: "150px",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.modelType"), // "网卡类型",
          prop: "modelType",
          width: "100px",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.addressPool"), // "地址池",
          prop: "addressPool",
          width: "150px",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.portGroup"), // "端口组",
          prop: "portGroup",
          width: "150px",
        },
        {
          label: this.$t("authorityMgr.netWorkSet.securityGroup"), // "安全组",
          prop: "securityGroup",
          width: "150px",
        },
        {
          label: this.$t("common.createTime"), // "创建时间",
          prop: "createTime",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      showCreateNewNetworkDrawer: false, // 是否显示创建新网络设置
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
    handleToCreateNewNetwork() {
      this.showCreateNewNetworkDrawer = true;
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.renderTable();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.renderTable();
    },
    // 刷新表格
    refreshTable() {
      this.renderTable();
    },
    renderTable() {
      let pageNo = this.pageNo;
      let pageSize = this.pageSize;
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      pageNetworkConfig({ pageNo, pageSize })
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.timeStamp = new Date();
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
        });
    },
    editInfo(row) {},
    // 删除
    deleteInfo(row) {
      let clusterEdleteConfirm = "确定删除该网卡吗?"; // 确定删除该网卡吗?
      let clusterEdleteSuccess = "删除成功"; // "删除成功!"
      this.$confirm(clusterEdleteConfirm, this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          // deleteOrg({ orgId: row.organizationId })
          //   .then((res) => {
          //     this.alertTips(clusterEdleteSuccess, "success");
          //     this.renderTable();
          //   })
          //   .catch((err) => {
          //     this.alertTips(err);
          //   });
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
        });
    },
  },
};
</script>
