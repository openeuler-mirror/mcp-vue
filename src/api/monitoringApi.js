import request from '@/utils/request'

// 获取物理主机事件类型 
export function serverEventTypeList(data) {
    return request({
        url: '/monitoring/serverEventTypeList',
        method: 'post',
        data
    })
}

// 分页获取物理主机事件 
export function pagePhysicalHostEvent(data) {
    return request({
        url: '/monitoring/pagePhysicalHostEvent',
        method: 'post',
        data
    })
}

// 获取告警日志类型 
export function alarmLogFilterList(data) {
    return request({
        url: '/monitoring/alarmLogFilterList',
        method: 'post',
        data
    })
}

// 分页告警日志
export function pageAlarmLog(data) {
    return request({
        url: '/monitoring/pageAlarmLog',
        method: 'post',
        data
    })
}

// 获取服务器虚拟化事件类型
export function serverVirtualizationEventsFilter(data) {
    return request({
        url: '/monitoring/serverVirtualizationEventsFilter',
        method: 'post',
        data
    })
}

// 分页获取服务器虚拟化事件
export function pageServerVirtualizationEvent(data) {
    return request({
        url: '/monitoring/pageServerVirtualizationEvent',
        method: 'post',
        data
    })
}


// 获取集群告警设置
export function listAlarmSettings(data) {
    return request({
        url: '/monitoring/listAlarmSettings',
        method: 'post',
        data
    })
}

// 修改告警设置
export function updateAlarmSettings(data) {
    return request({
        url: '/monitoring/updateAlarmSettings',
        method: 'post',
        data
    })
}

// 获取告警持续时间
export function getAlarmInterval(data) {
    return request({
        url: '/monitoring/getAlarmInterval',
        method: 'post',
        data
    })
}

// 修改持续告警时间
export function updateAlarmInterval(data) {
    return request({
        url: '/monitoring/updateAlarmInterval',
        method: 'post',
        data
    })
}

// 获取平台告警设置
export function listKcpAlarmSettings(data) {
    return request({
        url: '/monitoring/listKcpAlarmSettings',
        method: 'post',
        data
    })
}

// 修改平台告警设置
export function updateKcpAlarmSetting(data) {
    return request({
        url: '/monitoring/updateKcpAlarmSetting',
        method: 'post',
        data
    })
}

// 分页平台告警日志
export function pageKcpAlarmLog(data) {
    return request({
        url: '/monitoring/pageKcpAlarmLog',
        method: 'post',
        data
    })
}