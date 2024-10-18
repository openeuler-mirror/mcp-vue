
// 报错[ReferenceError: h is not defined]时注意！
// formatter要写在data里面，不能写在export default之外，可以在生命周期函数添加到data的变量中
// data是成员函数，所以会把h注入，而像methods,computed这些都只是对象，不会注入h
// 如果vue用的是3.4以上的版本，method，getter就支持自动注入h

export default {
  name: 'Formatter',
  props: {
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    column: {
      type: Object,
      default: () => {
        return {}
      }
    },
    renderName: {
      type: String,
      default: 'formatter'
    }
  },
  render () {
    return this.column[this.renderName](this.row, this.column)
  }
}
