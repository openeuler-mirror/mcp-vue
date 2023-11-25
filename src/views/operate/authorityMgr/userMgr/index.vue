<template>
  <!-- 用户管理 -->
  <div class="userMgr-home app-container">
    <div class="userMgr-home-left">
      <div class="title-box">{{ $t("authorityMgr.orgList") }}</div>
      <div class="content-box kcp-el-tree">
        <el-tree
          ref="ecstree"
          :data="treeData"
          :props="treeProps"
          :node-key="nodeKey"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          :default-expanded-keys="defaultExpandedkeys"
          :default-checked-keys="defaultCheckedkeys"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="el-icon-coin"></span>
            <span>{{ node.label }}</span>
            <span>{{ "(" + data.statisticNum + ")" }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="userMgr-home-right">
      <div class="title-box">{{ $t("authorityMgr.userList") }}</div>
      <div class="content-box">
        <!-- 操作按钮 -->
        <header-bar
          ref="headerBar"
          :select-data="selectTable"
          :spinBol="tableLoading"
          @newlyBuild="newlyBuild"
          @deleteInfos="deleteInfos"
          @refreshTable="refreshTable"
        />
        <!-- 表格 -->
        <mc-table
          :data="tableData"
          :total="total"
          :pageSize="pageSize"
          :currentPage="pageNo"
          :tableLoading="tableLoading"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          @selection-change="handleSelectione"
          selectionType="ownSelect"
          :rowkey="rowkey"
          style="margin-top: 20px"
        >
          <el-table-column
            :selectable="getSelectBol"
            type="selection"
            width="40"
          >
          </el-table-column>
          <template v-for="(item, index) in columnArr">
            <el-table-column
              v-if="item.prop == 'operation'"
              fixed="right"
              :key="index"
              :label="item.label"
              :width="item.width"
              className="tableoperation"
            >
              <template slot-scope="{ row }">
                <el-link
                  v-if="row.canModifyUser && currentBtnShow('modify_user')"
                  type="primary"
                  @click.stop="editInfo(row)"
                >
                  {{ $t("common.modify") }}
                </el-link>
                <el-link
                  v-if="row.canDeleteUser && currentBtnShow('delete_user')"
                  type="primary"
                  @click.stop="deleteInfo(row)"
                >
                  {{ $t("common.delete") }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop == 'roleType'"
              :key="'roleType' + index"
              :resizable="index != 0 && index != columnArr.length - 1"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <span>{{ getroleTypeLabel(row.roleType) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop == 'status'"
              :key="'status' + index"
              :resizable="index != 0 && index != columnArr.length - 1"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <span :class="getstatusClass(row.status)">
                  {{ getstatusLabel(row.status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="item.prop + index"
              :resizable="index != 0 && index != columnArr.length - 1"
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
        </mc-table>
      </div>
    </div>
    <!-- 创建用户 -->
    <createUserModal
      :options="modalOption"
      :visible.sync="showcreateUser"
      @freshTree="getTreeList"
    ></createUserModal>
  </div>
</template>

<script>
import headerBar from "./header-bar";
import mcTable from "@/components/MctablePro";
import createUserModal from "./createUser/createUserModal.vue";
import { orgStatisticTree } from "@/api/organization";
import {
  pageUser,
  modifyUserInfo,
  deleteUser,
  batchDeleteUser,
} from "@/api/userMgr";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  name: "userMgr",
  components: { headerBar, mcTable, createUserModal },
  data() {
    return {
      nodeKey: "organizationId",
      defaultExpandedkeys: [],
      defaultCheckedkeys: [],
      treeData: [],
      treeProps: {
        children: "children",
        label: "organizationName",
      },
      tableLoading: false,
      rowkey: "userId",
      tableTreeProps: { children: "children", hasChildren: "hasChildren" },
      checkedColumns: [],
      columnArr: [
        { label: this.$t("authorityMgr.userName"), prop: "userName" }, // 用户名
        { label: this.$t("authorityMgr.realName"), prop: "realName" }, // 真实姓名
        {
          label: this.$t("authorityMgr.role"),
          prop: "roleType",
        }, // 角色
        {
          label: this.$t("authorityMgr.mobile"),
          prop: "mobile",
        }, // 手机号
        {
          label: this.$t("authorityMgr.avtstatus"),
          prop: "status",
        }, // 激活状态
        {
          label: this.$t("authorityMgr.createTime"),
          prop: "createTime",
        }, // 创建时间

        { label: this.$t("common.operation"), prop: "operation" },
      ],
      tableData: [],

      total: 100,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,

      showcreateUser: false,
      // 模态框配置
      modalOption: {
        title: "",
        editflag: "",
        formData: {}, // 表单数据
      },
      searchKey: "",
      selectTable: [],
    };
  },
  computed: {},
  created() {
    this.getTreeList();
  },
  methods: {
    getSelectBol(row, index) {
      const cantClcikBol = row.defaultUser || row.roleName === "超级管理员";
      return !cantClcikBol;
    },
    getroleTypeLabel(key) {
      return dictionary.getDesc(key, dictionary.roleTypeArr);
    },
    getstatusLabel(key) {
      // ACTIVATE(激活) NO_ACTIVATE(不激活)
      let keyLabel = {
        ACTIVATE: this.$t("authorityMgr.ACTIVATE"), // "激活",
        NO_ACTIVATE: this.$t("authorityMgr.NO_ACTIVATE"), //  "未激活",
      };
      return keyLabel[key];
    },
    getstatusClass(key) {
      // ACTIVATE(激活) NO_ACTIVATE(不激活)
      let keyClass = {
        ACTIVATE: "status-active",
        NO_ACTIVATE: "status-noactive",
      };
      return keyClass[key];
    },
    getTreeList() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".kcp-el-tree");
      });
      orgStatisticTree({ statisticType: "USER" })
        .then((res) => {
          this.$hideFullScreenLoading();
          if (res && res.length > 0) {
            this.treeData = res;
            this.defaultExpandedkeys = [];
            let orgId = res[0].organizationId;
            this.defaultExpandedkeys.push(orgId);
            this.$nextTick(() => {
              this.defaultCheckedkeys = [orgId];
              this.$refs.ecstree.setCurrentKey(orgId);
            });
            this.orgId = orgId;
            this.renderTable();
          } else {
          }
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
          this.alertTips(err);
        });
    },
    renderTable() {
      this.tableLoading = true;
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orgId: this.orgId,
        searchKey: this.searchKey,
      };
      pageUser(pramas)
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
        })
        .catch((err) => {
          this.alertTips(err);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handleNodeClick(data) {
      this.orgId = data.organizationId;
      this.renderTable();
    },
    changeSearchKey(val) {
      this.searchKey = val;
      // this.renderTable();
    },
    newlyBuild() {
      this.modalOption.title = this.$t("authorityMgr.creatUser"); // "创建用户"
      this.modalOption.editflag = false;
      this.showcreateUser = true;
    },
    editInfo(row) {
      this.modalOption.title = this.$t("authorityMgr.modifyUser"); //"编辑用户";
      this.modalOption.editflag = true;
      modifyUserInfo({ userId: row.userId })
        .then((res) => {
          this.modalOption.formData = res;
          this.showcreateUser = true;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    deleteInfo(row) {
      this.$confirm(
        this.$t("authorityMgr.deleteTipMsg"),
        this.$t("common.tips"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          deleteUser({ userId: row.userId })
            .then((res) => {
              this.alertTips(
                this.$t("authorityMgr.deleteSuccessMsg"),
                "success"
              );
              this.renderTable();

              this.getTreeList();
            })
            .catch((err) => {
              this.alertTips(err);
            });
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
        });
    },
    deleteInfos() {
      this.$confirm(
        this.$t("authorityMgr.deletesTipMsg"),
        this.$t("common.tips"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          batchDeleteUser({ userIds: this.userIds })
            .then((res) => {
              this.alertTips(
                this.$t("authorityMgr.deletesSuccessMsg"),
                "success"
              );
              this.getTreeList();
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
    handlePageChange(page) {
      this.pageNo = +page;
      this.renderTable();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.renderTable();
    },
    handleSelectione(list) {
      this.$set(this, "selectTable", list);
      this.userIds = [];
      let oriIds = JSON.parse(JSON.stringify(this.userIds));
      let ids = [];
      list.forEach((element) => {
        ids.push(element.userId);
      });
      this.userIds = oriIds.concat(ids);
    },
    refreshTable() {
      this.renderTable();
    },
  },
};
</script>

<style lang="scss" scoped>
.userMgr-home {
  display: flex;
  flex-direction: row;
  .userMgr-home-left,
  .userMgr-home-right {
    display: flex;
    flex-direction: column;
    .title-box {
      width: 100%;
      font-size: 18px;

      padding: 10px 20px;
    }
    .content-box {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }
  .userMgr-home-left {
    width: 230px;
    height: 100%;
  }
  .userMgr-home-right {
    height: 100%;
    flex: 1;
    margin-left: 15px;
  }
  .status-active {
    color: #67c23a;
  }
  .status-noactive {
    color: #e6a23c;
  }
}
</style>
