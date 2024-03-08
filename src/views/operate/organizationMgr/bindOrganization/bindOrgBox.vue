<template>
  <div class="drawer-content">
    <div class="bind-table">
      <!-- <div>
        <el-input placeholder="请输入内容" v-model="input">
          <template slot="prepend"
            ><el-button slot="append" icon="el-icon-search"></el-button
          ></template>
        </el-input>
      </div> -->
      <mc-table
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        :defaultSelectedKeys="defaultSelectedKeysNew"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        @handleSelectione="handleSelectione"
        :rowkey="rowkey"
        :treeProps="treeProps"
        default-expand-all
        selectionType="singleTable"
        style="margin-top: 20px"
      >
        <template v-for="(item, index) in columnArr">
          <el-table-column
            :key="index"
            :resizable="index != 0 && index != columnArr.length - 1"
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
import { queryParentOrg } from "@/api/organization";

export default {
  name: "BindOrgBox",
  components: { mcTable, footBtn },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    organizationId: {
      type: Number,
    },
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      input: "",
      rowkey: "organizationId",
      treeProps: { children: "children", hasChildren: "hasChildren" },
      columnArr: [
        {
          label: this.$t("authorityMgr.organizationName"),
          prop: "organizationName",
        },
        { label: this.$t("authorityMgr.remark"), prop: "remark" },
      ],
      tableData: [],
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
  },
  created() {
    this.getParentOrgList();
  },
  computed: {},
  methods: {
    // 提交
    handlerConfirm() {
      this.commitCreate();
    },
    commitCreate() {
      this.$emit("confirm", this.selectList);
      this.$parent.closeDrawer();
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
    getParentOrgList() {
      queryParentOrg({ organizationId: this.organizationId })
        .then((res) => {
          this.tableData = res;
          let list = [];
          this.defaultSelectedKeys.forEach((element) => {
            let listi = this.getChidlren(
              this.tableData,
              "organizationId",
              element.organizationId
            );
            list.push(listi);
          });
          this.defaultSelectedKeysNew = list;
        })
        .catch((err) => {
          this.alertTips(err);
        });
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
    handlePageChange() {},
    handleSizeChange() {},
    handleSelectione(rows) {
      this.selectList = rows;
    },
  },
};
</script>

<style lang="scss" scope >
@import "~@/styles/mixin.scss";
@include DrawerRtl;

.bind-table {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  max-height: 82vh;
  padding: 0 50px;
}
</style>