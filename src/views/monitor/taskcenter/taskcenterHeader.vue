<template>
  <div class="header-outbox">
    <div class="header-box">
      <div class="header-left">
        <!-- 类型 -->
        <el-select
          v-model="typeValue"
          :placeholder="$t('taskcenter.allTypePlac')"
          @change="typeChange"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 任务 -->
        <el-select
          v-model="teskValue"
          :placeholder="$t('taskcenter.allTasksPlac')"
          @change="teskChange"
        >
          <el-option
            v-for="item in teskList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 状态-->
        <el-select
          v-model="statusValue"
          :placeholder="$t('taskcenter.allStatusPlac')"
          @change="statusChange"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 时间 -->
        <el-date-picker
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
      </div>
      <div class="header-right">
        <utilsButton type="fresh" :spinBol="spinBol" @refresh="refresh" />
      </div>
    </div>
  </div>
</template>

<script>
import utilsButton from "@/components/utilsButton";
import searchInput from "@/components/SearchInput";
import {
  getOperateLogType,
  getOperateLogAction,
  getOperateLogStatus,
} from "@/api/taskcenter";
export default {
  components: {
    searchInput,
    utilsButton,
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

      typeValue: "all",
      typeOriList: [
        {
          label: this.$t("taskcenter.allTypes"), // "全部类型",
          value: "all",
        },
      ],
      typeList: [],

      teskValue: "all",
      teskOriList: [
        {
          label: this.$t("taskcenter.allTasks"), // "全部任务",
          value: "all",
        },
      ],
      teskList: [],

      statusValue: "all",
      statusOriOptions: [
        {
          label: this.$t("taskcenter.allStatus"), // "全部状态",
          value: "all",
        },
      ],
      statusOptions: [],

      startTime: "",
      endTime: "",
    };
  },
  watch: {},
  created() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.typeValue = "all";
      this.teskValue = "all";
      this.statusValue = "all";
      this.startTime = "";
      this.endTime = "";
      this.searchValue = "";
      this.getTsaktypeList();
    },
    getTsaktypeList() {
      let list = JSON.parse(JSON.stringify(this.typeOriList));
      getOperateLogType()
        .then((res) => {
          res.forEach((element) => {
            const { type, i8nMessage } = element;
            list.push({
              label: i8nMessage, // "全部状态",
              value: type,
            });
          });
          this.typeList = list;
          this.typeChange(this.typeList[0].value);
        })
        .catch((err) => {
          this.typeList = list;
          this.typeChange(this.typeList[0].value);
        });
    },
    getTsakstatusList() {
      let list = JSON.parse(JSON.stringify(this.statusOriOptions));
      getOperateLogStatus()
        .then((res) => {
          res.forEach((element) => {
            const { status, i8nMessage } = element;
            list.push({
              label: i8nMessage, // "全部状态",
              value: status,
            });
          });
          this.statusOptions = list;
          this.statusChange(this.statusOptions[0].value);
        })
        .catch((err) => {
          this.statusOptions = list;
          this.statusChange(this.statusOptions[0].value);
        });
    },
    // 刷新
    refresh() {
      let params = {
        typeValue: this.typeValue,
        teskValue: this.teskValue,
        statusValue: this.statusValue,
        startTime: this.startTime,
        endTime: this.endTime,
        searchValue: this.searchValue,
      };
      this.$emit("refreshTable", params);
    },
    typeChange(val) {
      this.typeValue = val;
      this.getTsakList(this.typeValue);
    },
    getTsakList(val) {
      let params = {};
      if (val == "all") {
        params = {};
      } else {
        params = {
          type: val,
        };
      }
      let list = JSON.parse(JSON.stringify(this.teskOriList));
      this.teskList = list;
      getOperateLogAction(params)
        .then((res) => {
          res.forEach((element) => {
            const { action, i8nMessage } = element;
            list.push({
              label: i8nMessage, // "全部状态",
              value: action,
            });
          });
          this.teskList = list;
          this.teskValue = this.teskList[0].value;
          this.getTsakstatusList();
        })
        .catch((err) => {
          this.teskList = list;
          this.teskValue = this.teskList[0].value;
        });
    },
    teskChange(val) {
      this.teskValue = val;
      this.refresh();
    },
    statusChange(val) {
      this.statusValue = val;
      this.refresh();
    },
    // 选择时间
    timeDatachange(date) {
      let startTime = "";
      let endTime = "";
      if (date) {
        startTime = this.$moment(date[0]).format("YYYY-MM-DD");
        endTime = this.$moment(date[1]).format("YYYY-MM-DD");
      }
      this.startTime = startTime;
      this.endTime = endTime;
      this.refresh();
    },
    searchInputChange(val) {
      this.searchValue = val;
      this.refresh();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .el-select {
    margin-right: 15px;
  }
}
</style>
