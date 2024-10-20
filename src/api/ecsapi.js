// 云服务器
import request from '@/utils/request'

// 可用区组织树 
export function zoneOrgTree(data) {
    return request({
        url: '/serverVm/zoneOrgTree',
        method: 'post',
        data
    })
}

// 云服务器列表 
export function serverVmList(data) {
    return request({
        url: '/serverVm/serverVmList',
        method: 'post',
        data
    })
}
