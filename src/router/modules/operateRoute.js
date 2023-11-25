// 运营
import Layout from '@/layout'
import i18n from '@/assets/common/lang/index'
const operateRouter = [
    {
        path: '/organization',
        component: Layout,
        meta: {
            title: i18n.t('common.route.org'), // '组织管理'
        },
        redirect: '/operate/organizationMgr/index',
        pagekey: 'operator',
        routeKey: 'org',
        hidden: false,
        children: [
            {
                path: '/operate/organizationMgr/index',
                name: 'organization',
                routeKey: 'org',
                hidden: false,
                redirect: '',
                component: () => import('@/views/operate/organizationMgr/index'),
                meta: {
                    title: i18n.t('common.route.org'), // '组织管理',
                    icon: 'zzgl-icon', default: true, routeKey: 'org',
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
            {
                path: 'detail/:id/:type',
                name: 'organizationDetail',
                routeKey: 'org',
                hidden: true,
                redirect: '',
                component: () => import('@/views/operate/organizationMgr/detail'),
                meta: {
                    title: i18n.t('common.route.orgDetail'), // '组织详情',
                    icon: 'el-icon-s-order', default: false, routeKey: 'org',
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            }
        ]
    },
    {
        path: '/authority',
        component: Layout,
        meta: {
            title: i18n.t('common.route.permission'), // '权限管理',
            icon: 'qxgl-icon'
        },
        redirect: 'noRedirect',
        pagekey: 'operator',
        routeKey: 'permission',
        hidden: false,
        children: [
            {
                path: '/operate/authorityMgr/userMgr/index',
                name: 'userMgr',
                routeKey: 'user',
                hidden: false,
                redirect: '',
                component: () => import('@/views/operate/authorityMgr/userMgr/index'),
                meta: {
                    title: i18n.t('common.route.userMgr'), // '用户管理',
                    icon: 'yhgl-icon', default: false, routeKey: 'user'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
            {
                path: '/operate/authorityMgr/roleMgr/index',
                name: 'roleMgr',
                routeKey: 'role',
                hidden: false,
                redirect: '',
                component: () => import('@/views/operate/authorityMgr/roleMgr/index'),
                meta: {
                    title: i18n.t('common.route.roleMgr'), // '角色管理',
                    icon: 'jsgl-icon', default: false, routeKey: 'role'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
        ]
    },

    {
        path: '/workorder',
        component: Layout,
        meta: {
            title: i18n.t('common.route.workorder'), // '工单管理',
            icon: 'gdgl-icon'
        },
        redirect: 'noRedirect',
        pagekey: 'operator',
        routeKey: 'workorder',
        hidden: false,
        children: [
            {
                path: '/workorder/index',
                name: 'workorder',
                routeKey: 'check_workorder',
                hidden: false,
                redirect: '',
                component: () => import('@/views/workorder/index'),
                meta: {
                    title: i18n.t('common.route.WorkorderReview'), // '工单审核',
                    icon: 'gdsh-icon', default: false, routeKey: 'check_workorder'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
            {
                path: 'detail/:id/:type',
                name: 'workDetail',
                routeKey: 'check_workorder',
                hidden: true,
                redirect: '',
                component: () => import('@/views/workorder/detail'),
                meta: {
                    title: i18n.t('common.route.workorderDetail'), // '工单详情',
                    icon: 'gdsh-icon', default: false, routeKey: 'check_workorder'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },

            {
                path: '/network/index',
                name: 'network',
                routeKey: 'networkconfig',
                hidden: false,
                redirect: '',
                component: () => import('@/views/network/index'),
                meta: {
                    title: i18n.t('common.route.networkconfig'), // '网络设置',
                    icon: 'wlsz-icon', default: false, routeKey: 'networkconfig'
                },
                breadcrumb: true //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
            },
        ]
    }

]
export default operateRouter
