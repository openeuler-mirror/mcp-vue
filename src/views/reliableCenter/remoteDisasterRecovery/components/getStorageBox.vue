<template>
  <el-drawer
    size="880px"
    :title="$t('externalCloud.vmOperate.chooseLocation')"
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
            <el-table-column
              v-if="item.prop == 'useRate'"
              :key="item.prop + index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <mcAllocationratio
                  :option="{
                    percentage: calculatePercentage(
                      row.usedSize,
                      row.totalSize
                    ),
                  }"
                ></mcAllocationratio>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column
              v-else-if="item.prop == 'status'"
              :key="index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <statuscell :status="row.status"></statuscell>
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
import { getClusterPageStorageList } from "@/api/vcenter";
import mcAllocationratio from "@/components/Mcallocationratio";
import transformat from "@/utils/transformat";
import statuscell from "@/components/statuscell/index.vue";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  name: "getStorageBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    clusterId: {
      type: Number,
      default: null,
    },
    hostName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "dataStore",
    },
    selectData: {
      type: Object,
      default: () => {},
    },
  },
  components: { mcTable, mcAllocationratio, statuscell },
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
        // "名称"
        {
          label: this.$t("externalCloud.vcenter.name"),
          prop: "name",
          width: 150,
        },
        // 类型
        {
          label: this.$t("externalCloud.vcenter.type"),
          prop: "type",
        },
        // 状态
        {
          label: this.$t("externalCloud.vcenter.status"),
          prop: "status",
        },
        // 总容量
        {
          label: this.$t("externalCloud.vcenter.storageTotalCapacity") + "(GB)",
          prop: "totalSize",
          width: 150,
        },
        // 利用率
        {
          label: this.$t("externalCloud.vcenter.useRate"),
          prop: "useRate",
          width: 150,
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
        getClusterPageStorageList(params)
          .then((res) => {
            this.tableData = res;
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
      const data = this.tableData.find((e) => e.id === this.selectData.id);
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
