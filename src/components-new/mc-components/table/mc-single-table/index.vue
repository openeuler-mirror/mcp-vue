<!--基于mc-select-table 扩展的单页表格
1. 下拉筛选，搜索由前端过滤
2. 没有分页
3. 适用于弹窗简单提示
-->
<template>
  <mc-select-table
    ref="mcSelectTable"
    class-name="white"
    :table-data="newTableData"
    :column-list="columnList"
    :height="tableHeight"
    :pagination-show="false"
    @onFilter="handleFilter"
    @closeTag="closeTag"
    @clearTag="clearTag"
    @selectionChange="handleSelectionChange"
  >
    <template #toolbar>
      <div class="toolbar">
        <div class="header">
          <mc-search
            v-model="searchVal"
            :search="true"
            :placeholder="searchPlaceholder"
            @change="handleSearch"
          />
        </div>
      </div>
    </template>
    <template #unshift>
      <slot name="unshift" />
    </template>
    <template #append>
      <slot name="append" />
    </template>
  </mc-select-table>
</template>
<script>
import mcSearch from '@/components-new/mc-ui/input/mc-search'
import mcSelectTable from '@/components-new/mc-components/table/select-table/mc-select-table'
export default {
  components: {
    mcSelectTable,
    mcSearch
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columnList: {
      type: Array,
      default: () => []
    },
    tableHeight: {
      type: String,
      default: '500px'
    },
    // 搜索时要过滤的属性
    searchProps: {
      type: [Array, String],
      default: ''
    },
    searchPlaceholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      newTableData: this.tableData,
      searchVal: '',
      tableParams: {}
    }
  },
  methods: {
    handleSelectionChange (selections) {
      this.$emit('select-table', selections)
    },
    // 下拉筛选处理
    handleFilter (prop, texts) {
      this.handleComFunc(prop, texts)
    },
    // 关闭单个
    closeTag (data) {
      this.handleComFunc(data.prop)
    },
    // 全部清空
    clearTag (list) {
      list.forEach(item => {
        this.handleComFunc(item.prop)
      })
    },
    // 搜索
    handleSearch (val) {
      this.setNewData()
    },
    // val 为数组或者字符串
    handleComFunc (prop, val) {
      this.tableParams[prop] = val
      this.setNewData()
    },
    // 根据 tableParams的属性过滤tableData
    setNewData () {
      const arr = this.tableData.map(item => {
        item.match = false
        item.search_match = false
        // 筛选的数据要满足对象里的每一项
        const match = []
        for (const key in this.tableParams) {
          if (item[key]) {
            // 表格里的每一项 (这里会使用includes，值只能为 number 或者 string)
            const originVal = isNaN(item[key]) ? item[key] : String(item[key])
            const curVal = this.tableParams[key]
            // 即将筛选的每一项目，转为数组
            const filterVal = Array.isArray(curVal) ? curVal : curVal?.split(',') ?? []
            if (filterVal.length) {
              match.push(filterVal.some(ev => originVal.includes(ev)))
            } else {
              // 取消筛选
              match.push(true)
            }
          } else {
            // 过滤里无关属性
            match.push(true)
          }
        }
        const props = Array.isArray(this.searchProps) ? this.searchProps : [this.searchProps]
        props.forEach(prop => {
          if (!this.searchVal || (item[prop] && item[prop].includes(this.searchVal))) {
            item.search_match = true
          }
        })
        if (Object.keys(this.tableParams).length && !match.length) {
          item.match = false
        } else {
          item.match = match.every(item => item)
        }
        return item
      })
      this.newTableData = arr.filter(item => item.match && item.search_match)
    }
  }
}
</script>

<style scoped lang="scss">
.header{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}
</style>
