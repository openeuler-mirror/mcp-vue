<template>
  <div class="workorder app-container">
    <!-- 头部菜单栏 -->
    <header-bar
      ref="headerBar"
      :spinBol="tableLoading"
      :selectData="selectTable"
      @refreshTable="refreshTable"
    />

    <mc-table
      ref="workOrderTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :tableLoading="tableLoading"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @selection-change="handlerSelectionChange"
      @size-change="handleSizeChange"
      @row-click="rowSelect"
      :rowkey="rowkey"
      :selectionType="selectionType"
      style="margin-top: 20px"
    >
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <template v-for="(item, index) in columnArr">
        <el-table-column
          v-if="
            item.prop != 'type' &&
            item.prop != 'status' &&
            item.prop != 'workOrderId'
          "
          :key="index"
          :label="item.label"
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

      <el-table-column
        :label="$t('common.operation')"
        fixed="right"
        min-width="150px"
        className="tableoperation"
      >
        <template slot-scope="{ row }">
          <!-- 非申请云服务器  非变更云服务器的  审核通过    -->
          <el-link
            v-if="
              row.status === 'WAIT_CHECK' &&
              row.type != 'APPLY_SERVERVM' &&
              row.type != 'MODIFY_SERVERVM' &&
              row.type != 'MODIFY_VDC'
            "
            type="primary"
            @click.stop="handleShowPass(row)"
          >
            {{ $t("common.pass") }}
          </el-link>
          <!-- 申请云服务器 -->
          <el-link
            v-if="row.status === 'WAIT_CHECK' && row.type == 'APPLY_SERVERVM'"
            type="primary"
            @click.stop="handleShowPassApplyServerVm(row)"
          >
            {{ $t("common.pass") }}
          </el-link>
          <!-- 变更云服务器 -->
          <el-link
            v-if="row.status === 'WAIT_CHECK' && row.type == 'MODIFY_SERVERVM'"
            type="primary"
            @click.stop="handleShowPassModifyServerVm(row)"
          >
            {{ $t("common.pass") }}
          </el-link>
          <!-- vdc变更通过 -->
          <el-link
            v-if="showVdcModifyPass(row)"
            type="primary"
            @click.stop="handleShowVdcPass(row)"
          >
            {{ $t("common.pass") }}
          </el-link>
          <el-link
            v-if="showRefuseBtn(row)"
            type="primary"
            @click.stop="handleShowRefuse(row)"
          >
            {{ $t("common.refuse") }}
          </el-link>
          <!-- <router-link
            class="el-link"
            :to="{
              name: 'workDetail',
              params: { id: row.workOrderId, type: row.type },
            }"
          >
            <el-link type="primary">详情</el-link>
          </router-link> -->
          <el-link type="primary" @click.stop="handleShowDetails(row)">
            {{ $t("common.detailsInfo") }}
          </el-link>
        </template>
      </el-table-column>
    </mc-table>
    <!-- 通过 -->
    <pass-drawer
      :visible.sync="showPassDrawer"
      :selectRowData="selectRowData"
    />
    <!-- 拒绝 -->
    <refuse-drawer
      :visible.sync="showRefuseDrawer"
      :selectRowData="selectRowData"
    />
    <!-- 申请云服务器审核 -->
    <pass-apply-servervm-drawer
      :visible.sync="showPassApplyServervmDrawer"
      :selectRowData="selectRowData"
    />
    <!-- 变更云服务器审核 -->
    <pass-modify-servervm-drawer
      :visible.sync="showPassModifyServervmDrawer"
      :selectRowData="selectRowData"
    />
    <!-- vdc变更规格审核 -->
    <changeSpecModal
      :options="changeSpecModal"
      :visible.sync="showChangeSpecModal"
    ></changeSpecModal>
    <!-- 详情 -->
    <detailDrawer
      :options="modalOption"
      :visible.sync="showDetailDrawer"
    ></detailDrawer>
  </div>
</template>

