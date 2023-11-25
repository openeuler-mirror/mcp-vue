import request from '@/utils/request'
//已纳管vcenter列表查询
export function getVcenterList(data) {
    return request({
        url: '/vcenter/list',
        method: 'post',
        data
    })
}

//删除vcenter
export function deleteCluster(data) {
    return request({
        url: '/vcenter/delete',
        method: 'post',
        data
    })
}
//vcenter名称重复校验
export function checkNameIp(data) {
    return request({
        url: '/vcenter/exist/check',
        method: 'post',
        data
    })
}
//vcenter创建列表校验
export function getVcenterStorage(data) {
    return request({
        url: '/vcenter/storage/list',
        method: 'post',
        data
    })
}

//校验vcenter 账号
export function checkVcenterLogin(data) {
    return request({
        url: '/vcenter/connection/check',
        method: 'post',
        data
    })
}


//创建vcenter
export function createVcenter(data) {
    return request({
        url: '/vcenter/add',
        method: 'post',
        data
    })
}
//编辑vCenter
export function editVcenter(data) {
    return request({
        url: '/vcenter/modify',
        method: 'post',
        data
    })
}


//详情-编辑vCenter
export function getVcenterEditDetail(data) {
    return request({
        url: '/vcenter/info',
        method: 'post',
        data
    })
}
//获取vCenter概要
export function getVcenterDetail(data) {
    return request({
        url: '/vcenter/summary',
        method: 'post',
        data
    })
}

//云服务器列表
export function getVcenterCloudList(data) {
    return request({
        url: '/vcenter/server/list',
        method: 'post',
        data
    })
}

//主机列表
export function getVcenterhostList(data) {
    return request({
        url: '/vcenter/host/list',
        method: 'post',
        data
    })
}
//存储列表
export function getVcenterStorageList(data) {
    return request({
        url: '/vcenter/id/storage/list',
        method: 'post',
        data
    })
}

//云服务器详情数据
export function getServerMainData(data) {
    return request({
        url: '/vcenter/server/info',
        method: 'post',
        data
    })
}
//云服务器详情数据-占用率接口
export function getServerSummaryData(data) {
    return request({
        url: '/vcenter/server/summary',
        method: 'post',
        data
    })
}

//云服务器告警
export function getServerSummaryAlarmData(data) {
    return request({
        url: '/vcenter/server/alarm/list',
        method: 'post',
        data
    })
}

//云服务器网络列表
export function getServerNetListData(data) {
    return request({
        url: '/vcenter/server/network/list',
        method: 'post',
        data
    })
}
//云服务器存储列表
export function getServerDiskListData(data) {
    return request({
        url: '/vcenter/server/storage/list',
        method: 'post',
        data
    })
}
//已纳管vcenter下云服务器详情监控信息查询-单一采集项监控数据查询
export function getServerMonitorListData(data) {
    return request({
        url: '/vcenter/server/monitor/info',
        method: 'post',
        data
    })
}
//已纳管vcenter下云服务器详情存储监控信息查询
export function getServerStorageMonitorListData(data) {
    return request({
        url: '/vcenter/server/monitor/storage/info',
        method: 'post',
        data
    })
}
//已纳管vcenter下云服务器详情网络监控信息查询
export function getServerNetworkMonitorListData(data) {
    return request({
        url: '/vcenter/server/monitor/network/info',
        method: 'post',
        data
    })
}
//云服务器任务列表
export function getServerTaskListData(data) {
    return request({
        url: '/vcenter/server/task/list',
        method: 'post',
        data
    })
}
//控制台
export function getVncUrl(data) {
    return request({
        url: '/vcenter/server/ticket',
        method: 'post',
        data
    })
}


