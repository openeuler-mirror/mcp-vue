<template>
  <div class="table">
    <div class="header flex justify-between align-center">
      <span>
        {{ isRidOf ? $t('three-column-tree.ridof') : $t('three-column-tree.topublish') }}
        (<span class="total" :title="tableData.length">{{ tableData.length }}</span>)
        <mc-tooltip
          v-if="pushlishTip"
          place="right"
          max-width="280px"
          style="margin: 0"
          :content="$t( isRidOf ? 'three-column-tree.topublish.tip1' : 'three-column-tree.topublish.tip2' )"
        />
      </span>
      <div>
        <mc-search v-model="searchVal" width="125px" />
        <el-link icon="el-icon-delete" style="margin-left: 5px" @click="removeAll">{{ $t('common.emptyContent') }}</el-link>
      </div>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="filterTableData()"
        class="white"
        :height="height"
        :row-key="row => row[nodeKey]"
      >
        <template v-if="columnList.length">
          <el-table-column
            v-for="{prop,label,width,formatter} in columnList"
            :key="prop"
            :prop="prop"
            :width="width"
            :label="label"
            :formatter="(row, column, cellValue, index)=>handleFormatter(row, column, cellValue, index,formatter)"
          />
        </template>
        <template v-else>
          <el-table-column
            prop="user"
            :label="$t('choose-dialog.middleTable.user_group')"
            show-overflow-tooltip
          >
            <template slot-scope="{row}">
              <svg-icon v-if="row.isUser" icon-class="user" class="tree-icon user" />
              <svg-icon v-else icon-class="file" class="tree-icon file" />
              {{ row.label }}
            </template>
          </el-table-column>
          <el-table-column v-if="!hidePath" prop="groupNamePath" show-overflow-tooltip :label="$t('mc-ui.tree.select.dialog.path')" />
        </template>
        <el-table-column :label="$t('mc-ui.tree.select.dialog.operation')" width="100">
          <template slot-scope="{row}">
            <div class="flex align-center" @click="removeSelectRow(row)">
              <mc-link v-if="isRidOf" nomargin :is-stop-propagation="false">{{ $t('three-column-tree.cancel.ridof') }}</mc-link>
              <i v-else class="el-icon-delete" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import mcSearch from '@/components-new/mc-ui/input/mc-search'
import mcTooltip from '@/components-new/mc-ui/tooltip/mc-tooltip'
import mcLink from '@/components-new/mc-ui/link/mc-link'
import _ from 'lodash'
export default {
  components: {
    mcSearch,
    mcLink,
    mcTooltip
  },
  inject: ['nodeKey', 'midColumn', 'rightColumn', 'midRelated', 'pushlishTip', 'beforeCancelSelect'],
  props: {
    //   是否是剔除操作
    isRidOf: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchVal: '',
      hidePath: false // 是否隐藏路径
    }
  },
  computed: {
    searchProp () {
      if (this.rightColumn && this.rightColumn.length) {
        return this.rightColumn.map(item => item.prop)
      } else if (this.midColumn && this.midColumn.length) {
        return this.midColumn.map(item => item.prop)
      }
      return ['label', 'groupNamePath']
    },
    columnList () {
      if (this.rightColumn.length) {
        this.rightColumn.forEach(item => {
          item.width = item.width || '160px'
        })
        return this.rightColumn
      } else if (this.midColumn.length) {
        return this.midColumn
      }
      return []
    }
  },

  methods: {
    filterTableData () {
      // 数组中如果是后代，则会被覆盖,且该后代取消选中
      const arr = this.tableData.filter(item => this.searchProp.some(search => item[search]?.includes(this.searchVal)))
      // 如果父子关联，子要被父包含，否则两个独立
      if (this.midRelated) {
        arr.forEach(item => {
          const otherIds = arr.filter(_new => _new[this.nodeKey] !== item[this.nodeKey])?.map(item => item[this.nodeKey])
          // 其他id和当前路径id是否有交际
          if (_.intersection(otherIds, item.parentGroupIds).length > 0) {
            this.removeSelectRow(item)
          }
        })
        if (arr.length) {
          const data = arr[0]
          this.hidePath = !Object.hasOwnProperty.call(data, 'groupNamePath')
        }
      }
      return arr.sort((a, b) => a.isUser - b.isUser)
    },
    removeAll () {
      const callback = () => {
        this.$emit('updateTable', [])
      }
      this.handleRemove({}, callback)
    },
    removeSelectRow (row) {
      const callback = () => {
        const selectedRows = this.tableData.filter(item => item[this.nodeKey] !== row[this.nodeKey])
        this.$emit('updateTable', selectedRows)
      }
      this.handleRemove(row, callback)
    },
    async handleRemove (row, callback) {
      const request = this.isRidOf ? this.beforeCancelExclude : this.beforeCancelSelect
      try {
        request && await request(row, callback)
      } catch (error) {
        return
      }
      callback()
    },
    handleFormatter (row, column, cellValue, index, formatter) {
      return formatter(row, { ...column, prop: column.property }, cellValue, index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.total{
  max-width: 80px;
  display: inline-block;
  vertical-align: middle;
  @include text-overflow
}
.table ::v-deep{
  padding: 5px 0;
}
.table{
  .header{
    margin: 3px 15px 8px 15px
  }
  .el-icon-delete{
    cursor: pointer;
    font-size: 16px;
    margin-left: 3px;
    &:hover{
      color: $colorPrimary;
    }
  }
}
</style>
