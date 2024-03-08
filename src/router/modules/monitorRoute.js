// 监控
import Layout from '@/layout'
import i18n from '@/assets/common/lang/index'
const monitorRoute = [
    {
        path: '/alarmevent',
        component: Layout,
        meta: {
            title: i18n.t('common.route.alarmEvent'), // '告警事件',
            icon: 'gjsj-icon'
        },
        redirect: 'noRedirect',
        pagekey: 'monitor',
        routeKey: 'alarmEvent',
        hidden: false,
        children: [
            {
                path: 'monitor/alarmevent/alarmLog/index',
                name: 'alarmLog',
                routeKey: 'alarmLog',
                hidden: false,
                redirect: '',
                component: () => import('@/views/monitor/alarmevent/alarmLog/index'),
                meta: {
                    title: i18n.t('common.route.alarmLog'), // '告警日志',
                    icon: 'gjrz-icon', default: false, routeKey: 'alarmLog'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
            {
                path: 'monitor/alarmevent/alarmSet/index',
                name: 'settingAlarm',
                routeKey: 'settingAlarm',
                hidden: false,
                redirect: '',
                component: () => import('@/views/monitor/alarmevent/alarmSet/index'),
                meta: {
                    title: i18n.t('common.route.settingAlarm'), // '告警设置',
                    icon: 'gjsz-icon', default: false, routeKey: 'settingAlarm'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
        ]
    },
    {
        path: '/operationLog',
        component: Layout,
        meta: {
            title: i18n.t('common.route.operateLog'), // '操作日志',
            icon: 'czrz-icon'
        },
        redirect: 'noRedirect',
        pagekey: 'monitor',
        routeKey: 'operateLog',
        hidden: false,
        children: [
            {
                path: 'monitor/operationLog/physicalHostevents/index',
                name: 'serverEvent',
                routeKey: 'serverEvent',
                hidden: false,
                redirect: '',
                component: () => import('@/views/monitor/operationLog/physicalHostevents/index'),
                meta: {
                    title: i18n.t('common.route.serverEvent'), // '物理主机事件',
                    icon: 'wlzjsj-icon', default: false, routeKey: 'serverEvent'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
            {
                path: 'monitor/operationLog/cloudServerevents/index',
                name: 'cloudServerEvent',
                routeKey: 'cloudServerEvent',
                hidden: false,
                redirect: '',
                component: () => import('@/views/monitor/operationLog/cloudServerevents/index'),
                meta: {
                    title: i18n.t('common.route.cloudServerEvent'), // '云服务器事件',
                    icon: 'yfwqsj-icon', default: false, routeKey: 'cloudServerEvent'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
        ]
    },



]
export default monitorRoute
