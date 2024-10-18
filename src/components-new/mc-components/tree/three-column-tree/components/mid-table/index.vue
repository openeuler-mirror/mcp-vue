<template>
  <div class="flex mid-column" :class="{'mid-column--ridof': isRidOf}">
    <div class="mid-table" :style="{'padding-bottom': isPageStatus ? '20px' : '0'}">
      <mc-select-table
        ref="mcSelectTable"
        :list-handler="getTableList"
        :column-list="columnList"
        :pager-count="5"
        :pagination-show="isPageStatus"
        :height="isPageStatus ? '580px' : '640px'"
        class-name="white"
        pagination-layout="sizes, prev, pager, next"
        v-bind="new$Props"
        @onFilter="handleFilter"
        @closeTag="closeTag"
        @clearTag="clearTag"
        @selectAll="handleSelectAll"
        @selectRow="handleSelectRow"
        @selectionChange="handleSelectionChange"
        @select="handleSelect"
        @getTableData="handleGetTableData"
      >
        <template #toolbar>
          <div class="toolbar">
            <div class="header flex justify-between align-center">
              <span>{{ $t('mc-ui.tree.select.dialog.selecting') }} ({{ total }})</span>
              <mc-search
                v-model="searchVal"
                :search="true"
                :placeholder="midPlaceholder"
                @change="handleSearch"
              />
            </div>
          </div>
        </template>
        <template #unshift>
          <el-table-column type="selection" :selectable="renderSelected" width="40" />
        </template>
        <template #append>
          <el-table-column
            v-if="isRidOf"
            prop="desc"
            :label="$t('common.explain')"
            show-overflow-tooltip
            :formatter="formatterDesc"
          />
          <el-table-column v-if="isRidOf" :label="$t('mc-ui.tree.select.dialog.operation')" width="100">
            <template slot-scope="{row}">
              <mc-link
                v-if="row.showRidOf"
                nomargin
                :disabled="ridOfRows.map(item=> item[nodeKey]).includes(row[nodeKey])"
                @click="handleRidOf(row)"
              >
                {{ $t('three-column-tree.ridof') }}
              </mc-link>
            </template>
          </el-table-column>
        </template>
      </mc-select-table>
    </div>
    <div style="flex: 1">
      <right-table
        :select-table-data="selectedRows"
        :rid-of-table-data="ridOfRows"
        @updateSelectRow="updateSelectRow"
        @updateRidOfRow="updateRidOfRow"
      />
    </div>
  </div>
</template>
<script>
import mixTable from './mix-table'
import mcSearch from '@/components-new/mc-ui/input/mc-search'
import mcLink from '@/components-new/mc-ui/link/mc-link'
import rightTable from '../right-table/index'
import bus from '@/utils/bus'
import _ from 'lodash'
export default {
  inject: ['nodeKey', 'deaultSelectData', 'isRidOf', 'midColumn', 'midRelated', 'isUserGroup'],
  components: {
    rightTable,
    mcSearch,
    mcLink
  },
  mixins: [mixTable],
  props: {
    activeNode: {
      type: Object,
      default: () => {}
    },
    // api 点击左边tree，中间的表格同步更新数据，所调用的接口
    getMidTableFilter: {
      type: Function,
      default: null
    },
    // mid 排除的时候，进行拦截，return promise
    beforeExclude: {
      type: Function,
      default: null
    },
    midPlaceholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectedRows: _.cloneDeep(this.deaultSelectData.select) || [], // 已选中
      ridOfRows: _.cloneDeep(this.deaultSelectData.exclude) || [] // 待排除数组
    }
  },
  computed: {
    selectedRowsIds () {
      return this.selectedRows.map(item => item[this.nodeKey])
    },
    ridOfRowsIds () {
      return this.ridOfRows.map(item => item[this.nodeKey])
    }
  },
  watch: {
    // 左边树点击时，表格数据跟着切换
    activeNode: {
      handler (val) {
        this.reloadTable()
      },
      immediate: true
    },
    // 抛出去
    'selectedRows.length': {
      handler (len) {
        bus.$emit('selectArrayChange', this.selectedRows)
      }
    },
    'ridOfRows.length': {
      handler (len) {
        bus.$emit('ridofArrayChange', this.ridOfRows)
      }
    }
  },
  methods: {
    // 如果父级已发布，下面的用户不可以再发布，此时才可以排除
    renderSelected (row) {
      if (!this.selectedRowsIds.length || !row.parentGroupIds || !row.parentGroupIds.length) {
        return true
      }
      // 如果父子关联，父级被选择，子级要被禁止勾选
      return this.midRelated ? _.intersection(this.selectedRowsIds, row.parentGroupIds).length <= 0 : true
    },
    // 排除
    async handleRidOf (row) {
      const callback = () => {
        this.ridOfRows.push(row)
      }
      try {
        this.beforeExclude && await this.beforeExclude(row, callback)
      } catch (error) {
        return
      }
      callback()
    },
    // 删除已选中
    updateSelectRow (selections) {
      this.selectedRows = selections
      // 当前路径id 是否在已选id里，只有已选才可以排除
      this.ridOfRows = this.ridOfRows.filter(item => _.intersection(this.selectedRowsIds, item.parentGroupIds).length > 0)
      this.renderTableSelection()
    },
    // 取消排除
    updateRidOfRow (selections) {
      this.ridOfRows = selections
    }
  }
}
</script>
<style lang="scss" scoped>
.mid-column{
  min-width: 600px;
  &--ridof{
    min-width: 680px;
  }
}
.mid-table ::v-deep{
  border-left: 1px $defaultBorderColor solid;
  border-right: 1px $defaultBorderColor solid;
  padding: 5px 0 ;
}
.mid-table{
  flex: 1;
  min-width: 300px;
  .header{
    margin: -6px 15px -3px 15px
  }
}
</style>
