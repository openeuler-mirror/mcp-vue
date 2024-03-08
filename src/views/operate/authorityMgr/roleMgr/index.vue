<template>
  <!-- 角色管理 -->
  <div class="roleMgr-home app-container">
    <!-- <div class="title-box">{{ $t("authorityMgr.roleList") }}</div> -->
    <div class="content-box">
      <!-- 操作按钮 -->
      <header-bar
        ref="headerBar"
        @newlyBuild="newlyBuild"
        @refreshTable="refreshTable"
      />
      <!-- 表格 -->
      <mc-table
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        style="margin-top: 20px"
      >
        <template v-for="(item, index) in columnArr">
          <el-table-column
            v-if="item.prop == 'operation'"
            fixed="right"
            :key="index"
            :label="item.label"
            :min-width="item.width || '200px'"
            className="tableoperation"
            :resizable="index != 0 && index != columnArr.length - 1"
          >
            <template slot-scope="{ row }">
              <el-link
                v-if="currentBtnShow('role_info')"
                type="primary"
                @click="detailInfo(row)"
              >
                {{ $t("common.view") }}
              </el-link>
              <el-link
                v-if="row.canModify && currentBtnShow('modify_role')"
                type="primary"
                @click="editInfo(row)"
              >
                {{ $t("common.modify") }}
              </el-link>
              <el-link
                v-if="row.canDelete && currentBtnShow('delete_role')"
                type="primary"
                @click="deleteInfo(row)"
              >
                {{ $t("common.delete") }}
              </el-link>
            </template>
          </el-table-column>
          <!-- roleType -->
          <el-table-column
            v-else-if="item.prop == 'roleType'"
            :key="'roleType' + index"
            :label="item.label"
            :resizable="index != 0 && index != columnArr.length - 1"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <span>{{ getroleTypeLabel(row.roleType) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="item.prop + index"
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
      </mc-table>
    </div>

    <!-- 创建角色 -->
    <createRoleMadal
      :options="modalOption"
      :visible.sync="showcreateRole"
    ></createRoleMadal>
    <!-- 角色详情 -->
    <showDetailRole
      :options="modalOption"
      :visible.sync="showDetailRole"
    ></showDetailRole>
  </div>
</template>

<script>
import headerBar from "./header-bar";
import mcTable from "@/components/MctablePro";
import createRoleMadal from "./createRole/createRoleMadal";
import showDetailRole from "./detailRole/detailRoleMadal.vue";
import dictionary from "@/assets/common/dataDictionary/dictionary";
import {
  pageRole,
  deleteRole,
  roleInfo,
  modifyRoleDetail,
} from "@/api/roleMgr";

export default {
  name: "roleMgr",
  components: { headerBar, mcTable, createRoleMadal, showDetailRole },
  data() {
    return {
      rowkey: "id",
      tableTreeProps: { children: "children", hasChildren: "hasChildren" },
      checkedColumns: [],
      columnArr: [
        {
          label: this.$t("authorityMgr.roleName"),
          prop: "roleName",
          width: "400px",
        },
        {
          label: this.$t("authorityMgr.roleType"),
          prop: "roleType",
          width: "200px",
        },
        {
          label: this.$t("authorityMgr.remark"),
          prop: "remark",
          width: "600px",
        },
        {
          label: this.$t("authorityMgr.createTime"),
          prop: "createTime",
          width: "200px",
        },

        { label: this.$t("common.operation"), prop: "operation" },
      ],

      tableData: [],

      total: 100,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,

      showcreateRole: false,
      showDetailRole: false,
      // 模态框配置
      modalOption: {
        title: "",
        editflag: "",
        formData: {}, // 表单数据
      },
      defaultOrg: {},
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
    getroleTypeLabel(key) {
      return dictionary.getDesc(key, dictionary.roleTypeArr);
    },

    // 新增
    newlyBuild() {
      this.modalOption.title = this.$t("authorityMgr.createRole");
      this.modalOption.editflag = false;
      this.modalOption.formData = {
        ...this.defaultOrg,
      };
      this.showcreateRole = true;
    },
    // 查看
    detailInfo(row) {
      this.modalOption.title = this.$t("authorityMgr.roleDetail");

      roleInfo({ roleId: row.roleId })
        .then((res) => {
          this.modalOption.formData = res;
          this.showDetailRole = true;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    // 编辑
    editInfo(row) {
      this.modalOption.title = this.$t("authorityMgr.modifyRole");
      this.modalOption.editflag = true;

      modifyRoleDetail({ roleId: row.roleId })
        .then((res) => {
          this.modalOption.formData = res;
          this.showcreateRole = true;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    renderTable() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      pageRole(pramas)
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
          this.alertTips(err);
        });
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
    refreshTable() {
      this.renderTable();
    },
    deleteInfo(row) {
      this.$confirm(
        this.$t("authorityMgr.deleteRoleMsg"),
        this.$t("common.tips"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          deleteRole({ roleId: row.roleId })
            .then((res) => {
              this.alertTips(
                this.$t("authorityMgr.deleteRoleSuccMsg"),
                "success"
              );
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
  },
};
</script>

<style lang="scss" scoped>
.roleMgr-home {
  display: flex;
  flex-direction: row;
  .content-box {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>
