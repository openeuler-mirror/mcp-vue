<template>
  <el-drawer
    size="880px"
    :title="$t('reliableCenter.selectCloudServer')"
    direction="rtl"
    custom-class=""
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content">
        <div class="left-drawer-body">
          <el-tree
            ref="tree"
            v-loading="treeLoading"
            node-key="uuid"
            :element-loading-text="$t('reliableCenter.packetDataLoading')"
            class="left-server-tree"
            default-expand-all
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <div slot-scope="{ node, data }" class="left-server-tree-node">
              <div class="node-label">
                <div class="node-label-abs">
                  <el-tooltip
                    popper-class="backupdialog-tooltip"
                    effect="light"
                    :content="node.label + ''"
                    placement="top"
                    :visible-arrow="true"
                  >
                    <div>{{ node.label + "" }}</div>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-tree>
        </div>
        <div class="mid-drawer-body">
          <div class="mid-top-search-content">
            <p>{{ $t("reliableCenter.cloudServerList") }}</p>
            <el-input
              :placeholder="$t('reliableCenter.serverSearchTips')"
              suffix-icon="el-icon-search"
              v-model="searchAlike"
              @blur="handelSearchVm"
            >
            </el-input>
          </div>
          <div class="mc-table">
            <el-table
              :data="tableData"
              :row-key="'uuid'"
              style="height: 100%; overflow-y: auto"
              ref="selectServerModalTable"
              @select="handleSelectione"
              @select-all="handleSelectione"
              @cell-mouse-enter="enterCell"
              @cell-mouse-leave="leaveCell"
            >
              <el-table-column
                :selectable="selectable"
                reserve-selection
                type="selection"
                width="40"
              >
              </el-table-column>
              <template v-for="(item, index) in columnArr">
                <el-table-column
                  :key="item.prop + index"
                  :label="item.label"
                  :width="item.width"
                >
                  <template slot-scope="{ row }">
                    <div>
                      {{ row[item.prop] }}
                    </div>
                    <el-popover
                      :ref="'popover' + row.id"
                      trigger="hover"
                      placement="top"
                      :offset="-20"
                    >
                      {{ row.canNotSelectReason }}
                    </el-popover>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <el-pagination
              v-if="total > 0"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
              :current-page="pageNo"
              :page-sizes="[5, 10, 20, 50, 100, 200]"
              :page-size="pageSize"
              :pager-count="5"
              layout="sizes, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
        <div class="right-drawer-body">
          <div class="top-vm-content">
            <div class="top-vm-operate">
              <p>
                {{ $t("reliableCenter.cloudServerSelected") }}({{
                  selectData.length
                }})
              </p>
              <el-input
                :placeholder="$t('reliableCenter.cloudServerName')"
                suffix-icon="el-icon-search"
                v-model="searchVal"
                @blur="searchData = searchVal"
              />
              <p class="del-btn" @click="clearAll">
                {{ $t("reliableCenter.clear") }}
              </p>
            </div>
            <div class="top-vm-seleced-infor">
              <template v-if="showSelectData.length > 0">
                <div
                  class="select-data-infor"
                  v-for="(item, index) in showSelectData"
                  :key="index"
                >
                  {{ item.aliasName }}
                  <i @click="delSelected(index)" class="el-icon-close" />
                </div>
              </template>
              <div class="none-text" v-else>
                {{ $t("reliableCenter.noDataSelected") }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="drawer-foot">
        <el-button
          type="primary"
          :disabled="selectData.length === 0"
          @click="handelSubmit"
          >{{ $t("externalCloud.vmOperate.sure") }}</el-button
        >
        <el-button @click="handelClose">{{
          $t("externalCloud.vmOperate.cancel")
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import mcTable from "@/components/MctablePro";
import statuscell from "@/components/statuscell";
import { getServerVmGroup, getServerVmList } from "@/api/commonApi";
export default {
  name: "choosenVmBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    clusterId: {
      type: Number,
      default: 1,
    },
    selectVmList: {
      type: Array,
      default: null,
    },
    canDisBol: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      drawerLoading: false,
      treeLoading: false,
      tableLoading: false,
      groupName: "",
      groupId: "",
      searchVal: "",
      searchData: "",
      treeData: [],
      tableData: [],
      selectData: [],
      defaultProps: {
        label: "groupName",
      },
      columnArr: [
        // "名称"
        {
          label: this.$t("reliableCenter.cloudServerName"),
          prop: "aliasName",
        },
        // 类型
        {
          label: this.$t("reliableCenter.description"),
          prop: "description",
        },
      ],
      groupName: "",
      searchAlike: "",
      pageSize: 10,
      pageNo: 1,
      rowSelectFlag: false,
      total: 0,
    };
  },
  components: { mcTable, statuscell },
  computed: {
    showSelectData() {
      /*
       * 模糊搜索
       * */
      return this.selectData.filter(
        (item) =>
          item.aliasName
            .toLowerCase()
            .indexOf(this.searchData.toLowerCase()) !== -1
      );
    },
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.getServerVmGroup();
      }
    },
  },
  methods: {
    selectable(row, index) {
      return this.canDisBol && row.canSelect;
    },
    intModel() {
      if (!this.selectVmList || this.selectVmList.length === 0) return;
      const newArr = [];
      this.selectVmList.forEach((e) => {
        const selectedObj = {
          aliasName: e.machineName,
          uuid: e.machineUuid,
        };
        this.$refs.selectServerModalTable.toggleRowSelection(selectedObj, true);
        newArr.push(selectedObj);
      });
      this.rowSelectFlag = false;
      this.$set(this, "selectData", newArr);
    },

    getServerVmGroup() {
      this.drawerLoading = true;
      getServerVmGroup({ clusterId: this.clusterId })
        .then((res) => {
          this.treeData = res;
          this.groupName = res[0].groupName || "";
          this.renderTable("init");
        })
        .catch(() => {
          this.drawerLoading = false;
        });
    },
    handelClose() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
    handleNodeClick(e) {
      this.groupId = e.groupId || "";
      this.groupName = e.groupName;
      this.pageNo = 1;
      this.renderTable();
    },
    changeExpand(bol) {
      this.expandAll = bol;
      this.expandNodes(this.$refs.tree.store.root);
    },
    // 遍历树形数据，设置每一项的expanded属性，实现展开收起
    expandNodes(node) {
      const expendBol = node.level > 1 ? this.expandAll : true;
      node.expanded = expendBol;
      // 默认第一级不做操作
      for (let i = 0; i < node.childNodes.length; i++) {
        node.childNodes[i].expanded =
          node.childNodes[i].level > 2 ? this.expandAll : true;
        if (node.childNodes[i].childNodes.length > 0) {
          this.expandNodes(node.childNodes[i]);
        }
      }
    },
    renderTable(type) {
      this.tableLoading = true;
      this.drawerLoading = true;
      const params = {
        clusterId: this.clusterId, // 分组的id  如果是全部  为空 ,
        groupName: this.groupName, // 编辑的时候的策略id 如果是创建 不需要,
        searchAlike: this.searchAlike, // 查询条件 （虚拟机的名称）
        pageSize: this.pageSize, // 每页的行数
        pageNo: this.pageNo, // 当前页码
      };
      getServerVmList(params)
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.tableLoading = false;
          if (type === "init") {
            this.rowSelectFlag = true;
            this.intModel();
          }
        })
        .catch((err) => {
          console.error("err", err);
          this.tableLoading = false;
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
    handelSearchVm() {
      this.pageSize = 10;
      this.pageNo = 1;
      this.renderTable();
    },
    setSelect() {
      this.selectData.forEach((e) => {
        this.tableData.forEach((element) => {
          if (element.uuid === e.uuid) {
            this.$refs.selectServerModalTable.toggleRowSelection(element, true);
          }
        });
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
    handleSelectione(e) {
      // if (this.rowSelectFlag) return;
      this.selectData = e;
    },
    clearAll() {
      this.$refs.selectServerModalTable.clearSelection();
      this.selectData = [];
    },
    handelSubmit() {
      this.$emit("selectChange", this.selectData);
      this.handelClose();
    },
    selectWeekDaysChange(selectWeekDays) {
      this.backupFrequencyForm.selectWeekDays = selectWeekDays.toString();
    },
    delSelected(e) {
      const newArr = this.selectData.slice(0);
      this.$refs.selectServerModalTable.toggleRowSelection(
        this.selectData[e],
        false
      );
      newArr.splice(e, 1);
      this.selectData = newArr;
    },
    // 判断是否进入行
    enterCell(row, column, cell) {
      if (this.canDisBol && !row.canSelect && column.type === "selection") {
        this.$refs["popover" + row.id][0].doShow();
      }
    },
    // 判断是否离开行
    leaveCell(row, column, cell) {
      if (this.canDisBol && !row.canSelect && column.type === "selection") {
        this.$refs["popover" + row.id][0].doClose();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-body-content {
  flex-direction: row;
  border-top: 1px solid rgba(204, 204, 204, 1);
  .left-drawer-body {
    width: 200px;
    height: 100%;
    overflow-y: scroll;
  }
  .mid-drawer-body {
    flex: 1;
    padding: 8px 10px;
    border-left: 1px solid rgba(204, 204, 204, 1);
    border-right: 1px solid rgba(204, 204, 204, 1);
    .mc-table {
      height: 94%;
    }
  }
  .right-drawer-body {
    width: 280px;
    height: 100%;
    overflow-y: scroll;
  }
  .right-drawer-body ::v-deep .el-input {
    width: 120px;
  }
}

.top-vm-content {
  width: 100%;
  padding: 8px 10px;
  border-bottom: none;
  .top-vm-operate {
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    align-items: center;
    p {
      margin: 0;
    }
    .del-btn {
      color: $btnBg;
      cursor: pointer;
    }
  }
  .top-vm-seleced-infor {
    display: flex;
    flex-wrap: wrap;
  }
  .select-data-infor {
    padding: 15px 0;
    border-bottom: 1px solid #d9d6d6;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .none-text {
    text-align: center;
    width: 100%;
    margin-top: 20px;
    line-height: 20px;
  }
}
.vm-tree-select-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  border: 1px solid #eee;
  .left-tree {
    border-right: 1px solid #eee;
    overflow-y: scroll;
    width: 20%;
  }
  .right-table {
    width: 80%;
    height: 100%;
  }
}

.left-server-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .node-count {
    margin-left: 20px;

    i {
      padding: 2px;
      border: 1px solid #333;
      margin-left: 3px;
      color: #333;
      font-size: 10px;
      transform: scale(0.8);
    }

    i:hover {
      color: #409eff;
      border-color: #409eff;
    }
  }
}
.mc-table::v-deep {
  .el-table-column--selection .cell,
  .el-table__expand-column .cell {
    padding-left: 14px;
  }
}
.mid-top-search-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  ::v-deep {
    .el-input {
      width: 200px;
    }
  }
}
</style>
