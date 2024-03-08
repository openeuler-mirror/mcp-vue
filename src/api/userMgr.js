import request from '@/utils/request'

// 添加用户
export function createUser(data) {
    return request({
        url: '/user/createUser',
        method: 'post',
        data
    })
}

// 分页查询用户信息
export function pageUser(data) {
    return request({
        url: '/user/pageUser',
        method: 'post',
        data
    })
}

// 获取编辑用户详情
export function modifyUserInfo(data) {
    return request({
        url: '/user/modifyUserInfo',
        method: 'post',
        data
    })
}

// 删除用户
export function deleteUser(data) {
    return request({
        url: '/user/deleteUser',
        method: 'post',
        data
    })
}


// 批量删除用户
export function batchDeleteUser(data) {
    return request({
        url: '/user/batchDeleteUser',
        method: 'post',
        data
    })
}

// 编辑用户
export function modifyUser(data) {
    return request({
        url: '/user/modifyUser',
        method: 'post',
        data
    })
}