import request from '@/utils/request'

//组织列表查询
export function queryOrgTree(data) {
    return request({
        url: '/org/queryOrgList',
        method: 'post',
        data
    })
}


// 获取未绑定vdc列表
export function queryParentOrg(data) {
    return request({
        url: '/org/queryParentOrg',
        method: 'post',
        data
    })
}

// 获取未绑定vdc列表
export function gitVdcNotBindList(data) {
    return request({
        url: '/vdc/queryNotBindVdcByParentOrgId',
        method: 'post',
        data
    })
}

// 新增组织 
export function createOrg(data) {
    return request({
        url: '/org/createOrg',
        method: 'post',
        data
    })
}

// 获取组织详情
export function orgDetail(data) {
    return request({
        url: '/org/orgDetail',
        method: 'post',
        data
    })
}



// 编辑组织
export function modifyOrg(data) {
    return request({
        url: '/org/modifyOrg',
        method: 'post',
        data
    })
}

// 删除组织
export function deleteOrg(data) {
    return request({
        url: '/org/deleteOrg',
        method: 'post',
        data
    })
}

// 获取组织统计树
export function orgStatisticTree(data) {
    return request({
        url: '/org/orgStatisticTree',
        method: 'post',
        data
    })
}

// 组织概要信息
export function orgSummary(data) {
    return request({
        url: '/org/orgSummary',
        method: 'post',
        data
    })
}


// 修改顶层组织名称
export function modifyTopOrgName(data) {
    return request({
        url: '/org/modifyTopOrgName',
        method: 'post',
        data
    })
}