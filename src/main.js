import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import i18n from '@/assets/common/lang/index' // 国际化

import { showFullScreenLoading, hideFullScreenLoading } from "@/utils/loading";
Vue.prototype.$showFullScreenLoading = showFullScreenLoading;// 打开loading
Vue.prototype.$hideFullScreenLoading = hideFullScreenLoading;// 关闭loading

import onlyNum from '@/directive/only-num'
Vue.use(onlyNum)


import moment from 'moment'// 导入moment文件
Vue.prototype.$moment = moment;// 赋值使用

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }



import myMixin from '@/mixins/index.js'
Vue.use(myMixin)

import ReMessage from '@/utils/message'
Vue.prototype.$rmsg = ReMessage

import qs from 'qs'
Vue.prototype.qs = qs


Vue.use(ElementUI, {
  size: 'small', zIndex: 3000,
  i18n: (key, value) => i18n.t(key, value)
})



Vue.config.productionTip = false

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
