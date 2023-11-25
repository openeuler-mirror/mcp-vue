import tips from './commonTips'
import pageBtnPromisss from './commonPageBtnPromiss'
export default {
  install(Vue) {
    Vue.mixin(tips)
    Vue.mixin(pageBtnPromisss)
  }
}
