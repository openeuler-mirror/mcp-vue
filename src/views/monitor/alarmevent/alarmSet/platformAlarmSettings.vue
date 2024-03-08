<template>
  <!-- 云服务器告警策略 cloudServerAlarmPolicy -->
  <div class="cloudServerAlarmPolicy flex1">
    <mc-table
      ref="cloudServerAlarmPolicy"
      :data="tableData"
      :rowkey="rowkey"
      :selectionType="selectionType"
    >
      <template v-for="(item, index) in columnArr">
        <el-table-column
          v-if="item.prop == 'resourceTypeDesc'"
          :key="item.prop"
          :label="item.label"
          :width="item.width"
          :resizable="index != 0 && index != columnArr.length - 1"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.prop == 'operation'"
          fixed="right"
          :key="index"
          :label="item.label"
          :resizable="index != 0 && index != columnArr.length - 1"
          :min-width="item.width || '200px'"
        >
          <template slot-scope="{ row }">
            <div v-if="row.edit">
              <el-button type="primary" @click="handlerconfirm(row)">
                {{ $t("common.confirm") }}
              </el-button>
              <el-button style="margin-left: 15px" @click="handlerCancel(row)">
                {{ $t("common.cancel") }}
              </el-button>
            </div>
            <div v-else>
              <el-button @click="handlerModify(row)">{{
                $t("common.modify")
              }}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.prop"
          :label="item.label"
          :width="item.width"
          :resizable="index != 0 && index != columnArr.length - 1"
        >
          <template slot-scope="{ row }">
            <div class="input-box">
              <el-input
                v-model="row[item.prop]"
                :disabled="!row.edit"
                oninput="this.value=this.value.replace(/\D|^0/g,'')"
              >
                <i slot="prefix" class="el-input__icon el-icon">≥</i>
              </el-input>
            </div>
          </template>
        </el-table-column>
      </template>
    </mc-table>
  </div>
</template>

<script>
import {
  listKcpAlarmSettings,
  updateKcpAlarmSetting,
} from "@/api/monitoringApi";
import mcTable from "@/components/MctablePro";
import { validNum } from "@/utils/validate.js";
import dictionary from "@/assets/common/dataDictionary/dictionary";

export default {
  name: "cloudServerAlarmPolicy",
  props: ["clusterId"],
  components: {
    mcTable,
  },
  data() {
    return {
      rowkey: "kcpSettingId",
      //   selectionType: "multipleTable",
      selectionType: "",
      columnArr: [
        {
          label: this.$t("alarmSetting.indicatorItem"), // "指标项",
          prop: "resourceTypeDesc",
          width: "300px",
        },
        {
          label: this.$t("alarmSetting.ordinaryValue"), // "一般告警",
          prop: "generalAlarm",
          width: "300px",
        },
        {
          label: this.$t("alarmSetting.seriousValue"), // "严重告警",
          prop: "severityAlarm",
          width: "300px",
        },
        {
          label: this.$t("alarmSetting.urgentValue"), // "紧急告警",
          prop: "urgentAlarm",
          width: "300px",
        },
        {
          label: this.$t("common.operation"), // "操作",
          prop: "operation",
          width: "300px",
        },
      ],
      tableData: [],
    };
  },

  created() {
    this.renderTable();
  },
  watch: {
    clusterId(val) {
      //   this.renderTable();
    },
  },
  methods: {
    // 刷新表格
    refreshTable() {
      this.renderTable();
    },
    renderTable() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      listKcpAlarmSettings()
        .then((res) => {
          this.tableData = this.totableData(res);
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
        });
    },
    totableData(list) {
      list.forEach((element, index) => {
        let { resourceType } = element;
        // 告警名称映射
        list[index].resourceTypeDesc = dictionary.getDesc(
          resourceType,
          dictionary.resourceTypeArr
        );
      });
      return list;
    },
    handlerCancel(row) {
      row.generalAlarm = row.originVal.generalAlarm; // 一般
      row.severityAlarm = row.originVal.severityAlarm; // 严重
      row.urgentAlarm = row.originVal.urgentAlarm; // 高级
      row.durationTime = row.originVal.durationTime; // 持续时间
      row.edit = false;
      this.tableData = JSON.parse(JSON.stringify(this.tableData));
    },

    // 编辑确认
    testModifyText(row) {
      const urgentValue = row.urgentAlarm; // 紧急告警
      const seriousValue = row.severityAlarm; // 严重
      const ordinaryValue = row.generalAlarm; // "一般告警"

      function testNum(val) {
        return validNum(val) && parseInt(val) < 100;
      }
      if (
        testNum(urgentValue) &&
        testNum(seriousValue) &&
        testNum(ordinaryValue)
      ) {
        if (
          Number(urgentValue) !== 0 &&
          Number(urgentValue) <= Number(seriousValue)
        ) {
          return { type: false, message: this.$t("alarmSetting.seriousInput") };
        }
        if (
          Number(seriousValue) !== 0 &&
          Number(seriousValue) <= Number(ordinaryValue)
        ) {
          return {
            type: false,
            message: this.$t("alarmSetting.ordinaryInput"),
          };
        }
        return { type: true };
      } else {
        return { type: false, message: this.$t("alarmSetting.thresholdInput") };
      }
    },

    handlerconfirm(row) {
      const status = this.testModifyText(row);
      let message = "";

      if (!status.type) {
        message = status.message;
      }

      if (status.type) {
        let params = {
          kcpSettingId: row.kcpSettingId, // 告警设置ID
          resourceType: row.resourceType, // 类型
          // 枚举: VDC_CPU,VDC_MEM,VDC_STORAGE
          // 枚举备注: VDC_CPU VDC_MEM VDC_STORAGE
          generalAlarm: row.generalAlarm, // 一般告警
          severityAlarm: row.severityAlarm, // 严重告警
          urgentAlarm: row.urgentAlarm, // 紧急告警
          durationTime: row.durationTime, // 持续时间
        };
        updateKcpAlarmSetting(params).then((res) => {
          row.edit = false;
          this.tableData = JSON.parse(JSON.stringify(this.tableData));
          this.$rmsg.success(this.$t("common.updateSuccess"));
        });
      } else {
        this.$rmsg.warning(message);
      }
    },
    handlerModify(row) {
      row.edit = true;
      row.originVal = {
        generalAlarm: row.generalAlarm, // 一般告警
        severityAlarm: row.severityAlarm, // 严重告警
        urgentAlarm: row.urgentAlarm, // 紧急告警
        durationTime: row.durationTime, // 持续时间
      };
      this.tableData = JSON.parse(JSON.stringify(this.tableData));
    },
  },
};
</script>
<style lang="scss" scoped>
</style>