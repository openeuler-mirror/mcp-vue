import request from '@/utils/request'

// 创建集群 
export function creatCluster(data) {
    return request({
        url: '/cluster/creatCluster',
        method: 'post',
        data
    })
}
// 分页获取集群存储资源
export function pageStorage(data) {
    return request({
        url: '/cluster/pageStorage',
        method: 'post',
        data
    })
}

// 分页获取集群
export function pageCluster(data) {
    return request({
        url: '/cluster/pageCluster',
        method: 'post',
        data
    })
}

// 集群详情
export function clusterInfo(data) {
    return request({
        url: '/cluster/clusterInfo',
        method: 'post',
        data
    })
}

// 分页获取物理主机列表
export function pagePhysicalHost(data) {
    return request({
        url: '/cluster/pagePhysicalHost',
        method: 'post',
        data
    })
}

// 编辑集群-获取集群内容
export function clusterDetail(data) {
    return request({
        url: '/cluster/clusterDetail',
        method: 'post',
        data
    })
}

// 编辑集群
export function modifyCluster(data) {
    return request({
        url: '/cluster/modifyCluster',
        method: 'post',
        data
    })
}

// 获取登录用户可见的物理集群列表
export function getLoginUserCluster(data) {
    return request({
        url: '/cluster/getLoginUserCluster',
        method: 'post',
        data
    })
}

// 校验集群账号密码
export function checkClusterUserNameAndPassword(data) {
    return request({
        url: '/cluster/checkClusterUserNameAndPassword',
        method: 'post',
        data
    })
}

// 获取登录集群地址
export function getQuickLoginUrl(data) {
    return request({
        url: '/cluster/getQuickLoginUrl',
        method: 'post',
        data
    })
}

// 删除集群
export function deleteCluster(data) {
    return request({
        url: '/cluster/deleteCluster',
        method: 'post',
        data
    })
}
// 启用禁用 
export function changeClusterUse(data) {
    return request({
        url: '/cluster/updateClusterStorageForbadeStatus',
        method: 'post',
        data
    })
}