<template>
  <div
    v-loading="isLoading"
    class="tab-label"
    :element-loading-background="white ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'"
  >
    <tree-group
      ref="labelTree"
      :props="props"
      :tree-data="labelTreeData"
      :white="white"
      :height="height"
      :filter-data="filterData"
      :active-node-id="activeNodeId"
      :show-checkbox="showCheckbox"
      :check-strictly="checkStrictly"
      :is-show-right-label-icon="isShowRightLabelIcon"
      @nodeClick="handleNodeClick"
      @update-node="handleUpdateNode"
      @handleSearch="handleSearch"
      @check-change="handleCheckChange"
    >
      <template #tree="{ node,data }">
        <div class="flex justify-between align-center" style="width: 100%;padding-right: 10px">
          <span class="tree-label">
            <!-- 这里固定是 label -->
            <svg-icon v-if="isShowRightLabelIcon" icon-class="file" class="tree-icon file" />
            <span>{{ node.label }}</span>
          </span>
          <slot name="right-oper" :node="node" :data="data" />
        </div>
      </template>
    </tree-group>
  </div>
</template>

<script>
import mixProp from '../../prop'
import mixinFun from './mixin'
import * as api from '@/api/desktop-publish/user-management/user-management.js'
export default {
  mixins: [mixProp, mixinFun],
  data () {
    return {
      labelTreeData: []
    }
  },
  methods: {
    handleNodeClick (node) {
      this.$emit('nodeClick', { node, tab: 'right-tab' })
    },
    handleUpdateNode (node) {
      node && this.$emit('updateNode', { node, tab: 'right-tab' })
    },
    getTreeData (curId, isInit = false) {
      const id = curId || -1
      this.isLoading = true
      const request = this.getTreeRightList || api.getUserLabel
      request().then(res => {
        this.labelTreeData = [
          {
            [this.nodeKey]: '',
            isAll: true,
            [this.props['label']]: this.$t('common.all'),
            [this.props['children']]: res.map(item => {
              item[this.props['label']] = item.name || item[this.props['label']]
              return item
            })
          }
        ]
        // 这里tree会重新渲染，异步赋值
        setTimeout(() => {
          this.$refs.labelTree.setCurrentKey(this.labelTreeData, id)
          // 初始化的时候，更新currentNode 值
          isInit && this.$emit('nodeClick', { tab: 'right-tab', node: this.labelTreeData[0] })
        }, 200)
      }).finally(() => {
        this.isLoading = false
      })
    },
    handleCheckChange ({ data, checked, indeterminate }) {
      this.$emit('check-change', { data, checked, indeterminate, tab: 'right-tab' })
    },
    handleSearch (val, id) {
      if (val) {
        this.searchVal = val
        const request = this.filterLabelData || api.getUserLabel
        this.searchTree(request, val)
        this.$refs.labelTree.setListNodeId(id)
        return
      }
      this.searchVal = ''
      this.reloadTree(-1)
    }
  }
}
</script>

<style scoped lang="scss">
// .tree-icon{
//    color: $colorPrimary
// }
</style>
