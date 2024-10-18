<!--折叠树，可全部打开，折叠和搜索-->
<template>
  <div :class="{'tree-group-box--white': white}" class="tree-group-box">
    <div class="head flex">
      <div v-if="visibleExpand">
        <span :title="$t('logWarning.expandAll')">
          <svg-icon icon-class="tree_open_all" class="filter" @click="openAllHandle" />
        </span>
        <span :title="$t('logWarning.packUpAll')">
          <svg-icon icon-class="tree_close_all" class="filter" @click="closeAllHandle" />
        </span>
      </div>
      <mc-search v-model="searchVal" :placeholder="$t('data.extractLog.searchTip')" width="160px" @change="handleSearch" />
    </div>
    <div class="container">
      <div v-if="searchVal" class="recycle-scroller">
        <!-- 分页加载 -->
        <recycle-scroller
          v-slot="{item}"
          :items="filterData"
          :item-size="30"
          :key-field="nodeKey"
          :buffer="50"
          infinite-scroll-distance="50"
          :style="{
            height,
            'overflow-y': 'auto',
            'scroll-behavior': 'smooth',
            'padding-top': '5px'
          }"
        >
          <div class="scroll-list" :class="{'scroll-list--active': item[nodeKey] === activeListNodeId}" @click.stop="handleNodeClick(item)">
            <template v-if="$scopedSlots.list">
              <slot name="list" :data="item" />
            </template>
            <template v-else>
              <span class="tree-label flex align-center">
                <svg-icon v-if="isShowRightLabelIcon" icon-class="file" class="tree-icon file" />
                <span> {{ item[props['label']] }}</span>
              </span>
            </template>
          </div>
        </recycle-scroller>
      </div>
      <div v-else>
        <mc-tree
          ref="treeNode"
          :key="activeListNodeId"
          :props="props"
          :height="height"
          :data="treeData"
          :white="white"
          :lazy="lazy"
          :load="load"
          :node-key="nodeKey"
          :only-user="onlyUser"
          :current-node-key="currentNodeKey"
          :default-expand-all="expandAll"
          :show-checkbox="showCheckbox"
          :check-strictly="checkStrictly"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        >
          <template #default="{ node,data }">
            <template v-if="$scopedSlots.tree">
              <slot name="tree" :node="node" :data="data" />
            </template>
            <template v-else>
              <span class="tree-label flex align-center">
                <!-- 这里固定是 label -->
                <svg-icon icon-class="file" class="tree-icon file" />
                <span> {{ node.label }}</span>
              </span>
            </template>
          </template>
        </mc-tree>
      </div>
    </div>
  </div>
</template>

<script>
import mcSearch from '@/components-new/mc-ui/input/mc-search'
import mcTree from '@/components-new/mc-ui/tree/mc-tree'
import { RecycleScroller } from 'vue-virtual-scroller1-1-2'
import mixProp from './prop'
export default {
  components: {
    mcSearch,
    mcTree,
    RecycleScroller
  },
  mixins: [mixProp],
  data () {
    return {
      searchVal: '',
      expandAll: false,
      activeListNodeId: null // 虚拟树当前的id
    }
  },
  computed: {
    treeRef () {
      return this.$refs.treeNode.refTree()
    }
  },
  mounted () {
    this.setCurrentKey(this.treeData, -1)
  },
  methods: {
    setListNodeId (val) {
      val && (this.activeListNodeId = val)
    },
    setCurrentKey (arr, id) {
      if (id === -1) {
        this.$refs.treeNode.setCurrentKey(this.treeData[0])
        this.updateCurNode()
        return
      }
      setTimeout(() => {
        for (let index = 0; index < arr.length; index++) {
          const item = arr[index]
          if (Number(item[this.nodeKey]) === Number(id)) {
            this.$refs.treeNode.setCurrentKey(item)
            this.updateCurNode()
            break
          } else if (item[this.props.children] && item[this.props.children].length > 0) {
            this.setCurrentKey(item[this.props.children], id)
          }
        }
      }, 200)
    },
    handleSearch (val) {
      this.$emit('handleSearch', val)
    },
    handleNodeClick (data) {
      if (this.searchVal) {
        this.activeListNodeId = data[this.nodeKey]
      }
      // 只能选择用户，不能选择组
      if (!this.onlyUser) {
        this.$emit('nodeClick', data)
        return
      }
      if (data.isUser) {
        this.$emit('nodeClick', data)
      }
    },
    // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    handleCheckChange (data, checked, indeterminate) {
      this.$emit('check-change', { data, checked, indeterminate })
    },
    openAllHandle () {
      if (this.searchVal) {
        return
      }
      this.expandAll = true
      this.$refs.treeNode.expandAll()
    },
    closeAllHandle () {
      if (this.searchVal) {
        return
      }
      this.expandAll = false
      // 这里有个问题,内容太长在底部关闭全部时,无法关闭
      const treeNode = this.$refs.treeNode.$el
      const recycle = treeNode.getElementsByClassName('vue-recycle-scroller')[0]
      const oldHeight = recycle.offsetHeight
      recycle.style.height = '0px'
      recycle.scrollTop = 0
      this.$refs.treeNode.closeAll()
      setTimeout(() => {
        recycle.style.height = oldHeight + 'px'
      }, 500)
    },
    updateCurNode () {
      setTimeout(() => {
        this.$emit('update-node', this.getCurrentNode())
      }, 300)
    },
    getCurrentNode () {
      return this.$refs.treeNode.getCurrentNode()
    },
    getCurrentKey () {
      return this.$refs.treeNode.getCurrentKey()
    }
  }

}
</script>
<style lang="scss" scoped>
.tree-group-box ::v-deep{
  .recycle-scroller .vue-recycle-scroller__item-view{
    margin-top: 5px
  }
}
.tree-group-box{
  .head{
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-right: 5px;
  }
  .svg-icon.filter{
      color: #fff;
      cursor: pointer;
      font-size: 22px;
      &:first-child{
        margin: 0 5px 0 5px;
      }
  }
  .container{
    min-height: 600px;
    background-color: #090F26;
  }
  .scroll-list{
    padding: 0 10px;
    cursor: pointer;
    position: relative;
    &::after{
      content: "";
      position: absolute;
      left: 0px;
      top: -5px;
      bottom: -5px;
      right: 0;
      z-index: -1;
    }
    &:hover{
      &::after{
        background-color: rgba($ligthTabBgColor,0.3);
      }
    }
    &--active{
      &::after{
        background-color: rgba($ligthTabBgColor,0.6)  !important;
      }
    }
  }
}
.tree-group-box--white {
  .container{
    background-color: #fff;
  }
}

</style>
