import request from '@/utils/request'

// 获取操作类型列表
export function getOperateLogType(data) {
    return request({
        url: '/operateLog/getOperateLogType',
        method: 'post',
        data
    })
}

// 获取操作任务列表
export function getOperateLogAction(data) {
    return request({
        url: '/operateLog/getOperateLogAction',
        method: 'post',
        data
    })
}

// 获取操状态接口
export function getOperateLogStatus(data) {
    return request({
        url: '/operateLog/getOperateLogStatus',
        method: 'post',
        data
    })
}

// 分页获取操作日志
export function pageOperateLog(data) {
    return request({
        url: '/operateLog/pageOperateLog',
        method: 'post',
        data
    })
}

// 获取子任务
export function childOperateLogList(data) {
    return request({
        url: '/operateLog/childOperateLogList',
        method: 'post',
        data
    })
}

// 任务详情
export function operateLogDetail(data) {
    return request({
        url: '/operateLog/operateLogDetail',
        method: 'post',
        data
    })
}
