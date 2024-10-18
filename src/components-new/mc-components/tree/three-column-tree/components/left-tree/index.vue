<!--在tree-group的基础上增加了tab-->
<template>
  <div
    class="tree-uesr-group--left flex"
    :class="{
      'tree-uesr-group--left-white': white,
      'tree-uesr-group--left-onlyleft': onlyLeft,
      'tree-uesr-group--left-hide': !showHeader
    }"
  >
    <div class="left">
      <mc-tabs
        v-model="activeName"
        :panes="tabGroup"
        :theme="white ? 'light':'dark'"
        @tab-click="handleTabClick"
      >
        <div class="tab-content">
          <tab-user
            v-if="activeName === 'left-tab'"
            ref="left-tab"
            v-bind="$props"
            v-on="$listeners"
            @nodeClick="handleNodeClick"
          >
            <template #left-oper="{ node,data }">
              <slot name="left-oper" :node="node" :data="data" />
            </template>
          </tab-user>
          <tab-label
            v-else-if="activeName === 'right-tab'"
            ref="right-tab"
            v-bind="$props"
            v-on="$listeners"
            @nodeClick="handleNodeClick"
          >
            <template #right-oper="{ node,data }">
              <slot name="right-oper" :node="node" :data="data" />
            </template>
          </tab-label>
        </div>
      </mc-tabs>
    </div>
    <div v-if="!onlyLeft">
      <mid-table
        :active-node="tabActiveNodeData"
        :get-mid-table-filter="getMidTableFilter"
        :mid-placeholder="midPlaceholder"
        :before-exclude="beforeExclude"
      />
    </div>
  </div>
</template>

<script>
import mixProp from '../../prop'
import midTable from '../mid-table/index'
import tabUser from './tab-left-user'
import tabLabel from './tab-right-label'
import mcTabs from '@/components-new/mc-ui/nav-tab/mc-tabs'
export default {
  components: {
    tabUser,
    tabLabel,
    midTable,
    mcTabs
  },
  mixins: [mixProp],
  // 透传参数，不用通过prop 逐级传递
  provide () {
    return {
      nodeKey: this.nodeKey,
      isRidOf: this.isRidOf,
      deaultSelectData: this.deaultSelectData,
      midColumn: this.midColumn,
      rightColumn: this.rightColumn,
      midRelated: this.midRelated,
      isUserGroup: this.isUserGroup,
      pushlishTip: this.pushlishTip,
      beforeCancelSelect: this.beforeCancelSelect,
      beforeCancelExclude: this.beforeCancelExclude
    }
  },
  data () {
    return {
      activeName: 'left-tab',
      tabActiveNodeData: {} // node 选中的node信息
    }
  },
  computed: {
    tabGroup () {
      const arr = this.onlyLabel ? ['left-tab'] : ['left-tab', 'right-tab']
      return arr.map(item => {
        const info = {}
        info.name = item
        info.label = item === 'left-tab'
          ? (this.leftTabText || this.$t('three-column-tree.tab1'))
          : (this.rightTabText || this.$t('three-column-tree.tab2'))
        info.lazy = item === 'right-tab'
        return info
      })
    }
  },
  methods: {
    handleTabClick (tab) {
      this.activeName = tab.activeName
      this.$emit('leftTabChange', tab.activeName)
    },
    reloadTree (id, params) {
      const refEle = Array.isArray(this.$refs[this.activeName]) ? this.$refs[this.activeName][0] : this.$refs[this.activeName]
      refEle.reloadTree(id, params)
    },
    handleNodeClick (params) {
      if (!this.onlyUser) {
        this.tabActiveNodeData = params
        return
      }
      if (params.node.isUser) {
        this.tabActiveNodeData = params
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.tree-label{
  display: flex;
  align-items: center;
}
.tree-uesr-group--left{
  border: 1px $defaultBorderColor solid;
  width: max-content;
  .tab-content{
    margin-top: 10px
  }
  .left{
    width: 300px;
  }
}
.tree-uesr-group--left ::v-deep{
  .el-tabs__nav{
    width: 100%;
    display: flex;
    >div{
      flex: 1;
      text-align: center;
    }
  }
  .el-tabs__item{
    max-width: 160px;
  }
}
.tree-uesr-group--left-white ::v-deep{
  .el-tabs__item.is-active,
  .el-tabs__header,
  .el-tabs__nav,
  .el-tabs__item{
    border-color: transparent !important;
  }
  .el-tabs__header{
    border-bottom: 1px $defaultBorderColor solid !important;
  }
}
// 只展示侧边栏时，覆盖上面的样式
.tree-uesr-group--left-onlyleft{
  .left{
    width: auto;
  }
}
.tree-uesr-group--left-onlyleft ::v-deep{
  width: auto;
  display: block;
  border-color: transparent;
}
// 比较简单的tree时，可不显示tab
.tree-uesr-group--left-hide ::v-deep{
  .el-tabs__header{
    display: none;
  }
}

</style>
