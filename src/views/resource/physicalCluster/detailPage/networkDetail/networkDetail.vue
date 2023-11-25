<template>
  <div class="app-container">
    <headerBox @refresh="renderTable" :spinBol="showLoading">
      <template slot="headerLeft">
        <el-button @click="addNetworkSpecification">{{
          $t("resourceMgr.addSpec")
        }}</el-button>
        <el-button
          @click="hadnelDel()"
          :disabled="selectTableData.length === 0"
          >{{ $t("resourceMgr.delSpec") }}</el-button
        >
      </template>
    </headerBox>
    <mc-table
      ref="networkDetail"
      :data="tableData"
      :total="total"
      :tableLoading="showLoading"
      :pageSize="pageSize"
      :currentPage="pageNo"
      selectionType="multipleTable"
      @current-change="handlePageChange"
      @handleSelectione="handlerSelectionChange"
      @size-change="handleSizeChange"
    >
      <template v-for="(item, index) in tableColumns">
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
                ? $t("resourceMgr.layerNet2")
                : $t("resourceMgr.layerNet3")
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
          v-else-if="item.prop == 'userate'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <div class="oper-content">
              <el-link type="primary" @click="editInfo(row)">
                {{ $t("common.modify") }}
              </el-link>
              <el-link type="primary" @click="viewRow(row)">
                <!-- 查看 -->
                {{ $t("common.view") }}
              </el-link>
              <el-link type="primary" @click.stop="hadnelDel(row)">
                {{ $t("common.delete") }}
              </el-link>
            </div>
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
    <netWorkSpec
      :visible.sync="showNetWorkSpecification"
      :dataInfo="dataInfo"
      :formOptions="formOptions"
      @freshTable="renderTable"
    ></netWorkSpec>
    <networkSpecDetail
      :visible.sync="showSpecDEtail"
      :clusterName="clusterName"
      :networkSpecId="networkSpecId"
    ></networkSpecDetail>
  </div>
</template>
<script>
import { getNetworkCardList } from "@/api/commonApi";
import { handelDelSpec, handelGetSpecDetail } from "@/api/vdcapi";
import netWorkSpec from "./netWorkSpec.vue";
import headerBox from "@/components/headerBox";
import mcTable from "@/components/MctablePro";
import dictionary from "@/assets/common/dataDictionary/dictionary";
import networkSpecDetail from "@/components/networkSpecDetail";

export default {
  name: "networkDetail",
  components: { mcTable, headerBox, netWorkSpec, networkSpecDetail },
  props: {
    dataInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      pageInfo: {},
      selectTableData: [],
      showSpecDEtail: false,
      networkSpecId: null,
      showLoading: false,
      clusterName: "",
      formOptions: {
        editflag: false,
        formData: {},
      },
      tableColumns: [
        // "网络名称"
        {
          label: this.$t("resourceMgr.network.networkName"),
          prop: "networkName",
        },
        // 描述
        {
          label: this.$t("resourceMgr.clusterRemark"),
          prop: "networkDescription",
        },
        // 网络层级
        {
          label: this.$t("resourceMgr.network.networkHierarchy"),
          prop: "networkLevelType",
        },
        // 网卡类型
        {
          label: this.$t("resourceMgr.network.modelType"),
          prop: "modelType",
        },
        // 地址池
        {
          label: this.$t("resourceMgr.network.addressPool"),
          prop: "addressPool",
        },
        // 虚拟交换机
        {
          label: this.$t("resourceMgr.network.virtualSwitch"),
          prop: "virtualSwitch",
        },
        // 创建时间
        {
          label: this.$t("resourceMgr.zonecreateDate"),
          prop: "createTime",
        },
        // 操作
        {
          label: this.$t("resourceMgr.task.action"),
          prop: "userate",
          width: "200px",
        },
      ],
      tableData: [],

      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      showNetWorkSpecification: false,
    };
  },
  mounted() {
    this.clusterName = this.dataInfo.name;
    this.renderTable();
  },
  methods: {
    getStorageType(type) {
      return dictionary.storage.type[type];
    },
    getTableData() {
      this.showLoading = true;
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        clusterId: this.dataInfo.clusterId,
      };
      getNetworkCardList(pramas)
        .then((res) => {
          this.tableData = res.list;
        })
        .finally((err) => {
          this.showLoading = false;
        });
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    handlerSelectionChange(e) {
      this.selectTableData = e;
    },
    hadnelDel(row) {
      let networkSpecIds = "";
      if (row) {
        networkSpecIds = row.networkSpecId;
      } else {
        const ids = this.selectTableData.map((e) => e.networkSpecId);
        networkSpecIds = ids.join(",");
      }
      const tips = row
        ? this.$t("resourceMgr.delSpecTips")
        : this.$t("resourceMgr.delManySpecTips");
      this.$confirm(tips, this.$t("resourceMgr.tips"), {
        confirmButtonText: this.$t("resourceMgr.storage.sure"),
        cancelButtonText: this.$t("resourceMgr.storage.cancel"),
        type: "warning",
      }).then((e) => {
        handelDelSpec({ networkSpecIds }).then((res) => {
          this.$message({
            type: "success",
            message: this.$t("resourceMgr.deleteSucc"),
          });
          this.renderTable();
        });
      });
    },
    editInfo(row) {
      //编辑
      this.showLoading = true;
      this.formOptions.editflag = true;
      handelGetSpecDetail({ networkSpecId: row.networkSpecId })
        .then((res) => {
          this.$set(this.formOptions, "formData", res);
          this.showNetWorkSpecification = true;
        })
        .finally((e) => {
          this.showLoading = false;
        });
    },
    viewRow(row) {
      //查看
      this.showSpecDEtail = true;
      this.networkSpecId = row.networkSpecId;
    },
    renderTable() {
      this.formOptions = {
        editflag: false,
        formData: {},
      };
      this.pageNo = 1;
      this.pageSize = 20;
      this.getTableData();
    },
    addNetworkSpecification() {
      this.formOptions = {
        editflag: false,
        formData: {},
      };
      this.showNetWorkSpecification = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.oper-content {
  display: flex;
  justify-content: space-between;
}
</style>
