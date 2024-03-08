<template>
  <!-- 云服务器告警策略 physicalServerAlertPolicy -->
  <div class="physicalServerAlertPolicy flex1">
    <mc-table
      ref="physicalServerAlertPolicy"
      :data="tableData"
      :rowkey="rowkey"
      :selectionType="selectionType"
    >
      <template v-for="(item, index) in columnArr">
        <el-table-column
          v-if="item.prop == 'type'"
          :key="item.prop"
          :resizable="index != 0 && index != columnArr.length - 1"
          :label="item.label"
          :width="item.width"
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
          :resizable="index != 0 && index != columnArr.length - 1"
          :label="item.label"
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
          :resizable="index != 0 && index != columnArr.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <div class="input-box">
              <el-input
                v-model="row[item.prop]"
                :disabled="!row.edit"
                oninput="this.value=this.value.replace(/\D|^0/g,'')"
              >
                <i slot="prefix" class="el-input__icon">≥</i>
              </el-input>
            </div>
          </template>
        </el-table-column>
      </template>
    </mc-table>
  </div>
</template>

<script>
import { listAlarmSettings, updateAlarmSettings } from "@/api/monitoringApi";
import mcTable from "@/components/MctablePro";
import { validNum } from "@/utils/validate.js";

export default {
  name: "cloudServerAlarmPolicy",
  props: ["clusterId"],
  components: {
    mcTable,
  },
  data() {
    return {
      rowkey: "alarmSettingId",
      //   selectionType: "multipleTable",
      selectionType: "",
      columnArr: [
        {
          label: this.$t("alarmSetting.type"), // "类型",
          prop: "type",
          width: "300px",
        },
        {
          label: this.$t("alarmSetting.ordinaryValue"), // "一般告警",
          prop: "ordinaryValue",
          width: "300px",
        },
        {
          label: this.$t("alarmSetting.seriousValue"), // "严重告警",
          prop: "seriousValue",
          width: "300px",
        },
        {
          label: this.$t("alarmSetting.urgentValue"), // "紧急告警",
          prop: "urgentValue",
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
    // this.renderTable();
  },
  watch: {
    clusterId(val) {
      this.renderTable();
    },
  },
  methods: {
    // 刷新表格
    refreshTable() {
      this.renderTable();
    },
    renderTable() {
      let pramas = {
        clusterId: this.clusterId, // 物理集群ID
        alarmSettingType: "Server", // 设置类型
        // 枚举: ServerVirtualization,Server
        // 枚举备注: ServerVirtualization 云服务器告警策略 Server 物理服务器告警策略
      };
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      listAlarmSettings(pramas)
        .then((res) => {
          this.tableData = res;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
        });
    },
    handlerCancel(row) {
      row.urgentValue = row.originVal.urgentValue; // 紧急告警
      row.seriousValue = row.originVal.seriousValue;
      row.ordinaryValue = row.originVal.ordinaryValue;
      row.edit = false;
      this.tableData = JSON.parse(JSON.stringify(this.tableData));
    },

    // 编辑确认
    testModifyText(row) {
      const urgentValue = row.urgentValue;
      const seriousValue = row.seriousValue;
      const ordinaryValue = row.ordinaryValue;

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

      if (status.type) {
        let params = {
          clusterId: this.clusterId, // 集群ID
          alarmSettingId: row.alarmSettingId, // 告警设置ID
          urgentValue: row.urgentValue, // 紧急阈值
          ordinaryValue: row.ordinaryValue, // 一般阈值
          seriousValue: row.seriousValue, // 严重阈值
        };
        updateAlarmSettings(params).then((res) => {
          row.edit = false;
          this.tableData = JSON.parse(JSON.stringify(this.tableData));
          this.$rmsg.success(this.$t("common.updateSuccess"));
        });
      } else {
        this.$rmsg.warning(status.message);
      }
    },
    handlerModify(row) {
      row.edit = true;
      row.originVal = {
        urgentValue: row.urgentValue,
        seriousValue: row.seriousValue,
        ordinaryValue: row.ordinaryValue,
      };
      this.tableData = JSON.parse(JSON.stringify(this.tableData));
    },
  },
};
</script>
<style lang="scss" scoped>
</style>