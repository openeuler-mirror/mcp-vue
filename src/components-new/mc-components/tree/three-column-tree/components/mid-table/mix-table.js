import mcSelectTable from '@/components-new/mc-components/table/select-table/mc-select-table.vue'
import { getmiddleUserList } from '@/api/desktop-publish/desktop-management/scheduled-task.js'
import _ from 'lodash'
export default {
  components: {
    mcSelectTable
  },
  data () {
    return {
      originTable: [],
      selections: [],
      total: 0,
      pageSize: 20,
      searchVal: '',
      tableParams: {},
      isPageStatus: true // 是否是分页模式
    }
  },
  computed: {
    new$Props () {
      const newProps = {}
      for (const key in this.$props) {
        // key为驼峰写法的转为短横线写法
        newProps[_.kebabCase(key)] = this.$props[key]
      }
      return newProps
    },
    columnList () {
      if (this.isUserGroup) {
        return [{
          prop: 'user',
          label: this.$t('choose-dialog.middleTable.user_group'),
          formatter: this.formatterUser,
          showOverflowTooltip: true
        }]
      }
      return this.midColumn
    }
  },
  methods: {
    // 表格渲染回调
    handleGetTableData (data) {
      this.originTable = data
      this.renderTableSelection()
    },
    getTableList (params) {
      if (!Object.keys(this.activeNode).length) {
        return Promise.resolve({})
      }
      const requestName = this.getMidTableFilter ?? getmiddleUserList
      // 默认function 时，传参searchStr 和 groupId
      const defalutParams = this.getMidTableFilter ? params : {
        ...params,
        searchStr: this.searchVal,
        groupId: this.activeNode.node.id || ''
      }
      return requestName(defalutParams, {
        activeNode: this.activeNode,
        searchVal: this.searchVal
      }).then(res => {
        // 如果不存在records 则表示不分页，直接展示后台给的内容
        this.isPageStatus = !!res.records
        res.records = this.resetTableData(this.isPageStatus ? res.records : res)
        this.total = this.isPageStatus ? res.total : res.length
        this.pageSize = res.pageSize
        return res
      })
    },
    formatterUser (row) {
      return (<span>
        {row.isUser ? <svg-icon icon-class='user' class='tree-icon user' /> : <svg-icon icon-class='file' class='tree-icon file' />}
        {row.label}
      </span>)
    },
    formatterDesc (row) {
      return row.paName ? '已发布（' + row.paName + '）' : ''
    },
    // 下拉筛选处理
    handleFilter (prop, texts) {
      const { queryName } = this.columnList.find(item => item.prop === prop)
      this.handleComFunc(queryName, prop, texts)
    },
    // 刷新表格
    reloadTable (params = {}) {
      if (this.$refs.mcSelectTable) {
        this.tableParams = Object.assign(this.tableParams, params)
        this.$refs.mcSelectTable.reloadTable(this.tableParams)
      }
    },
    // 关闭单个
    closeTag (data) {
      this.handleComFunc(data.queryName, data.prop)
    },
    // 全部清空
    clearTag (list) {
      list.forEach(item => {
        this.handleComFunc(item.queryName, item.prop)
      })
    },
    // 搜索
    handleSearch (val) {
      this.reloadTable()
    },
    handleComFunc (queryName, prop, texts = []) {
      this.tableParams[ queryName || prop] = texts
      this.reloadTable()
    },
    // 表格当前行是否选中
    itemIsSelect (item) {
      // 自身选中或者父子关联时，父亲被选中
      const curSelect = this.selectedRowsIds.includes(item[this.nodeKey])
      const parentSelect = this.midRelated ? _.intersection(this.selectedRowsIds, item.parentGroupIds).length > 0 : false
      return curSelect || parentSelect
    },
    // 为table添加自定义变量
    resetTableData (arr) {
      return arr.map(item => {
        item.isSelected = this.itemIsSelect(item)
        // 排除按钮出现的时机，祖先已选择，但是未排除
        const hasSelect = _.intersection(this.selectedRowsIds, item.parentGroupIds).length > 0
        const noExclude = _.intersection(this.ridOfRowsIds, item.parentGroupIds).length <= 0
        item.showRidOf = hasSelect && noExclude
        item.disabled = !this.renderSelected(item)
        return item
      })
    },
    // 获取数据后，将之前保存的勾选状态恢复
    renderTableSelection () {
      const refTable = this.$refs.mcSelectTable.renderTable()
      this.$nextTick(() => {
        refTable.clearSelection()
        this.originTable.forEach(item => {
          this.itemIsSelect(item) && refTable.toggleRowSelection(item, true)
        })
      })
    },
    handleSelectRow (row) {
      !row.disabled && this.handleSelect(this.selections, row)
    },
    handleSelectAll (selections) {
      this.originTable.forEach(item => {
        this.handleSelect(selections, item)
      })
    },
    handleSelectionChange (selections) {
      this.selections = selections
    },
    // select 配合 select-all 完成跨页勾选记住选项
    handleSelect (selections, row) {
      if (selections.length === this.pageSize) {
        row.isSelected = true
      } else if (!selections.length) {
        row.isSelected = false
      } else {
        row.isSelected = !row.isSelected
      }
      // 取消勾选时，从selectedRows 中剔除
      !row.isSelected && (this.selectedRows = [...this.selectedRows.filter(item => item[this.nodeKey] !== row[this.nodeKey])])
      // 要从之前勾选的内容里剔除这次勾选的，防止重复
      const currentSelectIds = selections.map(item => item[this.nodeKey])
      this.selectedRows = [
        ...this.selectedRows.filter(item => !currentSelectIds.includes(item[this.nodeKey])),
        ...selections
      ]
    }
  }
}
