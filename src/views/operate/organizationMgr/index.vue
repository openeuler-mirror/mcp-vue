<template>
  <!-- 组织管理 -->
  <div class="organizationMgr-home app-container">
    <!-- 操作按钮 -->
    <headerBox @refresh="refreshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <el-button @click="newlyBuild" v-if="currentBtnShow('create_org')">
          {{ $t("authorityMgr.createOrg") }}
        </el-button>
      </template>
    </headerBox>

    <mc-table
      ref="orgTable"
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
      <template v-for="(item, index) in columnShowArr">
        <!-- name -->
        <el-table-column
          v-if="item.prop == 'organizationName'"
          :key="index"
          :label="item.label"
          :width="item.width"
          :resizable="index != 0 && index != columnShowArr.length - 1"
          class-name="orgNameClass"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              effect="light"
              :content="row[item.prop] + ''"
              placement="top"
              :visible-arrow="true"
            >
              <router-link
                v-if="currentBtnShow('org_info') && !row.topOrg"
                :to="{
                  name: 'organizationDetail',
                  params: {
                    id: row.organizationId,
                    type: 'organizationDetail',
                  },
                }"
              >
                <el-link type="primary">{{ row.organizationName }}</el-link>
              </router-link>
              <span v-else>{{ row.organizationName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- CPU分配比  -->
        <el-table-column
          v-else-if="item.prop == 'CPUallocationratio'"
          :key="index + 'CPUallocationratio'"
          :label="item.label"
          :resizable="index != 0 && index != columnShowArr.length - 1"
          :width="item.width"
        >
          <template v-if="!row.topOrg" topOrg slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(row.usedCpu, row.allocationCpu),
                unit: $t('authorityMgr.cpu'),
                num: row.usedCpu,
                total: row.allocationCpu,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 内存分配比 -->
        <el-table-column
          v-else-if="item.prop == 'memoryallocationratio'"
          :key="index + 'memoryallocationratio'"
          :label="item.label"
          :resizable="index != 0 && index != columnShowArr.length - 1"
          :width="item.width"
        >
          <template v-if="!row.topOrg" slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(row.usedMem, row.allocationMem),
                unit: 'GB',
                num: row.usedMem,
                total: row.allocationMem,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>
        <!-- 存储分配比 -->
        <el-table-column
          v-else-if="item.prop == 'Storageallocationratio'"
          :key="index + 'Storageallocationratio'"
          :label="item.label"
          :resizable="index != 0 && index != columnShowArr.length - 1"
          :width="item.width"
        >
          <template v-if="!row.topOrg" slot-scope="{ row }">
            <mcAllocationratio
              :option="{
                percentage: calculatePercentage(
                  row.usedDisk,
                  row.allocationDisk
                ),
                unit: 'GB',
                num: row.usedDisk,
                total: row.allocationDisk,
              }"
            ></mcAllocationratio>
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :key="index + item.label"
          :label="item.label"
          :resizable="index != 0 && index != columnShowArr.length - 1"
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
      <!-- 操作 -->
      <el-table-column :min-width="'200px'" className="tableoperation">
        <template slot="header">
          <div class="tableoperation-header">
            <div>{{ $t("common.operation") }}</div>
            <oper
              :filter-data="columnArr"
              :clumn-name="'org-table'"
              @tableColumn="getTableColumn"
            />
          </div>
        </template>
        <template slot-scope="{ row }">
          <el-link
            v-if="currentBtnShow('modify_org') && !row.topOrg"
            type="primary"
            @click="editInfo(row)"
          >
            {{ $t("common.modify") }}
          </el-link>
          <!-- 修改组织名称 -->
          <el-link
            v-if="row.topOrg && superUser"
            type="primary"
            @click="editOrgName(row)"
          >
            {{ $t("authorityMgr.editOrgName") }}
          </el-link>
          <el-link
            v-if="currentBtnShow('delete_org') && !row.topOrg"
            type="primary"
            @click="deleteInfo(row)"
          >
            {{ $t("common.delete") }}
          </el-link>
        </template>
      </el-table-column>
    </mc-table>
    <!-- 创建组织 -->

    <createorganizModal
      :options="modalOption"
      :visible.sync="showcreateorganiz"
    ></createorganizModal>

    <!-- 修改组织名称 modifyOrgNameModal -->
    <modifyOrgNameModal
      :options="modifyOrgNameOption"
      :visible.sync="showmodifyOrgNameModal"
    ></modifyOrgNameModal>
  </div>
</template>

<script>
import headerBox from "@/components/headerBox";
import mcTable from "@/components/MctablePro";
import oper from "@/components/Operation";
import mcAllocationratio from "@/components/Mcallocationratio";
import createorganizModal from "./createOrganization/createorganizModal";
import modifyOrgNameModal from "./modifyOrgName/modifyOrgNameModal.vue"; // 修改组织名称
import { queryOrgTree, orgDetail, deleteOrg } from "@/api/organization";
import transformat from "@/utils/transformat";
export default {
  name: "organizationMgr",
  components: {
    headerBox,
    mcTable,
    mcAllocationratio,
    createorganizModal,
    oper,
    modifyOrgNameModal,
  },
  data() {
    return {
      rowkey: "organizationId",
      tableLoading: false,
      treeProps: { children: "children", hasChildren: "hasChildren" },
      columnArr: [
        {
          label: this.$t("authorityMgr.organizationName"),
          prop: "organizationName",
          disabled: true,
          show: true,
          width: 200,
        },
        {
          label: this.$t("authorityMgr.userNum"),
          prop: "userNum",
          show: true,
          disabled: false,
        },
        {
          label: this.$t("authorityMgr.serverVmNum"),
          prop: "serverVmNum",
          show: true,
          disabled: false,
        },
        {
          label: this.$t("authorityMgr.parentName"),
          prop: "parentName",
          show: true,
          disabled: false,
        },
        { label: "VDC", prop: "vdcName", disabled: false },
        {
          label: this.$t("authorityMgr.CPUallocationratio"),
          prop: "CPUallocationratio",
          width: 200,
          show: true,
          disabled: false,
        },
        {
          label: this.$t("authorityMgr.memoryallocationratio"),
          prop: "memoryallocationratio",
          width: 200,
          show: true,
          disabled: false,
        },
        {
          label: this.$t("authorityMgr.Storageallocationratio"),
          prop: "Storageallocationratio",
          width: 200,
          show: true,
          disabled: false,
        },
      ],
      columnShowArr: [],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,

      showcreateorganiz: false,
      popovervisible: false,
      // 模态框配置
      modalOption: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },

      showmodifyOrgNameModal: false,
      modifyOrgNameOption: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },
      superUser: false,
    };
  },
  created() {
    let info = JSON.parse(localStorage.getItem("userInfo"));
    let { superUser } = info;
    this.superUser = superUser;
    this.refreshTable();
  },
  methods: {
    getTableColumn(table) {
      const newTableHeader = table || this.columnArr;
      let checkedDisabled = ["organizationName", "operation"];
      newTableHeader.forEach((element) => {
        const { prop } = element;
        element.checkedDisabled = true;
        if (checkedDisabled.indexOf(prop) == -1) {
          element.checkedDisabled = false;
        }
      });
      this.$set(this, "columnShowArr", newTableHeader);
      this.$nextTick(() => {
        this.$refs.orgTable && this.$refs.orgTable.doLayout();
      });
    },
    // 新增
    newlyBuild() {
      this.modalOption.title = this.$t("authorityMgr.createOrg");
      this.modalOption.editflag = false;
      this.showcreateorganiz = true;
    },
    // 编辑
    editInfo(row) {
      this.modalOption.title = this.$t("authorityMgr.editOrg");
      this.modalOption.editflag = true;

      orgDetail({ orgId: row.organizationId })
        .then((res) => {
          this.modalOption.formData = res;
          this.showcreateorganiz = true;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    editOrgName(row) {
      this.modifyOrgNameOption.title = this.$t("authorityMgr.editOrgName"); // "修改组织名称"
      this.modifyOrgNameOption.editflag = true;
      this.modifyOrgNameOption.formData = row;
      this.showmodifyOrgNameModal = true;
    },
    // 删除
    deleteInfo(row) {
      this.$confirm(
        this.$t("authorityMgr.delereOrgconfirm"),
        this.$t("common.tips"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          deleteOrg({ orgId: row.organizationId })
            .then((res) => {
              this.alertTips(this.$t("authorityMgr.delereOrgSucc"), "success");
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
      queryOrgTree()
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
<style lang="scss" scoped>
i.el-icon-d-arrow-right {
  transform: rotate(90deg);
}
.table-filter {
  .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }
}
</style>

<style lang="scss">
.orgNameClass {
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
