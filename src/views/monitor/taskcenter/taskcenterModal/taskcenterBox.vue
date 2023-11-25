<template>
  <div class="drawer-content">
    <div class="taskcenterBox-table">
      <mc-table
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        :rowkey="rowkey"
        :lazy="true"
        :load="taskcentertableload"
        :treeProps="taskcentertreeProps"
      >
        <template v-for="(item, index) in columnArr">
          <!-- 操作 -->
          <el-table-column
            v-if="item.prop == 'operation'"
            fixed="right"
            :key="'operation' + index"
            :label="item.label"
            :width="item.width"
            className="tableoperation"
          >
            <template slot-scope="{ row }">
              <el-link type="primary" @click="viewInfo(row)">
                {{ $t("common.view") }}
              </el-link>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            v-else-if="item.prop == 'status'"
            :key="'status' + index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <testCenterstatus :pageData="row"></testCenterstatus>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
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
    <teskDetail
      :options="teskDetailModalOption"
      :visible.sync="showteskDetailModal"
    ></teskDetail>
  </div>
</template>
<script>
import mcTable from "@/components/MctablePro";
import { pageOperateLog, childOperateLogList } from "@/api/taskcenter";
import dictionary from "@/assets/common/dataDictionary/dictionary";
import testCenterstatus from "../testCenterstatus.vue";
import teskDetail from "../teskDetail/teskDetailModal.vue";

export default {
  components: { mcTable, testCenterstatus, teskDetail },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rowkey: "rowkey",
      columnArr: [
        {
          label: this.$t("taskcenter.taskObjectType"), //  对象类型
          prop: "type",
          width: "200px",
        },
        {
          label: this.$t("taskcenter.taskName"), // 任务名称
          prop: "action",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.taskObject"), //  对象
          prop: "objName",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.taskStatus"), // 状态
          prop: "status",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.startingTime"), // 开始时间
          prop: "startTime",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.endTime"), // 结束时间
          prop: "endTime",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.operator"), // 操作者
          prop: "operateUser",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.operatorIp"), // 操作用户IP
          prop: "clientIp",
          width: "200px",
        },
        {
          label: this.$t("taskcenter.organization"), // 所属组织
          prop: "orgName",
          width: "200px",
        },

        {
          label: this.$t("taskcenter.availabilityZone"), //  可用区
          prop: "zoneName",
          width: "200px",
        },
        {
          label: this.$t("common.operation"), // 操作
          prop: "operation",
          width: "100px",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 10,
      taskcentertreeProps: {
        children: "children",
        hasChildren: "hasChildOperateLog",
      },
      showteskDetailModal: false,
      teskDetailModalOption: {
        title: "",
        formData: "", // 表单数据
      },
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.renderTable();
  },
  computed: {},
  methods: {
    // 提交
    handlerConfirm() {
      this.commitCreate();
    },
    commitCreate() {
      this.$parent.closeDrawer();
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
    renderTable() {
      this.tableData = [];
      this.$nextTick(() => {
        this.$showFullScreenLoading(".taskcenterBox-table");
      });
      let pramas = {
        pageSize: this.pageSize, //	string	非必须 分页数量
        pageNo: this.pageNo, // 非必须 页面
        type: "", // 类型
        action: "", // 操作
        status: "", // 状态
        startDate: "", // 开始时间
        endDate: "", // 结束时间
      };
      pageOperateLog(pramas)
        .then((res) => {
          const list = this.totableData(res.list);
          this.$set(this, "tableData", list);
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
          this.alertTips(err);
        });
    },
    totableData(list) {
      list.forEach((element, index) => {
        element.statusValue = element.enumStatus;
        element.rowkey = "rowkey" + new Date() + index;
      });
      return list;
    },
    taskcentertableload(tree, treeNode, resolve) {
      let params = {
        parentLogId: tree.operateLogId,
      };
      childOperateLogList(params)
        .then((res) => {
          let trdTableData = this.totableData(res);
          resolve(trdTableData);
        })
        .catch((err) => {
          resolve([]);
          this.alertTips(err);
        });
    },
    viewInfo(row) {
      this.teskDetailModalOption = {
        title: this.$t("taskcenter.checkTheDetails"), // "查看详情",
        formData: row, // 表单数据
      };
      this.showteskDetailModal = true;
    },
    cancelInfo() {},
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.taskcenterBox-table {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 10px;
}
</style>
