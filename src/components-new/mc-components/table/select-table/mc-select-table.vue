<template>
  <!-- emitVisible必须加(),不然不会触发 -->
  <div
    class="mc-select-table"
    :emit="emitVisible()"
  >
    <!-- 工具栏 -->
    <div v-if="showSelectColumn||$scopedSlots.toolbar" class="mc-select-table-select-column flex align-center" :style="selectColumnStyle">
      <!-- 控制列的显示 -->
      <select-column
        v-if="showSelectColumn"
        :style="{order:['right','end'].includes(selectColumnPosition)?'10':'-10'}"
        :column-array="columnList"
        v-bind="$attrs"
        :props="{ key: 'prop', name: 'label'}"
        @changeColumn="changeColumn"
      />
      <div :style="{flex:selectColumnPosition!='right'?1:''}">
        <slot name="toolbar" />
      </div>
    </div>

    <slot name="afterTool" />

    <!-- 筛选栏 -->
    <transition name="select-animation">
      <div v-if="showSelectTag" ref="selectTag" class="mc-select-table-select-tag flex align-center">
        <div
          v-show="tagList.length"
          :style="{width:'100%',order:selectTagPosition=='right'?'10':'-10'}"
        >
          <select-tag
            :key="new Date().getTime()"
            :class-name="className"
            :class="$attrs['class-name']"
            :column-table="columnTable"
            @closeTag="closeTag"
            @clearTag="clearTag"
          />
        </div>
        <div :style="{flex:selectTagPosition!='right'?1:''}">
          <slot name="selectbar" />
        </div>
      </div>
    </transition>

    <slot name="afterSelect" />

    <mc-table
      ref="mcTable"
      style="margin-top:10px"
      :setting-visible="false"
      :height="tableHeight"
      :class-name="className"
      v-bind="$newAttrs"
      v-on="$listeners"
    >
      <!-- 插入表格的每一列 -->
      <template>
        <!-- 解决筛选操作表头不更新问题 -->
        <el-table-column type="selection" class-name="mc-select-table-selection-class" fixed width="1px" />
        <slot name="unshift" />
        <el-table-column
          v-for="column in columnTable"
          :key="column.prop"
          align="left"
          :prop="column.prop"
          :sortable="column.sortable?'custom':false"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
        >
          <template slot="header" slot-scope="{col=column}">
            <formatter :column="column" render-name="headExpand" />
            <span :style="{color:col.filterChecked?selectedColor:''}">{{ col.label }}
              <span v-if="filtersLoad" class="el-icon-loading" />
              <mc-table-column
                v-else-if="col.filters.length"
                :ref="col.prop"
                :filters="col.filters"
                :filter-props="{ label: 'key', name: 'label'}"
                filter-width="220"
                :prop="col.prop"
                @handleFilter="handleFilter"
                @onInit="handleFilter($event,'onInitFilter')"
                @onFilter="handleFilter($event,'onFilter')"
                @onReset="handleFilter($event,'onResetFilter')"
              />
            </span>
          </template>
          <template slot-scope="{row}">
            <formatter :row="row" :column="column" />
          </template>
        </el-table-column>

        <slot name="append" />
      </template>
    </mc-table>
  </div>
</template>

<script>
import { isEqual, cloneDeep, isEmpty } from 'lodash'
import mcTable from '@/components-new/mc-components/table/mc-table.vue'
import selectColumn from '@/components-new/mc-components/table/select-table/select-column.vue'
import mcTableColumn from '@/components-new/mc-components/table/mc-table-column.vue'
import selectTag from './select-table-comp/selectTag.vue'
import formatter from '@/components-new/mc-components/table/select-table/formatter.js'
import variables from '@/styles/variables.scss'

