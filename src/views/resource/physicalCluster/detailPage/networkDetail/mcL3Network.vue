<template>
  <el-drawer
    size="880px"
    :title="title"
    direction="rtl"
    :append-to-body="true"
    :modal="false"
    custom-class="setVirtualFirewall"
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <div class="drawer-content">
      <div class="drawer-body-content">
        <mc-table
          ref="bindVirtualFirewallTable"
          :data="l3NetworkList"
          @handleSelectione="handleSelectione"
          default-expand-all
          selectionType="singleTable"
          style="margin-top: 20px"
        >
          <template v-for="(item, index) in columnArr">
            <el-table-column
              v-if="item.prop === 'mcL3NetworkType'"
              :key="index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <span>{{
                  row[item.prop] === "1"
                    ? $t("resourceMgr.pubNet")
                    : $t("resourceMgr.vpcNet")
                }}</span>
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
      <div class="drawer-foot">
        <el-button type="primary" @click="handlerConfirm">
          {{ $t("externalCloud.vmOperate.sure") }}
        </el-button>
        <el-button @click="handleCloseCreate">
          {{ $t("externalCloud.vmOperate.cancel") }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import mcTable from "@/components/MctablePro";
import footBtn from "@/components/Footbtn";
export default {
  name: "mcL3Network",
  components: { footBtn, mcTable },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    defaultTableData: {
      type: Array,
      default() {
        return [];
      },
    },
    l3NetworkList: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: this.$t("resourceMgr.network.netSpec3rd"),
      drawerVisible: this.visible,
      tableData: [],
      columnArr: [
        {
          //
          label: this.$t("resourceMgr.network.networkName"), // "网络名称",
          prop: "mcL3NetworkName",
          width: "200",
        },
        {
          label: this.$t("resourceMgr.vMwareMgr.type"), // "类型",
          prop: "mcL3NetworkType",
        },
        {
          label: this.$t("resourceMgr.网络段"), // "网络段",
          prop: "mcL3NetworKDhcpIp",
        },
      ],
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      isvis ? this.setPageData() : "";
    },
  },
  methods: {
    setPageData() {
      this.tableData = this.l3NetworkList;
      let selected = [];
      if (
        this.defaultSelectedKeys.length > 0 &&
        this.defaultSelectedKeys[0].threeLayerNetworkId
      ) {
        this.defaultSelectedKeys.forEach((element) => {
          let { threeLayerNetworkId } = element;
          selected.push(threeLayerNetworkId);
        });
        this.$nextTick(() => {
          for (let i = 0; i < selected.length; i++) {
            let row = this.tableData.find((item) => {
              return item.mcL3NetworkId.toString() === selected[i].toString();
            });
            if (row) {
              this.$refs.bindVirtualFirewallTable.$refs.elTable.toggleRowSelection(
                row
              );
            }
          }
        });
      }
    },
    handleSelectione(rows) {
      this.selectList = rows;
    },
    handleCloseCreate() {
      this.$emit("update:visible", false);
      // this.$parent.renderTable();
    },
    handlerConfirm(rows) {
      this.$emit("confirm", this.selectList);
      this.handleCloseCreate();
    },
  },
};
</script>

<style lang="scss" scoped></style>
