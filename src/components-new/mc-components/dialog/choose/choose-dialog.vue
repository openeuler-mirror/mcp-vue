<template>
  <mc-dialog
    :visible="true"
    width="1100px"
    :title="title||$t('mc-ui.tree.select.dialog.title')"
    :to-body="true"
    top="5vh"
    custom-class="select-dialog"
    :before-close="handleCancel"
    @confirm="handleConfirm"
    @close="handleCancel"
  >
    <template #title>
      <slot name="title" />
    </template>
    <div v-loading="isLoading" element-loading-background="rgba(255, 255, 255, 1)" class="flex select-dialog">
      <left-tree-group
        ref="left-tree-group"
        class="left-tree-group"
        :data="leftTreeData"
        :load="leftTreeLoad"
        :lazy="leftTreeLazy"
        :node-key="leftTreeNodeKey"
        :current-node-key="leftTreeCurrentNodeKey"
        :props="leftTreeProps"
        :pagination="leftTreeSearchPagination"
        v-bind="$props"
        @getSearchValue="getSearchValue"
        @loadMoreSearch="treeLoadMore"
        @select="getSelectNode"
        v-on="$listeners"
      />
      <mid-group-list
        ref="mid-group-list"
        class="mid-group-list"
        :group-id="groupId"
        :get-table-list="getMiddleTableList"
        :table-column="middleTableColumn"
        :table-key="middleTableKey"
        :table-search-key="middleTableSearchKey"
        :table-group-key="middleTableGroupKey"
        v-bind="$props"
        :choosed-id="choosedIdList"
        @selectChange="handleSelectChange"
      />
      <right-selected-list
        ref="right-selected-list"
        v-model="selectedList"
        class="right-selected-list"
        :table-key="middleTableKey"
        :seletced-column="rightSeletcedColumn"
        @beforeRemove="beforeRemove"
        @beforeClear="beforeClear"
      />
    </div>
  </mc-dialog>
</template>
<script>
import { cloneDeep, findIndex, isEmpty } from 'lodash'
import mcDialog from '@/components-new/mc-ui/dialog/mc-dialog.vue'
import leftTreeGroup from './components/left-tree-group'
import midGroupList from './components/mid-group-list'
import rightSelectedList from './components/right-selected-list'
import mcTreeProps from '@/components-new/mc-ui/tree/props.js'
import props from './components/props.js'
import i18n from '@/lang'
import { getUserGroupChild, getUserGroupTree, getSearchUserGroupTree } from '@/api/mc-components/components.js'

/**
 * @group 组件组合的封装 mc-components
 * 三列分组选择弹窗(左边分组是虚拟树,支持大量数据渲染)
 *
 * 使用示例:
 * [显示控制]
 *    <choose-dialog v-if="addShow" v-model="addShow" />
 *
 * [选择用户与用户分组](mode为user时,只需要设置已选数据choosedList和处理选择结果confirm)
 *    <choose-dialog v-if="addShow" v-model="addShow"
 *    mode="user" :choosed-list="[]" @confirm="()=>{}"/>
 *
 * [左侧分组数据--一次性加载]
 *    <choose-dialog v-if="addShow" v-model="addShow" :tree-data="treeData"
 *    :props="{children:'children',label:'groupName',isLeaf:'leaf' }"/>
 *
 * [左侧分组数据--懒加载](loadNode方法参照el-tree懒加载)
 *    <choose-dialog v-if="addShow" v-model="addShow" tree-lazy
 *    :tree-load="loadNode" :props="{label:'name',children:'zones',isLeaf:'leaf'}" />
 *
 * [左侧分组数据搜索--开启分页模式](默认是搜索后加载所有数据的长列表模式)
 *    <choose-dialog v-if="addShow" v-model="addShow" tree-search-pagination />
 *
 * [点击左侧分组查中间待选择数据]
 *    <choose-dialog v-if="addShow" v-model="addShow" :tree-data="treeData"
 *    :props="{label:'name',children:'zones',isLeaf:'leaf'}"
 *    :get-table-list="getTableList" :table-column="[ {label:'111',value:'name'} ]" />
 *
 * [选择中间待选择数据到右侧已选数据,点击"确定"按钮触发confirm方法获取已选](confirm方法会关闭弹窗)
 *    <choose-dialog v-if="addShow" v-model="addShow" :tree-data="treeData"
 *    :props="{label:'name',children:'zones',isLeaf:'leaf'}"
 *    :get-table-list="getTableList" :table-column="[ {label:'111',value:'name'} ]"
 *    :seletced-column="[ {label:'111',value:'name'}, {label:'路径',value:'path'} ]"
 *    @confirm="getSelect" />
 *
 * [初始化右侧已选数据]
 *    <choose-dialog v-if="addShow" v-model="addShow" :tree-data="treeData"
 *    :props="{label:'name',children:'zones',isLeaf:'leaf'}"
 *    :get-table-list="getTableList" :table-column="[ {label:'111',value:'name'} ]"
 *    :seletced-column="[ {label:'111',value:'name'}, {label:'路径',value:'path'} ]"
 *    :choosed-list="[{ id: 2 , name:'123' , path: '456' }]" />
 *
 * [点击"确定"按钮触发提示弹窗]
 *    <choose-dialog v-if="addShow" v-model="addShow" show-confirm-tips
 *    confirm-tips-title="弹窗标题" confirm-tips-content="弹窗内容" />
 *
 * [在右侧已选数据中点击"移除"按钮触发beforeRemove]
 *    <choose-dialog v-if="addShow" v-model="addShow" @beforeRemove="beforeRemove" />
 *    beforeRemove (data, resolve) {
 *      this.confirmTips({
 *        title: '标题',
 *        content: '内容'
 *      }).then(res => {
 *        //其他逻辑
 *        //确定
 *        resolve()
 *      }).catch(err => {
 *        //取消
 *      })
 *    }
 *
 * [在右侧已选数据中点击"清空"按钮触发beforeClear]
 *    <choose-dialog v-if="addShow" v-model="addShow" @beforeClear="beforeClear" />
 *    beforeClear (data, resolve) {
 *      this.confirmTips({
 *        title: '标题',
 *        content: '内容'
 *      }).then(res => {
 *        //其他逻辑
 *        //确定
 *        resolve()
 *      }).catch(err => {
 *        //取消
 *      })
 *    }
 */
