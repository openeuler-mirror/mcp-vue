import onlyNum from './num'

const install = function(Vue) {
  Vue.directive('only-num', onlyNum)
}

if (window.Vue) {
  window['v-only-num'] = onlyNum
  Vue.use(install); // eslint-disable-line
}

onlyNum.install = install
export default onlyNum
