<template>
  <div class="drawer-content">
    <div class="bind-table">
      <div>
        <el-input
          :placeholder="$t('common.placeholder')"
          v-model="input"
          @change="inputchange"
        >
          <template slot="prepend">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </div>
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
        selectionType="singleTable"
        style="margin-top: 20px"
      >
        <template v-for="(item, index) in columnArr">
          <el-table-column :key="index" :label="item.label" :width="item.width">
            <template slot-scope="{ row }">
              <el-tooltip
                v-if="item.tooltipsFlag"
                effect="light"
                :content="row[item.prop] + ''"
                placement="top"
                :visible-arrow="true"
              >
                <span>{{ row[item.prop] }}</span>
              </el-tooltip>
              <span v-else>{{ row[item.prop] }}</span>
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
import { pageUserByOrg } from "@/api/userMgr";
import dictionary from "@/assets/common/dataDictionary/dictionary";

export default {
  components: { mcTable, footBtn },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      input: "",
      rowkey: "userId",
      columnArr: [
        {
          label: this.$t("transferMgr.userName"), // "用户名称"
          prop: "userName",
        },
        {
          label: this.$t("transferMgr.realName"), // "真实姓名"
          prop: "realName",
        },
        {
          label: this.$t("transferMgr.roleName"), // "角色名称"
          prop: "roleName",
          tooltipsFlag: true,
        },
        {
          label: this.$t("transferMgr.orgName"), // "所属组织"
          prop: "orgName",
        },
      ],
      roleOrgId: "",
      tableData: [
        // { userId: "1", userName: "用户名称1" },
        // { userId: "2", userName: "用户名称2" },
        // { userId: "3", userName: "用户名称3" },
      ],
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
    // this.getRoleList();
  },
  computed: {},
  mounted() {
    this.initrenderTable();
  },
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
    initrenderTable() {
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
    },
    renderTable() {
      let { formData } = this.formOptions;
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orgId: formData.orgId,
        searchKey: this.input,
        searchSelfUser: this.formOptions.transforType === "MCDEFAULT",
      };
      pageUserByOrg(pramas)
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.setselected();
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
          this.alertTips(err);
        });
    },
    setselected() {
      let { formData } = this.formOptions;
      let selected = formData.userId.toString();
      let selectedArr = selected.split(",");
      let list = [];
      this.tableData.forEach((element) => {
        let { userId } = element;
        let checkid = userId.toString();
        if (selectedArr.indexOf(checkid) > -1) {
          list.push(element);
        }
      });
      this.defaultSelectedList = list;
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.renderTable();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.renderTable();
    },
    inputchange() {
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
    },
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
