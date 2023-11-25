import request from '@/utils/request'

// 根据操作对象获取操作日志
export function listOperateLogByObjId(data) {
    return request({
        url: '/operateLog/listOperateLogByObjId',
        method: 'post',
        data
    })
}

// 获取子任务列表
export function listChildOperateLogList(data) {
    return request({
        url: '/operateLog/listChildOperateLogList',
        method: 'post',
        data
    })
}