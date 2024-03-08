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
        :defaultSelectedKeys="defaultSelectedKeysNew"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        @handleSelectione="handleSelectione"
        :rowkey="rowkey"
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
import { listRole } from "@/api/roleMgr";
import dictionary from "@/assets/common/dataDictionary/dictionary";

export default {
  components: { mcTable, footBtn },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    roleOrgId: {
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
      rowkey: "roleId",
      columnArr: [
        { label: this.$t("authorityMgr.roleName"), prop: "roleName" },
        {
          label: this.$t("authorityMgr.roleType"),
          prop: "roleTypeDesc",
        },
        {
          label: this.$t("authorityMgr.remark"), // "描述",
          prop: "remark",
          tooltipsFlag: true,
        },
        // {
        //   label: "创建时间",
        //   prop: "createTime",
        // },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      selectList: [],
      defaultSelectedKeysNew: [],
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  created() {
    this.getRoleList();
  },
  computed: {},
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
    getRoleList() {
      this.renderTable();
    },
    renderTable() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orgId: this.roleOrgId,
        searchKey: this.input,
      };
      listRole(pramas)
        .then((res) => {
          this.tableData = this.totableData(res);

          this.$hideFullScreenLoading();

          let list = [];
          this.defaultSelectedKeys.forEach((element) => {
            let listi = this.getChidlren(
              this.tableData,
              "roleId",
              element.roleId
            );
            list.push(listi);
          });

          this.defaultSelectedKeysNew = list;
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
          this.alertTips(err);
        });
    },
    totableData(list) {
      list.forEach((element, index) => {
        let { roleType } = element;
        list[index].roleTypeDesc = dictionary.getDesc(
          roleType,
          dictionary.roleTypeArr
        );
      });
      return list;
    },
    getChidlren(dataList, key, id) {
      let data = dataList;
      var hasFound = false; // 表示是否有找到id值
      var result = null;
      var fn = function (data) {
        if (Array.isArray(data) && !hasFound) {
          // 判断是否是数组并且没有的情况
          data.forEach((item) => {
            if (item[key] === id) {
              // 数据循环每个子项，并且判断子项下边是否有id值
              result = item; // 返回的结果等于每一项
              hasFound = true; // 并且找到id值
            } else if (item.children) {
              fn(item.children); // 递归调用下边的子项
            }
          });
        }
      };
      fn(data); // 调用一下
      return result;
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
