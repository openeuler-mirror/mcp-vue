<template>
  <el-drawer
    size="880px"
    :title="$t('externalCloud.vmOperate.chooseMirFile')"
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
        >
          <template v-for="(item, index) in columnArr">
            <el-table-column
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
import { handelGetTemplateList } from "@/api/vcenter";
import mcAllocationratio from "@/components/Mcallocationratio";
export default {
  name: "getTemplateBox",
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
      tableData: [],
      selectTableData: [],
      total: 0,
      pageSize: 1000,
      drawerLoading: false,
      pageNo: 1,
      columnArr: [
        // "镜像名称"
        {
          label: this.$t("externalCloud.vmOperate.mirName"),
          prop: "templateName",
        },
        // 操作类型
        {
          label: this.$t("externalCloud.vmOperate.opType"),
          prop: "osType",
          width: 100,
        },
        // 镜像类型
        {
          label: this.$t("externalCloud.vmOperate.osType"),
          prop: "templateType",
        },
        // 镜像大小
        {
          label: this.$t("externalCloud.vmOperate.osSize"),
          prop: "templateSize",
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
      const params = {
        vcenterId: this.vcenterId,
      };
      handelGetTemplateList(params)
        .then((res) => {
          this.tableData = res;
        })
        .finally(() => {
          this.drawerLoading = false;
        });
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
