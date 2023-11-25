// 资源
import Layout from '@/layout'
import i18n from '@/assets/common/lang/index'
const externalCloudRouter = [
    {
        path: '/externalCloud',
        component: Layout,
        meta: {
            title: i18n.t('common.route.vcenter'), // '外部云'
        },
        redirect: '/externalCloud/vcenter',
        pagekey: 'externalCloud',
        routeKey: 'externalCloud',
        hidden: false,
        children: [
            {
                path: '/externalCloud/vcenter',
                name: 'vcenter',
                routeKey: 'vcenter',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/externalCloud/vcenter/vcenter.vue'),
                meta: {
                    title: i18n.t('common.route.vcenter'), // '纳管vcenter',
                    icon: 'kyq-icon',
                    default: true,
                    routeKey: 'vcenter'
                }
            },
            {
                path: 'detail/:id/:type/:pageName',
                name: 'vCenterDetail',
                routeKey: 'vCenterDetail',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/externalCloud/vcenter/detail.vue'),
                meta: {
                    title: i18n.t('common.route.vcenterDetail'), // 'vcenter详情',
                    icon: 'kyq-icon', 
                    default: false, 
                    routeKey: 'vCenterDetail',
                    useDetailName:true,//是否开启使用详情名称代替页面名称
                },
            },
            {
                path: 'cloudServerDetail/:vcenterId/:name/:pageName',
                name: 'cloudServerDetail',
                routeKey: 'cloudServerDetail',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/externalCloud/vcenter/cloudServerDetail/index.vue'),
                meta: {
                    title: i18n.t('common.route.servervmDetail'), //云服务器详情
                    icon: 'kyq-icon', 
                    default: false, 
                    routeKey: 'zone',
                    useDetailName:true,//是否开启使用详情名称代替页面名称
                },
            }
        ]
    },
]
export default externalCloudRouter
