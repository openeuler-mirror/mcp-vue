import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  console.log('to:', to, 'from:', from)

  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      localStorage.removeItem("kcp-pagekey");
      localStorage.removeItem("kcp-router");
      localStorage.removeItem("userInfo");
      store.dispatch("user/resetToken");
      next(`/login`)
      NProgress.done()
    } else {
      let pagekey = localStorage.getItem("kcp-pagekey")
      if (pagekey && to.meta.routeKey) {
        localStorage.setItem("kcp-router", JSON.stringify({ pagekey: pagekey, path: to.path }));
      }
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {


        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || '网络延迟，请稍后重试！')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
