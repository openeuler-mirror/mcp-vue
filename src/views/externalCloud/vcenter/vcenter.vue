<template>
  <!-- 物理集群 physicalCluster -->
  <div class="physicalCluster-home app-container">
    <!-- 操作按钮 -->
    <headerBox @refresh="refreshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <el-button @click="newBuild">
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
        <!-- 名称 -->
        <el-table-column
          v-if="item.prop == 'name'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <router-link
              :to="{
                name: 'vCenterDetail',
                params: {
                  id: row.id,
                  type: 'vCenterDetail',
                  pageName: row.name,
                },
              }"
            >
              <el-link type="primary">{{ row.name }}</el-link>
            </router-link>
            <!-- <span v-else>{{ row.name }}</span> -->
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          v-else-if="item.prop == 'status'"
          :key="index + 'status'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <statuscell
              :status="row.status.toString()"
              type="number"
            ></statuscell>
          </template>
        </el-table-column>
        <!-- CPU分配比  -->
        <el-table-column
          v-else-if="item.prop == 'cpurate'"
          :key="index + 'cpurate'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(
                  row.statistics.cpuUsedCapacity,
                  row.statistics.cpuTotalCapacity
                ),
                unit: row.statistics.cpuCapacityUnit,
                num: row.statistics.cpuUsedCapacity,
                total: row.statistics.cpuTotalCapacity,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 内存分配比 -->
        <el-table-column
          v-else-if="item.prop == 'memoryrate'"
          :key="index + 'memoryrate'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(
                  row.statistics.memoryUsedCapacity,
                  row.statistics.memoryTotalCapacity
                ),
                unit: row.statistics.memoryCapacityUnit,
                num: row.statistics.memoryUsedCapacity,
                total: row.statistics.memoryTotalCapacity,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 存储分配比 -->
        <el-table-column
          v-else-if="item.prop == 'storagerate'"
          :key="index + 'storagerate'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(
                  row.statistics.storageUsedCapacity,
                  row.statistics.storageTotalCapacity
                ),
                unit: row.statistics.storageCapacityUnit,
                num: row.statistics.storageUsedCapacity,
                total: row.statistics.storageTotalCapacity,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.prop == 'operation'"
          fixed="right"
          :key="index + 'operation'"
          :label="item.label"
          :min-width="item.width || '200px'"
          className="tableoperation"
        >
          <template slot-scope="{ row }">
            <!-- <div class="tableoperation"></div> -->
            <el-link type="primary" @click="editInfo(row)">
              {{ $t("common.modify") }}
            </el-link>
            <el-link
              type="primary"
              @click="deleteInfo(row)"
              v-if="row.status === 'OFFLINE'"
            >
              {{ $t("common.delete") }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :key="index + item.label"
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
  getVcenterList,
  getVcenterEditDetail,
  deleteCluster,
} from "@/api/vcenter";
import transformat from "@/utils/transformat";
export default {
  name: "vcenter",
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
      tableLoading: false,
      checkedColumns: [],
      checkedColumns22: [],
      columnArr: [
        // 集群名称
        {
          label: this.$t("externalCloud.vcenter.name"),
          prop: "name",
          width: "230px",
        },
        // 集群状态
        { label: this.$t("externalCloud.vcenter.status"), prop: "status" },
        // 描述
        {
          label: this.$t("externalCloud.vcenter.remark"),
          prop: "remark",
          tooltipsFlag: true,
        },
        // 版本号
        {
          label: this.$t("externalCloud.vcenter.versionNumber"),
          prop: "version",
          tooltipsFlag: true,
        },
        // 集群URL
        {
          label: this.$t("externalCloud.vcenter.clusterUrl"),
          prop: "vcenterIp",
          tooltipsFlag: true,
        },

        // CPU利用率
        {
          label: this.$t("externalCloud.vcenter.clustercpurate"),
          prop: "cpurate",
          width: 230,
        },
        // 内存利用率
        {
          label: this.$t("externalCloud.vcenter.clustermemoryrate"),
          prop: "memoryrate",
          width: 230,
        },
        // 存储利用率
        {
          label: this.$t("externalCloud.vcenter.clusterstoragerate"),
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
    newBuild() {
      this.modalOption.title = this.$t("externalCloud.vcenter.addVcenter"); // "添加物理集群";
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
      this.modalOption.title = this.$t("externalCloud.vcenter.editVcenter"); // "编辑物理集群";
      this.modalOption.editflag = true;

      getVcenterEditDetail({ vcenterId: row.id })
        .then((res) => {
          const {
            name,
            remark,
            httpProtocol,
            vcenterIp,

            vcenterPort,
            vcenterAccount,
            vcenterPassword,
          } = res;
          this.modalOption.formData = {
            clusterName: name, // 集群名称
            clusterDescription: remark, // 描述
            clusterURL: vcenterIp,
            id: row.id,
            clusterURLProtocol: httpProtocol.toString(),
            clusterURLPort: vcenterPort,
            vcenterUserName: vcenterAccount, // 用户名
            vcenterUserPassword: vcenterPassword, // 登录密码
          };
          this.showcreateEditModal = true;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    // 删除
    deleteInfo(row) {
      let clusterEdleteConfirm = this.$t("externalCloud.clusterEdleteConfirm"); // 确定删除该物理集群吗?
      let clusterEdleteSuccess = this.$t("externalCloud.clusterEdleteSuccess"); // "删除物理集群成功!"

      let params = {
        vcenterId: row.id,
      };
      this.$confirm(clusterEdleteConfirm, this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      }).then(() => {
        deleteCluster(params)
          .then((res) => {
            this.alertTips(clusterEdleteSuccess, "success");
            this.renderTable();
          })
          .catch((err) => {
            this.alertTips(err);
          });
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
      getVcenterList(pramas)
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
