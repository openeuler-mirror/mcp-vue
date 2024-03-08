<template>
  <div class="platformAlarmlog">
    <!-- 头部菜单栏 -->
    <header-bar ref="headerBar" @refreshTable="refreshTable" />

    <mc-table
      ref="platformAlarmlogTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
      style="margin-top: 20px"
    >
      <template v-for="(item, index) in columnArr">
        <el-table-column
          :prop="item.prop"
          :resizable="index != 0 && index != columnArr.length - 1"
          :key="item.prop + index"
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
</template>

<script>
import mcTable from "@/components/MctablePro";
import headerBar from "./platformAlarmlogHeader.vue";
import { pageKcpAlarmLog } from "@/api/monitoringApi";
import dictionary from "@/assets/common/dataDictionary/dictionary";

export default {
  name: "platformAlarmlog",
  components: {
    headerBar,
    mcTable,
  },
  data() {
    return {
      rowkey: "",
      columnArr: [
        {
          label: this.$t("monitoring.alarmEvtMap.severity"), // "告警级别",
          prop: "alarmLevelDesc",
        },
        {
          label: this.$t("monitoring.alarmEvtMap.type"), // "告警名称",
          prop: "resourceTypeDesc",

          tooltipsFlag: true,
        },
        {
          label: this.$t("monitoring.alarmEvtMap.date"), // "告警时间",
          prop: "alarmTime",
        },
        {
          label: this.$t("monitoring.alarmEvtMap.objectName"), // "告警对象",
          prop: "alarmTarget",

          tooltipsFlag: true,
        },
        {
          label: this.$t("monitoring.alarmEvtMap.objectType"), // "对象类型",
          prop: "targetTypeDesc",
        },
        {
          label: this.$t("monitoring.alarmEvtMap.info"), // "详情",
          prop: "alarmDetail",

          width: "300px",
          tooltipsFlag: true,
        },
        {
          label: this.$t("alarmSetting.zoneName"), // "可用区",
          prop: "zoneName",
          tooltipsFlag: true,
        },
        {
          label: this.$t("alarmSetting.orgName"), // "所在组织",
          prop: "orgName",
          tooltipsFlag: true,
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 10,
      startDate: "", // 开始时间(YYYY-MM-DD)
      endDate: "", // 结束时间(YYYY-MM-DD)
      zoneId: 0, // 可用区ID（全部可用时传0）
      orgId: 0, // 组织ID （全部组织时传0）
    };
  },
  created() {
    // this.renderTable();
  },
  methods: {
    // 刷新表格
    refreshTable(params) {
      this.pageNo = 1;
      this.pageSize = 10;
      this.startDate = params.startDate; // 开始时间(YYYY-MM-DD)
      this.endDate = params.endDate; // 结束时间(YYYY-MM-DD)
      this.zoneId = params.zoneId; // 可用区ID（全部可用时传0）
      this.orgId = params.orgId; // 组织ID （全部组织时传0）
      this.renderTable(params);
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
    renderTable() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let params = {
        pageSize: this.pageSize, //	string	非必须 分页数量
        pageNo: this.pageNo, // 非必须 页面
        startDate: this.startDate, // 开始时间(YYYY-MM-DD)
        endDate: this.endDate, // 结束时间(YYYY-MM-DD)
        zoneId: this.zoneId, // 可用区ID（全部可用时传0）
        orgId: this.orgId, // 组织ID （全部组织时传0）
      };
      pageKcpAlarmLog(params)
        .then((res) => {
          this.tableData = this.totableData(res.list);
          this.total = res.pageInfo.total;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
        });
    },
    totableData(list) {
      list.forEach((element, index) => {
        let { resourceType, alarmLevel, targetType } = element;
        // 告警名称映射
        list[index].resourceTypeDesc = dictionary.getDesc(
          resourceType,
          dictionary.resourceTypeArr
        );
        // 告警级别映射
        list[index].alarmLevelDesc = dictionary.getDesc(
          alarmLevel,
          dictionary.alarmLevelArr
        );
        // 对象类型映射
        list[index].targetTypeDesc = dictionary.getDesc(
          targetType,
          dictionary.targetTypeArr
        );
      });
      return list;
    },
  },
};
</script>

<style lang="scss" scoped>
.platformAlarmlog {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>