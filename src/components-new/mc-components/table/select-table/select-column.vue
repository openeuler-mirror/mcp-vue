<template>
  <div id="select-column" class="table-select-column">
    <el-popover v-model="visible" placement="bottom" width="200" height="100" trigger="click">
      <div class="pop-content">
        <el-input v-model="search" size="mini" clearable :placeholder="$t('common.columnSearch')" />
        <el-checkbox-group v-model="columnSelect" class="checkbox-group">
          <el-checkbox
            v-for="(item,index) in searchArr"
            :key="index"
            :label="item[defaultProps.key]"
            class="checkbox-item"
            :disabled="item[defaultProps.required]"
          >{{ item[defaultProps.name] }}</el-checkbox>
        </el-checkbox-group>
        <div class="pop-button">
          <span @click="applyColumn">{{ $t('common.apply') }}</span>
          <span @click="resetColumn">{{ $t('common.reset') }}</span>
        </div>
      </div>
      <svg-icon slot="reference" icon-class="filter" class="filter-icon" />
    </el-popover>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'

/**
 * @group 组件组合的封装 mc-components
 * 二次封装的字段控制器组件,用于控制哪些字段显示
 * 请配合 table 组件使用
 */
export default {
  name: 'SelectColumn',
  props: {
    /**
     * columnArray 多选的列表内容
     * item项包含:
     *  key - 表头字段key
     *  name - 国际化字段
     *  required - 是否是必选表头字段,为true则默认选中不可取消
     *  default - 是否为始化显示字段，重置的时候会显示初始化字
     * */
    columnArray: {
      type: Array,
      default: () => []
    },
    // 存储在sessionStorage中的唯一key,不设置则不会存储在sessionStorage中
    storageKey: {
      type: String,
      default: ''
    },
    /**
     * 节点的属性值字段名,只需要传需要设置的部分
     * key:checkbox节点的勾选框属性值,一般时传给后台接口的值,
     * name:checkbox节点的国际化描述文本,
     * required:checkbox节点是否必选,不可取消选中,
     * default:checkbox节点是否默认选中,
     * */
    props: {
      type: Object,
      default: () => {
        return {
          key: 'key',
          name: 'name',
          required: 'required',
          default: 'default'
        }
      }
    },
    // 初始化是否调用setColumn函数
    isInitCallSetColumn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 选择后的字段
      columnSelect: [],
      visible: false,
      emitUpdate: false, // 触发update标识
      search: '',
      searchArr: []
    }
  },
  computed: {
    defaultProps () {
      return Object.assign({
        key: 'key',
        name: 'name',
        required: 'required',
        default: 'default'
      }, this.props)
    }
  },
  watch: {
    columnArray: {
      deep: true,
      immediate: true,
      handler (list) {
        this.handleCheck()
      }
    },
    visible (val) {
      this.search = ''
      if (val) {
        this.emitUpdate = false
      }
      if (!val && !this.emitUpdate) {
        // 没有点击"筛选""重置"隐藏气泡时应当做数据同步,修正勾选项
        this.handleCheck()
      }
    },
    search (val) {
      this.searchArr = this.columnArray.filter((item) => {
        // 查找不区分大小写
        return item.label.match(new RegExp(val, 'i'))
      })
    }
  },
  methods: {
    handleCheck () {
      // 初始化默认选择字段
      this.columnDefault = []
      // 存储默认选择字段
      for (const column of this.columnArray) {
        if (column[this.defaultProps.required]) {
          column[this.defaultProps.default] = true
        }
        column[this.defaultProps.default] && this.columnDefault.push(column[this.defaultProps.key])
      }
      // 设置已选
      this.columnSelect = cloneDeep(this.columnDefault)
      // 存储在sessionStorage中的选项
      const columnStorage = sessionStorage.getItem(this.storageKey)
      if (columnStorage && JSON.parse(columnStorage).length) {
        // 设置已选
        // sessionStorage中的选项优先级比默认选择字段的高
        this.columnSelect = JSON.parse(columnStorage).map(column => column[this.defaultProps.key])
      }
      this.searchArr = this.columnArray
      this.isInitCallSetColumn && this.setColumn()
    },
    // 应用
    applyColumn () {
      this.emitUpdate = true
      this.visible = false
      this.setColumn()
    },
    // 重置
    resetColumn () {
      // 重置默认选择字段到已选
      this.columnSelect = cloneDeep(this.columnDefault)
      this.applyColumn()
    },
    setColumn () {
      const column = this.columnArray.filter(item => this.columnSelect.includes(item[this.defaultProps.key]))
      // 存储已选字段
      this.storageKey && sessionStorage.setItem(this.storageKey, JSON.stringify(column))
      this.$emit('changeColumn', column)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-select-column {
  display: inline-block;
  margin-right: 10px;
  order: 10;

  ::v-deep .el-checkbox-group {
    font-size: 0;
    display: flex;
    flex-direction: column;
    ::v-deep .el-checkbox {
      line-height: 40px;
    }
  }
}
.el-checkbox-group{
  overflow-y:auto;
  max-height:490px;
}

::v-deep .el-select-dropdown__item {
  display: flex;
  align-items: center;
}

.filter-icon {
  font-size: 16px;
  cursor: pointer;
  margin-left: 10px;
  &:hover{
   color:$menuHover;
  }
}
.pop-content {
  width: 100%;
  height: auto;
  .pop-button {
    width: 100%;
    height: 30px;
    border-top: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #2e8ff4;
    text-decoration: underline;
    cursor: pointer;
  }
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  .checkbox-item {
    line-height: 28px;
  }
}
</style>
