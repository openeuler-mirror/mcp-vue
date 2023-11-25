<template>
  <!-- 物理集群 physicalCluster -->
  <div class="physicalCluster-home app-container">
    <!-- 操作按钮 -->
    <headerBox @refresh="refreshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <el-button v-if="currentBtnShow('create_cluster')" @click="newlyBuild">
          {{ $t("common.add") }}
        </el-button>
      </template>
    </headerBox>
    <mc-table
      ref="physicalClusterTable"
      :tableLoading="tableLoading"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
      style="margin-top: 20px"
    >
      <template v-for="(item, index) in tableColumns">
        <!-- name -->
        <el-table-column
          v-if="item.prop == 'name'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <router-link
              v-if="currentBtnShow('cluster_info')"
              :to="{
                name: 'physicalDetail',
                params: { id: row.clusterId, type: 'physicalDetail' },
              }"
            >
              <el-link type="primary">{{ row.name }}</el-link>
            </router-link>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          v-else-if="item.prop == 'status'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <statuscell :status="row.status"></statuscell>
          </template>
        </el-table-column>
        <!-- CPU分配比  -->
        <el-table-column
          v-else-if="item.prop == 'cpurate'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(row.cpuUsed, row.cpuTotal),
                unit: 'GHZ',
                num: row.cpuUsed,
                total: row.cpuTotal,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 内存分配比 -->
        <el-table-column
          v-else-if="item.prop == 'memoryrate'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(row.memUsed, row.memTotal),
                unit: 'GB',
                num: row.memUsed,
                total: row.memTotal,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 存储分配比 -->
        <el-table-column
          v-else-if="item.prop == 'storagerate'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(
                  row.storageUsed,
                  row.storageTotal
                ),
                unit: 'GB',
                num: row.storageUsed,
                total: row.storageTotal,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.prop == 'operation'"
          fixed="right"
          :key="index"
          :label="item.label"
          :min-width="item.width || '200px'"
          className="tableoperation"
        >
          <template slot-scope="{ row }">
            <!-- <div class="tableoperation"></div> -->
            <el-link
              v-if="row.status == 'ONLINE'"
              type="primary"
              @click="toCluster(row)"
            >
              {{ $t("resourceMgr.toCluster") }}
            </el-link>
            <el-link
              type="primary"
              @click="editInfo(row)"
              v-if="currentBtnShow('modify_cluster')"
            >
              {{ $t("common.modify") }}
            </el-link>
            <el-link
              type="primary"
              @click="deleteInfo(row)"
              v-if="
                row.status === 'OFFLINE' && currentBtnShow('delete_cluster')
              "
            >
              {{ $t("common.delete") }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="item.tooltipsFlag"
              effect="light"
              :content="row[item.prop] || '-'"
              placement="top"
              :visible-arrow="true"
            >
              <span>{{ row[item.prop] }}</span>
            </el-tooltip>
            <span v-else>{{ row[item.prop] || "-" }}</span>
          </template>
        </el-table-column>
      </template>
    </mc-table>

    <!-- 创建/编辑 -->

    <createEditModal
      :options="modalOption"
      :visible.sync="showcreateEditModal"
    ></createEditModal>
  </div>
</template>

<script>
import headerBox from "@/components/headerBox";
import mcTable from "@/components/MctablePro";
import mcAllocationratio from "@/components/Mcallocationratio";
import createEditModal from "./createEditModal/createEditModal";
import statuscell from "../components/statuscell/index.vue";
import {
  pageCluster,
  clusterDetail,
  getQuickLoginUrl,
  deleteCluster,
} from "@/api/clusterapi";
import transformat from "@/utils/transformat";
export default {
  name: "physicalCluster",
  components: {
    headerBox,
    mcTable,
    mcAllocationratio,
    createEditModal,
    statuscell,
  },
  data() {
    return {
      rowkey: "clusterId",
      checkedColumns: [],
      checkedColumns22: [],
      columnArr: [
        // 集群名称
        {
          label: this.$t("resourceMgr.clusterName"),
          prop: "name",
          width: "230px",
        },
        // 集群状态
        { label: this.$t("resourceMgr.clusterStatus"), prop: "status" },
        // 描述
        {
          label: this.$t("resourceMgr.clusterRemark"),
          prop: "remark",
          tooltipsFlag: true,
        },
        // 可用区
        {
          label: this.$t("resourceMgr.zoneName"),
          prop: "zoneName",
          tooltipsFlag: true,
        },
        // 集群URL
        {
          label: this.$t("resourceMgr.clusterUrl"),
          prop: "clusterUrl",
          tooltipsFlag: true,
        },
        // 集群类型
        { label: this.$t("resourceMgr.clustertype"), prop: "type" },
        // CPU利用率
        {
          label: this.$t("resourceMgr.clustercpurate"),
          prop: "cpurate",
          width: 230,
        },
        // 内存利用率
        {
          label: this.$t("resourceMgr.clustermemoryrate"),
          prop: "memoryrate",
          width: 230,
        },
        // 存储利用率
        {
          label: this.$t("resourceMgr.clusterstoragerate"),
          prop: "storagerate",
          width: 230,
        },
        {
          label: this.$t("common.operation"),
          prop: "operation",
          width: 150,
        },
      ],
      tableColumns: [],
      tableData: [],
      tableLoading: false,
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,

      showcreateEditModal: false,
      // 模态框配置
      modalOption: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },
    };
  },
  created() {
    this.tableColumns = this.columnArr;
    this.refreshTable();
  },
  mounted() {},
  methods: {
    // 新增
    newlyBuild() {
      this.modalOption.title = this.$t("resourceMgr.clusterAdd"); // "添加物理集群";
      this.modalOption.editflag = false;
      this.showcreateEditModal = true;
    },
    toCluster(row) {
      // 获取登录集群地址;
      getQuickLoginUrl({ clusterId: row.clusterId })
        .then((res) => {
          window.open(res.quickLoginUrl, "_blank");
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    // 编辑
    editInfo(row) {
      this.modalOption.title = this.$t("resourceMgr.clusterEdit"); // "编辑物理集群";
      this.modalOption.editflag = true;

      clusterDetail({ clusterId: row.clusterId })
        .then((res) => {
          this.modalOption.formData = res;
          this.showcreateEditModal = true;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    // 删除
    deleteInfo(row) {
      let clusterEdleteConfirm = this.$t("resourceMgr.clusterEdleteConfirm"); // 确定删除该物理集群吗?
      let clusterEdleteSuccess = this.$t("resourceMgr.clusterEdleteSuccess"); // "删除物理集群成功!"

      let params = {
        clusterId: row.clusterId,
      };
      this.$confirm(clusterEdleteConfirm, this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          deleteCluster(params)
            .then((res) => {
              this.alertTips(clusterEdleteSuccess, "success");
              this.renderTable();
            })
            .catch((err) => {
              this.alertTips(err);
            });
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
        });
    },
    refreshTable() {
      this.getTableData();
    },

    renderTable() {
      this.pageNo = 1;
      this.pageSize = 20;
      this.getTableData();
    },
    getTableData() {
      this.tableLoading = true;
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      pageCluster(pramas)
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
          this.total = 0;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },

    // 计算百分比
    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
    },
  },
};
</script>
