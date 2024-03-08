<template>
  <!-- 可用区 availabilityZone -->
  <div class="availabilityZone-home app-container">
    <!-- 操作按钮 -->
    <header-bar
      ref="headerBar"
      @newlyBuild="newlyBuild"
      @refreshTable="refreshTable"
    />
    <mc-table
      class="loading-area"
      ref="availabilityZoneTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
      :treeProps="treeProps"
      default-expand-all
      style="margin-top: 20px"
    >
      <template v-for="(item, index) in tableColumns">
        <!-- name -->
        <el-table-column
          v-if="item.prop == 'name'"
          :key="index"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <router-link
              v-if="currentBtnShow('zone_info')"
              :to="{
                name: 'availabilityZoneDetail',
                params: { id: row.zoneId, type: 'availabilityZoneDetail' },
              }"
            >
              <el-link type="primary">{{ row.name }}</el-link>
            </router-link>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <!-- CPU总容量 -->
        <el-table-column
          v-else-if="item.prop == 'cpuTotal'"
          :key="index"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] + $t("common.cpu") }}</span>
          </template>
        </el-table-column>
        <!-- 内存总容量 -->
        <el-table-column
          v-else-if="item.prop == 'memTotal'"
          :key="index"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] + "GB" }}</span>
          </template>
        </el-table-column>
        <!-- 存储总容量 -->
        <el-table-column
          v-else-if="item.prop == 'storageTotal'"
          :key="index"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] + "GB" }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.prop == 'operation'"
          fixed="right"
          :key="index"
          :resizable="index != 0 && index != tableColumns.length - 1"
          :label="item.label"
          :min-width="item.width || '200px'"
          className="tableoperation"
        >
          <template slot-scope="{ row }">
            <el-link
              v-if="currentBtnShow('modify_zone')"
              type="primary"
              @click="editInfo(row)"
            >
              {{ $t("common.modify") }}
            </el-link>
            <el-link
              v-if="currentBtnShow('delete_zone')"
              type="primary"
              @click="deleteInfo(row)"
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
          :resizable="index != 0 && index != tableColumns.length - 1"
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
import createEditModal from "./createEditModal/createEditModal";
import { pageZone, modifyZoneDetail, deleteZone } from "@/api/zoneapi";
export default {
  name: "availabilityZone",
  components: { headerBar, mcTable, createEditModal },
  data() {
    return {
      rowkey: "zoneId",
      treeProps: { children: "children", hasChildren: "hasChildren" },
      checkedColumns: [],
      checkedColumns22: [],
      columnArr: [
        // 名称
        {
          label: this.$t("resourceMgr.zoneNameDesc"),
          prop: "name",
          width: "200px",
        },
        // 描述
        {
          label: this.$t("resourceMgr.zoneRemark"),
          prop: "remark",
          width: "200px",
          tooltipsFlag: true,
        },
        // 资源类型
        {
          label: this.$t("resourceMgr.zoneType"),
          prop: "type",
          width: "200px",
          tooltipsFlag: true,
        },
        // 物理集群
        {
          label: this.$t("resourceMgr.zoneClusterDesc"),
          prop: "clusterNames",
          width: "200px",
          tooltipsFlag: true,
        },
        // CPU总容量
        {
          label: this.$t("resourceMgr.cpuTotal"), // "CPU总容量",
          prop: "cpuTotal",
          width: "200px",
        },
        // 内存总容量
        {
          label: this.$t("resourceMgr.memTotal"), // "内存总容量",
          prop: "memTotal",
          width: "200px",
        },
        // 存储总容量
        {
          label: this.$t("resourceMgr.storageTotal"), // "存储总容量",
          prop: "storageTotal",
          width: "200px",
        },
        // 操作
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
  },
  mounted() {
    this.refreshTable();
  },
  methods: {
    // 新增
    newlyBuild() {
      this.modalOption.title = this.$t("resourceMgr.zoneAdd"); // "添加可用区";
      this.modalOption.editflag = false;
      this.showcreateEditModal = true;
    },
    // 编辑
    editInfo(row) {
      this.modalOption.title = this.$t("resourceMgr.zoneEdit"); // "编辑可用区";
      this.modalOption.editflag = true;

      modifyZoneDetail({ zoneId: row.zoneId })
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
      let zoneDleteConfirm = this.$t("resourceMgr.zoneDleteConfirm"); // 确定删除该可用区吗?
      let zoneDleteSuccess = this.$t("resourceMgr.zoneDleteSuccess"); // 删除可用区成功!
      let params = {
        zoneId: row.zoneId,
      };
      this.$confirm(zoneDleteConfirm, this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          deleteZone(params)
            .then((res) => {
              this.alertTips(zoneDleteSuccess, "success");
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
      pageZone(pramas)
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


