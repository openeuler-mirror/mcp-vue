<template>
  <!-- 物理集群 physicalCluster -->
  <div class="physicalCluster-home app-container">
    <!-- 操作按钮 -->
    <header-bar
      ref="headerBar"
      @newlyBuild="newlyBuild"
      @refreshTable="refreshTable"
    />

    <mc-table
      ref="physicalClusterTable"
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
              :to="{
                name: 'vMwareMgrPageDetail',
                params: {
                  id: row.vcenterId,
                  name: row.name,
                  type: 'vMwareMgrPageDetail',
                },
              }"
            >
              <el-link type="primary">{{ row.name }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.prop == 'operation'"
          fixed="right"
          :key="index"
          :label="item.label"
          :width="item.width || '200px'"
          className="tableoperation"
        >
          <template slot-scope="{ row }">
            <!-- 编辑 -->
            <el-link type="primary" @click="editInfo(row)">
              {{ $t("common.modify") }}
            </el-link>
            <!-- vCenterId -->
            <!-- <el-link
              type="primary"
              @click="deleteInfo(row)"
              v-if="
                row.status === 'OFFLINE' && currentBtnShow('delete_cluster')
              "
            >
              {{ $t("common.delete") }}
            </el-link> -->
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
import headerBar from "./header-bar";
import mcTable from "@/components/MctablePro";
import mcAllocationratio from "@/components/Mcallocationratio";
import createEditModal from "./createEditModal/createEditModal";
import statuscell from "../components/statuscell/index.vue";
import { deleteCluster } from "@/api/clusterapi";
import { pageVCenter, vCenterInfo } from "@/api/vMwareMgr";
export default {
  name: "physicalCluster",
  components: {
    headerBar,
    mcTable,
    mcAllocationratio,
    createEditModal,
    statuscell,
  },
  data() {
    return {
      rowkey: "vcenterId",
      columnArr: [
        // 名称
        {
          label: this.$t("resourceMgr.vMwareMgr.name"), // "名称",
          prop: "name",
          width: "230px",
          tooltipsFlag: true,
        },
        // 描述
        {
          label: this.$t("resourceMgr.vMwareMgr.remark"), // "描述",
          prop: "remark",
          tooltipsFlag: true,
        },
        // ip地址
        {
          label: this.$t("resourceMgr.vMwareMgr.vcenterIp"), // "ip地址",
          prop: "vcenterIp",
          tooltipsFlag: true,
        },
        // 端口
        {
          label: this.$t("resourceMgr.vMwareMgr.vcenterPort"), // "端口",
          prop: "vcenterPort",
          tooltipsFlag: true,
        },
        // 账号
        {
          label: this.$t("resourceMgr.vMwareMgr.vcenterAccount"), // "账号",
          prop: "vcenterAccount",
          tooltipsFlag: true,
        },
        {
          label: this.$t("common.operation"),
          prop: "operation",
          width: "150px",
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
    newlyBuild() {
      this.modalOption.title = this.$t("resourceMgr.vMwareMgr.addvMwareMgr"); // "添加VMware纳管";
      this.modalOption.editflag = false;
      this.showcreateEditModal = true;
    },
    // 编辑
    editInfo(row) {
      this.modalOption.title = this.$t("resourceMgr.vMwareMgr.editvMwareMgr"); // "编辑VMware纳管";
      this.modalOption.editflag = true;
      let params = {
        vcenterId: row.vcenterId,
        name: row.name,
      };
      vCenterInfo(params)
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
      this.$nextTick(() => {
        this.$showFullScreenLoading(".page-wrapper-content");
      });
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      pageVCenter(pramas)
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
          this.$hideFullScreenLoading();
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
  },
};
</script>

