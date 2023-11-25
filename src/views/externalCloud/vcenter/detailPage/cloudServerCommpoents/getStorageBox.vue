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
          @selection-change="handlerSelectionChange"
          :currentPage="pageNo"
          :getSelectBolFnc="getSelectBol"
        >
          <template v-for="(item, index) in columnArr">
            <el-table-column
              v-if="item.prop == 'datastoreCapacityUsedRate'"
              :key="item.prop + index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <mcAllocationratio
                  :option="{
                    percentage: row.datastoreCapacityUsedRate * 1,
                  }"
                ></mcAllocationratio>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column
              v-else-if="item.prop == 'datastoreStatus'"
              :key="index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <span v-if="row.datastoreStatus === 1" class="success">
                  <!-- 正常 -->
                  {{ $t("externalCloud.statuscell.NORMAL") }}
                </span>
                <span v-else class="error">
                  <!-- 异常 -->
                  {{ $t("externalCloud.statuscell.HALT") }}
                </span>
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
import { getdataStoreByHostname, getStorageByHostname } from "@/api/vcenter";
import mcAllocationratio from "@/components/Mcallocationratio";
export default {
  name: "getStorageBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vcenterId: {
      type: String,
      default: "",
    },
    hostName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "dataStore",
    },
    locationData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { mcTable, mcAllocationratio },
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
      total: 0,
      pageSize: 1000,
      pageNo: 1,
      columnArr: [
        // "名称"
        {
          label: this.$t("externalCloud.vcenter.name"),
          prop: "datastoreName",
        },
        // 类型
        {
          label: this.$t("externalCloud.vcenter.type"),
          prop: "datastoreType",
          width: 100,
        },
        // 状态
        {
          label: this.$t("externalCloud.vcenter.status"),
          prop: "datastoreStatus",
          width: 100,
        },
        // 总容量
        {
          label: this.$t("externalCloud.vcenter.storageTotalCapacity") + "(GB)",
          prop: "datastoreTotalCapacity",
          width: 150,
        },
        // 利用率
        {
          label: this.$t("externalCloud.vcenter.useRate"),
          prop: "datastoreCapacityUsedRate",
          width: 150,
        },
      ],
    };
  },
  methods: {
    getSelectBol(row) {
      return row.datastoreStatus === 1;
    },
    intData() {
      this.drawerLoading = true;
      if (this.type === "dataStore") {
        const params = {
          pageNo: 1,
          pageSize: 1000,
          vcenterId: this.vcenterId * 1,
          hostName: this.hostName,
        };
        getdataStoreByHostname(params)
          .then((res) => {
            this.tableData = res;
          })
          .finally(() => {
            this.drawerLoading = false;
          });
      }
      if (this.type === "location") {
        const { locationType, locationName } = this.locationData;
        const params = {
          pageNo: 1,
          pageSize: 1000,
          vcenterId: this.vcenterId * 1,
          locationType,
          locationName,
        };
        getStorageByHostname(params)
          .then((res) => {
            const resData = [];
            //后端参数名不同！！！！前端转译！

            res.forEach((element) => {
              const {
                storageName,
                storageType,
                storageTotalCapacity,
                storageFreeCapacity,
                storageCapacityUsedRate,
                storageStatus,
                storageCapacityUnit,
              } = element;
              resData.push({
                datastoreName: storageName,
                datastoreType: storageType,
                datastoreTotalCapacity: storageTotalCapacity,
                datastoreFreeCapacity: storageFreeCapacity,
                datastoreCapacityUsedRate: storageCapacityUsedRate,
                datastoreStatus: storageStatus,
                datastoreCapacityUnit: storageCapacityUnit,
              });
            });

            this.tableData = resData;
          })
          .finally(() => {
            this.drawerLoading = false;
          });
      }
    },
    submitData() {
      const {
        targetServerName,
        cloneServerDescription,
        hostName,
        datastoreName,
      } = this.form;

      const data = {
        sourceServerName: this.choosenData.sourceServerName,
        targetServerName,
        cloneServerDescription,
        hostName,
        datastoreName,
      };
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
