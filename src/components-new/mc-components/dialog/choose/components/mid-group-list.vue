<template>
  <div class="user-group-list">
    <div class="flex sub-title">
      <mc-input v-model="searchVal" margin="0" :search="true" />
    </div>
    <mc-table
      ref="mcTable"
      :key="groupId"
      :row-key="tableKey"
      style="width:calc(100% - 1px)"
      height="438px"
      :class-name="'white'"
      :list-handler="getTableList"
      :setting-visible="false"
      pagination-layout="prev, pager, next"
      :pager-count="5"
      :is-loading="false"
      :options="options"
      @select="selectChange"
      @selectAll="selectAll"
      @selectRow="selectRow"
      @row-click="rowClick"
      @getTableData="getTableData"
    >
      <el-table-column v-if="tableColumn.length" type="selection" width="40" fixed />
      <el-table-column
        v-for="column in tableColumn"
        :key="column.value"
        :label="column.label"
        align="center"
        :prop="column.value"
        show-overflow-tooltip
        min-width="160px"
        :fixed="column.fixed"
      >
        <template slot-scope="{row}">
          <formatter :row="row" :column="column" />
        </template>
      </el-table-column>
    </mc-table>
  </div>
</template>

<script>
import mcInput from '@/components-new/mc-ui/input/mc-input.vue'
import mcTable from '@/components-new/mc-components/table/mc-table.vue'
import props from '@/components-new/mc-components/dialog/choose/components/props.js'
import formatter from '@/components-new/mc-components/table/select-table/formatter.js'

export default {
  components: {
    mcInput,
    mcTable,
    formatter
  },
  mixins: [props],
  props: {
    // 要查询的分组id
    groupId: {
      required: true,
      type: [Number, String],
      default: 0
    },
    // 编辑时，展示已有数据
    choosedId: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchVal: '',
      tableData: []
    }
  },
  computed: {
    options () {
      const op = {}
      op[this.tableGroupKey] = this.groupId
      return Object.assign(op, this.tableOptions)
    }
  },
  watch: {
    searchVal (val) {
      const params = {}
      params[this.tableSearchKey] = val
      this.$refs.mcTable.reloadTable(params)
    },
    choosedId: {
      deep: true,
      immediate: true,
      handler (val) {
        // 右边已选数据修改时关联中间表格数据
        this.$nextTick(() => {
          const renderTable = this.$refs.mcTable.renderTable()
          renderTable.clearSelection()
          val.forEach(row => {
            if (this.tableData.length && this.tableData.some(item => row === item[this.tableKey])) {
              renderTable.toggleRowSelection(this.tableData.find(item => row === item[this.tableKey]))
            }
          })
        })
      }
    },
    tableColumn: {
      deep: true,
      immediate: true,
      handler (list) {
        // 中间表格数据
        for (const column of list) {
          if (!column.formatter) {
            // 初始化formatter
            column.formatter = function (row, column) {
              return (<span>{row[column.value]}</span>)
            }
          }
        }
      }
    }
  },
  methods: {
    getTableData (table) {
      this.tableData = table
      this.toggleSelectStatus()
    },
    // 点击行
    selectRow (row) {
      this.$emit('selectChange', [row], 'add')
    },
    // 单选
    selectChange (selection, row) {
      const includes = selection.includes(row)
      this.$emit('selectChange', includes ? selection : [row], includes ? 'add' : 'reduce')
    },
    // 全选
    selectAll (selection) {
      this.$emit('selectChange', selection.length > 0 ? selection : this.tableData, selection.length > 0 ? 'add' : 'reduce')
    },
    // 点击每行
    rowClick (row) {
      this.$emit('selectChange', [row], 'add')
    },
    // 切换中间表格数据时关联右边已选数据
    toggleSelectStatus () {
      // 不可直接赋值,需等待子组件渲染完成
      this.$nextTick(() => {
        const renderTable = this.$refs.mcTable.renderTable()
        this.tableData.forEach(row => {
          this.choosedId.includes(row[this.tableKey]) && renderTable.toggleRowSelection(row)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-group-list{
    border-right: 1px $lightBorderColor solid;

    .sub-title{
      justify-content: flex-end;
    }
}
</style>
