import request from '@/utils/request'

//网络配置查询
export function pageNetworkConfig(data) {
    return request({
        url: '/networkConfig/pageNetworkConfig',
        method: 'post',
        data
    })
}
//从mc获取网络配置
export function mcNetworkConfig(data) {
    return request({
        url: '/networkConfig/mcNetworkConfig',
        method: 'post',
        data
    })
}


//根据虚拟交换及名称获取端口组
export function mcPortGroupListByVirtualSwitch(data) {
    return request({
        url: '/networkConfig/mcPortGroupListByVirtualSwitch',
        method: 'post',
        data
    })
}

//创建网络配置
export function createNetwork(data) {
    return request({
        url: '/networkConfig/createNetwork',
        method: 'post',
        data
    })
}

