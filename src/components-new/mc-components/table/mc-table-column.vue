<template>
  <div class="mc-table-column">
    <!-- TODO 预留排序 -->
    <el-popover v-model="visible" placement="bottom" :width="filterWidth" trigger="hover">
      <i slot="reference" class="el-icon-arrow-down el-icon-arrow-up" />
      <div class="filter-box el-table-filter__content">
        <el-input v-model="search" size="mini" clearable :placeholder="$t('common.columnSearch')" />
        <div class="filter-list">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in searchArr" :key="item[defaultProps.key]" :label="item[defaultProps.label]">
              <span v-if="item[defaultProps.name]">{{ item[defaultProps.name] }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="el-table-filter__bottom">
        <el-link
          :underline="false"
          :disabled="!checkList.length"
          @click="handleConfirm"
        >{{ $t('common.columnFilter') }}</el-link>
        <el-link :underline="false" :disabled="disReset" @click="handleReset">{{ $t('common.columnReset') }}</el-link>
      </div>
    </el-popover>
  </div>
</template>
<script>
/**
 * @group 组件组合的封装 mc-components
 * 二次封装的table-column 头部筛选组件,用于在table头部加入下拉筛选功能
 */
import { isEmpty } from 'lodash'

export default {
  props: {
    /**
     * 筛选的选项列表
     * filterProps['label']:String, // 节点的勾选框属性值,一般是国际化描述文本或者给后台接口的值
     * filterProps['name']:String, // 节点的国际化描述文本
     * filterProps['key']:[String,Number] // 节点的勾选框属性值,一般是传给后台接口的值
     * filterProps['checked']:Boolean // 是否选中
     */
    filters: {
      type: Array,
      required: true,
      default: () => []
    },
    /**
     * 列表项的属性,只需要传需要设置的部分
     * 设置了label和name时无需设置key，此时label是传给后台接口的值，name是国际化描述文本，key会自动设置为label的值
     * 设置了key和label时无需设置name，此时key是传给后台接口的值，label是国际化描述文本
     */
    filterProps: {
      type: Object,
      default: () => {
        return {
          key: 'key',
          label: 'value',
          name: 'name',
          checked: 'checked'
        }
      }
    },
    // 属性
    prop: {
      type: String,
      required: true,
      default: ''
    },
    // 筛选组件的宽度
    filterWidth: {
      type: String,
      default: '200'
    }
  },
  data () {
    return {
      search: '',
      checkList: [],
      visible: false,
      searchArr: [],
      emitUpdate: false, // 触发update标识
      disReset: false // 禁用重置
    }
  },
  computed: {
    defaultProps () {
      return Object.assign({
        key: this.filterProps.key || this.filterProps.label,
        label: 'value',
        name: 'name',
        checked: 'checked'
      }, this.filterProps)
    }
  },
  watch: {
    search (val) {
      this.searchArr = this.filters.filter((item) => {
        // 查找不区分大小写
        return item[this.defaultProps.name].match(new RegExp(val, 'i'))
      })
    },
    filters: {
      deep: true,
      immediate: true,
      handler (list) {
        // 优化之前的多次触发handleConfirm问题
        // @arg prop:属性 texts:选择的所有项
        this.handleCheck() > 0 && this.$emit('onInit', {
          prop: this.prop,
          texts: this.checkList
        }) && this.update()
      }
    },
    visible (val) {
      if (val) {
        this.emitUpdate = false
        this.search = '' // 气泡出现时清空搜索
        this.disReset = this.getCheckedNum() === 0 // 气泡出现时是否启用重置
      }
      if (!val && !this.emitUpdate) {
        // 没有点击"筛选""重置"隐藏气泡时应当做数据同步,修正勾选项
        this.handleCheck()
      }
    }
  },
  methods: {
    handleCheck () {
      // 此处处理初始化设置默认checked时进行筛选
      // 每次手动点击筛选后也会进入这里，但是checkList与手动选择的是相同的
      // 可以通过判断前后筛选的checkList是否相同来过滤
      this.searchArr = this.filters
      return this.getCheckedNum()
    },
    getCheckedNum () {
      let num = 0
      this.checkList = []
      for (const item of this.filters) {
        item[this.defaultProps.checked] && this.checkList.push(item[this.defaultProps.label]) && num++
      }
      return num
    },
    setChecked () {
      const sta = !isEmpty(this.checkList)
      for (const item of this.filters) {
        item[this.defaultProps.checked] = sta && this.checkList.includes(item[this.defaultProps.label])
      }
    },
    handleConfirm () {
      this.setChecked()
      // 仅"筛选"触发
      // @arg prop:属性 texts:选择的每一项
      this.$emit('onFilter', {
        prop: this.prop,
        texts: this.checkList
      })
      this.update()
    },
    handleReset () {
      this.clearFilter()
      this.setChecked()
      // 仅"重置"触发
      // @arg prop:属性
      this.$emit('onReset', { prop: this.prop })
      this.update()
    },
    // 清除Filter事件，供外部（mc-select-table组件等）使用
    clearFilter () {
      this.checkList = []
      this.search = ''
    },
    update () {
      this.emitUpdate = true
      // 返回的数据,"筛选"和"重置"都会触发
      // @arg prop:属性 texts:选择的每一项
      this.$emit('handleFilter', {
        prop: this.prop,
        texts: this.checkList
      })
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.filter-box {
  .filter-list {
    .el-checkbox {
      margin-top: 8px;
      display: block;
    }
  }
  & + .el-table-filter__bottom {
    margin: 15px -12px -8px -12px;
    padding-left: 15px;
    .el-link {
      margin-right: 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
.el-checkbox-group{
  max-height:240px;
  overflow-y:auto;
  padding-bottom: 17px;
}
.mc-table-column {
  display: inline-block;
  i {
    cursor: pointer;
    outline: 0;
  }
}
.filter-list {
  ::v-deep .el-checkbox__label {
    white-space: nowrap;
  }
}
</style>
