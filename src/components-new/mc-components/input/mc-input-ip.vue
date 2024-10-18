<template>
  <div
    :class="['mc-input-ip', 'el-input', `el-input--${size}`,{'is-disabled':disabled},{'is-error':showErrorBorder}]"
    :style="mcWidth"
    @click.stop="focusInput"
  >
    <div class="el-input__inner flex align-center">
      <div
        v-for="(item,index) in ipList"
        :key="index"
        class="mc-input-ip-input"
      >
        <!-- 不用input是因为无法定位光标 -->
        <textarea
          :ref="'mc-input-ip-'+index"
          :data-tag="`mc-input-${key}`"
          rows="1"
          cols="3"
          :value="item"
          maxlength="4"
          autocomplete="off"
          :disabled="disabled"
          :style="{width:inputWidth}"
          @input="handlerInput($event,index)"
          @keydown.left="handlerKeydown($event)"
          @keydown.right="handlerKeydown($event)"
          @keydown.46="handlerKeydown($event)"
          @keydown.8="handlerKeydown($event)"
          @keyup.left="handlerKeyup($event,index,'left')"
          @keyup.right="handlerKeyup($event,index,'right')"
          @keyup.46="handlerDelete($event,index)"
          @keyup.8="handlerKeyup($event,index,'left')"
          @focus.stop="handlerFocus"
          @click.stop="()=>{}"
        />
      </div>
    </div>
    <div v-if="error" class="mc-input-ip-error">
      {{ error }}
    </div>
  </div>
</template>
<script>
import { isEmpty, cloneDeep, uniqueId, takeWhile, eq } from 'lodash'
import emitter from 'element-ui/lib/mixins/emitter'

/**
 * @group 单个组件的封装 mc-components
 * 二次封装的input 组件,针对输入ip的场景
 * 支持：←左移光标，→右移光标，tab切换输入位，↑光标移到某位最前，↓光标移到某位最后，
 *       backspace连续删除光标左移，delete连续删除光标右移，仅允许输入数字，支持el-form表单校验样式
 * 事件：input / blur / change [通过@/v-on触发]
 * 方法：focus() / validate() [通过ref调用]
 * 校验：支持el-form的rules使用trigger: ['blur', 'change']
 * 注意：不在此组件内支持校验功能是与el-form功能统一，组件的最小宽度为146px，设计上要预留足够空间
 */