<script>
import { getWorkOrderList, passModifyVdcDetail } from "@/api/workOrder";
import mcTable from "@/components/MctablePro";
import headerBar from "./header-bar";
import passDrawer from "./drawer/pass-drawer";
import refuseDrawer from "./drawer/refuse-drawer";
import passApplyServervmDrawer from "./drawer/pass-apply-servervm-drawer";
import passModifyServervmDrawer from "./drawer/pass-modify-servervm-drawer";
import detailDrawer from "./detail/detail-drawer.vue";
import changeSpecModal from "./changeSpecModal/createEditModal.vue";
export default {
  name: "Workorder",
  components: {
    headerBar,
    mcTable,
    passDrawer,
    refuseDrawer,
    passApplyServervmDrawer,
    passModifyServervmDrawer,
    detailDrawer,
    changeSpecModal,
  },
  data() {
    return {
      rowkey: "workOrderId",
      tableLoading: false,
      selectionType: "multipleTable",
      columnArr: [
        {
          label: this.$t("workOrder.workOrderId"), // 工单ID",
          prop: "workOrderId",
          width: "50px",
        },
        {
          label: this.$t("workOrder.applyUser"), // 申请人",
          prop: "applyUser",
          width: "150px",
        },
        // { label: '所属组织', prop: 'organizationName' },
        {
          label: this.$t("workOrder.typeDesc"), // 工单类型",
          prop: "typeDesc",
          width: "150px",
        },
        {
          label: this.$t("workOrder.type"), // 类型",
          prop: "type",
          width: "150px",
        },
        {
          label: this.$t("workOrder.target"), // 工单对象",
          prop: "target",
          width: "150px",
        },
        {
          label: this.$t("workOrder.statusDesc"), // 状态",
          prop: "statusDesc",
          width: "100px",
        },
        {
          label: this.$t("workOrder.status"), // 工单状态",
          prop: "status",
          width: "100px",
        },
        {
          label: this.$t("workOrder.applyReason"), // 申请原因",
          prop: "applyReason",
          width: "250px",
        },
        {
          label: this.$t("workOrder.auditOpinion"), // 反馈意见",
          prop: "auditOpinion",
          width: "250px",
        },
        {
          label: this.$t("workOrder.applyTime"), // 申请时间",
          prop: "applyTime",
          width: "150px",
        },
        {
          label: this.$t("workOrder.auditTime"), // 处理时间",
          prop: "auditTime",
          width: "150px",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      searchOrderStatus: "ALL",
      searchOrderType: "ALL",
      organizationId: 0,
      searchKey: "",
      selectTable: [],
      showPassDrawer: false,
      showRefuseDrawer: false,
      showPassApplyServervmDrawer: false,
      showPassModifyServervmDrawer: false,
      selectRowData: new Object(),
      startTime: "",
      endTime: "",
      showDetailDrawer: false,
      // 模态框配置
      modalOption: {
        title: "",
        formData: "", // 表单数据
      },

      // 变更规格模态框配置
      showChangeSpecModal: false,
      changeSpecModal: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
    showRefuseBtn(row) {
      let flag = false;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (row.status === "WAIT_CHECK") {
        if (row.type == "MODIFY_VDC") {
          if (row.applyUserId == userInfo.userId) {
            flag = false;
          } else {
            flag = true;
          }
        } else {
          flag = true;
        }
      }
      return flag;
    },
    showVdcModifyPass(row) {
      let flag = false;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (row.status === "WAIT_CHECK" && row.type == "MODIFY_VDC") {
        if (row.applyUserId == userInfo.userId) {
          flag = false;
        } else {
          flag = true;
        }
      }
      return flag;
    },
    // 表格勾选
    handlerSelectionChange(selection) {
      this.selectTable = selection;
    },
    rowSelect(row) {
      // let rowWorkOrderId = row.workOrderId;
      // let existWorkOrder = this.selectTable.find(
      //   (item) => item.workOrderId === rowWorkOrderId
      // );
      // if (!existWorkOrder) {
      //   this.$refs.workOrderTable.$refs.elTable.toggleRowSelection(row);
      // } else {
      //   this.$refs.workOrderTable.$refs.elTable.toggleRowSelection(row, false);
      // }
    },
    // 刷新表格
    refreshTable() {
      this.renderTable();
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
    changeOrderStatus(val) {
      this.searchOrderStatus = val;
    },
    changeOrderType(val) {
      this.searchOrderType = val;
    },
    changeSearchKey(val) {
      this.searchKey = val;
    },
    changeOrganizationId(val) {
      this.organizationId = val;
    },
    changetimeData(date) {
      this.startTime = date.startTime;
      this.endTime = date.endTime;
    },
    changeShowPassApplyServervmDrawer(val) {
      this.showPassApplyServervmDrawer = val;
    },
    changeShowPassModifyServervmDrawer(val) {
      this.showPassModifyServervmDrawer = val;
    },
    setSelectRowData(row) {
      this.selectRowData = row;
    },
    renderTable() {
      let pageNo = this.pageNo;
      let pageSize = this.pageSize;
      let searchOrderStatus = this.searchOrderStatus;
      let searchOrderType = this.searchOrderType;
      let searchKey = this.searchKey;
      let organizationId = this.organizationId;
      let startTime = this.startTime;
      let endTime = this.endTime;
      this.tableLoading = true;
      getWorkOrderList({
        searchOrderStatus,
        searchOrderType,
        searchKey,
        organizationId,
        pageNo,
        pageSize,
        startTime,
        endTime,
      })
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 审核通过弹窗控制
    handleShowPass(row) {
      this.showPassDrawer = true;
      this.setSelectRowData(row);
    },
    // 拒绝弹窗控制
    handleShowRefuse(row) {
      this.showRefuseDrawer = true;
      this.setSelectRowData(row);
    },
    // 申请虚拟机弹窗控制
    handleShowPassApplyServerVm(row) {
      this.showPassApplyServervmDrawer = true;
      this.setSelectRowData(row);
    },
    // 变更云服务器弹窗控制
    handleShowPassModifyServerVm(row) {
      this.showPassModifyServervmDrawer = true;
      this.setSelectRowData(row);
    },
    handleShowDetails(row) {
      this.showDetailDrawer = true;
      this.modalOption.title = row.typeDesc + this.$t("common.detailsInfo"); // "详情";
      this.modalOption.formData = row;
    },
    // vdc 变更审核
    handleShowVdcPass(row) {
      // this.$showFullScreenLoading(".vdcPage-home");
      this.changeSpecModal.title = this.$t("common.changeSpec"); // "变更规格";
      this.changeSpecModal.editflag = true;
      passModifyVdcDetail({ workOrderId: row.workOrderId })
        .then((res) => {
          this.changeSpecModal.formData = res;

          this.showChangeSpecModal = true;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
        });

      // this.$hideFullScreenLoading();
    },
  },
};
</script>
