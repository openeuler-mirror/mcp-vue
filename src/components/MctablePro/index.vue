<template>
  <div class="mc-table">
    <div class="mc-table-box">
      <div class="mc-table-box-abs" ref="elTableabs">
        <el-table
          ref="elTable"
          border
          :data="tableData"
          style="width: 100%; height: 100%"
          :height="tableHeight"
          :class="[total > 0 ? 'hasPagination' : '', selectionType]"
          @select="handleSelectione"
          @select-all="handleSelectione"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          @row-click="rowSelect"
          @filter-change="filterChange"
          v-loading.lock="tableLoading"
          :element-loading-text="$t('common.loadingText')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.2)"
          :tree-props="treeProps"
          :row-key="getRowKey"
          :default-expand-all="defaultExpandAll"
          :lazy="lazy"
          :load="load"
        >
          <el-table-column
            v-if="selectionType && selectionType !== 'ownSelect'"
            :selectable="getSelectBolFnc"
            type="selection"
            width="40"
          >
          </el-table-column>
          <slot />
          <span slot="empty"> </span>
        </el-table>
      </div>
    </div>
    <el-pagination
      v-if="total > 0"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 50, 100, 200]"
      :page-size="pageSize"
      background
      :layout="paginationLayout"
      :total="total"
      :hide-on-single-page="hideOnSinglePage"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    // 表格渲染的数据
    data: {
      type: Array,
      default: () => [],
    },
    // 总页数
    total: {
      type: Number,
      default: 0,
    },
    // 当前查询每次数量
    pageSize: {
      type: Number,
      default: 0,
    },
    //当前页
    currentPage: {
      type: Number,
      default: 0,
    },
    tableLoading: {
      type: Boolean,
      default: false,
    },
    // 渲染嵌套数据的配置选项
    treeProps: {
      type: Object,
      default() {
        return { children: "children", hasChildren: "hasChildren" };
      },
    },
    getSelectBolFnc: {
      type: Function,
      default: (row, index) => {
        return true;
      },
    },
    // 行数据的 Key，用来优化 Table 的渲染
    rowkey: { type: String, default: "id" },
    // 表格的选择类型   multipleTable/singleTable/ownSelect   多选/单选/自定义选择
    selectionType: { type: String, default: "" },
    // 表格默认选中项
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    load: {
      type: Function,
    },
    // 只有一页时是否隐藏
    hideOnSinglePage: {
      type: Boolean,
      default: false,
    },
    paginationLayout: {
      type: String,
      default: "total, sizes, prev, pager, next",
    },
  },
  data() {
    return {
      tableData: this.data,
      tableHeight: null,
    };
  },
  watch: {
    data(val) {
      this.$refs.elTable.clearSelection();
      this.tableData = val;
      this.toggleSelection();
      this.$nextTick(() => {
        this.calcTableHeight();
      });
    },
  },
  // watch: {
  //   data: {
  //     handler: function (newValue, oldValue) {
  //       if (newValue) {
  //         this.$refs.elTable.clearSelection();
  //         this.tableData = newValue;
  //         this.toggleSelection();
  //         this.$nextTick(() => {
  //           this.calcTableHeight();
  //         });
  //       }
  //     },
  //     // 代表在wacth里声明了 立即先去执行handler方法
  //     immediate: false,
  //     deep: true,
  //   },
  // },
  mounted() {
    this.calcTableHeight();
    this.toggleSelection();
    window.onresize = () => {
      this.calcTableHeight();
    };
  },
  methods: {
    getRowKey(row) {
      return row[this.rowkey];
    },
    toggleSelection() {
      let list = this.defaultSelectedKeys;
      list = list.filter((n) => n);
      if (list.length > 0) {
        this.$nextTick(() => {
          this.setTableSelection(list);
        });
      }
    },
    doLayout() {
      this.$refs.elTable.doLayout();
    },
    calcTableHeight() {
      if (this.$refs.elTableabs) {
        this.tableHeight = this.$refs.elTableabs.offsetHeight;
      }
    },
    handlePageChange(page) {
      this.$emit("current-change", page);
    },
    handleSizeChange(pageSize) {
      this.$emit("size-change", pageSize);
    },
    handleSelectione(selection, row) {
      let key = this.selectionType;
      let selectionList = [];
      switch (key) {
        case "multipleTable":
          this.$refs.elTable.clearSelection();
          selectionList = selection;
          this.setTableSelection(selectionList);
          break;
        case "ownSelect": // 多选
          selectionList = selection;
          this.setTableSelection(selectionList);
          break;
        case "singleTable": // 单选
          this.$refs.elTable.clearSelection();
          selectionList = selection.slice(-1);
          this.setTableSelection(selectionList);
          break;
        default:
          this.$refs.elTable.clearSelection();
          selectionList = selection;
          break;
      }
      this.$emit("handleSelectione", selectionList);
    },
    handleSelectionChange(selection) {
      // 返回选中的数组
      this.$emit("selection-change", selection);
    },

    setTableSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.elTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.elTable.clearSelection();
      }
    },
    handleSortChange(option) {
      // 点击就筛选回调
      this.$emit("sort-change", option);
    },
    rowSelect(row, column, event) {
      // 返回选中的数组

      let key = this.selectionType;
      let selectionList = JSON.parse(
        JSON.stringify(this.$refs.elTable.selection)
      );
      let hasrowFlag = false;
      switch (key) {
        case "multipleTable": // 多选
          selectionList.forEach((element) => {
            if (element[this.rowkey] == row[this.rowkey]) {
              hasrowFlag = true;
            }
          });
          if (hasrowFlag) {
            this.$refs.elTable.toggleRowSelection(row, false);
          } else {
            this.$refs.elTable.toggleRowSelection(row, true);
          }
          break;
        case "singleTable": // 单选
          selectionList.forEach((element) => {
            if (element[this.rowkey] == row[this.rowkey]) {
              hasrowFlag = true;
            }
          });
          if (hasrowFlag || !this.getSelectBolFnc(row)) {
            this.$refs.elTable.toggleRowSelection(row, false);
          }
          //判断是否符合传入规则以及选中改行 才进行选中行更改
          if (!hasrowFlag && this.getSelectBolFnc(row)) {
            this.$refs.elTable.clearSelection();
            this.$refs.elTable.toggleRowSelection(row, true);
          }
          break;
        default:
          break;
      }

      this.$emit("handleSelectione", this.$refs.elTable.selection);
      this.$emit("row-click", row);
    },
    filterChange(filters) {
      // 点击就筛选回调
      this.$emit("filter-change", filters);
    },
  },
};
</script>