/**
 * @group 组件组合的封装 mc-components
 * 二次封装的 table 组件,集合了表头控制器/表头下拉筛选功能
 * mc-table组件能使用的属性/方法此组件都能直接使用,具体属性/方法请参考mc-table组件内容
 * 请配合 src/components/mc-components/table/mc-table-column.vue 组件使用
 *
 * 使用示例:
 * // html
 * <mc-select-table
 *   ref="mcSelectTable"
 *   :list-handler="getTableList"  // 表格数据方法
 *   :select-request="getTableSelectList"  // 获取筛选数据方法
 *   :short-height="40"
 *   storage-key="uniphoneConversation"  // 设置存储在sessionStorage中的唯一key,不设置则不会存储在sessionStorage中
 *   :options="selectObject"  // 表格获取数据的请求参数
 *   :column-list="columnList"  // 表头配置项,包含表头的下拉筛选/表头控制器
 *   show-select-column  // 是否显示表头字段控制器(右上角那个控制哪些表头字段显示的那个)
 *   @closeTag="closeTag"  // 关闭单个筛选的tag时触发,返回参数要删除的单个tag数据
 *   @clearTag="clearTag"  // 清空全部筛选的tag时触发,返回参数全部tag数据
 *   @onFilter="handleFilter"
 *   @selectionChange="selectionChange"  // 勾选表格一行数据时触发,返回参数选中的数据
 * >
 *   <template v-slot:unshift>
 *     <el-table-column type="selection" width="40" fixed />
 *   </template>
 * </mc-select-table>
 *
 * // js
 *  import { throttle } from 'lodash'
 *  import mcSelectTable from '@/components/mc-components/select-table/mc-select-table.vue'
 *  import * as api from '@/api/desktop-publish/uniphone.js'
 *  export default {
 *    components: {
 *      mcSelectTable,
 *    },
 *    data () {
 *      return {
 *        color:'#fff',
 *        selectObject: {},
 *        columnList: [
 *          { prop: 'mirrorName', label: this.$t('uniphone.conversation.list.column.mirror'), formatter: this.nameFormatter },
 *          { prop: 'user', label: this.$t('uniphone.conversation.list.column.user') },
 *          { prop: 'ip', label: this.$t('uniphone.conversation.list.column.ip') },
 *          { prop: 'os', label: this.$t('uniphone.conversation.list.column.os') },
 *          { prop: 'rule', label: this.$t('uniphone.conversation.list.column.rule') },
 *          { prop: 'state', label: this.$t('uniphone.conversation.list.column.state') },
 *          { prop: 'serve', label: this.$t('uniphone.conversation.list.column.serve') },
 *          { prop: 'location', label: this.$t('uniphone.conversation.list.column.location') },
 *          { prop: 'mode', label: this.$t('uniphone.conversation.list.column.mode') },
 *          { prop: 'updateTime', label: this.$t('uniphone.conversation.list.column.updateTime') },
 *          { prop: 'performance', label: this.$t('uniphone.conversation.list.column.performance') }
 *        ]
 *      }
 *    },
 *    methods: {
 *      // 获取表格数据
 *      getTableList (params) {
 *        return api.getConversationList(params)
 *      },
 *      // 获取筛选数据
 *      getTableSelectList () {
 *        return api.getConversationSelectList().then(res => {
 *          this.columnList.forEach((column, index) => {
 *            // 对columnList的column设置filters属性
 *          })
 *        })
 *      },
 *      // 镜像名formatter
 *      nameFormatter (row, column) {
 *        // 传参数不能使用 onClick={this.navigateDetail(params)}，这样子会每次 render 的时候都会自动执行一次方法
 *        // 应该使用 bind，或者箭头函数来传参:onClick={this.navigateDetail.bind(this, row)}
 *        return (<el-link type='primary' style={{ color: this.color }} onClick={() => { this.navigateDetail(row) }}>{row.name}</el-link>)
 *      },
 *      // 跳转详情
 *      navigateDetail (row) {},
 *      // 获取表格选中的数据
 *      selectionChange (select) {},
 *      setSelectObject: function () {
 *        // 设置发送到后端的请求参数
 *        // this.selectObject......
 *        this.$refs.mcSelectTable.reloadTable(this.selectObject)
 *      },
 *      // 处理筛选
 *      handleFilter (prop, texts) {},
 *      // 关闭单个tag
 *      closeTag (data) {},
 *      // 清空tag
 *      clearTag (list) {}
 *    }
 *  }
 */
