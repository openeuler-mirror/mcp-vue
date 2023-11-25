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
        :defaultSelectedKeys="defaultSelectedList"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        @handleSelectione="handleSelectione"
        :rowkey="rowkey"
        :treeProps="treeProps"
        default-expand-all
        selectionType="singleTable"
      >
        <template v-for="(item, index) in columnArr">
          <el-table-column :key="index" :label="item.label" :width="item.width">
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
import { transferCanSelectOrg } from "@/api/serverVm";

export default {
  components: { mcTable, footBtn },
  props: {
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
    formOptions: {
      type: Object,
      default: () => ({}),
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
      defaultSelectedList: [],
    };
  },
  watch: {},
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
      let { formData } = this.formOptions;
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let params = {
        clusterId: formData.clusterId,
        machineUUid: formData.machineUUid,
      };
      transferCanSelectOrg(params)
        .then((res) => {
          this.tableData = res;
          this.setselected();
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
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
            if (item[key].toString() === id) {
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
    setselected() {
      let { formData } = this.formOptions;
      //兼容默认分组没有id情况
      let selected = formData.orgId ? formData.orgId.toString() : "";
      let selectedArr = selected.split(",");
      let list = [];
      selectedArr.forEach((element) => {
        let listi = this.getChidlren(this.tableData, "organizationId", element);
        list.push(listi);
      });
      this.defaultSelectedList = list;
    },
    handlePageChange() {},
    handleSizeChange() {},
    handleSelectione(rows) {
      this.selectList = rows;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.bind-table {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  max-height: 82vh;
  padding: 20px 30px;
}
</style>
