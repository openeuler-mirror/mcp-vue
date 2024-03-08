import request from '@/utils/request'

// 工单列表查询
export function getWorkOrderList(data) {
    return request({
        url: '/workOrder/pageWorkOrder',
        method: 'post',
        data
    })
}

// 批量审核
export function batchCheck(data) {
    return request({
        url: '/workOrder/batchCheck',
        method: 'post',
        data
    })
}

// 申请云服务器详情
export function getApplyServerVmDetail(data) {
    return request({
        url: '/workOrder/applyServerVmDetail',
        method: 'post',
        data
    })
}

// 变更云服务器详情
export function getModifyServerVmDetail(data) {
    return request({
        url: '/workOrder/modifyServerVmDetail',
        method: 'post',
        data
    })
}

// 延期云服务器详情
export function getApplyDeferredDetail(data) {
    return request({
        url: '/workOrder/applyDeferredDetail',
        method: 'post',
        data
    })
}

// 注册账号详情
export function getRegisterUserDetail(data) {
    return request({
        url: '/workOrder/registerUserDetail',
        method: 'post',
        data
    })
}

// 修改账号详情
export function getUpdateUserDetail(data) {
    return request({
        url: '/workOrder/updateUserDetail',
        method: 'post',
        data
    })
}

//账号注册审核
export function checkPassRegister(data) {
    return request({
        url: '/workOrder/checkPassRegister',
        method: 'post',
        data
    })
}
//修改账号审核
export function checkPassUpdateUser(data) {
    return request({
        url: '/workOrder/checkPassUpdateUser',
        method: 'post',
        data
    })
}

//延期审核
export function checkPassDeferred(data) {
    return request({
        url: '/workOrder/checkPassDeferred',
        method: 'post',
        data
    })
}
//拒绝工单
export function refuseWorkOrder(data) {
    return request({
        url: '/workOrder/refuseWorkOrder',
        method: 'post',
        data
    })
}
//申请云服务器审核通过
export function passApplyServerVm(data) {
    return request({
        url: '/workOrder/passApplyServerVm',
        method: 'post',
        data
    })
}
//申请云服务器申请通过时编辑页面获取详情
export function passApplyServerVmDetail(data) {
    return request({
        url: '/workOrder/passApplyServerVmDetail',
        method: 'post',
        data
    })
}

//变更云服务器申请通过时编辑页面获取详情
export function passModifyServerVmDetail(data) {
    return request({
        url: '/workOrder/passModifyServerVmDetail',
        method: 'post',
        data
    })
}

//变更云服务器申请通过
export function passModifyServerVm(data) {
    return request({
        url: '/workOrder/passModifyServerVm',
        method: 'post',
        data
    })
}

// 审核变更VDC - 获取变更详情
export function passModifyVdcDetail(data) {
    return request({
        url: '/workOrder/passModifyVdcDetail',
        method: 'post',
        data
    })
}

// 变更VDC资源-通过
export function passModifyVdc(data) {
    return request({
        url: '/workOrder/passModifyVdc',
        method: 'post',
        data
    })
}

// 工单详情-变更VDC
export function applyModifyVdcDetail(data) {
    return request({
        url: '/workOrder/applyModifyVdcDetail',
        method: 'post',
        data
    })
}