export default {
  components: {
    mcDialog,
    leftTreeGroup,
    midGroupList,
    rightSelectedList
  },
  mixins: [mcTreeProps, props],
  model: {
    prop: 'show',
    event: 'change'
  },
  props: {
    //  弹窗是否显示,请使用v-model
    show: {
      type: Boolean,
      default: true
    },
    // 弹窗标题
    dialogTitle: {
      type: String,
      default: ''
    },
    // 数据是否加载中
    isLoading: {
      type: Boolean,
      default: false
    },
    // 组件类型,目前仅内置用户选择类型,后续可以扩展
    mode: {
      // `'custom:自定义'` / `'user:用户'`
      type: String,
      default: 'custom'
    },
    // tree数据
    treeData: {
      type: Array,
      default: () => []
    },
    // 加载子树数据的方法，仅当 treeLazy 属性为true 时生效
    treeLoad: {
      // `Function(node, resolve)`
      type: Function,
      default: () => {}
    },
    // 是否懒加载子节点，需与 treeLoad 方法结合使用
    // 当此项为true时,mc-tree设置的height属性虚拟滚动不会生效
    treeLazy: {
      type: Boolean,
      default: false
    },
    // 树搜索是否开启分页模式,此项根据搜索接口是否分页而定,主要是针对接口返回数据的优化(例:用户分组)
    // 默认:加载所有搜索数据的长列表模式,没有页面性能限制,但是数据量大时对接口的查询不友好(例:终端管理分组)
    treeSearchPagination: {
      type: Boolean,
      default: false
    },
    // 右侧已选数据
    choosedList: {
      type: Array,
      default: () => []
    },
    // 显示confirmTips弹窗
    showConfirmTips: {
      type: Boolean,
      default: false
    },
    // confirmTips弹窗标题,showConfirmTips为true时生效
    confirmTipsTitle: {
      type: String,
      default: i18n.t('mc-ui.tree.select.dialog.confirmTips.title')
    },
    // confirmTips弹窗正文,showConfirmTips为true时生效
    confirmTipsContent: {
      type: String,
      default: i18n.t('mc-ui.tree.select.dialog.confirmTips.content')
    }
  },
  data () {
    return {
      groupId: this.currentNodeKey || 0, // 最左侧树选择的分组节点id
      tableSelectionRow: {}, // 中间单选的用户 / 组
      tableSelectionInfo: {}, // {中间全选的用户 / 组 , 当前表格的数据}
      selectedList: [], // 右侧已选的列表
      choosedIdList: [], // 已选id列表
      leftTreeLazy: false,
      leftTreeLoad: () => {},
      leftTreeNodeKey: '',
      leftTreeCurrentNodeKey: '',
      leftTreeProps: {},
      title: '',
      leftTreeData: [],
      searchUserPage: 1,
      leftTreeSearchPagination: false,
      getMiddleTableList: null,
      middleTableColumn: [],
      middleTableKey: '',
      middleTableSearchKey: '',
      middleTableGroupKey: '',
      rightSeletcedColumn: []
    }
  },
  watch: {
    mode: {
      immediate: true,
      handler (val) {
        this.leftTreeData = this.treeData
        if (val === 'custom') {
          this.title = this.dialogTitle
          // 左边分组树
          this.leftTreeNodeKey = this.nodeKey
          this.leftTreeCurrentNodeKey = this.currentNodeKey
          this.leftTreeSearchPagination = this.treeSearchPagination
          this.leftTreeLazy = this.treeLazy
          this.leftTreeLoad = this.treeLoad
          this.leftTreeProps = this.props
          // 中间表格
          this.getMiddleTableList = this.getTableList
          this.middleTableColumn = this.tableColumn
          this.middleTableKey = this.tableKey
          this.middleTableSearchKey = this.tableSearchKey
          this.middleTableGroupKey = this.tableGroupKey
          // 右边已选
          this.rightSeletcedColumn = isEmpty(this.seletcedColumn) ? this.tableColumn : this.seletcedColumn
        } else if (val === 'user') {
          // 开启用户选择,设置默认数据
          this.title = this.dialogTitle || this.$t('choose-dialog.middleTable.select_user')
          this.leftTreeNodeKey = 'id'
          this.leftTreeCurrentNodeKey = '0'
          this.leftTreeSearchPagination = true
          this.leftTreeLazy = true
          this.leftTreeLoad = (node, resolve) => {
            if (node.level === 0) {
              return resolve([{ name: this.$t('common.all'), id: 0 }])
            }
            getUserGroupTree({ groupId: node.data['id'] }).then(res => {
              resolve(res)
            })
          }
          this.leftTreeProps = {
            children: 'children',
            label: 'name',
            isLeaf: 'leaf'
          }
          this.getMiddleTableList = (params) => {
            return getUserGroupChild(params)
          }
          const column = {
            label: this.$t('choose-dialog.middleTable.user_group'),
            value: 'name',
            formatter: (row) => {
              return (<span><i class={row.itemType === 1 ? 'el-icon-user' : 'el-icon-folder-opened'} />{row.name}</span>)
            }
          }
          this.middleTableColumn = [column]
          this.middleTableKey = 'uniqueId'
          this.middleTableSearchKey = 'search'
          this.middleTableGroupKey = 'groupId'
          this.rightSeletcedColumn = [column, {
            label: this.$t('choose-dialog.middleTable.path'),
            value: 'groupPath'
          }]
        }
      }
    },
    selectedList: {
      deep: true,
      handler (val) {
        this.choosedIdList = this.selectedList.map(item => item[this.middleTableKey])
      }
    },
    choosedList: {
      deep: true,
      immediate: true,
      handler (val) {
        // 初始化已选数据
        this.selectedList = cloneDeep(this.choosedList)
      }
    }
  },
  methods: {
    // 内部方法,重新加载树,只有treeLazy为true时且treeSearchPagination为false情况下生效
    // @arg nodeId:需要开始加载的节点id
    reloadTree (nodeId) {
      if (nodeId && nodeId > 0 && !this.treeSearchPagination) {
        this.$nextTick(() => {
          const tree = this.$refs['left-tree-group'].refTree()
          const node = tree.getNode(nodeId) // 要刷新的tree id
          node.loaded = false
          node.expand()
        })
      }
    },
    getSearchValue (val) {
      if (this.mode === 'user') {
        if (!val) {
          this.searchUserPage = 1
          getUserGroupTree({ groupId: 0 }).then(res => {
            this.leftTreeData = [{ name: this.$t('common.all'), id: 0, children: res }]
          })
          return
        }
        this.searchUserTree({ searchVal: val })
      }
      // 外部通过此方法可以获取树搜索框的内容
      // 在搜索框输入内容后点击搜索图标或者回车时触发
      // @arg val:树搜索时的内容
      this.$emit('getTreeSearchValue', val)
    },
    // 搜索结果,只有mode为user时生效
    searchUserTree ({ type = '', searchVal = '' } = {}) {
      getSearchUserGroupTree({ search: searchVal, rows: 20, page: this.searchUserPage }).then(res => {
        const leftTreeData = res.records.map(item => {
          item.size = 26
          return item
        })
        if (!isEmpty(this.leftTreeData) && this.leftTreeData[this.leftTreeData.length - 1].id === 'more') {
          this.leftTreeData.splice(this.leftTreeData.length - 1, 1)
        }
        if (this.searchUserPage >= res.totalPage) {
          // 没有了
          this.$refs['left-tree-group'].noMore = true
          setTimeout(() => {
            this.$refs['left-tree-group'].noMore = false
          }, 500)
        } else {
          this.searchUserPage += 1
          leftTreeData.push({ name: this.$t('common.getMoreText'), id: 'more', size: 40 })
        }
        if (type === 'add') {
          setTimeout(() => {
            this.$refs['left-tree-group'].loading = false
          }, 500)
          this.leftTreeData = this.leftTreeData.concat(leftTreeData)
        } else {
          this.leftTreeData = leftTreeData
        }
      })
    },
    treeLoadMore () {
      this.searchUserTree({ type: 'add' })
    },
    handleConfirm () {
      if (this.showConfirmTips) {
        // 展示confirmTips
        this.beforeConfirm()
      } else {
        // 不展示confirmTips,直接confirm
        this.toConfirm()
      }
    },
    toConfirm () {
      // 不展示confirmTips情况下点击确定时触发,
      // 展示confirmTips情况下点击confirmTips的确定时触发
      // @arg 返回已选的表格数据
      this.$emit('confirm', this.selectedList)
      this.handleClose()
    },
    beforeConfirm () {
      // 点"确定"之后关闭弹窗之前的提示
      this.confirmTips({
        title: this.confirmTipsTitle,
        content: this.confirmTipsContent
      }).then(_ => {
        this.toConfirm()
      }).catch(_ => {})
    },
    handleCancel () {
      // 点击"取消"按钮或者关闭按钮时触发
      this.$emit('cancel')
      this.handleClose()
    },
    handleClose () {
      // 内部方法,关闭弹窗时触发,会被v-model绑定,无需调用
      this.$emit('change', false)
    },
    beforeRemove (data, resolve) {
      // 删除某条已选数据时触发,
      // @arg data返回即将删除的已选数据,resolve是异步回调,可调用resolve()通知组件进行下一步的删除,不调用则取消删除
      this.$emit('beforeRemove', data, this.$listeners['beforeRemove'] ? resolve : resolve())
    },
    beforeClear (data, resolve) {
      // 清空全部已选数据时触发,
      // @arg data返回即将删除的已选数据,resolve是异步回调,可调用resolve()通知组件进行下一步的删除,不调用则取消删除
      this.$emit('beforeClear', data, this.$listeners['beforeClear'] ? resolve : resolve())
    },
    closeLoading () {
      this.isLoading = false
    },
    getSelectNode (data) {
      this.groupId = data[this.nodeKey]
    },
    handleSelectChange (selection, type) {
      const selectedList = cloneDeep(this.selectedList)
      for (const select of selection) {
        if (type === 'add') {
          if (selectedList.length === 0) {
            this.selectedList.push(select)
            continue
          }
          if (selectedList.filter(item => item[this.middleTableKey] === select[this.middleTableKey]).length === 0) {
            this.selectedList.push(select)
          }
        } else if (type === 'reduce') {
          this.selectedList.splice(findIndex(this.selectedList, [this.middleTableKey, select[this.middleTableKey]]), 1)
        }
      }
    }
  }
}
</script>
<style lang="scss">
.select-dialog{
  .el-dialog__body{
    padding: 0;
  }
  .sub-title{
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    border-bottom: 1px $lightBorderColor solid;
  }
  .mc-table{
    margin-top: 0;
  }
}
</style>
<style lang="scss" scoped>
.select-dialog{
  overflow: hidden;
  min-height: 500px;
  border-top: 1px $lightBorderColor solid;
  border-bottom: 1px $lightBorderColor solid;
  .left-tree-group{
    width: 230px;
  }
  .mid-group-list{
    width: 400px;
  }
  .right-selected-list{
   width: 470px;
  }
  ::v-deep .el-icon-folder-opened {
    color: #ffcd2e;
    margin-right: 5px;
  }
  ::v-deep .el-icon-user {
    color: #409eff;
    margin-right: 5px;
  }
}
</style>
