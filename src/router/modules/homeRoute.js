// 首页
import Layout from '@/layout'
import i18n from '@/assets/common/lang/index'
const homeRoute = [
    {
        name: 'homePage',
        component: Layout,
        pagekey: '',
        // routeKey: 'home',
        path: '/homePage',
        hidden: true,
        children: [
            {
                path: 'pageHome/index',
                name: 'pageHome',
                routeKey: 'pageHome',
                hidden: false,
                redirect: '',
                component: () => import('@/layout/homePage/index'),
                meta: {
                    title: '首页',
                    icon: 'gjsj-icon'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
        ]
    },



]
export default homeRoute
