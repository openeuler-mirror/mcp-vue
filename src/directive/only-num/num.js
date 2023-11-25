export default {
  bind(el, binding, vnode) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.oninput = function () {
      let val = ele.value
      ele.value = val.toString().replace(/\D|^0/g, '') // 清除"数字"和"."以外的字符
    }
  }
}