const ipList = ['', '', '', '']
const cursorObj = { ele: null, vue: null }
let cursorLastEle = cloneDeep(cursorObj) // 光标上次的聚焦元素
let cursorCurEle = cloneDeep(cursorObj) // 光标当前的聚焦元素
export default {
  mixins: [emitter],
  model: {
    event: 'input',
    prop: 'value'
  },
  props: {
    // 组件的宽度
    width: {
      type: String,
      default: '180px'
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 组件尺寸，同elementUI组件尺寸，当size为mini时，width将设置为最小值146px
    size: {
      type: String,
      default: 'small'
    },
    // 组件的错误提示，一般用于非form表单校验，比如table中用到此组件时(要去除cell自带的overflow:hidden)
    // 注意：此属性有值时会同时显示红色的组件边框
    error: {
      type: String,
      default: ''
    },
    errorBorder: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      wide: '',
      key: uniqueId('mc-input-ip-'), // 区别同时多处使用的组件
      ipList: cloneDeep(ipList),
      cursorLastPos: '' // 光标上次的位置
    }
  },
  computed: {
    mcWidth () {
      return `min-width:${this.wide};max-width:${this.wide};`
    },
    inputWidth () {
      return `calc((${this.wide} - 32px)/4)`
    },
    // 显示校验错误的红色边框
    showErrorBorder () {
      return this.error || this.errorBorder
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        // ip对位赋值给ipList
        this.ipList = cloneDeep(ipList)
        val.split('.').slice(0, 4).forEach((ip, index) => {
          this.ipList.fill(ip, index, index + 1)
        })
        this.$forceUpdate()
      }
    },
    size: {
      immediate: true,
      handler (val) {
        // size为mini时，width将设置为最小值146px
        this.wide = val === 'mini' ? '146px' : this.width
      }
    }
  },
  mounted () {
    this.handlerBlur()
    cursorLastEle = cloneDeep(cursorObj) // 光标上次的聚焦元素
    cursorCurEle = cloneDeep(cursorObj) // 光标当前的聚焦元素
  },
  methods: {
    // 校验ip是否已填
    validate () {
      return takeWhile(this.ipList).length === 4
    },
    // 点击组件之外，模拟组件失焦
    handlerBlur () {
      document.onclick = window.onblur = () => {
        // 点击组件之外
        // 记录聚焦元素
        cursorLastEle = cursorCurEle
        cursorCurEle = { ele: null, vue: null }
        this.blurInput()
      }
      this.$once('hook:beforeDestroy', () => {
        document.onclick = window.onblur = null
      })
    },
    clearCursorCurEle () {
      if (cursorCurEle.ele) {
        cursorCurEle.ele = null
      }
    },
    handlerInput (evt, index) {
      let val = evt.target.value.trim()
      const hasPoint = val.includes('.')
      val = val.replace('.', '')
      if (val && hasPoint) {
        // 输入内容为'.'时，光标后移一位
        this.handlerKeydown(evt)
        this.handlerKeyup(evt, index, 'right')
      }
      if (val && !isNaN(val) && val <= 255 && val >= 0) {
        this.ipList[index] = Number(val)
      } else if (val === '') {
        this.ipList[index] = ''
      }
      this.$forceUpdate()
      this.handlerChange()
    },
    handlerChange () {
      const ip = this.ipList.some(ip => ip) ? this.ipList.join('.') : ''
      this.$emit('input', ip)
      this.$emit('change', ip)
      this.dispatch('ElFormItem', 'el.form.change', [ip])
    },
    handlerKeydown (evt, type) {
      const cursorLastPos = this.getCursorPos(evt.target)
      if (this.cursorLastPos !== cursorLastPos) {
        this.cursorLastPos = cursorLastPos
      }
    },
    handlerDelete (evt, index) {
      // 光标位于当前输入框内容末尾时，光标后移一位
      String(this.ipList[index]).length === this.cursorLastPos && this.handlerKeyup(evt, index, 'right')
    },
    handlerKeyup (evt, index, type) {
      if (this.cursorLastPos === this.getCursorPos(evt.target)) {
        const i = type === 'left' ? Math.max(index - 1, 0) : Math.min(index + 1, this.ipList.length)
        i !== index && i !== this.ipList.length && this.$nextTick(() => {
          this.setCursorPos(this.$refs['mc-input-ip-' + i][0], type === 'left' ? String(this.ipList[i]).length : 0)
        })
      }
    },
    // 非当前组件判断
    isNotCurInput () {
      return cursorCurEle.ele && cursorCurEle.ele.dataset.tag !== `mc-input-${this.key}`
    },
    // 获取光标位置，此方法只适用于textarea
    getCursorPos (element) {
      let cursorLastPos = 0
      if (document.selection) {
        // IE
        var selectRange = document.selection.createRange()
        selectRange.moveStart('character', -element.value.length)
        cursorLastPos = selectRange.text.length
      } else {
        cursorLastPos = element.selectionStart ?? 0
      }
      return cursorLastPos
    },
    // 设置光标位置
    setCursorPos (textDom, pos) {
      if (textDom.setSelectionRange) {
        // IE
        textDom.focus()
        textDom.setSelectionRange(pos, pos)
      } else if (textDom.createTextRange) {
        var range = textDom.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
      }
      this.handlerFocus()
    },
    handlerFocus () {
      const focusEle = document.activeElement
      if (focusEle.dataset.tag === `mc-input-${this.key}`) {
        // 记录聚焦元素
        cursorLastEle = cursorCurEle
        cursorCurEle = { ele: focusEle, vue: this }
      }
      if (cursorLastEle.vue && cursorCurEle.vue && !eq(cursorLastEle.vue, cursorCurEle.vue)) {
        // 在不同的ip组件
        this.blurInput()
      }
    },
    focusInput () {
      if (this.isNotCurInput() || !cursorCurEle.ele) {
        this.clearCursorCurEle()
        this.focus()
      } else {
        cursorCurEle.ele.focus()
      }
    },
    // 聚焦
    focus () {
      const index = this.ipList.findIndex(val => isEmpty(val))
      this.$nextTick(() => {
        this.$refs['mc-input-ip-' + (index < 0 ? this.ipList.length - 1 : index)][0].focus()
      })
    },
    // 失焦
    blurInput () {
      if (cursorLastEle.vue || cursorCurEle.vue) {
        const that = cursorLastEle.vue || cursorCurEle.vue
        that.$emit('blur')
        that.dispatch('ElFormItem', 'el.form.blur', [])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input__inner:focus-within{
    border-color: $colorPrimary;
}

.el-form-item.is-error .el-input__inner:focus-within{
    border-color: $colorDanger;
}

.el-input.is-disabled textarea{
    color: #c0c4cc;
    cursor: not-allowed;
}

.el-input.is-error .el-input__inner{
    border-color: $colorDanger;
}

.mc-input-ip{
    display: inline-block;
    box-sizing: border-box;
    border-radius: 4px;
    min-width: 146px!important;
    cursor: text;
    position: relative;

    &-input{
        display: inline-block;
        height: 16px;
        line-height: 16px;
        position: relative;

        textarea{
            border: 0;
            padding: 0;
            color: #333;
            outline: none;
            resize: none;
            min-width: 29px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            background-color: transparent;
            vertical-align: top;

            &:focus .mc-input-ip>.el-input__inner{
                border-color: $colorPrimary;
                outline: none;
                border-color: #2096ff;
            }
        }

        &::after{
            content: '.';
            display: inline-block;
            width: 10px;
            height: 100%;
            font-size: 20px;
            line-height: 14px;
            text-align: center;
            vertical-align: top;
            position: absolute;
            right: -5px;
            top: 0;
        }

        &:last-of-type::after{
            display: none;
        }
    }

    &-error{
      word-break: break-all;
      color: $colorDanger;
      font-size: 12px;
      line-height: 1;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
    }
}
</style>
