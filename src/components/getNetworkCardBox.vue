<template>
  <el-drawer
    size="900px"
    title="选择网卡规格"
    direction="rtl"
    custom-class=""
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content">
        <mc-table
          :data="tableData"
          :total="total"
          selectionType="singleTable"
          :pageSize="pageSize"
          :defaultSelectedKeys="defaultSelectedKeys"
          @handleSelectione="handlerSelectionChange"
          :currentPage="pageNo"
        >
          <template v-for="(item, index) in columnArr">
            <!-- 网络层级 -->
            <el-table-column
              v-if="item.prop == 'networkLevelType'"
              :key="index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                {{
                  row.networkLevelType === "LAYER_2_NETWORK"
                    ? "2层网络"
                    : "3层网络"
                }}
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop == 'type'"
              :key="index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <span>{{ getStorageType(row.type) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="item.label + index"
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
        <el-button type="primary" @click="handelSubmit">{{
          $t("externalCloud.vmOperate.sure")
        }}</el-button>
        <el-button @click="handelClose">{{
          $t("externalCloud.vmOperate.cancel")
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import mcTable from "@/components/MctablePro";
import { getNetworkCardList } from "@/api/commonApi";
import transformat from "@/utils/transformat";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  name: "getNetworkCardBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    clusterId: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      default: "dataStore",
    },
    netCardData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { mcTable },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      this.$nextTick(() => {
        isvis ? this.intData() : "";
      });
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      drawerLoading: false,
      tableData: [],
      selectTableData: [],
      defaultSelectedKeys: [],
      total: 0,
      pageSize: 1000,
      pageNo: 1,
      columnArr: [
        // "网络名称"
        {
          label: "网络名称",
          prop: "networkName",
          width: 150,
        },
        // 网络描述
        {
          label: "网络描述",
          prop: "networkDescription",
        },
        // 网络层级
        {
          label: "网络层级",
          prop: "networkLevelType",
        },
        // 网卡类型
        {
          label: "网卡类型",
          prop: "modelType",
        },
        // 网络类型
        {
          label: "网络类型",
          prop: "interfaceType",
        },
        // 地址池
        {
          label: "地址池",
          prop: "addressPool",
        },
        // 虚拟交换机
        {
          label: "虚拟交换机",
          prop: "virtualSwitch",
        },
      ],
    };
  },
  methods: {
    getStorageType(type) {
      return dictionary.storage.type[type];
    },
    getSelectBol(row) {
      return row.datastoreStatus === 1;
    },
    intData() {
      this.drawerLoading = true;
      if (this.type === "dataStore") {
        const params = {
          pageNo: 1,
          pageSize: 1000,
          clusterId: this.clusterId,
        };
        getNetworkCardList(params)
          .then((res) => {
            this.tableData = res.list;
            this.selectData ? this.setDefaultSelect() : "";
          })
          .finally(() => {
            this.drawerLoading = false;
          });
      }
    },
    handelClose() {
      this.$emit("update:visible", false);
    },
    handlerSelectionChange(e) {
      this.selectTableData = e;
    },
    handelSubmit() {
      this.$emit("selectChange", this.selectTableData);
      this.handelClose();
    },
    // 计算百分比
    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
    },
    setDefaultSelect() {
      const data = this.tableData.find(
        (e) => e.id === this.selectData.networkSpecId
      );
      this.$set(this, "defaultSelectedKeys", [data]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.success {
  color: $msgSuccess;
}
.error {
  color: $msgDanger;
}
</style>
