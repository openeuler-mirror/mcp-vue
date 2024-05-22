<template>
  <div class="flex justify-center">
    <!-- <span>操作</span> -->
    <el-popover
      v-show="visible"
      placement="bottom-start"
      trigger="click"
      width="150"
    >
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <el-checkbox-group
        v-model="checkedColumn"
        @change="handlecheckedColumnChange"
      >
        <el-checkbox
          v-for="(item, index) in filterData"
          :key="index"
          :label="item.prop"
          :disabled="item.checkedDisabled"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
      <i slot="reference" class="el-icon-d-arrow-right" />
    </el-popover>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    // 表格每列的数据，用于设置筛选展示的列
    filterData: {
      type: Array,
      default: () => [],
    },
    // 存储到cookie 的表格名称，用户获取显示列
    columnName: {
      type: String,
      default: "column-setting",
    },
  },
  data() {
    return {
      isIndeterminate: false,
      checkAll: false,
      checkedColumn: [],
    };
  },
  created() {
    this.visible && this.defaultSetting();
  },
  methods: {
    //   全选
    handleCheckAllChange(val) {
      let checkedColumnArr = [];
      let filterDataArr = [];
      this.filterData.forEach((element) => {
        const { checkedDisabled, prop } = element;
        if (val) {
          checkedColumnArr.push(prop);
          filterDataArr.push(element);
        } else {
          if (checkedDisabled) {
            checkedColumnArr.push(prop);
            filterDataArr.push(element);
          }
        }
      });
      this.checkedColumn = checkedColumnArr;
      this.isIndeterminate = false;
      this.$emit("tableColumn", filterDataArr);
      Cookies.set(this.columnName, this.checkedColumn);
    },
    // 单个选中
    handlecheckedColumnChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.filterData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.filterData.length;
      this.$emit("tableColumn", this.filterTableColumn(value));
      Cookies.set(this.columnName, value);
    },
    filterTableColumn(arr) {
      return this.filterData.filter((item) => arr.includes(item.prop));
    },
    // 从cookie 中获取显示列
    defaultSetting() {
      const columnOldName = Cookies.get(this.columnName);
      const arr = columnOldName ? JSON.parse(columnOldName) : [];
      if (arr.length) {
        this.setDefaultSetting(arr);
      } else {
        const showArr = this.filterData.filter((item) => item.show);
        this.setDefaultSetting(showArr.map((item) => item.prop));
      }
    },
    // 根据cookie 设置
    setDefaultSetting(arr) {
      this.checkAll = this.filterData.length === arr.length;
      this.checkedColumn = arr;
      this.$emit("tableColumn", this.filterTableColumn(arr));
    },
  },
};
</script>

<style scoped lang="scss">
i.el-icon-d-arrow-right {
  transform: rotate(90deg);
}

.el-checkbox-group {
  .el-checkbox {
    display: block;
    margin-left: 10px;
  }
}
</style>
