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



// 添加主机
export function bareMetalcreate(data) {
    return request({
        url: '/bareMetal/create',
        method: 'post',
        data
    })
}
// 编辑主机
export function bareMetalupdate(data) {
    return request({
        url: '/bareMetal/update',
        method: 'post',
        data
    })
}
// 查询主机列表
export function bareMetallist(data) {
    return request({
        url: '/bareMetal/list',
        method: 'post',
        data
    })
}
// 查询主机详情
export function bareMetaldetail(data) {
    return request({
        url: '/bareMetal/detail',
        method: 'post',
        data
    })
}
// 主机开机
export function bareMetalpowerOn(data) {
    return request({
        url: '/bareMetal/powerOn',
        method: 'post',
        data
    })
}
// 主机关机
export function bareMetalpowerOff(data) {
    return request({
        url: '/bareMetal/powerOff',
        method: 'post',
        data
    })
}
// 主机监控信息
export function monitorinfo(data) {
    return request({
        url: '/bareMetal/monitor/info',
        method: 'post',
        data
    })
}

//删除主机
export function bareMetaldelete(data) {
    return request({
        url: '/bareMetal/delete',
        method: 'post',
        data
    })
}

 //删除主机
export function bareMetalmonitor(data) {
    return request({
        url: '/bareMetal/monitor/info',
        method: 'post',
        data
    })
}
 
 