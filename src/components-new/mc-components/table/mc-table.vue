<template>
  <div class="mc-table" :class="[className]">
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :class="[className]"
      :empty-text="emptyText"
      element-loading-background="rgba(0, 0, 0, 0.1)"
      :data="list"
      tooltip-effect="dark"
      :border="isBorder"
      style="width: 100%;height: 100%;overflow:auto"
      :height="tableHeight"
      :span-method="spanMethod"
      :row-key="rowKey"
      :tree-props="treePropsObj"
      :default-expand-all="isExpand"
      :row-class-name="rowClassName"
      :default-sort="defaultSort"
      v-bind="$attrs"
      v-on="new$listeners"
    >
      <!-- 插入表格的每一列 -->
      <slot />
    </el-table>
    <div v-if="paginationShow" class="flex pagination">
      <el-pagination
        v-if="paginationShow"
        :hide-on-single-page="hideSinglePage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="tableTotal"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="pagerCount"
        :layout="paginationLayout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { cloneDeep, kebabCase, isEmpty } from 'lodash'
import bus from '@/utils/bus'
// @group 组件组合的封装 mc-components
// 二次封装的table 组件,el-table组件能使用的属性/方法此组件都能直接使用,具体属性/方法请参考el-table组件文档
export default {
  props: {
    // 接受请求，获取表格数据
    listHandler: {
      type: Function,
      default: null
    },
    // 直接给表格赋值
    tableData: {
      type: Array,
      default: () => []
    },
    // 设置rowname
    rowClassName: {
      type: Function,
      default: () => () => {}
    },
    // 行id
    rowKey: {
      type: String,
      default: 'id'
    },
    // 是否显示翻页
    paginationShow: {
      type: Boolean,
      default: true
    },
    // 表格固定高度，不会根据屏幕宽带变化而变化, eg: 20vh / 600px  传进来的value为’auto‘时 表示表格高度由内容撑开
    height: {
      type: String,
      default: '0'
    },
    // 减去的表格高度，部分情况下计算的表格高度不准确，需要额外增减一些
    shortHeight: {
      type: Number,
      default: 0
    },
    // 接受到额外参数，用于获取表格数据
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 表格为空时展示的提示文字
    emptyText: {
      type: String,
      default () {
        return this.$t('common.noData')
      }
    },
    // 表格每列的数据，用于设置筛选展示的列
    filterData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格的classname
    className: {
      type: String,
      default: ''
    },
    // 是否带有纵向边框
    isBorder: {
      type: Boolean,
      default: false
    },
    // 表格合并function
    spanMethod: {
      type: Function,
      default: () => () => {}
    },
    // 不选中列，此列点击不会触发行选中
    columnUncheck: {
      type: [Array, Boolean],
      default: () => {
        return []
      }
    },
    // 特殊的key，数组取得不是data
    specialKey: {
      type: String,
      default: 'data'
    },
    // 分页layout设置
    paginationLayout: {
      type: String,
      default: 'sizes, prev, pager, next, jumper, total'
    },
    // 页码按钮的数量，当总页数超过该值时会折叠, 只能设置为5-21的奇数，否则会报错
    pagerCount: {
      type: Number,
      default: 7
    },
    // 表格加载时是否需要使用loading
    isLoading: {
      type: Boolean,
      default: true
    },
    // 赋值之前先对表格数据进行处理
    handleTableData: {
      type: Function,
      default: () => ({})
    },
    // 指定树形数据的关联属性
    treePropsObj: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 是否默认展开树形结构
    isExpand: {
      type: Boolean,
      default: true
    },
    // 表格是否在created周期中去调用getTableList方法,因为可能会有默认筛选
    getTableListFuncTag: {
      type: Boolean,
      default: true
    },
    // 只有一页时是否隐藏
    hideSinglePage: {
      type: Boolean,
      default: false
    },
    // 默认排序的字段
    defaultSort: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      list: this.tableData.length ? this.tableData : [],
      tableHeight: null,
      listLoading: false,
      tableTotal: this.tableData.length, // 表格总的数据个数
      currentPage: 1,
      pageSize: 20, // 每页显示20条
      sortName: '', // 排序类型
      order: 'desc',
      extraParams: cloneDeep(this.options), // 下拉，搜索等传递来的额外参数
      screenWidth: document.documentElement.clientWidth, // 屏幕宽度
      screenHeight: document.documentElement.clientHeight, // 屏幕高度
      selectSetting: [] // 展示的筛选列数据
    }
  },
  computed: {
    // 使用 new$listeners 继承$listeners属性，并重写$listeners原有事件
    // new$listeners解决 $listeners 与自定义事件同时使用会触发两次的问题
    new$listeners () {
      const rewrite = {
        // 这里的重写的方法,后续若有新的el-table方法被重写
        // 一定要加进来,不然调用会触发两次
        'sort-change': this.handleTableSort,
        'cell-click': this.handleClickCell,
        'row-click': this.handleClickTableRow
      }
      const obj = ['selectionChange', 'select', 'selectAll', 'filterChange']
      const listeners = {}
      for (const key in this.$listeners) {
        if (obj.includes(key)) {
          // key为驼峰写法的转为短横线写法
          listeners[kebabCase(key)] = this.$listeners[key]
        } else {
          listeners[key] = this.$listeners[key]
        }
      }
      return Object.assign({}, listeners, rewrite)
    }
  },
  watch: {
    screenWidth () {
      this.calcTableHeight()
    },
    screenHeight () {
      this.calcTableHeight()
    },
    height (newVal, oldVal) {
      if (newVal !== oldVal) {
        // 固定高度时修改高度时
        this.$nextTick(() => {
          this.calcTableHeight()
        })
      }
    },
    // 监听筛选列
    filterData: {
      handler (val) {
        const data = val.filter((res) => res.isShow)
        this.$emit('tableColumn', data)
      },
      deep: true,
      immediate: true
    },
    tableData (table) {
      this.tableTotal = table.length
      this.handleListData()
    },
    defaultSort: {
      immediate: true,
      handler (val) {
        if (!isEmpty(val)) {
          this.order = val.order === 'descending' ? 'desc' : 'asc'
          this.sortName = val.prop
          this.$emit('expressOrder', { sidx: this.sortName, sord: this.order })
        }
      }
    }
  },
  created () {
    this.defaultSetting()
    this.getTableListFuncTag && this.getTableList()
  },
  mounted () {
    this.calcTableHeight()
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
      this.screenHeight = document.body.clientHeight
    }
    bus.$on('resizeWindow', () => {
      this.screenWidth = document.body.clientWidth
      this.screenHeight = document.body.clientHeight
      this.calcTableHeight()
    })
  },
  beforeDestroy () {
    this.$off('resizeWindow')
  },
  methods: {
    calcTableHeight () {
      // 表格高度
      // 注意!!! 在mc-table祖先元素中使用 vue的transition组件transform模式 或者 css位移动画 等会导致 this.$refs.multipleTable.$el.offsetTop 获取不准确
      // 在上面这种情况中建议给定mc-table的height
      this.tableHeight = this.height === 'auto' ? '' : isNaN(this.height) ? this.height : window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110 - this.shortHeight
    },
    getTableList () {
      this.listLoading = this.isLoading
      if (!this.listHandler) {
        this.listLoading = false
        this.handleListData()
        return
      }
      // 部分只需要展示表格,不用翻页,此时不传rows 会返回所有内容
      const pageSize = this.extraParams.pageSizeHide ? {} : { rows: this.pageSize }
      this.listHandler({
        page: this.currentPage,
        sidx: this.sortName,
        sord: this.order,
        ...pageSize,
        ...this.extraParams
      }).then((res) => {
        // 由于之前的接口回调未统一，目前有3种回调
        // 1. {page:1,rows:[],records:1}
        // 2. {status: 200,data: {page:1,rows:[],records:1}}
        // 3. {status: 200,data: []}
        if (res[this.specialKey] && Array.isArray(res[this.specialKey])) {
          this.list = res[this.specialKey]
        } else {
          /**
           * 后台参数调整, 丢弃 rows,使用新字段
           * records 分页记录
           * total 总条数
           * pageSize 页面大小
           * currentPage 当前页
           * totalPage 总页数
           */
          const { data = {} } = res
          const tableInfo = (data && Object.keys(data).length > 0) ? data : res
          this.tableTotal = tableInfo.total || 0
          this.pageSize = tableInfo.pageSize || 20
          this.currentPage = tableInfo.currentPage || 1
          this.list = tableInfo.records || []
        }
        // 对表格数据进行处理再赋值
        const handeledArrayData = this.handleTableData(this.list)
        this.list = Array.isArray(handeledArrayData) ? handeledArrayData : this.list
        // 主动抛出表格返回数据
        // @arg 返回处理过的数据 rows.data
        this.$emit('getTableData', Array.from(this.list), res)
      }).finally(_ => {
        // 优化交互，防止请求太快看不见loading，让用户知道确实刷新了
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 前端分页
    handleListData () {
      // 如果显示分页,则计算分页,否则显示全部数据
      this.list = this.paginationShow ? this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) : this.tableData
    },
    // 每页显示内容个数
    handleSizeChange (val) {
      this.pageSize = val
      this.getTableList()
    },
    // 翻页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableList()
    },
    // 排序
    handleTableSort (column) {
      this.order = column.order ? (column.order === 'descending' ? 'desc' : 'asc') : ''
      this.sortName = this.order ? column.prop : ''
      // 点击排序按钮会触发该事件
      // @arg 返回排序的字段名与排序值
      this.$emit('expressOrder', { sidx: this.sortName, sord: this.order })
      this.getTableList()
    },
    clearFilter () {
      this.$refs.multipleTable.clearFilter()
    },
    handleClickTableRow (row, column, event) {
      // 当某一行被点击时会触发该事件
      // @arg 返回当前勾选行数据
      this.$emit('selectRow', row, column, event)
    },
    // 单元格被选中
    handleClickCell (row, column, cell) {
      // 操作栏/详情等  不触发行选中
      if (typeof this.columnUncheck !== 'boolean') {
        const columnUnchecks = [this.$t('mc-table.column.details'), this.$t('mc-table.column.operation'), ...this.columnUncheck]
        if (!columnUnchecks.includes(column.label)) {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        }
      }
      this.$emit('cell-click', { row, column, cell })
    },
    // 父组件抓取
    // @vuese
    // 刷新表格数据，返回第一页
    refresh () {
      this.currentPage = 1
      this.getTableList()
    },
    // @vuese
    // 获取当前组件ref，可调用原来elementui提供的api
    renderTable () {
      return this.$refs.multipleTable
    },
    // @vuese
    // 父组件有额外参数渲染
    // 用于初始化接受额外参数、搜索、下拉等接受额外参数重新渲染表格
    // @arg params:{search，select等额外参数}, allParams:去除options参数数据,默认为false, resetPage:重置页码,默认为true
    reloadTable (params, allParams = false, resetPage = true) {
      if (allParams) {
        this.extraParams = Object.assign({}, params)
      } else {
        this.extraParams = Object.assign(this.extraParams, params)
      }
      resetPage ? this.refresh() : this.getTableList()
    },
    // 抛出给父组件
    // 选择设置
    confirmSetting () {
      const arr = this.filterData.filter((item) => {
        return this.selectSetting.includes(item.label) && item.key
      })
      // 自定义显示表格显示哪几列，保存
      const showArr = arr.map((item) => item.key)
      const hideSetting = []
      this.filterData.forEach((item) => {
        item.isShow = showArr.includes(item.key)
        if (!item.isShow) {
          hideSetting.push(item.key)
        }
      })
      Cookies.set('virual-setting', hideSetting)
    },
    // 默认设置，隐藏列
    defaultSetting () {
      let arr
      try {
        arr = JSON.parse(Cookies.get('virual-setting'))
      } catch (error) {
        arr = []
      }
      this.filterData.forEach((item) => {
        if (arr.includes(item.key)) {
          item.isShow = false
        } else {
          this.selectSetting.push(item.label)
        }
      })
    },
    // 供外部调用的方法，切换某行数据是否选中 isToSelect的值来控制 rowData对应行的选中与不选中
    toggleSelection (rowData, isToSelect) {
      if (rowData) {
        if (rowData.length) { // 数组
          rowData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, isToSelect)
          })
        } else { // 单个对象
          this.$refs.multipleTable.toggleRowSelection(rowData, isToSelect)
        }
      } else { // 全不选
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 单行刷新
    reloadTableTargetRow (key, val) {
      // 存在加载中的数据禁止刷新
      if (this.listLoading) {
        return
      }
      // 遍历列表，找到匹配的行
      const rowToRefresh = this.list.find(row => row[key] === val)
      // 部分只需要展示表格,不用翻页,此时不传rows 会返回所有内容
      if (rowToRefresh) {
        const pageSize = this.extraParams.pageSizeHide ? {} : { rows: this.pageSize }
        this.listHandler({
          page: this.currentPage,
          sidx: this.sortName,
          sord: this.order,
          ...pageSize,
          ...this.extraParams
        }).then((res) => {
          let list = null
          // 由于之前的接口回调未统一，目前有3种回调
          // 1. {page:1,rows:[],records:1}
          // 2. {status: 200,data: {page:1,rows:[],records:1}}
          // 3. {status: 200,data: []}
          if (res[this.specialKey] && Array.isArray(res[this.specialKey])) {
            list = res[this.specialKey]
          } else {
          /**
           * 后台参数调整, 丢弃 rows,使用新字段
           * records 分页记录
           * total 总条数
           * pageSize 页面大小
           * currentPage 当前页
           * totalPage 总页数
           */
            const { data = {} } = res
            const tableInfo = (data && Object.keys(data).length > 0) ? data : res
            list = tableInfo.records || []
          }
          // 对表格数据进行处理再赋值
          const handeledArrayData = this.handleTableData(list)
          list = Array.isArray(handeledArrayData) ? handeledArrayData : list
          const newRowToRefresh = list.find(row => row[key] === val)
          const newRowToRefreshIndex = list.findIndex(row => row[key] === val)
          this.$set(this.list, newRowToRefreshIndex, newRowToRefresh)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-item {
  margin-bottom: 5px;
}
.mc-table {
  margin-top: 20px;

  .pagination {
    margin-top: 15px;
    .setting-icon {
      font-size: 20px;
      margin-top: 6px;
      margin-left: 15px;
      cursor: pointer;
    }
  }
  .el-pagination {
    text-align: center;
    width: 100%;
  }
  &:not(.white) {
    .el-pagination {
      text-align: center;
      width: 100%;
      color: #fff;
      .el-input__inner,
      .more,
      [class*='el-pagination__'],
      [class*='btn-'] {
        color: #fff;
        line-height: 30px;
      }
    }
  }
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    .el-checkbox {
      width: calc(calc(100% / 5) - 10px);
      margin: 5px;
    }
  }
  .el-dialog__footer {
    text-align: center;
    button {
      margin-left: 0;
      margin-right: 0;
      margin: 0 10px;
    }
  }
}
</style>
