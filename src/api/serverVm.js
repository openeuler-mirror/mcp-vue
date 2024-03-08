import request from '@/utils/request'

//申请云服务器
export function applyServerVm(data) {
    return request({
        url: '/serverVm/applyServerVm',
        method: 'post',
        data
    })
}

//申请延期
export function applyDeferredMachine(data) {
    return request({
        url: '/serverVm/applyDeferredMachine',
        method: 'post',
        data
    })
}

//变更申请
export function modifyServerVm(data) {
    return request({
        url: '/serverVm/modifyServerVm',
        method: 'post',
        data
    })
}

// 云服务器列表查询
export function getServerVmList(data) {
    return request({
        url: '/serverVm/listServerVm',
        method: 'post',
        data
    })
}

// 云服务器详情
export function getServerVmDetail(data) {
    return request({
        url: '/serverVm/serverVmInfo',
        method: 'post',
        data
    })
}

// 云服务器操作日志
export function getServerVmOperateLog(data) {
    return request({
        url: '/serverVm/serverVmOperateLog',
        method: 'post',
        data
    })
}

// 云服务器快照列表
export function getSnapshotList(data) {
    return request({
        url: '/serverVm/listSnapshot',
        method: 'post',
        data
    })
}
//新建快照
export function createSnapshot(data) {
    return request({
        url: '/serverVm/createSnapshot',
        method: 'post',
        data
    })
}
// 编辑快照
export function updateSnapshot(data) {
    return request({
        url: '/serverVm/updateSnapshot',
        method: 'post',
        data
    })
}
// 删除快照
export function deleteSnapshot(data) {
    return request({
        url: '/serverVm/deleteSnapshot',
        method: 'post',
        data
    })
}
//应用快照
export function applySnapshot(data) {
    return request({
        url: '/serverVm/applySnapshot',
        method: 'post',
        data
    })
}
//获取监控数据
export function getServerVmMonitorInfo(data) {
    return request({
        url: '/serverVm/serverVmMonitor',
        method: 'post',
        data
    })
}

//删除
export function deleteServerVm(data) {
    return request({
        url: '/serverVm/deleteServerVm',
        method: 'post',
        data
    })
}
//开机
export function startServerVm(data) {
    return request({
        url: '/serverVm/startServerVm',
        method: 'post',
        data
    })
}
//关机
export function shutdownServerVm(data) {
    return request({
        url: '/serverVm/shutdownServerVm',
        method: 'post',
        data
    })
}

//强制关机
export function abortServerVm(data) {
    return request({
        url: '/serverVm/forcedShutdownServerVm',
        method: 'post',
        data
    })
}
//重启
export function restartServerVm(data) {
    return request({
        url: '/serverVm/restartServerVm',
        method: 'post',
        data
    })
}

//强制重启
export function forcedRestartServerVm(data) {
    return request({
        url: '/serverVm/forcedRestartServerVm',
        method: 'post',
        data
    })
}

//批量开机
export function batchStartServerVm(data) {
    return request({
        url: '/serverVm/batchStartServerVm',
        method: 'post',
        data
    })
}
//批量关机
export function batchShutdownServerVm(data) {
    return request({
        url: '/serverVm/batchShutdownServerVm',
        method: 'post',
        data
    })
}
//批量重启
export function batchRebootServerVm(data) {
    return request({
        url: '/serverVm/batchRebootServerVm',
        method: 'post',
        data
    })
}

//批量删除
export function batchDeleteServerVm(data) {
    return request({
        url: '/serverVm/batchDeleteServerVm',
        method: 'post',
        data
    })
}

//模板列表查询
export function listServerVmTemplate(data) {
    return request({
        url: '/serverVm/listServerVmTemplate',
        method: 'post',
        data
    })
}

//变更云服务器时，获取云服务器详情
export function getModifyServerVmDetail(data) {
    return request({
        url: '/serverVm/getServerVmDetail',
        method: 'post',
        data
    })
}

//获取vncUrl链接
export function getVncUrl(data) {
    return request({
        url: '/serverVm/getVncUrl',
        method: 'post',
        data
    })
}


// 获取iso列表
export function isoList(data) {
    return request({
        url: '/serverVm/isoList',
        method: 'post',
        data
    })
}

// 获取云服务器图片
export function downLoadServerVmLog(data) {
    return request({
        url: '/serverVm/downLoadServerVmLog',
        method: 'get',
        params: data
    })
}

// 云服务器详情-概要信息
export function serverVmSummary(data) {
    return request({
        url: '/serverVm/serverVmSummary',
        method: 'post',
        data
    })
}

// 云服务器详情-网络信息
export function serverVmNetwork(data) {
    return request({
        url: '/serverVm/serverVmNetwork',
        method: 'post',
        data
    })
}

// 云服务器详情-磁盘信息
export function serverVmDisk(data) {
    return request({
        url: '/serverVm/serverVmDisk',
        method: 'post',
        data
    })
}

// 云服务器详情-告警信息
export function serverVmAlarmEvent(data) {
    return request({
        url: '/serverVm/serverVmAlarmEvent',
        method: 'post',
        data
    })
}


