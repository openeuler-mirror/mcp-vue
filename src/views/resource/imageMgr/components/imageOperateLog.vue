<template>
  <!-- imageDetail-Log 操作日志-->
  <div class="imageDetail-Log">
    <div class="imageDetail-oper">
      <el-button class="el-icon-refresh setting-icon" @click="refreshTable" />
    </div>
    <div class="imageDetail-table">
      <mc-table
        ref="imageDetailtable"
        :data="tableData"
        :total="total"
        :short-height="60"
        :rowkey="rowkey"
        :lazy="true"
        :load="imageDetailtableload"
        :treeProps="imagetreeProps"
      >
        >
        <template v-for="(item, index) in columnArr">
          <!-- 操作 -->
          <el-table-column
            v-if="item.prop == 'operation'"
            fixed="right"
            :key="index"
            :label="item.label"
            :width="item.width"
            className="tableoperation"
          >
            <template slot-scope="{ row }">
              <el-link type="primary" @click="viewOperationDetail(row)">
                查看操作详情
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop == 'percent'"
            :key="index + 'percent'"
            :label="item.label"
            :width="item.width"
            className="tableoperation"
          >
            <template slot-scope="{ row }">
              <logPercentBox :percent="row.percent"></logPercentBox>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :prop="item.prop"
            :key="item.prop + index"
            :label="item.label"
            :width="item.width"
            :sortable="item.sortable"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                v-if="item.tooltipsFlag"
                effect="light"
                :content="row[item.prop] + ''"
                placement="top-start"
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

    <el-dialog
      title="操作详情"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose"
    >
      <div>
        <div v-for="(value, key, i) in dialogVisData" :key="i">
          {{ key }}：{{ value }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          $t("common.cancel")
        }}</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          {{ $t("common.confirm") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOperateLogByObjId,
  listChildOperateLogList,
} from "@/api/operateLog";
import mcTable from "@/components/MctablePro";
import imageStatus from "./imageStatus.vue";
import dictionary from "@/assets/common/dataDictionary/dictionary";
import imageLogDic from "@/assets/common/dataDictionary/imageLogDic";
import logPercentBox from "./logPercentBox";
export default {
  name: "imageDetail-Log",
  components: {
    mcTable,
    imageStatus,
    logPercentBox,
  },
  data() {
    return {
      imageId: this.$route.params.id,
      tableData: [],
      rowkey: "operateLogId",
      columnArr: [
        {
          label: "类型", // "类型",
          prop: "typeDesc",
          width: "200px",
        },
        {
          label: "操作", // "操作",
          prop: "actionDesc",
          width: "200px",
          tooltipsFlag: true,
        },
        {
          label: "状态", // "状态",
          prop: "statusDesc",
          width: "100px",
        },
        {
          label: "百分比进度", // "百分比进度",
          prop: "percent",
          width: "200px",
        },
        {
          label: "对象名称", // "对象名称",
          prop: "objName",
          width: "200px",
          tooltipsFlag: true,
        },
        {
          label: "操作详情", // "操作详情",
          prop: "detailDesc",
          width: "200px",
          tooltipsFlag: true,
        },
        {
          label: "结果描述", // "结果",
          prop: "result",
          width: "200px",
        },
        {
          label: "开始时间", // "开始时间",
          prop: "startTime",
          width: "200px",
          tooltipsFlag: true,
        },
        {
          label: "结束时间", // "结束时间",
          prop: "endTime",
          width: "200px",
          tooltipsFlag: true,
        },
        {
          label: "操作", // "操作",
          prop: "operation",
          width: "200px",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      imagetreeProps: {
        children: "children",
        hasChildren: "hasChildOperateLog",
      },
      dialogVisible: false,
      dialogVisData: {},
    };
  },
  created() {
    this.getvdcDetailLog();
  },
  methods: {
    viewOperationDetail(row) {
      this.dialogVisData = JSON.parse(row.detailDesc);
      this.dialogVisible = true;
    },
    handleClose(row) {
      this.dialogVisible = false;
      this.dialogVisData = {};
    },
    refreshTable() {
      this.tableData = [];
      this.pageNo = 1;
      this.pageSize = 20;
      this.getvdcDetailLog();
    },
    getvdcDetailLog() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".imageDetail-Log");
      });
      let pramas = {
        objId: this.imageId,
        type: "IMAGE",
        // 分页数1开始
        pageNo: this.pageNo,
        // 每页数量
        pageSize: this.pageSize,
      };
      listOperateLogByObjId(pramas)
        .then((res) => {
          this.tableData = this.totableData(res.list);
          this.total = res.pageInfo.total;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
          this.total = 0;
          this.$hideFullScreenLoading();
        });
    },
    imageDetailtableload(tree, treeNode, resolve) {
      let params = {
        parentLogId: tree.operateLogId,
      };
      listChildOperateLogList(params)
        .then((res) => {
          let trdTableData = this.totableData(res);
          resolve(trdTableData);
        })
        .catch((err) => {
          resolve([]);
          this.alertTips(err);
        });
    },

    totableData(list) {
      let { operateLogTypeList, imageActionList, operateLogStatusList } =
        dictionary;
      list.forEach((element, index) => {
        let { type, action, status, detail } = element;

        // 日志类型映射
        list[index].typeDesc = dictionary.getDesc(type, operateLogTypeList);

        // 操作类型映射
        list[index].actionDesc = dictionary.getDesc(action, imageActionList);

        // 状态类型映射
        list[index].statusDesc = dictionary.getDesc(
          status,
          operateLogStatusList
        );
        // 操作详情映射
        list[index].detailDesc = imageLogDic.getLabelDesc(
          action,
          JSON.parse(detail)
        );
      });
      return list;
    },
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.imageDetail-Log {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .imageDetail-oper {
    width: 100%;
    margin: 15px 0;
    display: flex;
    justify-content: flex-end;
    .setting-icon {
      font-size: 14px;
    }
  }
  .imageDetail-table {
    flex: 1;
  }
}
</style>
