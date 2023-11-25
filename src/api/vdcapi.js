import request from '@/utils/request'

// 获取可以绑定的可用区列表
export function zoneList(data) {
    return request({
        url: '/zone/zoneList',
        method: 'post',
        data
    })
}

// 获取可用区集群
export function zoneClusterList(data) {
    return request({
        url: '/cluster/zoneClusterList',
        method: 'post',
        data
    })
}

// 获取上级VDC
export function vdcTreeByZone(data) {
    return request({
        url: '/vdc/vdcTreeByZone',
        method: 'post',
        data
    })
}

// 获取上级vdc资源
export function checkCreateVdc(data) {
    return request({
        url: '/vdc/checkCreateVdc',
        method: 'post',
        data
    })
}

// 根据集群获取网络配置
export function clusterNetworkConfig(data) {
    return request({
        url: '/cluster/clusterNetworkConfig',
        method: 'post',
        data
    })
}

// 根据虚拟交换机获取端口组
export function mcPortGroupListByVirtualSwitch(data) {
    return request({
        url: '/cluster/mcPortGroupListByVirtualSwitch',
        method: 'post',
        data
    })
}

// 创建VDC
export function createVdc(data) {
    return request({
        url: '/vdc/createVdc',
        method: 'post',
        data
    })
}

// VDC列表
export function vdcTree(data) {
    return request({
        url: '/vdc/vdcTree',
        method: 'post',
        data
    })
}

// vdc详情
export function vdcDetail(data) {
    return request({
        url: '/vdc/vdcDetail',
        method: 'post',
        data
    })
}

// 编辑vdc-获取详情
export function modifyVdcDetail(data) {
    return request({
        url: '/vdc/modifyVdcDetail',
        method: 'post',
        data
    })
}

// 编辑VDC
export function modifyVdc(data) {
    return request({
        url: '/vdc/modifyVdc',
        method: 'post',
        data
    })
}

// 删除VDC
export function deleteVdc(data) {
    return request({
        url: '/vdc/deleteVdc',
        method: 'post',
        data
    })
}

// 变更VDC资源-详情
export function modifyVdcResourceDetail(data) {
    return request({
        url: '/vdc/modifyVdcResourceDetail',
        method: 'post',
        data
    })
}

// 申请变更VDC资源
export function applyModifyVdcResource(data) {
    return request({
        url: '/vdc/applyModifyVdcResource',
        method: 'post',
        data
    })
}

// 审核变更VDC-获取变更详情
export function passModifyVdcDetail(data) {
    return request({
        url: '/workOrder/passModifyVdcDetail',
        method: 'post',
        data
    })
}

// 获取上级VDC网络列表
export function listNetworkListByVdcId(data) {
    return request({
        url: '/networkConfig/listNetworkListByVdcId',
        method: 'post',
        data
    })
}
// 创建网络规格
export function handelSubmitSpec(data) {
    return request({
        url: '/network/specification/create',
        method: 'post',
        data
    })
}
//删除规格
export function handelDelSpec(data) {
    return request({
        url: '/network/specification/delete',
        method: 'post',
        data
    })
}
//获取网卡详情
export function handelGetSpecDetail(data) {
    return request({
        url: '/network/specification/detail',
        method: 'post',
        data
    })
}
//获取网卡详情
export function handelmodifySpecDetail(data) {
    return request({
        url: '/network/specification/modify',
        method: 'post',
        data
    })
}
