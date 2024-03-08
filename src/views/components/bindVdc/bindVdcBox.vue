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
      <div class="flex align-center" v-if="otherBtnShow('vdc', 'create_vdc')">
        {{ $t("resourceMgr.vdc.nomatchingVDC") }}
        <el-link type="primary" @click="toCreateVdc">
          {{ $t("common.create") }}
        </el-link>
      </div>
      <mc-table
        ref="bindVdcTable"
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
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
            v-if="item.prop == 'vdcConfigure'"
            :key="index"
            :label="item.label"
            :width="item.width"
            :resizable="index != 0 && index != columnArr.length - 1"
          >
            <template slot-scope="{ row }">
              <span>
                CPU：{{ row.allocationCpu + $t("authorityMgr.cpu") }}；
                {{ $t("authorityMgr.mem") }}：{{ row.allocationMem }}GB；
                {{ $t("authorityMgr.disk") }}：{{ row.allocationDisk }}GB；
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
            :label="item.label"
            :width="item.width"
            :resizable="index != 0 && index != columnArr.length - 1"
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
import { gitVdcNotBindList } from "@/api/organization";
import bus from "@/utils/eventBus";

export default {
  components: { mcTable, footBtn },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vdcparentId: {
      type: String,
      default: "",
    },
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      input: "",
      rowkey: "vdcId",
      treeProps: { children: "children", hasChildren: "hasChildren" },
      columnArr: [
        {
          label: this.$t("authorityMgr.vdcName"),
          prop: "vdcName",
          width: "200",
        },
        { label: this.$t("authorityMgr.vdcConfigure"), prop: "vdcConfigure" },
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
  created() {
    // this.getVdcList();
  },
  mounted() {
    this.getVdcList();
  },
  computed: {},
  methods: {
    toCreateVdc() {
      // localStorage.setItem("kcp-pagekey", "resource");
      bus.$emit("changeMenuNav", "resource");
      this.$router.push({
        name: "vdcPage",
        params: { create: true },
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
    getVdcList() {
      gitVdcNotBindList({ orgId: this.vdcparentId })
        .then((res) => {
          this.tableData = res;
          let selected = [];
          this.defaultSelectedKeys.forEach((element) => {
            let { vdcId } = element;
            selected.push(vdcId);
          });
          this.$nextTick(() => {
            for (let i = 0; i < selected.length; i++) {
              let row = this.tableData.find(
                (item) => item.vdcId.toString() === selected[i].toString()
              );
              if (row) {
                this.$refs.bindVdcTable.$refs.elTable.toggleRowSelection(row);
              }
            }
          });
        })
        .catch((err) => {
          this.alertTips(err);
        });
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
