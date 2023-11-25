import request from '@/utils/request'

// 分页查询角色列表
export function pageRole(data) {
    return request({
        url: '/role/pageRole',
        method: 'post',
        data
    })
}

// 根据组织获取角色列表
export function listRole(data) {
    return request({
        url: '/role/listRole',
        method: 'post',
        data
    })
}


// 删除角色
export function deleteRole(data) {
    return request({
        url: '/role/deleteRole',
        method: 'post',
        data
    })
}

// 获取权限列表
export function customPlatformRoleMaxPermission(data) {
    return request({
        url: '/permission/customPlatformRoleMaxPermission',
        method: 'post',
        data
    })
}

// 创建角色
export function createRole(data) {
    return request({
        url: '/role/createRole',
        method: 'post',
        data
    })
}

// 角色详情
export function roleInfo(data) {
    return request({
        url: '/role/roleInfo',
        method: 'post',
        data
    })
}

// 修改详情
export function modifyRoleDetail(data) {
    return request({
        url: '/role/modifyRoleDetail',
        method: 'post',
        data
    })
}

// 修改
export function modifyRole(data) {
    return request({
        url: '/role/modifyRole',
        method: 'post',
        data
    })
}