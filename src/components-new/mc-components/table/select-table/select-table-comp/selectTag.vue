<template>
  <div class="select-tag" :class="className">
    <div class="select-tag-content">
      <span class="filter-title">{{ $t('common.filter') }}</span>
      <span v-for="(item,key) in columnTable" :key="key" class="tag-item">
        <span v-if="showTag(item.filters)">
          <el-tag closable size="mini" @close="closeTag(item)">
            <el-tooltip effect="dark" placement="bottom">
              <span class="tag-item-text">{{ $t(item.label) }}:{{ changeFilters(item.filters) }}</span>
              <div slot="content" class="mc-select-table-tooltip-content">{{ changeFilters(item.filters) }}</div>
            </el-tooltip>
          </el-tag>
        </span>
      </span>
    </div>
    <div class="clearFilter" @click="clearTag">{{ $t('common.emptyFilter') }}</div>
  </div>
</template>

<script>
/**
 * mc-select-table专属子组件，负责下拉筛选后的tag筛选标签列显示
 * 用于拆分mc-select-table业务逻辑，减少mc-select-table代码冗余，降低逻辑复杂度
 */
import { isEmpty } from 'lodash'

export default {
  props: {
    columnTable: {
      type: Array,
      default: () => []
    },
    // 表格风格
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    showTag (filters) {
      return !isEmpty(filters.filter(item => item.checked))
    },
    changeFilters (filters) {
      const checkedArr = filters.filter(item => item.checked)
      return !isEmpty(checkedArr) ? checkedArr.reduce((total, cur, index) => (total += (cur.value || cur.label) + ';'), '') : ''
    },

    // 关闭单个tag
    closeTag (data) {
      this.$emit('closeTag', data)
    },

    // 清空tag
    clearTag () {
      this.$emit('clearTag')
    }
  }
}
</script>

<style lang="scss" scoped>
.select-tag{
    box-sizing: border-box;
    min-height: 35px;
    background: $lightBgColor;
    border: 1px solid $subBorderColor;
    border-radius: 2px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.white{ // 白色主题
      background: #fff;
      border-color: $lightFormColor;
      .filter-title {
        color: $subTextColor;
      }
    }

    &-content{
        width: calc(100% - 100px);
    }

    .filter-title {
        color: #ffffff;
        font-size: 12px;
        line-height: 35px;
        margin-right: 10px;
    }
    .tag-item {
        line-height: 35px;

        .el-tag{
        margin-right: 10px;
        max-width: calc(100% - 72px);
        }

        &-text{
        display: inline-block;
        max-width: 200px;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        }
    }
    .clearFilter {
        min-width: 80px;
        text-align: center;
        color: #409eff;
        text-decoration: underline;
        cursor: pointer;
    }
}
</style>
