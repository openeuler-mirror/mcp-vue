import Vue from 'vue'
import VueI18n from 'vue-i18n'// 国际化
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element英文语言包
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element中文语言包
import enLocale from './en/index.js' // 英文语言包
import zhLocale from './zh/index.js' // 中文语言包

Vue.use(VueI18n) // 通过插件的形式挂载
let locale = localStorage.getItem("kcp-lang") || 'zh'
localStorage.setItem("kcp-lang", locale);
const i18n = new VueI18n({
    locale: locale,    // 语言标识
    messages: {
        // 中文语言包
        'zh': {
            ...elementZhLocale,
            ...zhLocale
        },
        // 英文语言包
        'en': {
            ...elementEnLocale,
            ...enLocale
        }
    }
})

export default i18n