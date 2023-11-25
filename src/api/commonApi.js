import request from '@/utils/request'
//获取云服务器分组列表
export function getServerVmGroup(data) {
    return request({
        url: '/general/serverVmGroups',
        method: 'post',
        data
    })
}
//获取云服务器分组云服务器列表
export function getServerVmList(data) {
    return request({
        url: '/general/serverVm/list',
        method: 'post',
        data
    })
}
//获取云服务器存储位置
export function getbackupServerList(data) {
    return request({
        url: '/general/backupServer/list',
        method: 'post',
        data
    })
}
//获取网卡列表
export function getNetworkCardList(data) {
    return request({
        url: '/network/specification/list',
        method: 'post',
        data
    })
}