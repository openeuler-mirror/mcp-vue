import Vue from 'vue' // loading框设置局部刷新，且所有请求完成后关闭loading框
import i18n from '@/assets/common/lang/index' // 国际化 
let loading
function startLoading(targetdq) {
    let text = i18n.t("common.loadingText")
    loading = Vue.prototype.$loading({
        lock: true,
        text: text,
        background: 'rgba(0,0,0,0.2)',
        spinner: "el-icon-loading",
        target: document.querySelector(targetdq) // 设置加载动画区域 
    })
}
function endLoading() {
    if (loading) {
        loading.close()
    }

}
export function showFullScreenLoading(targetdq) {
    endLoading()
    startLoading(targetdq)
}
export function hideFullScreenLoading() {
    endLoading()
}
export default {
    showFullScreenLoading,
    hideFullScreenLoading
}