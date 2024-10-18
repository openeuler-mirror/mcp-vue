<template>
  <div
    v-loading="isLoading"
    class="tab-user"
    :element-loading-background="white ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'"
  >
    <tree-group
      ref="userTree"
      :props="props"
      :white="white"
      :height="height"
      :tree-data="userTreeData"
      :filter-data="filterData"
      :active-node-id="activeNodeId"
      :show-checkbox="showCheckbox"
      :check-strictly="checkStrictly"
      :only-user="onlyUser"
      @nodeClick="handleNodeClick"
      @handleSearch="handleSearch"
      @check-change="handleCheckChange"
      @update-node="handleUpdateNode"
    >
      <template #tree="{ node,data }">
        <div class="flex justify-between align-center" style="width: 100%;padding-right: 10px">
          <!-- 这里固定是 label -->
          <span class="tree-label">
            <svg-icon icon-class="file" class="tree-icon file" />
            <span>{{ node.label }}</span>
          </span>
          <slot name="left-oper" :node="node" :data="data" />
        </div>
      </template>
      <template #list="{data}">
        <div class="flex justify-between align-center search-list">
          <span class="tree-label">
            <el-row>
              <el-col :span="12">
                <mc-overflow-tooltip>
                  <div slot="content">{{ data[props.label] }}</div>
                  <span class="flex align-center"> <svg-icon icon-class="file" class="tree-icon file" />{{ data[props.label] }}</span>
                </mc-overflow-tooltip>
              </el-col>
              <el-col :span="12">
                <mc-overflow-tooltip>
                  <div slot="content">{{ data.groupNamePath }}</div>
                  <span class="groupNamePath">{{ data.groupNamePath }}</span>
                </mc-overflow-tooltip>
              </el-col>
            </el-row>
          </span>
          <span class="left-oper">
            <slot name="left-oper" :node="data" :data="data" />
          </span>
        </div>
      </template>
    </tree-group>
  </div>
</template>

<script>
import mixProp from '../../prop'
import mixinFun from './mixin'
import * as api from '@/api/desktop-publish/user-management/user-management.js'
import mcOverflowTooltip from '@/components-new/mc-ui/tooltip/mc-overflow-tooltip'
export default {
  components: {
    mcOverflowTooltip
  },
  mixins: [mixProp, mixinFun],
  data () {
    return {
      userTreeData: []
    }
  },
  methods: {
    // 手动点击回调
    handleNodeClick (node) {
      this.$emit('nodeClick', { node, tab: 'left-tab' })
    },
    // reloadTree 回调
    handleUpdateNode (node) {
      node && this.$emit('updateNode', { node, tab: 'left-tab' })
    },
    handleCheckChange ({ data, checked, indeterminate }) {
      this.$emit('check-change', { data, checked, indeterminate, tab: 'left-tab' })
    },
    getTreeData (curId, isInit = false) {
      const id = curId || -1
      this.isLoading = true
      const request = this.getTreeLeftList || api.getUserGroupTree
      request().then(res => {
        this.userTreeData = [
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
          this.$refs.userTree.setCurrentKey(this.userTreeData, id)
          // 初始化的时候，更新currentNode 值
          isInit && this.$emit('nodeClick', { tab: 'left-tab', node: this.userTreeData[0] })
        }, 200)
      }).finally(() => {
        // 这里不用finally，用bus 在组件渲染完成后触发
        this.isLoading = false
      })
    },
    handleSearch (val, id) {
      if (val) {
        this.searchVal = val
        const request = this.filterTreeData || api.searchUserGroupTree
        this.searchTree(request, val)
        this.$refs.userTree.setListNodeId(id)
        return
      }
      // 清空勾选
      this.searchVal = ''
      this.reloadTree(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.search-list{
  width: 100%;
  padding-right: 5px;
  .tree-label{
    flex: 1;
  }
  .left-oper{
    margin-left: 5px;
  }
  .groupNamePath{
    margin: 0 5px;
  }
}
</style>
