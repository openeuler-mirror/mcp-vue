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
        ref="bindVirtualFirewallTable"
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        @handleSelectione="handleSelectione"
        :rowkey="rowkey"
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

export default {
  components: { mcTable, footBtn },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    defaultTableData: {
      type: Array,
      default: () => [],
    },
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      input: "",
      rowkey: "virtualFirewallId",
      columnArr: [
        {
          label: this.$t("resourceMgr.virtualFirewallName"), // "名称",
          prop: "virtualFirewallName",
          width: "200",
        },
        {
          label: this.$t("resourceMgr.virtualFirewallRemark"), // "说明",
          prop: "virtualFirewallRemark",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  created() {},
  mounted() {
    this.setPageData();
  },
  computed: {},
  methods: {
    setPageData() {
      this.tableData = this.defaultTableData;
      let selected = [];
      this.defaultSelectedKeys.forEach((element) => {
        let { virtualFirewallId } = element;
        selected.push(virtualFirewallId);
      });
      this.$nextTick(() => {
        for (let i = 0; i < selected.length; i++) {
          let row = this.tableData.find(
            (item) =>
              item.virtualFirewallId.toString() === selected[i].toString()
          );
          if (row) {
            this.$refs.bindVirtualFirewallTable.$refs.elTable.toggleRowSelection(
              row
            );
          }
        }
      });
    },
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