//获取主机下存储列表
export function getdataStoreByHostname(data) {
    return request({
        url: '/vcenter/host/datastore/list',
        method: 'post',
        data
    })
}
//获取主机下存储列表
export function getStorageByHostname(data) {
    return request({
        url: '/vcenter/location/storage/list',
        method: 'post',
        data
    })
}
//删除云服务器
export function hadelDelVm(data) {
    return request({
        url: '/vcenter/server/delete',
        method: 'post',
        data
    })
}
//克隆云服务器
export function handelCloneVm(data) {
    return request({
        url: '/vcenter/server/clone',
        method: 'post',
        data
    })
}
//克隆云服务器
export function handelGetRp(data) {
    return request({
        url: '/vcenter/location/tree',
        method: 'post',
        data
    })
}
//获取镜像文件列表
export function handelGetTemplateList(data) {
    return request({
        url: '/vcenter/image/list',
        method: 'post',
        data
    })
}
//获取网卡列表
export function handelGetNetCardList(data) {
    return request({
        url: '/vcenter/network/list',
        method: 'post',
        data
    })
}
//云服务器开机
export function startServerVm(data) {
    return request({
        url: '/vcenter/server/power/on',
        method: 'post',
        data
    })
}
//云服务器关机
export function shutdownServerVm(data) {
    return request({
        url: '/vcenter/server/power/off',
        method: 'post',
        data
    })
}

//云服务器唤醒
export function resumeVm(data) {
    return request({
        url: '/vcenter/server/power/resume',
        method: 'post',
        data
    })
}
//云服务器暂停
export function suspendVm(data) {
    return request({
        url: '/vcenter/server/power/suspend',
        method: 'post',
        data
    })
}
//云服务器重启
export function restartVm(data) {
    return request({
        url: '/vcenter/server/power/restart',
        method: 'post',
        data
    })
}
//云服务器关闭电源
export function offForceVm(data) {
    return request({
        url: '/vcenter/server/power/off/force',
        method: 'post',
        data
    })
}
//云服务器列表新建云服务器
export function createVm(data) {
    return request({
        url: '/vcenter/server/create',
        method: 'post',
        data
    })
}
//云服务器编辑详情
export function modifyDetail(data) {
    return request({
        url: '/vcenter/server/modify/detail',
        method: 'post',
        data
    })
}
//云服务器提交编辑
export function handelSubmitEdit(data) {
    return request({
        url: '/vcenter/server/modify',
        method: 'post',
        data
    })

}
//云服务器图片
export function getSummaryImage(data) {
    return request({
        url: '/vcenter/server/logo/download',
        method: 'get',
        params: data
    })
}

//集群列表
export function getClusterList(data) {
    return request({
        url: '/vcenter/cluster/list',
        method: 'post',
        data
    })
}
//主机列表
export function getClusterHostList(data) {
    return request({
        url: '/vcenter/cluster/host/list',
        method: 'post',
        data
    })
}
//迁移界面存储列表查询
export function getClusterPageStorageList(data) {
    return request({
        url: '/general/cluster/storageList',
        method: 'post',
        data
    })
}

//迁移界面网络列表查询
export function getClusterSpecificationList(data) {
    return request({
        url: '/network/specification/list',
        method: 'post',
        data
    })
}

//迁移界面资源组列表查询
export function getClusterResourceList(data) {
    return request({
        url: '/vcenter/cluster/resource/list',
        method: 'post',
        data
    })
}

//获取详情
export function getTranseferDetail(data) {
    return request({
        url: '/vcenter/server/detail',
        method: 'post',
        data
    })
}
//提交vdc
export function handelSubmitTransfer(data) {
    return request({
        url: '/vcenter/server/migrate',
        method: 'post',
        data
    })
}

 //校验云服务器重名
 export function checkExistVmName(data) {
    return request({
        url: '/vcenter/server/exist/check',
        method: 'post',
        data
    })
}
  //校验云服务器重名
  export function vcenterResourceMax(data) {
    return request({
        url: '/vcenter/resource/max',
        method: 'post',
        data
    })
}
