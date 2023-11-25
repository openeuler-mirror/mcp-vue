<template>
  <div class="drawer-content">
    <div class="bind-table">
      <div class="search-box">
        <div class="small-input-box input-box">
          <el-input
            ref="sinput"
            v-model="input"
            :placeholder="$t('common.search')"
            prefix-icon="el-icon-search"
            :clearable="true"
            @change="inputchange"
          />
        </div>
      </div>

      <mc-table
        ref="isotable"
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        :defaultSelectedKeys="defaultSelectedKeysNew"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        @handleSelectione="handleSelectione"
        @row-click="rowSelect"
        :rowkey="rowkey"
        selectionType="singleTable"
        style="margin-top: 20px"
      >
        <template v-for="(item, index) in columnArr">
          <el-table-column
            v-if="item.prop == 'isoLabel'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                class="item"
                effect="light"
                :content="row[item.prop]"
                placement="top"
              >
                <span class="table-ccsl">{{ row[item.prop] }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <span>{{ row[item.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </mc-table>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>
<script>
import mcTable from "@/components/MctablePro";
import footBtn from "@/components/Footbtn";

export default {
  components: { mcTable, footBtn },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
    allIsoList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      input: "",
      rowkey: "isoKey",
      columnArr: [
        {
          label: this.$t("workOrder.isoLabel"), // "ISO镜像名称",
          prop: "isoLabel",
        },
      ],
      tableData: [],
      oritableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      selectList: [],
      defaultSelectedKeysNew: [],
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
    allIsoList: {
      handler(newValue, old) {
        this.renderTable();
      },
      // 代表在wacth里声明了这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true,
    },
  },
  created() {},
  computed: {},
  methods: {
    // 提交
    handlerConfirm() {
      this.commitCreate();
    },
    commitCreate() {
      if (this.selectList.length > 0) {
        this.$emit("confirm", this.selectList);
      }
      this.$parent.closeDrawer();
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },

    renderTable() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: "正在拼命加载中",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)",
      // });
      // let pramas = {
      //   pageNo: this.pageNo,
      //   pageSize: this.pageSize,
      //   // orgId: this.roleOrgId,
      //   searchKey: this.input,
      // };
      // isoList(pramas)
      //   .then((res) => {
      //     // this.total = res.pageInfo.total;
      //     let list = [];
      //     res.forEach((element) => {
      //       list.push({
      //         isoLabel: element,
      //         isoKey: element,
      //       });
      //     });
      //     this.tableData = list;

      //     this.$hideFullScreenLoading();
      //   })
      //   .catch((err) => {
      //     this.$hideFullScreenLoading();
      //     this.alertTips(err);
      //   });

      let list = [];
      this.allIsoList.forEach((element) => {
        list.push({
          isoLabel: element,
          isoKey: element,
        });
      });
      this.input = "";
      this.tableData = list;
      this.oritableData = JSON.parse(JSON.stringify(this.tableData));
      let listNew = [];
      this.defaultSelectedKeys.forEach((element) => {
        let listi = this.getChidlren(this.tableData, "isoKey", element.isoKey);
        listNew.push(listi);
      });

      this.defaultSelectedKeysNew = listNew;
    },
    getChidlren(dataList, key, id) {
      let data = dataList;
      var hasFound = false; // 表示是否有找到id值
      var result = null;
      var fn = function (data) {
        if (Array.isArray(data) && !hasFound) {
          // 判断是否是数组并且没有的情况
          data.forEach((item) => {
            if (item[key] === id) {
              // 数据循环每个子项，并且判断子项下边是否有id值
              result = item; // 返回的结果等于每一项
              hasFound = true; // 并且找到id值
            } else if (item.children) {
              fn(item.children); // 递归调用下边的子项
            }
          });
        }
      };
      fn(data); // 调用一下
      return result;
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
    inputchange() {
      this.pageNo = 1;
      this.pageSize = 20;
      // this.renderTable();
      let search = this.input;

      let data = this.oritableData.filter(
        (data) =>
          !search || data.isoLabel.toLowerCase().includes(search.toLowerCase())
      );
      this.tableData = data;
    },
    handleSelectione(rows) {
      this.selectList = rows;
    },
    rowSelect(row) {
      if (this.selectList.length > 0) {
        let currentRow = this.selectList[0];
        if (currentRow[this.rowkey] == row[this.rowkey]) {
          this.$refs.isotable.handleSelectione([]);
        } else {
          this.$refs.isotable.handleSelectione([row]);
        }
      } else {
        this.$refs.isotable.handleSelectione([row]);
      }
    },
  },
};
</script>
<style>
.bind-table .search-box .small-input-box .el-input__suffix {
  right: 12px;
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.bind-table {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 20px 30px;
  .table-ccsl {
    max-width: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .search-box {
    display: inline-block;
    .el-button {
      margin-left: 15px;
    }
    .small-input-box {
      width: 60px;
      margin-left: 5px;
    }
    .input-box {
      width: 100%;
    }
  }
}
</style>
