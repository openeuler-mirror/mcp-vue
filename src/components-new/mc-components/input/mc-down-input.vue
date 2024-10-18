<template>
  <div>
    <el-input
      v-model="searchText"
      :placeholder="placeholder"
      :style="{width:width}"
      class="input-with-select"
      clearable
      @keyup.enter.native="changeSearch"
      @clear="changeSearch"
    >
      <el-select slot="prepend" v-model="select">
        <el-option v-for="item in dropdownList" :key="item[defaultProps.value]" :value="item[defaultProps.value]" :label="item[defaultProps.label]" />
      </el-select>
      <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearch" />
    </el-input>
  </div>
</template>
<script>
/**
 * @group 单个组件的封装 mc-components
 * 二次封装的input 组件,针对有下拉的input框的场景
 */
import i18n from '@/lang'
export default {
  props: {
    // 整个下拉input框的宽度设置
    width: {
      type: String,
      default: '300px'
    },
    /**
     * dropdownList数组中每一项包含
     * label:String, //每一选项名称，可通过props修改
     * value:String,//每一选项的value值，可通过props修改
     */
    // 下拉选项的列表设置，参照props的默认值,一般设置为[{label:'',value:''}]
    dropdownList: {
      type: Array,
      default: () => []
    },
    props: {
      /**
       * `label:国际化，可自定义，string`
       * `value:国际化对应的字段名，可自定义，string`
       */
      type: Object,
      default: () => {}
    },
    // input框的placeholder值设置
    placeholder: {
      type: String,
      default: i18n.t('common.columnSearch')
    },
    // 默认下拉展示的选项
    defaultSelect: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      select: '',
      searchText: ''
    }
  },
  computed: {
    defaultProps () {
      return Object.assign({
        label: 'label',
        value: 'value'
      }, this.props)
    }
  },
  watch: {
    dropdownList: {
      immediate: true,
      handler () {
        this.initSelect()
      }
    }
  },
  methods: {
    // 给select设置初始值
    initSelect () {
      this.select = this.defaultSelect || this.dropdownList[0][this.defaultProps.value]
    },
    // 重置
    resetSearch () {
      this.initSelect()
      this.searchText = ''
      this.changeSearch()
    },
    changeSearch () {
      const params = {}
      const objectKeys = this.dropdownList.map(item => item[this.defaultProps.value])
      objectKeys.forEach(search => {
        if (search === this.select) {
          params[search] = this.searchText
        } else {
          params[search] = ''
        }
      })
      this.$emit('changeTableSearch', params)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep{
  .el-input-group__prepend {
    overflow: hidden;
    .el-select .el-input__inner{
      width:100px
    }
  }
  .el-select--small{
    .el-input--small{
      .el-input__inner{
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>
