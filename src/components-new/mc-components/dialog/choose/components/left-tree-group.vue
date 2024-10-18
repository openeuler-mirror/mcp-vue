<template>
  <div class="tree-group">
    <div class="sub-title flex">
      <span>{{ $t('mc-ui.tree.select.dialog.filter') }}</span>
      <mc-input v-model="searchVal" width="160px" margin="0" :search="true" />
    </div>
    <div
      class="tree-node"
    >
      <!-- 分页加载 -->
      <recycle-scroller
        v-if="searchVal && pagination"
        v-slot="{ item }"
        style="height:495px"
        :items="data"
        :buffer="50"
        :key-field="nodeKey"
      >
        <div v-if="item[nodeKey]=='more'" class="tree-label tree-search-more" :title="item[props.label]" @click="loadMore">
          <div class="tree-search-more-text">
            <i class="el-icon-circle-plus-outline" /> {{ item[props.label] }}
          </div>
        </div>
        <div v-else class="tree-label tree-search-item">
          <i class="el-icon-folder-opened" />{{ item[props.label] }}
        </div>
      </recycle-scroller>

      <!-- 懒加载非分页 -->
      <mc-tree
        v-else
        ref="treeNode"
        height="495px"
        v-bind="$props"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="tree-label">
            <i :class="data[nodeKey] == currentNodeKey? 'el-icon-s-grid':'el-icon-folder-opened' " />
            {{ node.label }}
          </span>
        </template>
      </mc-tree>

      <div v-if="loading" class="tree-loading">
        <span><span class="el-icon-loading" /> {{ $t('common.loadingText') }}</span>
      </div>
      <div v-if="noMore" class="tree-loading">
        <span><span class="el-icon-warning-outline" /> {{ $t('common.noMoreText') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import mcInput from '@/components-new/mc-ui/input/mc-input.vue'
import mcTree from '@/components-new/mc-ui/tree/mc-tree.vue'
import { RecycleScroller } from 'vue-virtual-scroller1-1-2'
import props from '@/components-new/mc-ui/tree/props.js'
import { isEmpty } from 'lodash'

export default {
  components: {
    mcTree,
    mcInput,
    RecycleScroller
  },
  mixins: [props],
  props: {
    // 搜索开启分页
    pagination: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchVal: '',
      currentPage: 1,
      loading: false,
      noMore: false
    }
  },
  computed: {
    disReachBottom () {
      return isEmpty(this.searchVal) || this.loading || this.noMore
    }
  },
  watch: {
    searchVal (val) {
      // 后端搜索
      // 后端接口是在三列选择组件外部调用的,所以此处抛出由外部处理
      this.$emit('getSearchValue', this.searchVal)
    }
  },
  methods: {
    refTree () {
      return this.$refs.treeNode.refTree()
    },
    filterNode (value, data, node) {
      if (!value) return true
      return node.label.indexOf(value) !== -1
    },
    handleNodeClick (data) {
      this.$emit('select', data)
    },
    loadMore () {
      // 加载更多
      if (!this.loading && !this.noMore) {
        this.loading = true
        this.$emit('loadMoreSearch')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-group{
  border-right: 1px $lightBorderColor solid;

  ::v-deep  {
    .vue-recycle-scroller.direction-vertical:not(.page-mode) {
      width: 100%;
    }
    .vue-recycle-scroller.direction-vertical .vue-recycle-scroller__item-wrapper{
      width: 500px;
    }

    .tree-label{
      width: 160px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  >div{
      &.sub-title{
        background-color: $subMenuActiveText;
      }
      &.tree-node{
        width: 100%;
        height: 495px;
        position: relative;
        overflow: hidden;

        .tree-search-item{
          margin-left: 15px;
          height: 26px;
          line-height: 26px;
        }

        .tree-search-more{
          width: 100%;
          height: 40px;
          cursor: pointer;
          border-top: dashed 1px #ccc;

          &:hover{
            background-color: #8bc5ff;
          }

          &-text{
            width: 228px;
            text-align: center;
            height: 40px;
            line-height: 40px;
          }
        }

        .tree-loading{
          width: 100%;
          color: #aaa;
          padding: 8px 0;
          text-align: center;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          position: absolute;
          left: 0;
          bottom: 0;
        }
      }
  }
  .el-icon-folder-opened {
    color: #ffcd2e;
    margin-right: 5px;
  }
  .el-icon-s-grid {
    color: #409eff;
    margin-right: 5px;
  }
}
</style>
