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
    {
        path: '/taskcenter',
        component: Layout,
        meta: {
            title: i18n.t('common.route.taskcenter'), // '任务中心'
        },
        redirect: '/monitor/taskcenter/index',
        pagekey: 'monitor',
        routeKey: 'taskcenter',
        hidden: false,
        children: [
            {
                path: '/monitor/taskcenter/index',
                name: 'taskcenter',
                routeKey: 'taskcenter',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/monitor/taskcenter/index.vue'),
                meta: {
                    title: i18n.t('common.route.taskcenter'), // '任务中心'
                    icon: 'gdgl-icon', default: true, routeKey: 'taskcenter'
                }
            }
        ]
    },
]
export default monitorRoute
