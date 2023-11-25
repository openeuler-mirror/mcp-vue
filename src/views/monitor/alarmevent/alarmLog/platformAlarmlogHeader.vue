<template>
  <div class="header-outbox">
    <div class="header-box">
      <div class="header-left">
        <!-- 时间 -->
        <el-date-picker
          style="margin-left: 15px"
          v-model="timeData"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :range-separator="$t('common.to')"
          :start-placeholder="$t('common.startdate')"
          :end-placeholder="$t('common.enddate')"
          @change="timeDatachange"
        >
        </el-date-picker>
        <el-select
          style="margin-left: 15px"
          v-model="alarmType"
          placeholder="请选择告警类型"
          @change="refresh"
        >
          <el-option
            v-for="item in alertList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 可用区 -->
        <!-- <el-select
          style="margin-left: 15px"
          v-model="zoneValue"
          placeholder="请选择可用区"
          @change="zoneChange"
        >
          <el-option
            v-for="item in zoneList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-cascader
          v-model="cascaderValue"
          style="margin-left: 15px"
          :show-all-levels="false"
          :options="cascaderoptions"
          :props="cascaderprops"
          @change="cascaderChange"
        >
        </el-cascader> -->
      </div>
      <div class="header-right">
        <!-- <searchInput @change="searchInputChange" /> -->
        <utilsButton type="fresh" :spinBol="spinBol" @refresh="refresh" />
        <!-- <i
          v-if="currentBtnShow('exportAlarmLog')"
          class="el-icon-download setting-icon"
          style="margin-left: 15px"
          title="导出"
          @click="refresh"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import utilsButton from "@/components/utilsButton";
import searchInput from "@/components/SearchInput";
import { zoneList } from "@/api/vdcapi";
import { queryOrgTree } from "@/api/organization";
export default {
  components: {
    utilsButton,
    searchInput,
  },
  props: {
    spinBol: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timeData: "",
      timeDataObj: {
        startTime: "",
        endTime: "",
      },
      zoneValue: 0,
      alarmType: "",
      alertList: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "VDC-CPU使用率",
          value: "VDC_CPU",
        },
        {
          label: "VDC-内存使用率",
          value: "VDC_MEM",
        },
        {
          label: "VDC-存储使用率",
          value: "VDC_STORAGE",
        },
        {
          label: "异地容灾-链路检测",
          value: "SITE_LICK_CHECK",
        },
        {
          label: "云服务器使用到期",
          value: "MACHINE_EXPIRE",
        },
      ],
      zoneList: [],
      cascaderValue: 0,
      cascaderprops: {
        checkStrictly: true,
        emitPath: false,
        value: "organizationId",
        label: "organizationName",
        children: "children",
      },
      cascaderoptions: [],
      inputValue: "",
    };
  },
  watch: {},
  created() {
    this.getFilter();
  },
  methods: {
    getFilter() {
      let getZoneList = zoneList();
      let getOrgTreeList = queryOrgTree();
      Promise.all([getZoneList, getOrgTreeList])
        .then((res) => {
          this.getzoneList(res[0]);
          this.getorgTreeList(res[1]);
          this.getTableData();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    getzoneList(res) {
      let list = [
        {
          value: 0,
          label: this.$t("alarmSetting.allZone"), // "全部可用区"
        },
      ];
      res.forEach((element) => {
        list.push({
          value: element.zoneId,
          label: element.name,
        });
      });
      this.zoneValue = list[0].value;
      this.zoneList = list;
    },
    zoneChange(val) {
      this.zoneValue = val;
      this.getTableData();
    },

    getorgTreeList(res) {
      let list = [
        {
          organizationId: "0",
          organizationName: this.$t("alarmSetting.allOrganization"), //  "全部组织"
        },
      ];
      list.push(res[0]);
      this.cascaderValue = list[0].organizationId;
      this.cascaderoptions = list;
    },
    cascaderChange(val) {
      this.cascaderValue = val;
      this.getTableData();
    },
    getTableData() {
      let params = {
        startDate: this.timeDataObj.startTime, // 开始时间(YYYY-MM-DD)
        endDate: this.timeDataObj.endTime, // 结束时间(YYYY-MM-DD)
        alarmType: this.alarmType,
        // zoneId: this.zoneValue, // 可用区ID（全部可用时传0）
        // orgId: this.cascaderValue, // 组织ID （全部组织时传0）
        // inputValue: this.inputValue,
      };
      this.$emit("refreshTable", params);
    },
    // 搜索
    searchInputChange(val) {
      this.inputValue = val;
      this.getTableData();
    },
    // 刷新
    refresh() {
      this.getTableData();
    },
    // 选择时间
    timeDatachange(date) {
      let startTime = "";
      let endTime = "";
      if (date) {
        startTime = this.$moment(date[0]).format("YYYY-MM-DD");
        endTime = this.$moment(date[1]).format("YYYY-MM-DD");
      }
      this.timeDataObj = {
        startTime: startTime,
        endTime: endTime,
      };
      this.getTableData();
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