export default {
  components: {
    mcTable,
    formatter,
    selectTag,
    selectColumn,
    mcTableColumn
  },
  props: {
    /**
     * 表头字段
     * columnList子项包含:
     *    prop: String, // th表头字段名
     *    label: String, // th表头字段名对应的国际化文字
     *    sortable: Boolean, // 排序
     *    default: Boolean, // 默认显示
     *    required: Boolean, // 必须显示
     *    fixed: Boolean, // 是否固定[true/false/'left'/'right']
     *    showOverflowTooltip: Boolean, // 超出部分显示...,鼠标悬浮显示tooltip
     *    width: String, // 固定的列宽度，尽量使用自适应宽度的minWidth
     *    minWidth: String, // 列最小宽度
     *    formatter: Function (row, column) => {}, // 这一列html内容处理事件
     *    load: false, // 下拉数据加载动画(默认关闭)
     *    filters: Array, // 下拉筛选
     *      filters子项包含:
     *        key: String, // checkbox选项的字段值,一般是传给接口的内容
     *        label: String, // checkbox字段值对应的国际化文本描述
     *        checked: Boolean // checkbox是否选中
     * tips:在设置default或者required属性无效时请清空浏览器的sessionStorage或者点击“重置”来重置表格的显示列
     */
    columnList: {
      type: Array,
      default () {
        return []
      }
    },
    // 表格风格
    className: {
      type: String,
      default: ''
    },
    // 显示selectColumn,为false时会columnList中的所有字段都会显示在表头
    showSelectColumn: {
      type: Boolean,
      default: false
    },
    // selectColumn组件的位置
    selectColumnPosition: {
      // `'left'` / `'right'` / `'start'` / `'end'`
      type: String,
      default: 'end'
    },
    // selectTag组件的位置
    selectTagPosition: {
      // `'left'` / `'right'`
      type: String,
      default: 'left'
    },
    // 下拉筛选请求方法
    selectRequest: {
      type: Function,
      default: () => {
        return Promise.resolve()
      }
    },
    // 表格固定高度，不会根据屏幕宽带变化而变化, eg: 20vh / 600px
    height: {
      type: String,
      default: '0'
    },
    controlsGetListObj: {
      type: Object,
      default: () => ({ isNotAllowgetTableList: false })
    }
  },
  data () {
    return {
      tagList: [],
      columnTable: [],
      showSelectTag: false, // 筛选栏是否显示标识
      selectTagHeight: 0, // 筛选栏高度
      tableHeight: '', // 表格高度
      filtersLoad: false, // 下拉筛选数据加载loading
      selectedColor: variables.colorPrimary// 列筛选之后的label字体颜色
    }
  },
  computed: {
    selectColumnStyle () {
      let style = {}
      if (this.selectColumnPosition === 'end') {
        style = { 'justify-content': 'space-between' }
      }
      return style
    },
    $newAttrs () {
      const oldAttrs = this.$attrs
      const tableData = oldAttrs['table-data'] && oldAttrs['table-data'].length
      return {
        ...oldAttrs,
        ...{ 'list-handler': tableData ? null : this.resetListRequest }
      }
    },
    getCurrentPageInfo () {
      const { pageSize, currentPage, sidx, sord } = this.$refs.mcTable
      return { pageSize, currentPage, sidx, sord }
    }
  },
  watch: {
    height: {
      immediate: true,
      handler (val) {
        this.tableHeight = val
      }
    },
    tagList: {
      immediate: true,
      handler (val) {
        this.calcTableHeight()
      }
    },
    columnList: {
      deep: true,
      immediate: true,
      handler (list) {
        list.forEach(column => {
          column.headExpand = column.headExpand ?? function (row, column) {
            return
          }
          column.formatter = column.formatter ?? function (row, column) {
            return (<span>{row[column.prop]}</span>)
          }
          this.$set(column, 'filters', column.filters ?? [])
        })

        if (!this.showSelectColumn) {
          this.setTableColumn(list)
        }
      }
    }
  },
  created () {
    this.lastFilter = {} // 上一次的handleFilter数据
    this.getSelectList = false // 是否已获取里下拉筛选数据
    this.initCheckedColumnNum = 0 // 有多少列带有checked选中项的
    this.initFilterNum = 0 // 计算onInitFilter触发多少次
    this.initFilter = [] // onInitFilter触发时的Filter
    this.initFilterReady = false // initFilter是否触发
  },
  methods: {
    // @vuese
    // 获取el-table组件，可调用原来elementui提供的api
    renderTable () {
      return this.$refs.mcTable.renderTable()
    },
    // 表格请求
    async resetListRequest (params) {
      // selectHandler只需要触发一次
      if (!this.getSelectList) {
        await this.selectHandler()
        this.getInitCheckedColumnNum()
      }
      // 此时initFilterNum还未清0
      return (this.initCheckedColumnNum === 0 || (this.initFilterReady && this.initCheckedColumnNum > 0) || this.initFilterNum === 0) &&
      !this.controlsGetListObj.isNotAllowgetTableList
        ? this.$attrs['list-handler'](params) : false
    },

    // 处理筛选请求
    selectHandler () {
      this.changeSelectListLoad(true)
      return this.selectRequest().then(res => {
        this.getSelectList = true
      }).finally(_ => {
        setTimeout(() => {
          this.changeSelectListLoad()
        }, 500)
      })
    },

    // 计算表格高度
    calcTableHeight () {
      this.$nextTick(() => {
        if (!isNaN(this.height)) {
          // selectTag显示/隐藏时重新计算table高度
          this.$refs.mcTable.calcTableHeight()
        } else {
        /* 设置height时的类型(还有其他的请继续补充):
         * 'calc(100% - 10px)'  isNaN(this.height):true
         * '100%'或'100vh'或'500px'  isNaN(this.height):true
         * 500或'500'  isNaN(this.height):false
         */
          this.selectTagHeight = this.showSelectTag ? this.$refs.selectTag.offsetHeight : 0
          this.tableHeight = this.height.includes('calc')
            ? this.height.replace(')', ' - ' + (this.selectTagHeight + 'px') + ')')
            : this.height === 'auto' ? 'auto' : `calc(${this.height} - ${this.selectTagHeight + 'px'})`
        }
      })
    },

    // 设置表格数据
    setTableColumn (list) {
      this.columnTable = []
      list.forEach(column => {
        this.columnTable.push(column)
      })
    },

    // 修改下拉筛选的load
    changeSelectListLoad (bool = false) {
      const array = this.showSelectColumn ? this.columnTable : this.columnList
      this.filtersLoad = bool
      array.forEach((column, index) => {
        column.filters.every(fil => { fil.checked = fil.checked ?? false })
      })
      this.setTableColumn(array)
    },

    // 获取带有checked选中项的列数
    getInitCheckedColumnNum () {
      this.initCheckedColumnNum = 0
      for (const column of this.columnTable) {
        if (!isEmpty(column.filters)) {
          column.filters.some(f => f.checked) && this.initCheckedColumnNum++
        }
      }
    },

    // 改变展示的列
    changeColumn (column) {
      this.setTableColumn(column)
      this.$nextTick(() => {
        // 部分浏览器在改变列数量后需要重新计算布局
        this.$refs.mcTable?.renderTable().doLayout()
      })
      this.setTagList()
      // filters含有checked才计算initCheckedColumnNum
      this.tagList.length && this.getInitCheckedColumnNum()
    },

    // 设置selectTag
    setTagList () {
      const tagList = this.columnTable.filter(col => col.filters.some(item => item.checked))
      if (!isEqual(tagList, this.tagList)) {
        // 不相等才赋值，减少不必要的更新
        this.tagList = cloneDeep(tagList)
      }
    },

    reloadTable (params, allParams = true, resetPage) {
      if (this.$refs.mcTable) {
        this.$refs.mcTable.reloadTable(params, allParams, resetPage)
      }
    },

    refresh () {
      this.$refs.mcTable.refresh()
    },

    emitVisible () {
      // 获取select-tag的显示状态
      this.showSelectTag = !!(this.tagList.length || this.$scopedSlots.selectbar)
      // @arg 返回高度和显示状态
      this.$nextTick(() => {
        this.$emit('getSelectTagInfo', {
          height: this.selectTagHeight,
          show: this.showSelectTag
        })
      })
    },

    // 设置filters的选中
    handleFilter ({ prop, texts = [] }, type) {
      if (!isEqual(this.lastFilter[prop], texts)) {
        this.lastFilter[prop] = texts
        let hasFilters = false
        // 修改columnTable对应prop项的filters中的对应item的checked
        for (let index = 0; index < this.columnTable.length; index++) {
          const column = this.columnTable[index]
          if (column.prop === prop) {
            let filterChecked = false
            for (const item of column.filters) {
              item.checked = false
              if (texts.length && texts.some(text => item.key === text)) {
                item.checked = true
                filterChecked = true
                hasFilters = true
              }
            }
            // 标识是否有选中
            this.$set(column, 'filterChecked', filterChecked)
            break
          }
        }
        if (type === 'onInitFilter') {
          // filters不为空才计算initCheckedColumnNum
          hasFilters && this.getInitCheckedColumnNum()
          // 在多列下拉筛选的checked如果有true,则有几列就会触发几次该事件
          this.initFilterNum++ // 计算onInitFilter触发多少次
          this.initCheckedColumnNum > 0 && this.initFilter.push({ prop, texts })
          if (this.initCheckedColumnNum === this.initFilterNum) {
            // 在手动修改checked时触发且
            // 理想情况下不管有多少列含有checked,都应该只触发一次initFilter事件
            // @arg 返回筛选选中的列表
            this.initFilterReady = true
            this.$emit('initFilter', this.initFilter)
            this.initFilterNum = 0 // 次数统计清0
          }
        } else if (['onFilter', 'onResetFilter'].includes(type)) {
          // onFilter事件只用于在点击"筛选"与"重置"时触发
          this.$emit('onFilter', prop, texts)
        }

        this.setTagList()
      }
    },

    // 关闭单个tag
    closeTag (data, emit = true) {
      // el-table会根据fixed列的数量来进行拷贝表单,重置表单的时候要注意
      // 比如 selection列 和 操作列 有设置fixed时,这时的el-table会有2+1个
      this.$refs[data.prop].map(item => {
        // closeTag与clearTag不应该触发onFilter
        item.clearFilter()
        // update会触发handleFilter自动更新checked
        item.update()
      })
      emit && this.$emit('closeTag', data)
    },

    // 清空tag
    clearTag () {
      const tagList = cloneDeep(this.tagList)
      for (const item of tagList) {
        this.closeTag(item, false)
      }
      this.$emit('clearTag', tagList)
    },
    reloadTableTargetRow (key, val) {
      console.log(key, val)
      if (!key || !val) {
        return
      }
       this.$refs.mcTable?.reloadTableTargetRow(key, val)
    }
  }
}
</script>

<style lang="scss" scoped>
.mc-select-table{
  ::v-deep &-selection-class{
    border: none!important;
    .cell,.el-checkbox__input{
      display: none!important;
    }
  }

  &-select-column{
    box-sizing: content-box;
    padding-top: 10px;
  }

  .select-animation{
    &-enter-active{
      transition: opacity 1s;
    }
    &-leave-active{
      transition: opacity 0.5s;
    }
    &-enter, &-leave-to{
      opacity: 0;
    }
  }

  &-select-tag{
    box-sizing: content-box;
    margin-top: 10px;
  }

  &-tooltip-content{
    max-width: 300px;
  }
}
</style>
