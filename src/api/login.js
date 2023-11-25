import request from '@/utils/request'


// 获取组织列表
export function getOrganizationList(data) {
  return request({
    url: '/org/queryOrgList',
    method: 'post',
    data
  })
}
// 注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 修改真实姓名
export function updateRealName(data) {
  return request({
    url: '/user/updateRealName',
    method: 'post',
    data
  })
}

// 修改密码
export function updatePwd(data) {
  return request({
    url: '/user/updatePwd',
    method: 'post',
    data
  })
}
// 重置密码
export function resetPassword(data) {
  return request({
    url: '/user/resetPassword',
    method: 'post',
    data
  })
}

// 获取告警数量
export function alarmNotifications(data, headers) {
  return request({
    url: '/monitoring/alarmNotifications',
    method: 'post',
    data,
    headers: {
      ...headers
    }
  })
}

// 获取待审核工单数量
export function getWaitCheckCount(data, headers) {
  return request({
    url: '/workOrder/getWaitCheckCount',
    method: 'post',
    data,
    headers: {
      ...headers
    }
  })
}