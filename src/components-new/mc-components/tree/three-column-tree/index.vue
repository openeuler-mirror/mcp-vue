
<!--三列可剔除-->
<template>
  <div class="three-column-tree">
    <left-tree
      ref="leftTree"
      :props="props"
      :node-key="nodeKey"
      :deault-select-data="deaultSelectData"
      :only-left="onlyLeft"
      :only-label="onlyLabel"
      :only-user="onlyUser"
      :white="white"
      :is-rid-of="isRidOf"
      :is-user-group="isUserGroup"
      :height="height"
      :left-tab-text="leftTabText"
      :right-tab-text="rightTabText"
      :show-header="showHeader"
      :show-checkbox="showCheckbox"
      :pushlish-tip="pushlishTip"
      :check-strictly="checkStrictly"
      :filter-tree-data="filterTreeData"
      :filter-label-data="filterLabelData"
      :get-tree-left-list="getTreeLeftList"
      :get-tree-right-list="getTreeRightList"
      :mid-column="midColumn"
      :right-column="rightColumn"
      :get-mid-table-filter="getMidTableFilter"
      :mid-related="midRelated"
      :is-show-right-label-icon="isShowRightLabelIcon"
      :before-exclude="beforeExclude"
      :before-cancel-select="beforeCancelSelect"
      :before-cancel-exclude="beforeCancelExclude"
      :mid-placeholder="midPlaceholder"
      @nodeClick="handleNodeClick"
      @updateNode="handleUpdateNode"
      @check-change="handleCheckChange"
      @leftTabChange="leftTabChange"
    >
      <template #left-oper="{ node,data }">
        <slot name="left-oper" :node="node" :data="data" />
      </template>
      <template #right-oper="{ node,data }">
        <slot name="right-oper" :node="node" :data="data" />
      </template>
    </left-tree>
  </div>
</template>

<script>
import leftTree from './components/left-tree/index'
import mixProp from './prop'
import bus from '@/utils/bus'
import _ from 'lodash'
export default {
  components: {
    leftTree
  },
  mixins: [mixProp],
  data () {
    return {
      selectArray: _.clone(this.deaultSelectData.select), // 选择的用户
      ridofArray: _.clone(this.deaultSelectData.exclude) // 排除的用户
    }
  },
  mounted () {
    // 待发布数组内容变化时
    bus.$on('selectArrayChange', (arr) => {
      this.selectArray = arr
      this.$emit('rightSelectChange', arr)
    })
    // 待排除数组内容变化时
    bus.$on('ridofArrayChange', (arr) => {
      this.ridofArray = arr
      this.$emit('rightRidofChange', arr)
    })
  },
  destroyed () {
    bus.$off('selectArrayChange')
    bus.$off('ridofArrayChange')
  },
  methods: {
    reloadTree (id, params) {
      this.$refs.leftTree.reloadTree(id, params)
    },
    // node 节点点击回调
    handleNodeClick (params) {
      this.$emit('nodeClick', params)
    },
    // tree 的active node更新时
    handleUpdateNode (params) {
      this.$emit('updateNode', params)
    },
    // checkbox 时，勾选回调
    handleCheckChange (params) {
      this.$emit('check-change', params)
    },
    // load结束时，初始化回调tree信息
    initTree (params) {
      this.$emit('init-tree', params)
    },
    // 左侧tree上的tab，切换时回调
    leftTabChange (activeName) {
      this.$emit('leftTabChange', activeName)
    },
    selections () {
      return {
        selectArray: this.selectArray,
        excludeArray: this.ridofArray
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-use-group{
  color: #000;
}
</style>
