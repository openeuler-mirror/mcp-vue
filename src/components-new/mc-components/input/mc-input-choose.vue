<template>
  <div class="mcChoose" :class="[readOnly ? 'mcChoose-readonly' : '',disabled? 'mcChoose-disabled' : '']" @click.stop="handlerSelectAll">
    <el-input v-model="currentVal" :disabled="disabled" :placeholder="placeholder" :style="{width: width}" @input="handlerInput">
      <template slot="append">
        <span class="select-span" @click.stop="handlerSelect">{{ dialog_choose }}</span>
      </template>
    </el-input>
  </div>
</template>

<script>
// 用户弹窗选择的input组件
export default {
  props: {
    //   输入框是否可以输入文字，如果true， 则点击整体呼出弹窗，否则只允许点击选择按钮才可以呼出弹窗
    readOnly: {
      type: Boolean,
      default: true
    },
    // 输入框默认的内容
    placeholder: {
      type: String,
      default: ''
    },
    // 输入框内容
    value: {
      type: String,
      default: ''
    },
    selectText: {
      type: String,
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {
      currentVal: this.value,
      dialog_choose: this.selectText || this.$t('common.choose')
    }
  },
  watch: {
    value (val) {
      this.currentVal = val
    }
  },
  methods: {
    //  readOnly 为true 点击整体呼出弹窗
    handlerSelectAll () {
      if (this.disabled) {
        return
      }
      if (this.readOnly) {
        this.handlerSelect()
      }
    },
    handlerSelect () {
      if (this.disabled) {
        return
      }
      this.$emit('select', this.currentVal)
    },
    handlerInput () {
      // 配合v-model 使用
      this.$emit('input', this.currentVal)
    }
  }
}
</script>
<style lang="scss" scoped>
.mcChoose{
    &.mcChoose-readonly{
        position: relative;
        &::before{
            content: '';
            position: absolute;
            top: 0;bottom: 0;left: 0;right: 0;z-index: 10;
            cursor: pointer;
        }
    }
    &.mcChoose-disabled{
        &::before{
            cursor: not-allowed;
        }
    }
    .select-span{
        cursor: pointer;
        padding: 0 20px;
    }

}
.mcChoose ::v-deep{
    .el-input-group__append{
            padding: 0;
    }
    &.mcChoose-disabled{
        &::before{
            cursor: unset !important;
        }
        .el-input__inner{
          background-color: #ececec !important;
          border-color: #E4E7ED!important;;
          color: #C0C4CC!important;;
          cursor: not-allowed!important;;
        }
    }
}
</style>
