import request from '@/utils/request'

// 创建可用区
export function createZone(data) {
    return request({
        url: '/zone/createZone',
        method: 'post',
        data
    })
}
// 获取可用区绑定物理集群
export function clusterListByZone(data) {
    return request({
        url: '/zone/clusterListByZone',
        method: 'post',
        data
    })
}
// 可用区-获取可绑定的物理集群
export function canBindCluster(data) {
    return request({
        url: '/zone/canBindCluster',
        method: 'post',
        data
    })
}

// 分页获取可用区
export function pageZone(data) {
    return request({
        url: '/zone/pageZone',
        method: 'post',
        data
    })
}

// 编辑时获取可用区详情
export function modifyZoneDetail(data) {
    return request({
        url: '/zone/modifyZoneDetail',
        method: 'post',
        data
    })
}

// 编辑可用区
export function modifyZone(data) {
    return request({
        url: '/zone/modifyZone',
        method: 'post',
        data
    })
}

// 可用区详情
export function zoneDetail(data) {
    return request({
        url: '/zone/zoneDetail',
        method: 'post',
        data
    })
}

// 删除可用区
export function deleteZone(data) {
    return request({
        url: '/zone/deleteZone',
        method: 'post',
        data
    })
}

