import request from '@/utils/request'

// 添加VCenter
export function addVCenter(data) {
    return request({
        url: '/vCenter/addVCenter',
        method: 'post',
        data
    })
}

// 分页获取Vcenter列表
export function pageVCenter(data) {
    return request({
        url: '/vCenter/pageVCenter',
        method: 'post',
        data
    })
}

// 获取Vcenter详情
export function vCenterInfo(data) {
    return request({
        url: '/vCenter/vCenterInfo',
        method: 'post',
        data
    })
}

// 编辑VCenter
export function modifyVCenter(data) {
    return request({
        url: '/vCenter/modifyVCenter',
        method: 'post',
        data
    })
}

// 获取云服务器列表
export function vmList(data) {
    return request({
        url: '/vCenter/vmList',
        method: 'post',
        data
    })
}

// 云服务器开机
export function powerOn(data) {
    return request({
        url: '/vCenter/powerOn',
        method: 'post',
        data
    })
}

// 云服务器关机
export function powerOff(data) {
    return request({
        url: '/vCenter/powerOff',
        method: 'post',
        data
    })
}