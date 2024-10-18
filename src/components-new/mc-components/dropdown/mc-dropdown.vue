<template>
  <el-dropdown :trigger="trigger" :placement="placement" class="mc-dropdown" v-on="$listeners">
    <slot v-if="isSlot" />
    <template v-else>
      <el-button v-if="type === 'button'" type="primary" :disabled="disabled">{{ label || $t('common.moreLabel') }}<svg-icon icon-class="tab_down" /></el-button>
      <el-link v-else type="primary" :disabled="disabled">{{ label || $t('common.moreLabel') }}<svg-icon icon-class="tab_down" /></el-link>
    </template>
    <el-dropdown-menu slot="dropdown" :class="isShow" class="dropdownPop">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-tooltip
          v-for="(item,index) in dropdownMenuList"
          :key="index"
          popper-class="tooltip-style"
          effect="light"
          :class="calcClass(item)"
          :disabled="calcDisabled(item)"
          :content="item.errorTitle"
          :placement="popoverPlacement"
          v-bind="$attrs"
        >
          <!-- 如果需要传入标签使用插槽 -->
          <div v-if="item.slotContent" slot="content" v-html="item.slotContent" />
          <!--  因为el-dropdown-item的disabled生效会禁用掉鼠标事件,导致el-tooltip失效，所以包裹一个div -->
          <div>
            <el-dropdown-item
              :disabled="item.disabled"
              :command="item.command"
              :type="item.type"
              :icon="item.startIcon"
              :class="['dropdownItem',downItemClass]"
            >
              <mc-dropdown
                :dropdown-menu-list="item.dropdownMenuList"
                :placement="item.placement"
                trigger="hover"
                v-bind="$attrs"
                v-on="$listeners"
              >
                <div :class="calcColorClass(item)">
                  <!-- 这里的title是已经国际化之后的内容-->
                  {{ item.title }}
                  <i v-if="item.endIcon" :class="item.endIcon" />
                </div>
              </mc-dropdown>
            </el-dropdown-item>
          </div>
        </el-tooltip>
      </el-scrollbar>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
/**
 * @group  组件组合的封装 mc-components
 * 二次封装 el-dropdown 下拉菜单，目前只能嵌套两层，具有带文字提示以及显示错误手势的功能
 * * 使用示例:
 * // html
 * <template slot-scope="{row}">
 *    <mc-dropdown :dropdown-menu-list="dropdownMenuList" @command="handleCommand($event,row)">
 *        <mc-link class="common_a">{{ $t('common.moreLabel') }}</mc-link>
 *    </mc-dropdown>
 * </template>
 * // js
 *   import mcDropdown from '@/components-new/mc-ui/dropdown/mc-dropdown.vue'
 *   import mcLink from '@/components-new/mc-ui/link/mc-link.vue'
 *   export default {
 *     components: {
 *       mcDropdown,
 *       mcLink
 *    },
 *    data(){
 *      return {
 *       dropdownMenuList: [
 *            {
 *              title:this.$t('common.power'), command: 'handlePowerClick'
 *            },
 *            {
 *              title:this.$t('common.delete') , command: 'handleDeleteClick', disabled: true, errorTitle: '下载中，无法操作' //注意国际化
 *            },
 *            {
 *              title: this.$t('common.modify'), command: 'handleCopyClick', disabled: true, errorTitle: '维护中,无法操作',
 *              endIcon: 'el-icon-caret-bottom',
 *              dropdownMenuList: [
 *                {
 *                  title: this.$t('common.startSession'), command: 'handleStartClick', disabled: true, errorTitle: '维护中,无法操作'
 *                },
 *                {
 *                  title: this.$t('common.closeSession'), command: 'handleStartClick'
 *                }
 *              ]
 *            }
 *          ]
 *       }
 *     },
 *    methods: {
 *        handleCommand (value,row) {
 *          //拿到对应操作的command值，进行后续的处理
 *          this[value]?.(row) 这里拿到的value是点击该项的回调函数名称，是自己设定的值
 *        }
 *   }
 * }
 */
export default {
  name: 'McDropdown',
  props: {
    type: {
      type: String,
      default: 'link' // button / link
    },
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * dropdownMenuList子项包含:
     *     command:  //command值就是一个标识符,是选中某一项之后返回出去的值,这里推荐传的值是选中项对应的回调函数名称,也可以不是。
     *     disabled：Boolean, //表示是否显示禁止点击效果 即cursor: not-allowed
     *     endIcon: String, //尾部的icon,
     *     startIcon: String //头部的icon
     *     title: String, //显示的label
     *     errorTitle: String,//禁止点击时,显示的错误原因
     *     placement: 菜单位置 默认'left-start'
     *     dropdownMenuList:嵌套的内容
     *     注意：目前一级菜单和二级菜单点击触发的方法为同一个方法，因此一级菜单和二级菜单的command值都是唯一的
     */
    dropdownMenuList: {
      type: Array,
      default: () => []
    },
    // 菜单弹出位置
    placement: {
      type: String,
      default: 'left-start'
    },
    // 触发下拉的行为
    trigger: {
      type: String,
      default: 'click'
    },
    // 出现位置 top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
    popoverPlacement: {
      type: String,
      default: 'left-start'
    },
    downItemClass: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    isShow () {
      return this.dropdownMenuList.length ? '' : 'isNoShow'
    },
    isSlot () {
      return !!this.$scopedSlots.default
    }
  },
  methods: {
    // 抛出当前选中值
    handleCommand (value) {
      this.$emit('handleCommand', value)
    },
    // 判断是否启用el-tooltip
    calcDisabled (item) {
      return !item.disabled || (item.disabled && !item.errorTitle && !item.slotContent)
    },
    // 判断是否添加错误手势
    calcClass (item) {
      return item.disabled && 'isDiabled'
    },
    // 禁止点击时，需要单独去设置字体颜色
    calcColorClass (item) {
      return item.disabled ? 'disabled_color' : 'title_div'
    }
  }
}
</script>

<style lang="scss" scoped>
 ::v-deep .scrollbar-wrapper{
    max-height: 60vh;
    & + .is-horizontal{
      display: none;
      overflow-x: hidden;
    }
  }
svg{
  margin-left: 5px;
  width: 0.8em !important;
}
.isDiabled{
  cursor: not-allowed;
}
.title_div{
  &:hover{
    color:$colorPrimary;
  }
}
.el-dropdown-menu__item[type="delete"]{
  .title_div{
    &:hover{
      color:$colorDanger;
    }
  }
}
.dropdownItem{
  text-align: left;
}
.isNoShow{
  display: none;
}
.disabled_color{
  color: $colorDisabled;
}
</style>
<style lang="scss">
.tooltip-style.is-light {
  color: #606266;
  border: none;
}
</style>
