// 资源
import Layout from '@/layout'
import i18n from '@/assets/common/lang/index'
const resourceRouter = [
    {
        path: '/availabilityZone',
        component: Layout,
        meta: {
            title: i18n.t('common.route.zone'), // '可用区'
        },
        redirect: '/resource/availabilityZone/index',
        pagekey: 'resource',
        routeKey: 'zone',
        hidden: false,
        children: [
            {
                path: '/resource/availabilityZone/index',
                name: 'availabilityZone',
                routeKey: 'zone',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/resource/availabilityZone/index.vue'),
                meta: {
                    title: i18n.t('common.route.zone'), // '可用区',
                    icon: 'kyq-icon',
                    pagekey: 'resource',
                    default: true,
                    routeKey: 'zone'
                }
            },
            {
                path: 'detail/:id/:type',
                name: 'availabilityZoneDetail',
                routeKey: 'zone',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/resource/availabilityZone/detail.vue'),
                meta: {
                    title: i18n.t('common.route.zoneDetail'), // '可用区详情',
                    icon: 'kyq-icon',
                    pagekey: 'resource',
                    default: false,
                    routeKey: 'zone'
                }
            }
        ]
    },
    {
        path: '/physicalCluster',
        component: Layout,
        meta: {
            title: i18n.t('common.route.cluster'), // '物理集群'
        },
        redirect: '/resource/physicalCluster/index',
        pagekey: 'resource',
        routeKey: 'cluster',
        hidden: false,
        children: [
            {
                path: '/resource/physicalCluster/index',
                name: 'physicalCluster',
                routeKey: 'cluster',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/resource/physicalCluster/index.vue'),
                meta: {
                    title: i18n.t('common.route.cluster'), // '物理集群',
                    icon: 'wljq-icon',
                    pagekey: 'resource',
                    default: true,
                    routeKey: 'cluster',
                    breadcrumb: true
                }
            },
            {
                path: 'detail/:id/:type',
                name: 'physicalDetail',
                routeKey: 'cluster',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/resource/physicalCluster/detail.vue'),
                meta: {
                    title: i18n.t('common.route.clusterDetail'), // '物理集群详情',
                    icon: 'wljq-icon',
                    pagekey: 'resource',
                    default: false,
                    routeKey: 'cluster',
                    breadcrumb: true
                }
            }
        ]
    },
    {
        path: '/vdcPage',
        component: Layout,
        meta: {
            title: i18n.t('common.route.vdc'), // '虚拟数据中心（VDC）'
        },
        redirect: '/resource/vdcPage/index',
        pagekey: 'resource',
        routeKey: 'vdc',
        hidden: false,
        children: [
            {
                path: '/resource/vdcPage/index',
                name: 'vdcPage',
                routeKey: 'vdc',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/resource/vdcPage/index.vue'),
                meta: {
                    title: i18n.t('common.route.vdc'), // '虚拟数据中心（VDC）',
                    icon: 'xnsjzx-icon',
                    pagekey: 'resource',
                    default: true,
                    routeKey: 'vdc'
                }
            },
            {
                path: 'detail/:id/:type',
                name: 'vdcPageDetail',
                routeKey: 'vdc',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/resource/vdcPage/detail.vue'),
                meta: {
                    title: i18n.t('common.route.vdcDetail'), // '虚拟数据中心（VDC）详情',
                    icon: 'xnsjzx-icon',
                    pagekey: 'resource',
                    default: false,
                    routeKey: 'vdc'
                }
            }
        ]
    },
    {
        path: '/escPage',
        component: Layout,
        meta: {
            title: i18n.t('common.route.servervm'), // '云服务器'
        },
        redirect: '/resource/esc/index',
        pagekey: 'resource',
        routeKey: 'servervm',
        hidden: false,
        children: [
            {
                path: '/resource/esc/index',
                name: 'escPage',
                routeKey: 'servervm',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/resource/ecs/index.vue'),
                meta: {
                    title: i18n.t('common.route.servervm'), // '云服务器',
                    icon: 'yfwq-icon',
                    pagekey: 'resource',
                    default: true,
                    routeKey: 'servervm'
                }
            },
            {
                path: 'detail/:id/:type/:cid',
                name: 'escPageDetail',
                routeKey: 'servervm',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/resource/ecs/components/detail/index.vue'),
                meta: {
                    title: i18n.t('common.route.servervmDetail'), // '云服务器详情',
                    icon: 'yfwq-icon',
                    default: false,
                    pagekey: 'resource',
                    routeKey: 'servervm'
                }
            }
        ]
    },
    {
        path: '/vMwareMgr',
        component: Layout,
        meta: {
            title: i18n.t('common.route.vMwareMgr'), // 'VMware纳管'
        },
        redirect: '/resource/vMwareMgr/index',
        pagekey: 'resource',
        routeKey: 'vMwareMgr',
        hidden: false,
        children: [
            {
                path: '/resource/vMwareMgr/index',
                name: 'vMwareMgrPage',
                routeKey: 'vMwareMgr',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/resource/vMwareMgr/index.vue'),
                meta: {
                    title: i18n.t('common.route.vMwareMgr'), // 'VMware纳管',
                    icon: 'wljq-icon',
                    default: true,
                    pagekey: 'resource',
                    routeKey: 'vMwareMgr'
                }
            },
            {
                path: 'detail/:id/:name/:type',
                name: 'vMwareMgrPageDetail',
                routeKey: 'vMwareMgr',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/resource/vMwareMgr/detail.vue'),
                meta: {
                    title: i18n.t('common.route.vMwareMgrDetail'), // 'VMware纳管详情',
                    icon: 'wljq-icon',
                    default: false,
                    pagekey: 'resource',
                    routeKey: 'vMwareMgr'
                }
            }
        ]
    },
    {
        path: '/imageMgr',
        component: Layout,
        meta: {
            title: i18n.t('common.route.imageMgr'), // // '镜像管理'
        },
        redirect: '/resource/imageMgr/index',
        pagekey: 'resource',
        routeKey: 'image',
        hidden: false,
        children: [
            {
                path: '/resource/imageMgr/index',
                name: 'imageMgr',
                routeKey: 'image',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/resource/imageMgr/index.vue'),
                meta: {
                    title: i18n.t('common.route.imageMgr'), // 镜像管理'
                    icon: 'jxgl-icon',
                    pagekey: 'resource',
                    default: true,
                    routeKey: 'image'
                }
            },
            {
                path: '/resource/imageMgr/components/imageupload/:type',
                name: 'imageupload',
                routeKey: 'image',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/resource/imageMgr/components/imageupload.vue'),
                meta: {
                    title: i18n.t('common.route.imageMgrUpload'), // 上传镜像',
                    icon: 'jxgl-icon',
                    default: false,
                    pagekey: 'resource',
                    routeKey: 'image'
                }
            },
            {
                path: '/resource/imageMgr/components/imageuploading',
                name: 'imageuploading',
                routeKey: 'image',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/resource/imageMgr/components/imageuploading.vue'),
                meta: {
                    title: i18n.t('common.route.imageMgrUpload'), // 上传镜像',
                    icon: 'jxgl-icon',
                    pagekey: 'resource',
                    default: false,
                    routeKey: 'image'
                }
            },
            {
                path: 'detail/:id/:type',
                name: 'imageDetail',
                routeKey: 'image',
                hidden: true,
                noRedirect: '',
                component: () => import('@/views/resource/imageMgr/components/imageDetail.vue'),
                meta: {
                    title: i18n.t('common.route.imageMgrDetail'), // 镜像详情',
                    icon: 'jxgl-icon',
                    default: false,
                    pagekey: 'resource',
                    routeKey: 'image'
                }
            },
        ]
    },
    // 主机纳管
    {
        path: '/bareMetal',
        component: Layout,
        meta: {
            title: i18n.t('common.route.bareMetal'), // '主机纳管'
        },
        redirect: '/resource/hostTube/index',
        pagekey: 'resource',
        routeKey: 'bareMetal',
        hidden: false,
        children: [
            {
                path: '/resource/hostTube/index',
                name: 'bareMetal',
                routeKey: 'bareMetal',
                hidden: false,
                noRedirect: '',
                component: () => import('@/views/resource/hostTube/index.vue'),
                meta: {
                    title: i18n.t('common.route.bareMetal'), // '主机纳管',
                    icon: 'ljs',
                    default: true,
                    pagekey: 'resource',
                    routeKey: 'bareMetal',
                    breadcrumb: true
                }
            },
        ]
    },
]
export default resourceRouter
