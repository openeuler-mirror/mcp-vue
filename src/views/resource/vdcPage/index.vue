<template>
  <!-- 虚拟数据中心 vdcPage -->
  <div class="vdcPage-home app-container">
    <!-- 操作按钮 -->
    <headerBox @refresh="refreshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <el-button v-if="currentBtnShow('create_vdc')" @click="newlyBuild">
          {{ $t("common.create") }}
        </el-button>
      </template>
    </headerBox>
    <mc-table
      ref="vdcPageTable"
      :tableLoading="tableLoading"
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
          v-if="item.prop == 'vdcName'"
          :key="index"
          :label="item.label"
          :width="item.width"
          class-name="vdcNameClass"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              effect="light"
              :content="row[item.prop] + ''"
              placement="top"
              :visible-arrow="true"
            >
              <router-link
                v-if="currentBtnShow('vdc_info')"
                :to="{
                  name: 'vdcPageDetail',
                  params: { id: row.vdcId, type: 'vdcPageDetail' },
                }"
              >
                <el-link type="primary">{{ row.vdcName }}</el-link>
              </router-link>

              <span v-else>{{ row.vdcName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- CPU分配比  -->
        <el-table-column
          v-else-if="item.prop == 'CPUallocationratio'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(row.usedCpu, row.totalCpu),
                unit: $t('common.cpu'),
                num: row.usedCpu,
                total: row.totalCpu,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 内存分配比 -->
        <el-table-column
          v-else-if="item.prop == 'memoryallocationratio'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(row.usedMem, row.totalMem),
                unit: row.memUnit,
                num: row.usedMem,
                total: row.totalMem,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 存储分配比 -->
        <el-table-column
          v-else-if="item.prop == 'Storageallocationratio'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(
                  row.usedStorage,
                  row.totalStorage
                ),
                unit: row.storageUnit,
                num: row.usedStorage,
                total: row.totalStorage,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.prop == 'operation'"
          fixed="right"
          :key="'operation' + index"
          :label="item.label"
          min-width="250px"
          className="tableoperation"
        >
          <template slot-scope="{ row }">
            <el-link
              v-if="currentBtnShow('modify_vdc')"
              type="primary"
              @click="editInfo(row)"
            >
              {{ $t("common.modify") }}
            </el-link>
            <el-link
              v-if="currentBtnShow('apply_vdc')"
              type="primary"
              @click="editResourceInfo(row)"
            >
              <!-- 变更规格 -->
              {{ $t("common.changeSpec") }}
            </el-link>
            <el-link
              v-if="currentBtnShow('delete_vdc')"
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

    <!-- 创建vdc -->
    <createEditModal :options="modalOption" :visible.sync="showcreateEditModal">
    </createEditModal>
    <vdcEditModal
      :options="vdcEditModalOption"
      :visible.sync="showvdcEditModal"
    >
    </vdcEditModal>
    <!-- 变更规格 -->
    <changeSpecModal
      :options="changeSpecModal"
      :visible.sync="showChangeSpecModal"
    >
    </changeSpecModal>
  </div>
</template>

<script>
import headerBox from "@/components/headerBox";
import mcTable from "@/components/MctablePro";
import mcAllocationratio from "@/components/Mcallocationratio";
import createEditModal from "./createEditModal/createEditModal";
import changeSpecModal from "./changeSpecModal/createEditModal.vue";
import vdcEditModal from "./vdcEditModal/createEditModal.vue";

import {
  vdcTree,
  modifyVdcDetail,
  deleteVdc,
  modifyVdcResourceDetail,
} from "@/api/vdcapi";
import transformat from "@/utils/transformat";
export default {
  name: "vdcPage",
  components: {
    headerBox,
    mcTable,
    mcAllocationratio,
    createEditModal,
    changeSpecModal,
    vdcEditModal,
  },
  data() {
    return {
      rowkey: "vdcId",
      treeProps: { children: "children", hasChildren: "hasChildren" },
      checkedColumns: [],
      checkedColumns22: [],
      columnArr: [
        // 名称
        {
          label: this.$t("resourceMgr.vdcName"),
          prop: "vdcName",
          width: "200px",
        },
        // 上级vdc
        {
          label: this.$t("resourceMgr.vdcparentName"),
          prop: "parentName",
          width: "200px",
          tooltipsFlag: true,
        },
        // 组织机构
        {
          label: this.$t("resourceMgr.vdcorgName"),
          prop: "orgName",
          width: "200px",
          tooltipsFlag: true,
        },
        // 网络
        { label: this.$t("resourceMgr.vdcnetworkNum"), prop: "networkNum" },
        // 可用区名称
        {
          label: this.$t("resourceMgr.zoneName"),
          prop: "zoneName",
          width: "200px",
          tooltipsFlag: true,
        },
        // CPU分配比
        {
          label: this.$t("resourceMgr.vdcCPUallocationratio"),
          prop: "CPUallocationratio",
          width: "200px",
        },
        // 内存分配比
        {
          label: this.$t("resourceMgr.vdcmemoryallocationratio"),
          prop: "memoryallocationratio",
          width: "200px",
        },
        // 存储分配比
        {
          label: this.$t("resourceMgr.vdcStorageallocationratio"),
          prop: "Storageallocationratio",
          width: "200px",
        },
        // 操作
        {
          label: this.$t("common.operation"),
          prop: "operation",
          width: "200px",
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
      // 变更规格模态框配置
      showChangeSpecModal: false,
      changeSpecModal: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },
      // 编辑vdc
      showvdcEditModal: false,
      vdcEditModalOption: {
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
  methods: {
    // 新增
    newlyBuild() {
      this.modalOption.title = this.$t("resourceMgr.vdcAdd"); // "创建VDC";
      this.modalOption.editflag = false;
      this.modalOption.formData = {
        parentId: 0,
        parentName: "",
      };
      this.showcreateEditModal = true;
    },
    // 编辑
    editInfo(row) {
      this.$showFullScreenLoading(".vdcPage-home");
      this.vdcEditModalOption.title = this.$t("resourceMgr.vdcEdit"); // "编辑虚拟数据中心";
      this.vdcEditModalOption.editflag = true;

      modifyVdcDetail({ vdcId: row.vdcId })
        .then((res) => {
          this.vdcEditModalOption.formData = res;
          this.showvdcEditModal = true;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.$hideFullScreenLoading();
        });
    },
    editResourceInfo(row) {
      this.$showFullScreenLoading(".page-wrapper-content");
      this.changeSpecModal.title = this.$t("common.changeSpec"); // "变更规格"; // "变更规格";
      this.changeSpecModal.editflag = true;

      modifyVdcResourceDetail({ vdcId: row.vdcId })
        .then((res) => {
          this.changeSpecModal.formData = res;
          this.changeSpecModal.formData.vdcId = row.vdcId;
          this.changeSpecModal.formData.parentId = row.parentId;
          this.showChangeSpecModal = true;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.$hideFullScreenLoading();
        });
    },
    // 删除
    deleteInfo(row) {
      let cdcDleteConfirm = this.$t("resourceMgr.cdcDleteConfirm"); // 确定删除该虚拟数据中心吗?
      let cdcDdleteSuccess = this.$t("resourceMgr.cdcDdleteSuccess"); // "删除该虚拟数据中心成功!"
      this.$confirm(cdcDleteConfirm, this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          deleteVdc({ vdcId: row.vdcId })
            .then((res) => {
              this.alertTips(cdcDdleteSuccess, "success");
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
      this.renderTable();
    },
    renderTable() {
      this.tableLoading = true;
      vdcTree()
        .then((res) => {
          this.tableData = res;
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handlePageChange(page) {
      this.pageNo = +page;
      // this.renderTable();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      // this.renderTable();
    },

    // 计算百分比
    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
    },
  },
};
</script>
<style lang="scss">
.vdcNameClass {
  .cell {
    display: flex;
    flex-direction: row;
    align-items: center;
    .el-tooltip {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .el-link {
        width: 100%;
        .el-link--inner {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
