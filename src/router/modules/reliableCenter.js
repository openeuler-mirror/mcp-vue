import Layout from '@/layout'
import i18n from '@/assets/common/lang/index'
const reliableCenter = [
    {
        path: '/reliableCenter',
        component: Layout,
        meta: {
            title: i18n.t('common.route.remoteDisasterRecovery'), // '异地容灾'
        },
        redirect: '/reliableCenter/remoteDisasterRecovery/index',
        pagekey: 'reliableCenter',
        routeKey: 'remoteDisasterRecovery',
        hidden: false,
        children: [
            {
                path: '/reliableCenter/remoteDisasterRecovery/index',
                name: 'remoteDisasterRecovery',
                routeKey: 'remoteDisasterRecovery',
                pagekey: 'reliableCenter',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/reliableCenter/remoteDisasterRecovery/index.vue'),
                meta: {
                    title: i18n.t('common.route.remoteDisasterRecovery'), // '异地容灾',
                    icon: 'rzbf', 
                    default: true, 
                    routeKey: 'remoteDisasterRecovery',
                    pagekey: 'reliableCenter'
                }
            },
            {
                path: '/reliableCenter/linkManagement/index',
                name: 'linkManagement',
                routeKey: 'linkManagement',
                pagekey: 'reliableCenter',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/reliableCenter/remoteDisasterRecovery/linkManagement/index.vue'),
                meta: {
                    title: i18n.t('common.route.linkManagement'), // '异地容灾',
                    icon: 'rzbf', 
                    default: false, 
                    pagekey: 'reliableCenter',
                    routeKey: 'linkManagement'
                }
            },
        ]
    },
    {
        path: '/mainAndBackupKcp',
        component: Layout,
        meta: {
            title: i18n.t('common.route.mainAndBackupKcp'), // '主备kcp'
        },
        redirect: '/mainAndBackupKcp/index',
        pagekey: 'reliableCenter',
        routeKey: 'kcpha',
        hidden: false,
        children: [
            {
                path: '/mainAndBackupKcp/index',
                name: 'kcpha',
                routeKey: 'kcpha',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/reliableCenter/kcpha/index.vue'),
                meta: {
                    title: i18n.t('common.route.mainAndBackupKcp'), // '主备kcp',
                    icon: 'zbkcp', 
                    pagekey: 'reliableCenter',
                    default: true, 
                    routeKey: 'kcpha', 
                    breadcrumb: true
                }
            },
        ]
    },
]
export default reliableCenter