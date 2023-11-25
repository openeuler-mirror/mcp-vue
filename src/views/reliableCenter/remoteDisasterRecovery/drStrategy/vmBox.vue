<template>
  <el-drawer
    size="880px"
    :title="$t('reliableCenter.cloudServerList')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content">
        <mc-table :data="tableData" rowkey="machineUuid">
          <template v-for="(item, index) in columnArr">
            <el-table-column
              :key="item.prop + index"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="{ row }">
                <div>
                  <statuscell
                    v-if="item.prop === 'machineStatus'"
                    :status="row.machineStatus"
                  />
                  <span v-else>{{ row[item.prop] }}</span>
                </div>
              </template>
            </el-table-column>
          </template>
        </mc-table>
      </div>
      <div class="drawer-foot">
        <el-button @click="handleCloseCreate">{{
          $t("externalCloud.vmOperate.cancel")
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import mcTable from "@/components/MctablePro";
import statuscell from "@/components/statuscell";
import { getPlanVmList } from "@/api/remoteDisasterRecovery";
export default {
  name: "vmBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    planId: {
      type: Number,
      default: null,
    },
    modelType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      tableData: [],
      drawerLoading: false,
      columnArr: [
        // "名称"
        {
          label: this.$t("reliableCenter.cloudServerName"),
          prop: "machineName",
        },
        // 类型
        {
          label: this.$t("reliableCenter.cloudServerStatus"),
          prop: "machineStatus",
        },
      ],
    };
  },
  components: { mcTable, statuscell },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.getPlanVmList();
      }
    },
  },
  methods: {
    getPlanVmList() {
      this.drawerLoading = true;
      getPlanVmList({ planId: this.planId })
        .then((res) => {
          this.tableData = res;
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
    handleCloseCreate() {
      this.$emit("update:visible", false);
    },
  },
};
</script>
