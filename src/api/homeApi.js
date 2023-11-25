import request from '@/utils/request'

// 管理员首页接口
export function indexStatistic(data) {
    return request({
        url: '/indexStatistic',
        method: 'post',
        data
    })
}

//  非管理员首页数据
export function orgLeaderStatistic(data) {
    return request({
        url: '/orgLeaderStatistic',
        method: 'post',
        data
    })
}