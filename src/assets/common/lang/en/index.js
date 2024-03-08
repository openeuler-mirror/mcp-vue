import common from './common.js'
import authorityMgr from './authorityMgr.js'
import resourceMgr from './resourceMgr.js'
import monitorMgr from './monitorMgr'
import alarmevents from './alarmevents'
import serverVirtualization from './serverVirtualization'
import operateMgr from './operateMgr.js'
export default {
    common,// 公共模块
    authorityMgr, //权限管理
    resourceMgr, // 资源管理
    ...monitorMgr, // 监控
    ...alarmevents, // 告警事件
    ...serverVirtualization, // kcp及自服务云服务器详情-操作日志，参考mc将任务详情，和失败原因，进行国际化转移
    ...operateMgr // 操作
}