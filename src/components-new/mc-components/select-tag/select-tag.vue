<template>
  <div v-show="visibleTag" :emit="emitVisible()" class="select-tag">
    <div class="select-tag-content">
      <span class="filter-title">{{ $t('common.filter') }}</span>
      <span v-for="(item,key) in filterList" :key="key" class="tag-item">
        <el-tag
          v-show="item.length"
          v-if="type=='string'"
          class="tag-item-eltag"
          closable
          size="mini"
          @close="closeFilterItem(key)"
        >
          <span class="tag-item-text">{{ item }}</span>
        </el-tag>
        <el-tag
          v-show="item.val"
          v-if="type=='object'"
          closable
          size="mini"
          @close="closeFilterItem(item,key)"
        >
          <span class="tag-item-text">{{ $t(item.label) }}:{{ item.val }}</span>
        </el-tag>
      </span>
    </div>
    <div class="clearFilter" @click="clearFilter">{{ $t('common.emptyFilter') }}</div>
  </div>
</template>

<script>
/**
	 * @group 组件组合的封装 mc-components
	 * 筛选后的tag数据标签管理,tag标签内文字支持字符串与键值对展示,一般放在table上方
	 * 建议配合 mc-table-column(th头部筛选弹窗) 组件使用
*/
export default {
  props: {
    // 标签内部文字的展示形式
    // string:字符串('val1;val2');
    // object:键值对对象({val:'val1;val2',label:'label'})
    type: {
      type: String,
      default: 'string'
    },
    /**
     * 传入的数据
     * 当type为string时,tagList为{name:'val1;val2',name:'val1;val2'},name为table对应表头数据的字段名
     * 当type为object时,tagList为{name:{val:'val1;val2',label:'label'}},name为table对应表头数据的字段名,
     * val为筛选的值,label为国际化的字段,通过$t(label)能获取正确的国际化值
     * */
    tagList: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      filterList: null
    }
  },
  computed: {
    visibleTag () {
      return Object.values(this.tagList).filter((item) =>
        this.type === 'object' ? item.val.length : item.length
      ).length
    }
  },
  watch: {
    tagList: {
      immediate: true,
      deep: true,
      handler (obj) {
        if (this.type === 'object') {
          this.filterList = []
          for (const key in obj) {
            this.filterList.push({
              name: key,
              val: obj[key].val,
              label: obj[key].label
            })
          }
        } else {
          this.filterList = obj
        }
      }
    }
  },
  methods: {
    closeFilterItem (item, index) {
      if (this.type === 'object') {
        this.filterList.splice(index, 1)
      } else {
        this.$set(this.filterList, item, '')
      }
      // 关闭单个tag触发
      // @arg 返回关闭的单个tag数据
      this.$emit('close', item)
    },
    clearFilter () {
      Object.keys(this.filterList).forEach((item) => {
        this.$set(this.filterList, item, '')
      })
      // 清空全部tag触发
      this.$emit('clear')
    },
    emitVisible () {
      // 获取select-tag的显示状态
      // @arg 返回true或者false
      this.$emit('getShow', !!this.visibleTag)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-tag {
  width: 100%;
  min-height: 35px;
  background: $lightBgColor;
  border: 1px solid rgba(23, 33, 71, 1);
  margin-top: 20px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

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
      max-width: calc(100% - 12px);
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
