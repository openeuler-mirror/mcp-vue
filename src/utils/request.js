import axios from 'axios'
import ReMessage from '@/utils/message'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers['KYLIN_LANGUAGE'] = localStorage.getItem("kcp-lang") || ' "zh"'
    if (store.getters.token) {
      config.headers['KYLIN_ACCESS_TOKEN'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      // TODO 缺少其他状态，例如token过期，token不合法等
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 401) {
        // MessageBox.confirm('登录信息过期,请重新登录', '重新登录', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // })

        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })

      } else {
        ReMessage.error({
          message: res.desc || '网络延迟，请稍后重试！',
          type: 'error',
          duration: 5 * 1000,
          showClose: true
        })
      }
      return Promise.reject(res.desc)
    } else {
      return res.data || res.desc
    }
  },
  error => {
    console.log('err' + error) // for debug
    ReMessage.error({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
      showClose: true
    })
    return Promise.reject(error)
  }
)



export default service