<style lang="scss">
.mc-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  .mc-table-box {
    position: relative;
    display: flex;
    flex: 1;
    .mc-table-box-abs {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .el-checkbox,
  .el-checkbox__input {
    display: grid;
    position: unset;
  }
}
.singleTable {
  .el-table__header-wrapper {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }
  //外边框的样式
  .el-checkbox__inner {
    width: 16px !important;
    height: 16px !important;
    border: 1px solid #19a9ff !important;
    background: none !important;
    border-radius: 50% !important;
  }
  //选中里面的样式
  .el-checkbox__inner::after {
    width: 8px !important;
    height: 8px !important;
    border: 1px solid #19a9ff !important;
    background: #19a9ff !important;
    border-radius: 50%;
    top: calc(50% - 5px) !important;
    left: calc(50% - 5px) !important;
  }
  //修改定位以及加载动画
  .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: translate(0%, 0%) rotate(0) scale(1, 1) !important;
  }
}

// 表格
.el-table--enable-row-transition .el-table__body td {
  transition: none;
}
.el-table .cell {
  .el-tooltip {
    white-space: nowrap;
  }
}
.el-table th > .cell {
  font-weight: normal !important;
  // color: $fontColor;
}
.el-table i {
  margin-right: 3px;
}
.el-table--border {
  border: none;
}
// .el-table__row > td {
//   border: none;
// }
.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid #ebeef5;
}

.el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 0px solid #ebeef5;
}

.el-table th.is-leaf .cell::after {
  height: 26px;
  width: 2px;
  background-color: #ebeef5;
  content: "";
  position: absolute;
  z-index: 1;
  right: 0px;
  top: calc(50% - 13px);
}
.el-table th.is-leaf:nth-last-child(2) .cell::after,
.el-table--border::after,
.el-table--group::after,
.el-table__fixed-right::before,
.el-table__fixed::before,
.el-table::before {
  width: 0px !important;
}

.el-table-column--selection,
.el-table__expand-column {
  .cell {
    padding: 0;
  }
}

.el-table th,
.el-table__fixed-right-patch {
  background-color: #f5f7fa;
}

.el-table .el-table__row {
  height: 46px;
  td {
    padding: 0;
  }
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #fafafa;
}
.el-pagination {
  text-align: right;
  padding: 12px 0;
}
</style>
