<template>
  <div class="right-selected-list">
    <div class="sub-title flex">
      <span>{{ $t('common.selected') }}（{{ tableData.length }}）</span>
      <el-link type="primary" @click="clearList">{{ $t('common.emptyContent') }}</el-link>
    </div>
    <mc-table
      ref="mcTable"
      style="width:calc(100% - 1px)"
      height="438px"
      :row-key="tableKey"
      :table-data="tableData"
      :class-name="'white'"
      :setting-visible="false"
      pagination-layout="sizes, prev, pager, next"
      :pager-count="5"
      :is-loading="false"
    >
      <el-table-column
        v-for="column in seletcedColumn"
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
      <el-table-column v-if="seletcedColumn.length" :label="$t('mc-ui.tree.select.dialog.operation')" width="80" align="center" fixed="right">
        <template slot-scope="{row}">
          <el-link type="primary" @click="removeSelected(row)">{{ $t('mc-ui.tree.select.dialog.operation.remove') }}</el-link>
        </template>
      </el-table-column>
    </mc-table>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import mcTable from '@/components-new/mc-components/table/mc-table.vue'
import props from './props.js'
import formatter from '@/components-new/mc-components/table/select-table/formatter.js'

export default {
  components: {
    mcTable,
    formatter
  },
  mixins: [props],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 编辑时,展示已有数据,请使用v-model
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tableData: []
    }
  },
  watch: {
    // 用于和待选择联动
    'tableData.length': {
      handler (val) {
        this.$emit('change', this.tableData)
      }
    },
    value: {
      immediate: true,
      deep: true,
      handler (val) {
        this.tableData = cloneDeep(val)
      }
    },
    seletcedColumn: {
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
    removeSelected (data) {
      this.$emit('beforeRemove', data, () => {
        this.tableData = this.tableData.filter(item => item[this.tableKey] !== data[this.tableKey])
        this.$emit('delete', data)
      })
    },
    clearList () {
      this.$emit('beforeClear', this.tableData, () => {
        this.tableData = []
        this.$emit('clear')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.right-selected-list{
      .sub-title{
        padding: 18px 15px
    }
}
</style>
<style lang="scss">
.right-selected-list{
  .el-checkbox__inner{
    display: none;
  }
}
</style>
